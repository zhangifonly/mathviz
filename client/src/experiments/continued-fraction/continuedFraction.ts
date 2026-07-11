/**
 * 连分数（纯函数，便于测试）
 *
 * 连分数把一个实数写成 a0 + 1/(a1 + 1/(a2 + 1/(a3 + ...))) 的形式。
 * 有理数的连分数展开必然有限；无理数则无限。
 * 逐步截断得到的分数（渐近分数）是对原数最好的有理逼近。
 */

/** 连分数展开的一步渐近分数：分子 p、分母 q，以及当前系数 a */
export interface Convergent {
  a: number // 该步的连分数系数（整数部分）
  p: number // 渐近分数分子
  q: number // 渐近分数分母
}

/**
 * 计算实数 x 的连分数系数序列 [a0; a1, a2, ...]。
 * @param x 目标实数
 * @param maxTerms 最多展开多少项（无理数会无限，需截断）
 * @param eps 小数部分小于该值即视为展开结束（有理数会精确终止）
 */
export function continuedFractionCoeffs(
  x: number,
  maxTerms = 12,
  eps = 1e-9,
): number[] {
  const coeffs: number[] = []
  let value = x
  for (let i = 0; i < maxTerms; i++) {
    const a = Math.floor(value)
    coeffs.push(a)
    const frac = value - a
    if (frac < eps) break
    value = 1 / frac
  }
  return coeffs
}

/**
 * 由连分数系数序列递推计算每一步的渐近分数。
 * 递推式：p_k = a_k * p_{k-1} + p_{k-2}，q_k 同理。
 */
export function convergents(coeffs: number[]): Convergent[] {
  const result: Convergent[] = []
  let pPrev = 1
  let pPrev2 = 0
  let qPrev = 0
  let qPrev2 = 1
  for (const a of coeffs) {
    const p = a * pPrev + pPrev2
    const q = a * qPrev + qPrev2
    result.push({ a, p, q })
    pPrev2 = pPrev
    pPrev = p
    qPrev2 = qPrev
    qPrev = q
  }
  return result
}

/**
 * 把连分数系数序列还原成一个实数值（从最后一项往回折叠）。
 * 用于验证展开的正确性。
 */
export function evaluateContinuedFraction(coeffs: number[]): number {
  if (coeffs.length === 0) return 0
  let value = coeffs[coeffs.length - 1]
  for (let i = coeffs.length - 2; i >= 0; i--) {
    value = coeffs[i] + 1 / value
  }
  return value
}

/** 最大公约数（辗转相除），用于把有理数化到最简 */
export function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b !== 0) {
    ;[a, b] = [b, a % b]
  }
  return a
}

/** 有理数 num/den 的连分数系数（精确，用整数运算避免浮点误差） */
export function rationalCoeffs(num: number, den: number): number[] {
  const coeffs: number[] = []
  let a = num
  let b = den
  while (b !== 0) {
    const q = Math.floor(a / b)
    coeffs.push(q)
    ;[a, b] = [b, a - q * b]
  }
  return coeffs
}

export interface NumberOption {
  key: string
  label: string
  value: number
  note: string
}

/** 可供演示的经典常数与有理数 */
export const NUMBER_OPTIONS: NumberOption[] = [
  { key: 'golden', label: '黄金比例 φ', value: (1 + Math.sqrt(5)) / 2, note: '系数全是 1，最难逼近' },
  { key: 'pi', label: '圆周率 π', value: Math.PI, note: '渐近分数出现 22/7、355/113' },
  { key: 'e', label: '自然常数 e', value: Math.E, note: '系数呈 2,1,2,1,4,1... 规律' },
  { key: 'sqrt2', label: '根号 2', value: Math.SQRT2, note: '系数循环 1,2,2,2...' },
  { key: 'frac', label: '有理数 45/16', value: 45 / 16, note: '有限连分数，精确终止' },
]
