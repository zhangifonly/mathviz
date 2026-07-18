/**
 * 有理函数与渐近线核心算法（纯函数，便于测试）
 *
 * 有理函数 f(x) = P(x)/Q(x)，P、Q 均为多项式（系数数组，index 即次数）。
 * - 竖直渐近线：分母 Q 的实根（且分子不同时为 0）。
 * - 水平/斜渐近线：比较分子分母次数。
 *   deg P < deg Q  -> y = 0（水平）
 *   deg P = deg Q  -> y = 首项系数比（水平）
 *   deg P = deg Q+1 -> 多项式长除得到斜渐近线 y = kx + b
 */

/** 多项式求值（coeffs[i] 为 x^i 系数） */
export function evalPoly(coeffs: number[], x: number): number {
  let y = 0
  for (let i = coeffs.length - 1; i >= 0; i--) y = y * x + coeffs[i]
  return y
}

/** 去掉高次的零系数，返回真实次数（零多项式返回 -1） */
export function degree(coeffs: number[]): number {
  for (let i = coeffs.length - 1; i >= 0; i--) {
    if (Math.abs(coeffs[i]) > 1e-12) return i
  }
  return -1
}

/** 有理函数求值 */
export function evalRational(num: number[], den: number[], x: number): number {
  return evalPoly(num, x) / evalPoly(den, x)
}

/** 多项式长除：num / den = quotient 余 remainder（均为系数数组） */
export function polyDivide(num: number[], den: number[]): { quotient: number[]; remainder: number[] } {
  const dDeg = degree(den)
  if (dDeg < 0) return { quotient: [], remainder: num.slice() }
  const r = num.slice()
  const quotient: number[] = []
  let rDeg = degree(r)
  const lead = den[dDeg]
  while (rDeg >= dDeg) {
    const coef = r[rDeg] / lead
    const shift = rDeg - dDeg
    quotient[shift] = coef
    for (let i = 0; i <= dDeg; i++) r[shift + i] -= coef * den[i]
    r[rDeg] = 0
    rDeg = degree(r)
  }
  for (let i = 0; i < quotient.length; i++) if (quotient[i] === undefined) quotient[i] = 0
  return { quotient: quotient.length ? quotient : [0], remainder: r.slice(0, Math.max(1, dDeg)) }
}

/** 求分母（二次或一次）的实根，作为竖直渐近线 */
export function verticalAsymptotes(den: number[]): number[] {
  const d = degree(den)
  if (d === 1) return [-den[0] / den[1]]
  if (d === 2) {
    const [c, b, a] = den
    const disc = b * b - 4 * a * c
    if (disc < 0) return []
    if (Math.abs(disc) < 1e-12) return [-b / (2 * a)]
    const s = Math.sqrt(disc)
    return [(-b - s) / (2 * a), (-b + s) / (2 * a)].sort((p, q) => p - q)
  }
  return []
}

export type AsymKind = 'horizontal' | 'oblique' | 'none'
export interface EndAsymptote { kind: AsymKind; slope: number; intercept: number }

/** 水平或斜渐近线：比较分子分母次数 */
export function horizontalOrOblique(num: number[], den: number[]): EndAsymptote {
  const dn = degree(num)
  const dd = degree(den)
  if (dn < dd) return { kind: 'horizontal', slope: 0, intercept: 0 }
  if (dn === dd) return { kind: 'horizontal', slope: 0, intercept: num[dn] / den[dd] }
  if (dn === dd + 1) {
    const { quotient } = polyDivide(num, den)
    return { kind: 'oblique', slope: quotient[1] ?? 0, intercept: quotient[0] ?? 0 }
  }
  return { kind: 'none', slope: 0, intercept: 0 }
}

export interface RationalExample {
  key: string
  label: string
  num: number[]
  den: number[]
}

/** 预置例子：水平(y=0)、水平(系数比)、斜渐近线 */
export const RATIONAL_EXAMPLES: RationalExample[] = [
  { key: 'inv', label: '1 / (x - 1)', num: [1], den: [-1, 1] },
  { key: 'ratio', label: '(2x² + 1) / (x² - 4)', num: [1, 0, 2], den: [-4, 0, 1] },
  { key: 'oblique', label: '(x² + 1) / (x - 1)', num: [1, 0, 1], den: [-1, 1] },
]

export const SAMPLES = 480
