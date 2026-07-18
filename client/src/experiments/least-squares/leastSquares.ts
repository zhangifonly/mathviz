/**
 * 最小二乘法核心算法（纯函数，便于测试）
 *
 * 给定一堆散点，寻找一条直线 y = kx + b，
 * 使所有点到直线的竖直残差平方和最小。
 * 用闭式解（正规方程）：k = cov(x,y)/var(x)，b = ȳ - k·x̄。
 */

export interface Point {
  x: number
  y: number
}

export interface Line {
  slope: number
  intercept: number
}

/** 数据生成用的真实直线参数（供噪声散点围绕它分布） */
export const TRUE_SLOPE = 0.8
export const TRUE_INTERCEPT = 12

/** 噪声档位（散点在竖直方向的抖动幅度） */
export const NOISE_LEVELS = [6, 18, 36]

/** 生成 n 个围绕真实直线的带噪声散点（线性同余伪随机，可复现） */
export function makePoints(n: number, noise: number, seed = 1): Point[] {
  let s = seed
  const rand = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
  const pts: Point[] = []
  for (let i = 0; i < n; i++) {
    const x = (i + 0.5) * (100 / n) + (rand() - 0.5) * (60 / n)
    const jitter = (rand() - 0.5) * 2 * noise
    const y = TRUE_SLOPE * x + TRUE_INTERCEPT + jitter
    pts.push({ x, y })
  }
  return pts
}

/** 闭式最小二乘拟合一元直线 */
export function fitLine(points: Point[]): Line {
  const n = points.length
  if (n < 2) return { slope: 0, intercept: n === 1 ? points[0].y : 0 }
  let sx = 0
  let sy = 0
  for (const p of points) {
    sx += p.x
    sy += p.y
  }
  const mx = sx / n
  const my = sy / n
  let cov = 0
  let varX = 0
  for (const p of points) {
    const dx = p.x - mx
    cov += dx * (p.y - my)
    varX += dx * dx
  }
  if (varX === 0) return { slope: 0, intercept: my }
  const slope = cov / varX
  return { slope, intercept: my - slope * mx }
}

/** 残差平方和：Σ (yᵢ - (k·xᵢ + b))² */
export function rss(points: Point[], line: Line): number {
  let sum = 0
  for (const p of points) {
    const pred = line.slope * p.x + line.intercept
    const r = p.y - pred
    sum += r * r
  }
  return sum
}

/** 决定系数 R² = 1 - RSS/TSS，衡量拟合优度（越接近 1 越好） */
export function rSquared(points: Point[], line: Line): number {
  const n = points.length
  if (n < 2) return 1
  let sy = 0
  for (const p of points) sy += p.y
  const my = sy / n
  let tss = 0
  for (const p of points) {
    const d = p.y - my
    tss += d * d
  }
  if (tss === 0) return 1
  return 1 - rss(points, line) / tss
}
