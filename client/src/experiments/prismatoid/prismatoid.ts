/**
 * Prismatoid 公式（拟柱体公式，纯函数，便于测试）
 *
 * 只量**三个**截面就能算出体积：
 *
 *   V = h/6 × (S_下 + 4·S_中 + S_上)
 *
 * 这就是辛普森公式的立体版。它的适用范围出人意料地广 ——
 * **只要截面积 A(t) 是 t 的三次以内多项式，公式就精确成立**（不是近似）。
 *
 * 为什么？辛普森公式对三次多项式精确，而常见立体的 A(t) 恰好都在这个范围：
 *
 *   棱柱     A = 常数              零次
 *   棱锥/圆锥 A = S(1−t/h)²        二次
 *   球       A = π(r²−(t−r)²)      二次
 *   棱台     A 是 t 的二次式        二次
 *
 * 于是同一条公式一口气覆盖了柱、锥、台、球 —— 中学立体几何的全部体积公式
 * 都是它的特例。这正是它值得单独讲一课的原因。
 *
 * 反过来，A(t) 一旦超过三次（比如某些旋转体），公式就只是近似了。
 * 本实验用一个四次例子把这个边界也验出来。
 */

/** 由"高度 → 截面积"刻画的立体 */
export interface Prismatoid {
  id: string
  label: string
  height: number
  areaAt: (t: number) => number
  /** 解析体积 */
  volume: number
  /** A(t) 的次数（0..3 时公式精确） */
  degree: number
  note: string
}

/** Prismatoid 公式：h/6 × (下 + 4×中 + 上) */
export function prismatoidVolume(s: Prismatoid): number {
  const h = s.height
  return (h / 6) * (s.areaAt(0) + 4 * s.areaAt(h / 2) + s.areaAt(h))
}

/** 与解析体积的相对误差 */
export function prismatoidError(s: Prismatoid): number {
  const v = prismatoidVolume(s)
  return Math.abs(v - s.volume) / Math.max(1e-12, Math.abs(s.volume))
}

/** 数值积分（中点法），用作第三方参照 */
export function integrate(s: Prismatoid, steps = 20000): number {
  const dt = s.height / steps
  let v = 0
  for (let i = 0; i < steps; i++) v += s.areaAt((i + 0.5) * dt) * dt
  return v
}

/** 三个采样点的截面积 */
export function samplePoints(s: Prismatoid): {
  bottom: number; middle: number; top: number
} {
  return {
    bottom: s.areaAt(0),
    middle: s.areaAt(s.height / 2),
    top: s.areaAt(s.height),
  }
}

// ============ 各种立体 ============

/** 棱柱/圆柱：A 恒定，零次 */
export function makePrism(area: number, h: number): Prismatoid {
  return {
    id: 'prism',
    label: '柱体',
    height: h,
    areaAt: () => area,
    volume: area * h,
    degree: 0,
    note: 'A(t) 是常数',
  }
}

/** 棱锥/圆锥：A = S(1−t/h)²，二次 */
export function makeCone(baseArea: number, h: number): Prismatoid {
  return {
    id: 'cone',
    label: '锥体',
    height: h,
    areaAt: (t) => {
      const k = 1 - t / h
      return baseArea * k * k
    },
    volume: (baseArea * h) / 3,
    degree: 2,
    note: 'A(t) 是二次式',
  }
}

/**
 * 棱台/圆台：上下底面积 S1、S2，A(t) 在 √A 上线性。
 * 体积 = h/3 × (S1 + S2 + √(S1·S2))，这是中学课本的公式。
 */
export function makeFrustum(s1: number, s2: number, h: number): Prismatoid {
  const r1 = Math.sqrt(s1)
  const r2 = Math.sqrt(s2)
  return {
    id: 'frustum',
    label: '台体',
    height: h,
    // 半径线性插值，面积是它的平方 → 二次
    areaAt: (t) => {
      const r = r1 + (r2 - r1) * (t / h)
      return r * r
    },
    volume: (h / 3) * (s1 + s2 + Math.sqrt(s1 * s2)),
    degree: 2,
    note: 'A(t) 是二次式（√A 线性）',
  }
}

