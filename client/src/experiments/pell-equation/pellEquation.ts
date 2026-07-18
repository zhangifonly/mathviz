/**
 * 佩尔方程核心算法（纯函数，便于测试）
 *
 * 佩尔方程形如 x^2 - N*y^2 = 1，N 为非完全平方的正整数，
 * 求其正整数解 (x, y)。用连分数逼近 sqrt(N)：sqrt(N) 的连分数
 * 展开是周期的，其渐近分数 p/q 中第一个满足方程的即为基本解，
 * 后续解由 (x1 + y1*sqrt(N))^k 递推得到。
 */

export interface PellSolution {
  x: number
  y: number
}

/** 判断 N 是否完全平方数 */
export function isPerfectSquare(N: number): boolean {
  if (N < 0) return false
  const r = Math.round(Math.sqrt(N))
  return r * r === N
}

/**
 * 求 sqrt(N) 的连分数展开：[a0; a1, a2, ...]（周期部分）。
 * 返回从 a0 开始的一个周期系数数组。N 为完全平方时返回 [sqrt(N)]。
 */
export function continuedFractionSqrt(N: number): number[] {
  const a0 = Math.floor(Math.sqrt(N))
  const coeffs = [a0]
  if (a0 * a0 === N) return coeffs
  let m = 0
  let d = 1
  let a = a0
  // 周期在 a === 2*a0 时结束
  while (a !== 2 * a0) {
    m = d * a - m
    d = (N - m * m) / d
    a = Math.floor((a0 + m) / d)
    coeffs.push(a)
  }
  return coeffs
}

/**
 * 求佩尔方程 x^2 - N*y^2 = 1 的基本（最小正整数）解。
 * 逐个计算连分数渐近分数 h/k，直到满足方程。完全平方数返回 null。
 */
export function fundamentalSolution(N: number): PellSolution | null {
  if (isPerfectSquare(N)) return null
  const cf = continuedFractionSqrt(N)
  const a0 = cf[0]
  const period = cf.slice(1)
  // 渐近分数递推：h_n = a_n*h_{n-1} + h_{n-2}
  let hPrev = 1
  let h = a0
  let kPrev = 0
  let k = 1
  let i = 0
  // 若周期长度为偶数，基本解在第一个周期末；否则在第二个周期末
  const limit = period.length % 2 === 0 ? period.length : 2 * period.length
  while (true) {
    if (h * h - N * k * k === 1) return { x: h, y: k }
    const a = period[i % period.length]
    const hNext = a * h + hPrev
    const kNext = a * k + kPrev
    hPrev = h
    h = hNext
    kPrev = k
    k = kNext
    i++
    if (i > limit + 2) break
  }
  return null
}

/**
 * 生成佩尔方程前 count 个正整数解。
 * 由基本解 (x1, y1) 递推：x_{n+1} = x1*x_n + N*y1*y_n，
 * y_{n+1} = x1*y_n + y1*x_n（即 (x1+y1√N)^k 展开）。
 */
export function generateSolutions(N: number, count: number): PellSolution[] {
  const base = fundamentalSolution(N)
  if (!base) return []
  const sols: PellSolution[] = [{ x: base.x, y: base.y }]
  let { x, y } = base
  for (let i = 1; i < count; i++) {
    const nx = base.x * x + N * base.y * y
    const ny = base.x * y + base.y * x
    x = nx
    y = ny
    sols.push({ x, y })
  }
  return sols
}

export const NS = [2, 3, 5, 7, 13]
