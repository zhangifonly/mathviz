/**
 * 素数计数与素数定理核心算法（纯函数，便于测试）
 *
 * primePi(x)   —— 素数计数函数 π(x)，用埃拉托斯特尼筛法数出不超过 x 的素数个数
 * pnlApprox(x) —— 素数定理主项 x / ln(x)
 * logIntegral(x) —— 对数积分 Li(x) = ∫_2^x dt/ln(t)，比 x/ln(x) 更精确
 * 三者随 x 增大而渐近吻合（比值趋近 1）。
 */

/** 埃拉托斯特尼筛法：返回长度 n+1 的布尔数组，isComposite[i]=true 表示 i 是合数 */
export function sieve(n: number): boolean[] {
  const composite = new Array<boolean>(n + 1).fill(false)
  if (n >= 0) composite[0] = true
  if (n >= 1) composite[1] = true
  for (let p = 2; p * p <= n; p++) {
    if (!composite[p]) {
      for (let m = p * p; m <= n; m += p) composite[m] = true
    }
  }
  return composite
}

/** 素数计数函数 π(x)：不超过 x 的素数个数（用筛法数一遍） */
export function primePi(x: number): number {
  const n = Math.floor(x)
  if (n < 2) return 0
  const composite = sieve(n)
  let count = 0
  for (let i = 2; i <= n; i++) {
    if (!composite[i]) count++
  }
  return count
}

/** 素数定理主项 x / ln(x)（x<=1 时无意义，返回 0） */
export function pnlApprox(x: number): number {
  if (x <= 1) return 0
  return x / Math.log(x)
}

/** 对数积分 Li(x) = ∫_2^x dt/ln(t)，用辛普森法数值积分 */
export function logIntegral(x: number): number {
  if (x <= 2) return 0
  const steps = 2000
  const h = (x - 2) / steps
  const f = (t: number) => 1 / Math.log(t)
  let sum = f(2) + f(x)
  for (let i = 1; i < steps; i++) {
    const t = 2 + i * h
    sum += (i % 2 === 1 ? 4 : 2) * f(t)
  }
  return (h / 3) * sum
}

/** π(x) 与 x/ln(x) 的比值，素数定理断言 x→∞ 时趋近 1 */
export function primeRatio(x: number): number {
  const approx = pnlApprox(x)
  if (approx === 0) return 0
  return primePi(x) / approx
}

export const UPPER_BOUNDS = [100, 1000, 10000]
