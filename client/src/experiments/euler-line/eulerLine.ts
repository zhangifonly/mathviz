/**
 * 欧拉线核心算法（纯函数，便于测试）
 *
 * 对任意非等边三角形，重心(centroid)、外心(circumcenter)、
 * 垂心(orthocenter)三点共线，这条线称为欧拉线；且重心把
 * 外心到垂心的线段分成 1:2（OG:GH = 1:2）。
 * 这里三心各自用独立几何方法求出，再验证共线，绝非套用恒等式。
 */

export interface Pt {
  x: number
  y: number
}

export interface Triangle {
  A: Pt
  B: Pt
  C: Pt
}

/** 重心：三顶点坐标的算术平均 */
export function centroid(A: Pt, B: Pt, C: Pt): Pt {
  return { x: (A.x + B.x + C.x) / 3, y: (A.y + B.y + C.y) / 3 }
}

/** 外心：三边垂直平分线的交点（外接圆圆心） */
export function circumcenter(A: Pt, B: Pt, C: Pt): Pt {
  const d = 2 * (A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y))
  const a2 = A.x * A.x + A.y * A.y
  const b2 = B.x * B.x + B.y * B.y
  const c2 = C.x * C.x + C.y * C.y
  const ux = a2 * (B.y - C.y) + b2 * (C.y - A.y) + c2 * (A.y - B.y)
  const uy = a2 * (C.x - B.x) + b2 * (A.x - C.x) + c2 * (B.x - A.x)
  return { x: ux / d, y: uy / d }
}

/** 垂心：两条高线的交点（解 2x2 线性方程组，独立于外心） */
export function orthocenter(A: Pt, B: Pt, C: Pt): Pt {
  const a1 = B.x - C.x
  const b1 = B.y - C.y
  const c1 = A.x * (B.x - C.x) + A.y * (B.y - C.y)
  const a2 = A.x - C.x
  const b2 = A.y - C.y
  const c2 = B.x * (A.x - C.x) + B.y * (A.y - C.y)
  const det = a1 * b2 - a2 * b1
  return { x: (c1 * b2 - c2 * b1) / det, y: (a1 * c2 - a2 * c1) / det }
}

/** 三点共线判定：叉积（有向面积两倍）绝对值接近 0 */
export function collinear(p: Pt, q: Pt, r: Pt, eps = 1e-6): boolean {
  const cross = (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x)
  return Math.abs(cross) < eps
}

/** 两点距离 */
export function dist(p: Pt, q: Pt): number {
  return Math.hypot(p.x - q.x, p.y - q.y)
}

/**
 * 欧拉线端点：沿外心->垂心方向向两侧延伸 span，
 * 供 canvas 画一条贯穿画面的直线（画布自动裁剪）。
 * 等边三角形三心重合，方向退化，回退到重心方向或返回同点。
 */
export function eulerLineEndpoints(A: Pt, B: Pt, C: Pt, span = 2000): [Pt, Pt] {
  const O = circumcenter(A, B, C)
  const H = orthocenter(A, B, C)
  let dx = H.x - O.x
  let dy = H.y - O.y
  const len = Math.hypot(dx, dy)
  if (len < 1e-9) return [{ ...O }, { ...O }]
  dx /= len
  dy /= len
  return [
    { x: O.x - dx * span, y: O.y - dy * span },
    { x: O.x + dx * span, y: O.y + dy * span },
  ]
}

/** 预置三角形：标量三角形、钝角三角形、直角三角形（均非等边，欧拉线明显） */
export const PRESET_TRIANGLES: Triangle[] = [
  { A: { x: 120, y: 380 }, B: { x: 500, y: 340 }, C: { x: 300, y: 90 } },
  { A: { x: 120, y: 360 }, B: { x: 520, y: 360 }, C: { x: 180, y: 120 } },
  { A: { x: 150, y: 380 }, B: { x: 470, y: 380 }, C: { x: 150, y: 120 } },
]
