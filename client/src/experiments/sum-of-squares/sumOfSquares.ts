/**
 * 平方和定理核心算法（纯函数，便于测试）
 *
 * 研究哪些自然数可以写成两个整数的平方和 a^2 + b^2 = n。
 * 费马双平方定理：n 能表示为两平方和，当且仅当 n 的每个
 * 形如 4k+3 的质因子都出现偶数次。
 */

export interface SquarePair {
  a: number
  b: number
}

/** 找出所有满足 a^2 + b^2 = n 且 0 <= a <= b 的表示 */
export function waysToSumTwoSquares(n: number): SquarePair[] {
  const pairs: SquarePair[] = []
  if (n < 0) return pairs
  const limit = Math.floor(Math.sqrt(n / 2))
  for (let a = 0; a <= limit; a++) {
    const rest = n - a * a
    const b = Math.round(Math.sqrt(rest))
    if (b >= a && b * b === rest) {
      pairs.push({ a, b })
    }
  }
  return pairs
}

/**
 * 费马双平方定理判定：n 是否为两平方和。
 * 对 n 做质因数分解，检查所有 4k+3 型质因子的幂次是否为偶数。
 */
export function isSumOfTwoSquares(n: number): boolean {
  if (n < 0) return false
  if (n === 0) return true
  let m = n
  for (let p = 2; p * p <= m; p++) {
    if (m % p === 0) {
      let exp = 0
      while (m % p === 0) {
        m = Math.floor(m / p)
        exp++
      }
      if (p % 4 === 3 && exp % 2 === 1) return false
    }
  }
  // 剩余的 m 是一个大质因子（幂次为 1）
  if (m % 4 === 3) return false
  return true
}

/** 枚举 1..N，返回每个数是否为两平方和 */
export function sumsInRange(N: number): boolean[] {
  const flags: boolean[] = []
  for (let n = 1; n <= N; n++) {
    flags.push(isSumOfTwoSquares(n))
  }
  return flags
}

/** 统计 1..N 中能表示为两平方和的个数 */
export function countSumsInRange(N: number): number {
  return sumsInRange(N).filter(Boolean).length
}

export const RANGE = 100
export const RANGE_CHOICES = [50, 100, 200]
