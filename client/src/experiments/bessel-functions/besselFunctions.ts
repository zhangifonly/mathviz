/**
 * 贝塞尔函数核心（纯函数，便于测试）
 *
 * 第一类贝塞尔函数 J_n(x) 是贝塞尔方程
 *   x^2 y'' + x y' + (x^2 - n^2) y = 0
 * 的解，描述圆膜（鼓面）振动的径向模态。
 *
 * 幂级数展开：
 *   J_n(x) = Σ_{k=0}^∞ (-1)^k / (k! (n+k)!) * (x/2)^(2k+n)
 */

/** 阶乘（整数），用于幂级数系数 */
export function factorial(m: number): number {
  let f = 1
  for (let i = 2; i <= m; i++) f *= i
  return f
}

/**
 * 第一类贝塞尔函数 J_n(x)，用幂级数求和。
 * terms 控制级数项数，x 不太大时收敛很快。
 */
export function besselJ(n: number, x: number, terms = 30): number {
  let sum = 0
  const half = x / 2
  for (let k = 0; k < terms; k++) {
    const coef = Math.pow(-1, k) / (factorial(k) * factorial(n + k))
    sum += coef * Math.pow(half, 2 * k + n)
  }
  return sum
}

/**
 * 在 [xMin, xMax] 上用变号法+二分找 J_n 的前若干个正零点。
 * 零点决定圆膜振动的节圆半径。
 */
export function besselZeros(n: number, count = 5, xMax = 40, dx = 0.05): number[] {
  const zeros: number[] = []
  let prev = besselJ(n, 1e-6)
  let x = 1e-6
  while (x < xMax && zeros.length < count) {
    const next = x + dx
    const cur = besselJ(n, next)
    if (prev === 0) {
      zeros.push(x)
    } else if (prev * cur < 0) {
      // 二分细化根
      let lo = x
      let hi = next
      for (let i = 0; i < 40; i++) {
        const mid = (lo + hi) / 2
        const fm = besselJ(n, mid)
        if (besselJ(n, lo) * fm <= 0) hi = mid
        else lo = mid
      }
      zeros.push((lo + hi) / 2)
    }
    prev = cur
    x = next
  }
  return zeros
}

/** 采样 J_n 在 [0, xMax] 上的曲线点，供绘图 */
export function sampleBessel(n: number, xMax = 20, steps = 400): { x: number; y: number }[] {
  const pts: { x: number; y: number }[] = []
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * xMax
    pts.push({ x, y: besselJ(n, x) })
  }
  return pts
}

/** 演示用的贝塞尔函数阶数 */
export const ORDERS = [0, 1, 2]
