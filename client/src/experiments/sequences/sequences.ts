/**
 * 等差数列与等比数列（纯函数，便于测试，不碰 DOM）
 *
 * 等差数列：相邻两项之差为常数 d，通项 a_n = a1 + (n-1)*d。
 * 等比数列：相邻两项之比为常数 r，通项 a_n = a1 * r^(n-1)。
 */

/** 等差数列通项：a_n = a1 + (n-1)*d（n 从 1 开始） */
export function arithmeticTerm(a1: number, d: number, n: number): number {
  return a1 + (n - 1) * d
}

/** 生成等差数列前 n 项 */
export function arithmeticSequence(a1: number, d: number, n: number): number[] {
  const out: number[] = []
  for (let i = 1; i <= n; i++) out.push(arithmeticTerm(a1, d, i))
  return out
}

/** 等差数列前 n 项和：S_n = n*(a1 + a_n)/2 = n*a1 + n*(n-1)*d/2 */
export function arithmeticSum(a1: number, d: number, n: number): number {
  if (n <= 0) return 0
  const an = arithmeticTerm(a1, d, n)
  return (n * (a1 + an)) / 2
}

/** 等比数列通项：a_n = a1 * r^(n-1)（n 从 1 开始） */
export function geometricTerm(a1: number, r: number, n: number): number {
  return a1 * Math.pow(r, n - 1)
}

/** 生成等比数列前 n 项 */
export function geometricSequence(a1: number, r: number, n: number): number[] {
  const out: number[] = []
  for (let i = 1; i <= n; i++) out.push(geometricTerm(a1, r, i))
  return out
}

/**
 * 等比数列前 n 项和：
 * r === 1 时 S_n = a1 * n；否则 S_n = a1 * (1 - r^n) / (1 - r)。
 */
export function geometricSum(a1: number, r: number, n: number): number {
  if (n <= 0) return 0
  if (r === 1) return a1 * n
  return (a1 * (1 - Math.pow(r, n))) / (1 - r)
}

/**
 * 无穷等比数列的极限和：仅当 |r| < 1 时收敛，S = a1 / (1 - r)。
 * 不收敛返回 null。
 */
export function geometricInfiniteSum(a1: number, r: number): number | null {
  if (Math.abs(r) >= 1) return null
  return a1 / (1 - r)
}

export type SequenceKind = 'arithmetic' | 'geometric'

export interface SequenceOption {
  kind: SequenceKind
  label: string
  a1: number
  step: number // 等差为公差 d，等比为公比 r
  note: string
}

export const SEQUENCE_OPTIONS: SequenceOption[] = [
  { kind: 'arithmetic', a1: 1, step: 2, label: '等差 · 公差 2', note: '1, 3, 5, 7, 9 … 每次加 2' },
  { kind: 'arithmetic', a1: 3, step: -1, label: '等差 · 公差 -1', note: '3, 2, 1, 0, -1 … 每次减 1' },
  { kind: 'geometric', a1: 1, step: 2, label: '等比 · 公比 2', note: '1, 2, 4, 8, 16 … 每次乘 2' },
  { kind: 'geometric', a1: 8, step: 0.5, label: '等比 · 公比 0.5', note: '8, 4, 2, 1 … 每次乘一半，趋近于 0' },
]
