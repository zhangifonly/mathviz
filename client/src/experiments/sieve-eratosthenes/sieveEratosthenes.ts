/**
 * 埃拉托斯特尼筛法核心算法（纯函数，便于测试）
 *
 * 从 2 开始，把每个素数的倍数依次标记为合数，
 * 未被标记的就是素数。是求一段区间内所有素数的经典高效方法。
 */

/**
 * 埃氏筛。返回长度 n+1 的布尔数组，isPrime[i] 表示 i 是否为素数。
 * 约定：0 和 1 不是素数。
 */
export function sieve(n: number): boolean[] {
  const isPrime = new Array<boolean>(n + 1).fill(true)
  if (n >= 0) isPrime[0] = false
  if (n >= 1) isPrime[1] = false
  for (let p = 2; p * p <= n; p++) {
    if (!isPrime[p]) continue
    // 从 p*p 起标记，比 p 小的倍数已被更小的素数标记过
    for (let m = p * p; m <= n; m += p) {
      isPrime[m] = false
    }
  }
  return isPrime
}

/** 返回不超过 n 的所有素数列表 */
export function primesUpTo(n: number): number[] {
  const isPrime = sieve(n)
  const primes: number[] = []
  for (let i = 2; i <= n; i++) {
    if (isPrime[i]) primes.push(i)
  }
  return primes
}

/**
 * 返回长度 n+1 的数组，smallestFactor[i] 为 i 的最小质因子。
 * 素数的最小质因子是它自己；0 和 1 记为 0（无质因子）。
 * 用于按最小质因子给合数着色。
 */
export function smallestFactor(n: number): number[] {
  const spf = new Array<number>(n + 1).fill(0)
  for (let i = 2; i <= n; i++) {
    if (spf[i] !== 0) continue
    // i 此刻必为素数：标记它及其所有倍数中尚未有最小质因子者
    for (let m = i; m <= n; m += i) {
      if (spf[m] === 0) spf[m] = i
    }
  }
  return spf
}

/** 统计不超过 n 的素数个数（素数计数函数 π(n)） */
export function countPrimes(n: number): number {
  return primesUpTo(n).length
}

/** 可选的上界档位，供 UI 切换 */
export const GRID_SIZES = [50, 100, 200]
