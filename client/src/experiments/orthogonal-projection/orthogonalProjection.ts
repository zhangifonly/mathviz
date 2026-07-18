/**
 * 正交投影核心算法（纯函数，便于测试）
 *
 * 把向量 v 投影到另一个向量/方向 u 所在的直线上：
 *   proj = (v·u / u·u) u
 * 垂足（投影点）是直线上离 v 最近的点，残差 r = v - proj 与 u 正交。
 */

export interface Vec2 {
  x: number
  y: number
}

/** 点积 v·u */
export function dot(v: Vec2, u: Vec2): number {
  return v.x * u.x + v.y * u.y
}

/** 模长 |v| */
export function norm(v: Vec2): number {
  return Math.sqrt(dot(v, v))
}

/**
 * 向量 v 在方向 u 上的正交投影 proj = (v·u/u·u) u。
 * u 为零向量时退化返回零向量。
 */
export function projectOnto(v: Vec2, u: Vec2): Vec2 {
  const uu = dot(u, u)
  if (uu === 0) return { x: 0, y: 0 }
  const k = dot(v, u) / uu
  return { x: k * u.x, y: k * u.y }
}

/** 投影系数（标量），v 在 u 上的坐标 */
export function projectionCoeff(v: Vec2, u: Vec2): number {
  const uu = dot(u, u)
  if (uu === 0) return 0
  return dot(v, u) / uu
}

/** 残差 r = v - proj，理论上与 u 正交 */
export function residual(v: Vec2, u: Vec2): Vec2 {
  const p = projectOnto(v, u)
  return { x: v.x - p.x, y: v.y - p.y }
}

/** 判断两向量是否近似正交（点积接近 0） */
export function isOrthogonal(a: Vec2, b: Vec2, eps = 1e-9): boolean {
  return Math.abs(dot(a, b)) <= eps * (norm(a) * norm(b) + 1)
}

/** 由角度（弧度）生成单位方向向量 */
export function dirFromAngle(theta: number): Vec2 {
  return { x: Math.cos(theta), y: Math.sin(theta) }
}

/** 预设演示样例：不同的向量 v 与直线角度（度） */
export const SAMPLES = [
  { label: '斜上方', vx: 3, vy: 2, angleDeg: 20 },
  { label: '陡峭向量', vx: 1, vy: 3, angleDeg: 35 },
  { label: '接近垂直', vx: -2, vy: 3, angleDeg: 60 },
  { label: '水平投影', vx: 3, vy: 1, angleDeg: 0 },
]
