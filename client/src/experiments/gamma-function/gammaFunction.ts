/**
 * 伽马函数核心（纯函数，便于测试）
 *
 * 伽马函数 Γ(x) 把阶乘从整数推广到实数与复数：
 *   Γ(n) = (n-1)!，且满足递推 Γ(x+1) = x·Γ(x)，以及 Γ(1/2) = √π。
 * 这里用经典的 Lanczos 近似（g=7, n=9 系数），配合反射公式覆盖 x < 0.5。
 * 不依赖任何 DOM。
 */

const G = 7
// Lanczos g=7 系数（Godfrey 常用组），精度约 15 位有效数字
const LANCZOS = [
  0.99999999999980993,
  676.5203681218851,
  -1259.1392167224028,
  771.32342877765313,
  -176.61502916214059,
  12.507343278686905,
  -0.13857109526572012,
  9.9843695780195716e-6,
  1.5056327351493116e-7,
]

/** Lanczos 近似计算 Γ(x)，对负数用反射公式 Γ(x)Γ(1-x)=π/sin(πx) */
export function gamma(x: number): number {
  if (x < 0.5) {
    return Math.PI / (Math.sin(Math.PI * x) * gamma(1 - x))
  }
  x -= 1
  let a = LANCZOS[0]
  const t = x + G + 0.5
  for (let i = 1; i < LANCZOS.length; i++) {
    a += LANCZOS[i] / (x + i)
  }
  return Math.sqrt(2 * Math.PI) * Math.pow(t, x + 0.5) * Math.exp(-t) * a
}

/** 整数阶乘 n!（n>=0），用于对照 Γ(n+1)=n! */
export function factorial(n: number): number {
  let r = 1
  for (let i = 2; i <= n; i++) r *= i
  return r
}

/**
 * 采样 Γ(x) 曲线，返回 [x, y] 点序列。
 * 遇到极点（0 与负整数）附近，y 会剧烈发散，交由绘制层裁剪。
 */
export function sampleGammaCurve(
  xMin: number,
  xMax: number,
  n: number,
): [number, number][] {
  const pts: [number, number][] = []
  for (let i = 0; i <= n; i++) {
    const x = xMin + ((xMax - xMin) * i) / n
    pts.push([x, gamma(x)])
  }
  return pts
}

/** 交互面板可选的 x 取值（含半整数，突出 Γ(1/2)=√π） */
export const SAMPLE_POINTS = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5]
