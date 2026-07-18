/**
 * 三角形四心核心算法（纯函数，便于测试）
 *
 * 给定三顶点 A/B/C，计算：
 * - centroid   重心：三顶点坐标平均
 * - circumcenter 外心：三边垂直平分线交点（外接圆圆心）
 * - incenter   内心：三条角平分线交点（内切圆圆心，按对边长加权）
 * - orthocenter 垂心：三条高线交点
 * 再给出外接圆半径 circumradius 与内切圆半径 inradius。
 */

export interface Point {
  x: number
  y: number
}

export type Triangle = [Point, Point, Point]

/** 两点距离 */
export function distance(p: Point, q: Point): number {
  return Math.hypot(p.x - q.x, p.y - q.y)
}

/** 重心 = 三顶点平均 */
export function centroid(t: Triangle): Point {
  const [a, b, c] = t
  return { x: (a.x + b.x + c.x) / 3, y: (a.y + b.y + c.y) / 3 }
}

/**
 * 外心：解垂直平分线交点。
 * d = 2 * (ax(by-cy) + bx(cy-ay) + cx(ay-by))
 */
export function circumcenter(t: Triangle): Point {
  const [a, b, c] = t
  const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y))
  const a2 = a.x * a.x + a.y * a.y
  const b2 = b.x * b.x + b.y * b.y
  const c2 = c.x * c.x + c.y * c.y
  const ux = (a2 * (b.y - c.y) + b2 * (c.y - a.y) + c2 * (a.y - b.y)) / d
  const uy = (a2 * (c.x - b.x) + b2 * (a.x - c.x) + c2 * (b.x - a.x)) / d
  return { x: ux, y: uy }
}

/** 内心：以对边长为权重的加权平均 */
export function incenter(t: Triangle): Point {
  const [a, b, c] = t
  const la = distance(b, c) // A 的对边
  const lb = distance(a, c) // B 的对边
  const lc = distance(a, b) // C 的对边
  const p = la + lb + lc
  return {
    x: (la * a.x + lb * b.x + lc * c.x) / p,
    y: (la * a.y + lb * b.y + lc * c.y) / p,
  }
}

/** 垂心：利用恒等式 H = A + B + C - 2*O（O 为外心） */
export function orthocenter(t: Triangle): Point {
  const [a, b, c] = t
  const o = circumcenter(t)
  return {
    x: a.x + b.x + c.x - 2 * o.x,
    y: a.y + b.y + c.y - 2 * o.y,
  }
}

/** 外接圆半径 = 外心到任一顶点距离 */
export function circumradius(t: Triangle): number {
  return distance(circumcenter(t), t[0])
}

/** 三角形面积（叉积绝对值的一半） */
export function triangleArea(t: Triangle): number {
  const [a, b, c] = t
  return Math.abs((b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y)) / 2
}

/** 内切圆半径 = 面积 / 半周长 */
export function inradius(t: Triangle): number {
  const [a, b, c] = t
  const s = (distance(b, c) + distance(a, c) + distance(a, b)) / 2
  return triangleArea(t) / s
}

/** 三组预设三角形（锐角、钝角、直角），画布坐标系 */
export const PRESET_TRIANGLES: Triangle[] = [
  [{ x: 300, y: 90 }, { x: 130, y: 380 }, { x: 470, y: 380 }],
  [{ x: 140, y: 120 }, { x: 210, y: 400 }, { x: 520, y: 340 }],
  [{ x: 160, y: 130 }, { x: 160, y: 400 }, { x: 480, y: 400 }],
]
