/**
 * 莫比乌斯函数核心算法（纯函数，便于测试）
 *
 * 莫比乌斯函数 μ(n) 是数论中的经典函数：
 *   - 若 n 含平方因子（能被某个素数的平方整除），μ(n)=0
 *   - 否则 μ(n)=(-1)^k，k 为 n 的不同素因子个数
 * 梅滕斯函数 M(n)=∑_{i=1}^{n} μ(i) 是它的前缀和。
 */

/** 计算单个 μ(n)。n>=1。返回 -1 / 0 / +1 */
export function mobius(n: number): number {
  if (n < 1) return 0
  if (n === 1) return 1
  let m = n
  let primeCount = 0
  for (let p = 2; p * p <= m; p++) {
    if (m % p === 0) {
      m /= p
      primeCount++
      if (m % p === 0) return 0 // 出现平方因子
    }
  }
  if (m > 1) primeCount++ // 剩下一个大素因子
  return primeCount % 2 === 0 ? 1 : -1
}

/** 返回 [1..n] 的 μ 值数组，索引 i 对应 μ(i+1) */
export function mobiusArray(n: number): number[] {
  const out: number[] = []
  for (let i = 1; i <= n; i++) out.push(mobius(i))
  return out
}

/** 梅滕斯函数 M(n)=∑_{i=1}^{n} μ(i) */
export function mertens(n: number): number {
  let sum = 0
  for (let i = 1; i <= n; i++) sum += mobius(i)
  return sum
}

/** 返回 [M(1)..M(n)] 的前缀和数组 */
export function mertensArray(n: number): number[] {
  const out: number[] = []
  let sum = 0
  for (let i = 1; i <= n; i++) {
    sum += mobius(i)
    out.push(sum)
  }
  return out
}

/** 除数上的莫比乌斯和 ∑_{d|n} μ(d)，理论上等于 [n==1] */
export function divisorMobiusSum(n: number): number {
  let sum = 0
  for (let d = 1; d <= n; d++) {
    if (n % d === 0) sum += mobius(d)
  }
  return sum
}

/** 可选的范围档位（可视化条形数量） */
export const RANGE = [30, 60, 100]
