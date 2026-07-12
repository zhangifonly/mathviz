/**
 * 留数定理（Residue Theorem）纯函数数学内核（无 DOM）
 *
 * 复分析核心结论：若 f 在闭曲线 C 内部只有有限个孤立奇点，则
 *   ∮_C f(z) dz = 2πi · Σ Res(f, z_k)
 * 其中求和取遍 C 内部所有奇点的留数。
 *
 * 这里用「部分分式」表示被积函数：f(z) = Σ_k a_k / (z - p_k)，
 * 每个简单极点 p_k 的留数就是它的系数 a_k。这样既能解析求和，
 * 又能对圆周做数值积分来验证定理本身。
 */

/** 复数 */
export interface Complex {
  re: number
  im: number
}

export const cAdd = (a: Complex, b: Complex): Complex => ({ re: a.re + b.re, im: a.im + b.im })
export const cSub = (a: Complex, b: Complex): Complex => ({ re: a.re - b.re, im: a.im - b.im })
export const cMul = (a: Complex, b: Complex): Complex => ({
  re: a.re * b.re - a.im * b.im,
  im: a.re * b.im + a.im * b.re,
})
export const cDiv = (a: Complex, b: Complex): Complex => {
  const d = b.re * b.re + b.im * b.im
  return { re: (a.re * b.re + a.im * b.im) / d, im: (a.im * b.re - a.re * b.im) / d }
}
export const cAbs = (a: Complex): number => Math.hypot(a.re, a.im)
export const cScale = (a: Complex, s: number): Complex => ({ re: a.re * s, im: a.im * s })

/** 一个简单极点及其留数 */
export interface Pole {
  z: Complex        // 极点位置 p_k
  residue: Complex  // 留数 a_k = Res(f, p_k)
  label: string     // 展示用标签
}

/** 部分分式函数 f(z) = Σ a_k / (z - p_k) 在点 z 处求值 */
export function evaluateField(poles: Pole[], z: Complex): Complex {
  let sum: Complex = { re: 0, im: 0 }
  for (const p of poles) {
    const denom = cSub(z, p.z)
    // 极点处发散，返回一个大值避免除零
    if (cAbs(denom) < 1e-9) return { re: 1e9, im: 1e9 }
    sum = cAdd(sum, cDiv(p.residue, denom))
  }
  return sum
}

/** 判断极点是否落在以 center 为圆心、radius 为半径的圆内部 */
export function isEnclosed(pole: Pole, center: Complex, radius: number): boolean {
  return cAbs(cSub(pole.z, center)) < radius
}

/** 圆 C 内部所有极点的留数之和 Σ Res(f, z_k) */
export function residueSum(poles: Pole[], center: Complex, radius: number): Complex {
  let sum: Complex = { re: 0, im: 0 }
  for (const p of poles) if (isEnclosed(p, center, radius)) sum = cAdd(sum, p.residue)
  return sum
}

/** 由留数定理给出的理论积分值 2πi · Σ Res */
export function contourIntegralTheoretical(poles: Pole[], center: Complex, radius: number): Complex {
  const s = residueSum(poles, center, radius)
  // 乘以 2πi：(0 + 2π i)·s
  return cMul({ re: 0, im: 2 * Math.PI }, s)
}

/**
 * 对圆周 z(t)=center + r·e^{it}, t∈[0,2π] 做数值围道积分
 *   ∮ f dz = ∫ f(z(t))·z'(t) dt,  z'(t)=i·r·e^{it}
 * 用中点法（矩形法）逼近，steps 越大越精确。
 */
export function contourIntegralNumerical(
  poles: Pole[],
  center: Complex,
  radius: number,
  steps = 2000,
): Complex {
  let acc: Complex = { re: 0, im: 0 }
  const dt = (2 * Math.PI) / steps
  for (let k = 0; k < steps; k++) {
    const t = (k + 0.5) * dt
    const cos = Math.cos(t)
    const sin = Math.sin(t)
    const z: Complex = { re: center.re + radius * cos, im: center.im + radius * sin }
    // z'(t) = i r e^{it} = r(-sin + i cos)
    const dz: Complex = { re: -radius * sin, im: radius * cos }
    acc = cAdd(acc, cScale(cMul(evaluateField(poles, z), dz), dt))
  }
  return acc
}

/** 预设：不同极点布局 + 围道，供 UI 切换 */
export interface ResidueScenario {
  key: string
  label: string
  note: string
  poles: Pole[]
  center: Complex
  radius: number
}

export const RESIDUE_SCENARIOS: ResidueScenario[] = [
  {
    key: 'two-in',
    label: '两个极点全部围住',
    note: '围道包住两个简单极点，积分 = 2πi(留数和)',
    poles: [
      { z: { re: -1, im: 0 }, residue: { re: 1, im: 0 }, label: 'p1 = -1' },
      { z: { re: 1, im: 0 }, residue: { re: 2, im: 0 }, label: 'p2 = 1' },
    ],
    center: { re: 0, im: 0 },
    radius: 2,
  },
  {
    key: 'one-in',
    label: '只围住一个极点',
    note: '围道外的极点不贡献，积分只算内部留数',
    poles: [
      { z: { re: -0.6, im: 0 }, residue: { re: 1, im: 0 }, label: 'p1 = -0.6' },
      { z: { re: 2.5, im: 0 }, residue: { re: 3, im: 0 }, label: 'p2 = 2.5' },
    ],
    center: { re: 0, im: 0 },
    radius: 1.4,
  },
  {
    key: 'complex-res',
    label: '含复留数的极点',
    note: '留数可为复数，积分方向沿逆时针',
    poles: [
      { z: { re: 0, im: 0.8 }, residue: { re: 0, im: 1 }, label: 'p1 = 0.8i' },
      { z: { re: 0, im: -0.8 }, residue: { re: 0, im: -1 }, label: 'p2 = -0.8i' },
    ],
    center: { re: 0, im: 0 },
    radius: 1.5,
  },
  {
    key: 'none-in',
    label: '围道内无极点',
    note: '解析函数沿闭曲线积分为零（柯西定理）',
    poles: [
      { z: { re: 3, im: 0 }, residue: { re: 1, im: 0 }, label: 'p1 = 3' },
      { z: { re: -3, im: 0 }, residue: { re: 1, im: 0 }, label: 'p2 = -3' },
    ],
    center: { re: 0, im: 0 },
    radius: 1.2,
  },
]