/** 球：A = π(r² − (t−r)²)，二次 */
export function makeSphere(r: number): Prismatoid {
  return {
    id: 'sphere',
    label: '球',
    height: 2 * r,
    areaAt: (t) => {
      const d = t - r
      return Math.PI * Math.max(0, r * r - d * d)
    },
    volume: (4 * Math.PI * r ** 3) / 3,
    degree: 2,
    note: 'A(t) 是二次式',
  }
}

/** 楔形体（上底退化成一条线）：A 线性，一次 */
export function makeWedge(baseArea: number, h: number): Prismatoid {
  return {
    id: 'wedge',
    label: '楔体',
    height: h,
    areaAt: (t) => baseArea * (1 - t / h),
    volume: (baseArea * h) / 2,
    degree: 1,
    note: 'A(t) 是一次式',
  }
}

/**
 * 人造三次例子：A(t) = a + bt + ct² + dt³。
 * 公式仍精确 —— 这是辛普森公式的性质，值得单独验一次。
 */
export function makeCubic(h: number): Prismatoid {
  const a = 2
  const b = 1.3
  const c = -0.7
  const d = 0.45
  return {
    id: 'cubic',
    label: '三次截面（人造）',
    height: h,
    areaAt: (t) => a + b * t + c * t * t + d * t ** 3,
    // ∫₀ʰ = ah + bh²/2 + ch³/3 + dh⁴/4
    volume: a * h + (b * h * h) / 2 + (c * h ** 3) / 3 + (d * h ** 4) / 4,
    degree: 3,
    note: 'A(t) 三次 —— 公式仍精确',
  }
}

/**
 * 人造四次例子：超出适用范围，公式只是近似。
 * 用它把边界验出来。
 */
export function makeQuartic(h: number): Prismatoid {
  return {
    id: 'quartic',
    label: '四次截面（人造）',
    height: h,
    areaAt: (t) => 1 + t ** 4,
    volume: h + h ** 5 / 5,
    degree: 4,
    note: 'A(t) 四次 —— 公式失效',
  }
}

export type SolidId =
  | 'prism' | 'cone' | 'frustum' | 'sphere' | 'wedge' | 'cubic' | 'quartic'

export function solidOf(id: SolidId, h = 2): Prismatoid {
  switch (id) {
    case 'cone': return makeCone(Math.PI, h)
    case 'frustum': return makeFrustum(Math.PI, Math.PI / 4, h)
    case 'sphere': return makeSphere(h / 2)
    case 'wedge': return makeWedge(Math.PI, h)
    case 'cubic': return makeCubic(h)
    case 'quartic': return makeQuartic(h)
    default: return makePrism(Math.PI, h)
  }
}

export const SOLID_IDS: SolidId[] = [
  'prism', 'wedge', 'cone', 'frustum', 'sphere', 'cubic', 'quartic',
]

/** 公式对该立体是否精确（次数 ≤ 3） */
export function isExact(s: Prismatoid): boolean {
  return s.degree <= 3
}

/**
 * 辛普森公式的权重 (1, 4, 1)/6 是怎么定出来的：
 * 要求对 1、t、t²、t³ 四个基函数都精确积分。
 * 返回四个基函数下的误差（都应为 0）。
 */
export function simpsonWeightCheck(h = 1): number[] {
  const basis: Array<(t: number) => number> = [
    () => 1, (t) => t, (t) => t * t, (t) => t ** 3,
  ]
  const exact = [h, (h * h) / 2, h ** 3 / 3, h ** 4 / 4]
  return basis.map((f, i) => {
    const approx = (h / 6) * (f(0) + 4 * f(h / 2) + f(h))
    return Math.abs(approx - exact[i])
  })
}

/** 四次基函数下辛普森的固有误差（不为零，说明适用边界） */
export function simpsonQuarticError(h = 1): number {
  const approx = (h / 6) * (0 + 4 * (h / 2) ** 4 + h ** 4)
  const exact = h ** 5 / 5
  return Math.abs(approx - exact)
}

/** 中学体积公式都是它的特例 */
export const SPECIAL_CASES = [
  { name: '柱体', formula: 'S·h', degree: 0 },
  { name: '楔体', formula: 'S·h/2', degree: 1 },
  { name: '锥体', formula: 'S·h/3', degree: 2 },
  { name: '台体', formula: 'h(S₁+S₂+√(S₁S₂))/3', degree: 2 },
  { name: '球', formula: '4πr³/3', degree: 2 },
] as const
