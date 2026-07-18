/**
 * 欧拉函数 phi(n) 核心算法（纯函数，便于测试）
 *
 * phi(n) 表示 1..n 中与 n 互质的数的个数。
 * 用质因子公式计算：phi(n) = n * prod(1 - 1/p)，p 取遍 n 的不同质因子。
 */

/** 最大公约数（辗转相除法） */
export function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b !== 0) {
    const t = b
    b = a % b
    a = t
  }
  return a
}

/** 求出 n 的所有不同质因子 */
export function primeFactors(n: number): number[] {
  const factors: number[] = []
  let m = n
  for (let p = 2; p * p <= m; p++) {
    if (m % p === 0) {
      factors.push(p)
      while (m % p === 0) m = Math.floor(m / p)
    }
  }
  if (m > 1) factors.push(m)
  return factors
}

/** 欧拉函数 phi(n)，用质因子公式 n * prod(1 - 1/p) */
export function totient(n: number): number {
  if (n < 1) return 0
  if (n === 1) return 1
  let result = n
  for (const p of primeFactors(n)) {
    result -= Math.floor(result / p)
  }
  return result
}

/** 判断 a 与 b 是否互质 */
export function isCoprime(a: number, b: number): boolean {
  return gcd(a, b) === 1
}

/** 列出 1..n 中所有与 n 互质的数 */
export function coprimesUpTo(n: number): number[] {
  const list: number[] = []
  for (let k = 1; k <= n; k++) {
    if (gcd(k, n) === 1) list.push(k)
  }
  return list
}

/** 验证积性：当 gcd(m,n)=1 时 phi(m*n) = phi(m)*phi(n) */
export function isMultiplicative(m: number, n: number): boolean {
  if (gcd(m, n) !== 1) return false
  return totient(m * n) === totient(m) * totient(n)
}

/** 示例样本 */
export const SAMPLES = [12, 30, 36]
