/**
 * 万花尺（内摆线 / hypotrochoid）核心算法（纯函数，便于测试）
 *
 * 一个半径 r 的小圆在半径 R 的大圆内侧无滑动滚动，
 * 小圆内距圆心 d 处的笔尖画出的轨迹就是内摆线（hypotrochoid）：
 *   x = (R-r)cos(t) + d*cos((R-r)/r * t)
 *   y = (R-r)sin(t) - d*sin((R-r)/r * t)
 * 花瓣数由 R/r 的比值（约分后）决定，曲线在 t 走过 2π*r/gcd(R,r) 后闭合。
 */

export interface Point {
  x: number
  y: number
}

export interface SpiroParams {
  R: number // 大圆（固定圆）半径
  r: number // 小圆（滚动圆）半径
  d: number // 笔尖到小圆圆心的距离
}

/** 最大公约数（欧几里得算法），用于判断花瓣数与闭合周期 */
export function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a))
  b = Math.abs(Math.round(b))
  while (b) {
    ;[a, b] = [b, a % b]
  }
  return a
}

/** 花瓣（尖点/回环）数量 = R / gcd(R, r) */
export function petalCount(R: number, r: number): number {
  const g = gcd(R, r)
  return g === 0 ? 0 : Math.round(R / g)
}

/**
 * 曲线闭合所需的参数上限：t 从 0 走到 2π * r / gcd(R, r)。
 * 此时小圆恰好在大圆内滚动整数圈并回到初始位置。
 */
export function closingT(R: number, r: number): number {
  const g = gcd(R, r)
  return g === 0 ? 2 * Math.PI : (2 * Math.PI * r) / g
}

/** 内摆线在参数 t 处的坐标（未缩放，圆心在原点） */
export function hypotrochoid(p: SpiroParams, t: number): Point {
  const k = p.R - p.r
  const ratio = k / p.r
  return {
    x: k * Math.cos(t) + p.d * Math.cos(ratio * t),
    y: k * Math.sin(t) - p.d * Math.sin(ratio * t),
  }
}

/**
 * 采样整条闭合曲线，返回点序列。
 * @param steps 采样点数量（越大越平滑）
 */
export function sampleCurve(p: SpiroParams, steps = 2000): Point[] {
  const tMax = closingT(p.R, p.r)
  const pts: Point[] = []
  for (let i = 0; i <= steps; i++) {
    pts.push(hypotrochoid(p, (tMax * i) / steps))
  }
  return pts
}

/** 曲线的最大半径（用于自适应缩放到画布） */
export function maxRadius(p: SpiroParams): number {
  return Math.abs(p.R - p.r) + Math.abs(p.d)
}

/** 预设参数组，每组画出不同花纹 */
export const PRESETS: { name: string; R: number; r: number; d: number }[] = [
  { name: '五瓣星', R: 100, r: 40, d: 40 },
  { name: '细密玫瑰', R: 105, r: 32, d: 50 },
  { name: '七角花', R: 96, r: 28, d: 44 },
  { name: '缠绕环', R: 120, r: 35, d: 60 },
]
