/**
 * 完全数与亲和数核心算法（纯函数，便于测试）
 *
 * 完全数：一个数等于它所有真因数（不含自身）之和，如 6=1+2+3。
 * 盈数：真因数和大于自身；亏数：真因数和小于自身。
 * 亲和数：两个数互为对方真因数之和，如 220 与 284。
 */

export type NumberClass = 'perfect' | 'abundant' | 'deficient'

/** 返回 n 的所有真因数（不含 n 自身），升序排列 */
export function properDivisors(n: number): number[] {
  if (n < 2) return []
  const small: number[] = [1]
  const large: number[] = []
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) {
      small.push(i)
      const j = n / i
      if (j !== i) large.push(j)
    }
  }
  large.reverse()
  return small.concat(large)
}

/** n 的真因数之和 */
export function divisorSum(n: number): number {
  return properDivisors(n).reduce((a, b) => a + b, 0)
}

/** 按真因数和与自身的关系分类 */
export function classify(n: number): NumberClass {
  const s = divisorSum(n)
  if (s === n) return 'perfect'
  if (s > n) return 'abundant'
  return 'deficient'
}

/** 判断 a、b 是否互为亲和数（互不相等且互为对方真因数和） */
export function isAmicable(a: number, b: number): boolean {
  if (a === b || a < 2 || b < 2) return false
  return divisorSum(a) === b && divisorSum(b) === a
}

/** 生成不超过 limit 的完全数列表 */
export function perfectNumbers(limit: number): number[] {
  const out: number[] = []
  for (let n = 2; n <= limit; n++) {
    if (classify(n) === 'perfect') out.push(n)
  }
  return out
}

export const KNOWN_PERFECTS = [6, 28, 496, 8128]
export const SAMPLES = [6, 28, 220, 284, 12]
