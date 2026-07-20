/**
 * 质因数分解核心算法（纯函数，便于测试）
 *
 * 算术基本定理：任何大于 1 的整数，都能唯一地写成若干质数的乘积。
 * 这里用试除法把一个数拆成质因数，并构造一棵二叉分解树用于可视化。
 */

/** 因数树节点：叶子(prime=true) 或内部节点(拆成 left * right) */
export interface FactorNode {
  value: number
  prime: boolean
  left?: FactorNode
  right?: FactorNode
}

/** 分解出 n 的全部质因数（带重复），如 12 -> [2, 2, 3] */
export function factorize(n: number): number[] {
  const factors: number[] = []
  let m = Math.abs(Math.trunc(n))
  if (m < 2) return factors
  for (let d = 2; d * d <= m; d++) {
    while (m % d === 0) {
      factors.push(d)
      m /= d
    }
  }
  if (m > 1) factors.push(m)
  return factors
}

/** 判断质数 */
export function isPrime(n: number): boolean {
  if (n < 2) return false
  for (let d = 2; d * d <= n; d++) {
    if (n % d === 0) return false
  }
  return true
}

/** 指数形式，如 12 -> [{prime:2,exp:2},{prime:3,exp:1}] */
export function factorPairs(n: number): { prime: number; exp: number }[] {
  const factors = factorize(n)
  const pairs: { prime: number; exp: number }[] = []
  for (const p of factors) {
    const last = pairs[pairs.length - 1]
    if (last && last.prime === p) last.exp++
    else pairs.push({ prime: p, exp: 1 })
  }
  return pairs
}

/** 找 n 的最小质因数（n>=2 且为合数时用于拆分） */
export function smallestFactor(n: number): number {
  for (let d = 2; d * d <= n; d++) {
    if (n % d === 0) return d
  }
  return n
}

/** 递归构造因数树：把合数拆成 最小质因数 × 其余，直到全为质数 */
export function factorTree(n: number): FactorNode {
  const m = Math.abs(Math.trunc(n))
  if (m < 2 || isPrime(m)) {
    return { value: m, prime: m >= 2 }
  }
  const p = smallestFactor(m)
  return {
    value: m,
    prime: false,
    left: { value: p, prime: true },
    right: factorTree(m / p),
  }
}

/** 把 pairs 渲染成人类可读字符串，如 "2^2 x 3" */
export function formatFactorization(n: number): string {
  const pairs = factorPairs(n)
  if (pairs.length === 0) return String(n)
  return pairs.map((p) => (p.exp === 1 ? `${p.prime}` : `${p.prime}^${p.exp}`)).join(' x ')
}

export const SAMPLES = [60, 100, 360, 17]
