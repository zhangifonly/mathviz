/**
 * 实数域椭圆曲线核心算法（纯函数，便于测试）
 *
 * 曲线方程 y^2 = x^3 + a*x + b（要求非奇异：4a^3 + 27b^2 != 0）。
 * 曲线上的点连同"无穷远点" O 构成一个交换群：
 *   - 加法用弦切法几何构造：过 P、Q 的直线交曲线于第三点 R，
 *     P+Q 定义为 R 关于 x 轴的对称点。
 *   - O 是单位元（群零元）。
 * 这里用 null 表示无穷远点 O。
 */

export interface Point {
  x: number
  y: number
}

/** 曲线参数 y^2 = x^3 + a x + b */
export interface Curve {
  a: number
  b: number
}

/** 判别式，非零则曲线非奇异 */
export function discriminant(c: Curve): number {
  return -16 * (4 * c.a * c.a * c.a + 27 * c.b * c.b)
}

/** 计算某点的另一 y（正分支），x 不在曲线定义域返回 null */
export function curveY(c: Curve, x: number): number | null {
  const rhs = x * x * x + c.a * x + c.b
  if (rhs < 0) return null
  return Math.sqrt(rhs)
}

/** 判断点是否在曲线上（含无穷远点 O=null） */
export function onCurve(c: Curve, p: Point | null, eps = 1e-6): boolean {
  if (p === null) return true
  const lhs = p.y * p.y
  const rhs = p.x * p.x * p.x + c.a * p.x + c.b
  return Math.abs(lhs - rhs) < eps
}

/** 取负元 -P（关于 x 轴对称） */
export function negate(p: Point | null): Point | null {
  if (p === null) return null
  return { x: p.x, y: -p.y }
}

/** 倍点 2P：用切线斜率求 P+P */
export function pointDouble(c: Curve, p: Point | null): Point | null {
  if (p === null) return null
  if (Math.abs(p.y) < 1e-12) return null // 切线竖直，结果为 O
  const s = (3 * p.x * p.x + c.a) / (2 * p.y)
  const x = s * s - 2 * p.x
  const y = s * (p.x - x) - p.y
  return { x, y }
}

/** 点加 P+Q：弦切法几何加法 */
export function pointAdd(c: Curve, p: Point | null, q: Point | null): Point | null {
  if (p === null) return q
  if (q === null) return p
  if (Math.abs(p.x - q.x) < 1e-12) {
    // 同 x：要么互为负元（和为 O），要么是同点（倍点）
    if (Math.abs(p.y + q.y) < 1e-9) return null
    return pointDouble(c, p)
  }
  const s = (q.y - p.y) / (q.x - p.x)
  const x = s * s - p.x - q.x
  const y = s * (p.x - x) - p.y
  return { x, y }
}

/** 数乘 n*P：反复加法（快速倍增） */
export function scalarMult(c: Curve, n: number, p: Point | null): Point | null {
  let k = Math.abs(Math.trunc(n))
  let base: Point | null = n < 0 ? negate(p) : p
  let result: Point | null = null
  while (k > 0) {
    if (k & 1) result = pointAdd(c, result, base)
    base = pointDouble(c, base)
    k = Math.floor(k / 2)
  }
  return result
}

/** 预设曲线库 */
export const CURVES: Curve[] = [
  { a: -1, b: 1 },
  { a: -2, b: 2 },
  { a: 0, b: 1 },
]
