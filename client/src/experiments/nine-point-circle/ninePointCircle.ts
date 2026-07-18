/**
 * 九点圆核心算法（纯函数，便于测试）
 *
 * 任意三角形都存在一个圆，恰好经过九个特殊点：
 *   三条边的中点、三条高的垂足、垂心到三顶点连线的中点。
 * 其圆心是外心与垂心的中点，半径是外接圆半径的一半。
 */

export interface Pt {
  x: number
  y: number
}

/** 中点 */
export function midpoint(a: Pt, b: Pt): Pt {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}

/** 点 P 在直线 AB 上的垂足（正交投影） */
export function footOfPerpendicular(p: Pt, a: Pt, b: Pt): Pt {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len2 = dx * dx + dy * dy
  if (len2 === 0) return { x: a.x, y: a.y }
  const t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2
  return { x: a.x + t * dx, y: a.y + t * dy }
}

/** 三角形外心（三边垂直平分线交点） */
export function circumcenter(a: Pt, b: Pt, c: Pt): Pt {
  const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y))
  const a2 = a.x * a.x + a.y * a.y
  const b2 = b.x * b.x + b.y * b.y
  const c2 = c.x * c.x + c.y * c.y
  const ux = (a2 * (b.y - c.y) + b2 * (c.y - a.y) + c2 * (a.y - b.y)) / d
  const uy = (a2 * (c.x - b.x) + b2 * (a.x - c.x) + c2 * (b.x - a.x)) / d
  return { x: ux, y: uy }
}

/** 三角形垂心（三条高的交点）。由 O + H = A + B + C 得 H = A+B+C-2O */
export function orthocenter(a: Pt, b: Pt, c: Pt): Pt {
  const o = circumcenter(a, b, c)
  return { x: a.x + b.x + c.x - 2 * o.x, y: a.y + b.y + c.y - 2 * o.y }
}

/** 外接圆半径 */
export function circumradius(a: Pt, b: Pt, c: Pt): number {
  const o = circumcenter(a, b, c)
  return Math.hypot(a.x - o.x, a.y - o.y)
}

/** 九点圆圆心：外心与垂心的中点 */
export function ninePointCenter(a: Pt, b: Pt, c: Pt): Pt {
  return midpoint(circumcenter(a, b, c), orthocenter(a, b, c))
}

/** 九点圆半径：外接圆半径的一半 */
export function ninePointRadius(a: Pt, b: Pt, c: Pt): number {
  return circumradius(a, b, c) / 2
}

/** 返回九个点：三边中点、三高垂足、垂心到三顶点连线的中点 */
export function ninePoints(a: Pt, b: Pt, c: Pt): Pt[] {
  const h = orthocenter(a, b, c)
  return [
    midpoint(a, b),
    midpoint(b, c),
    midpoint(c, a),
    footOfPerpendicular(a, b, c),
    footOfPerpendicular(b, c, a),
    footOfPerpendicular(c, a, b),
    midpoint(h, a),
    midpoint(h, b),
    midpoint(h, c),
  ]
}

/** 预设三角形（每组三个顶点），配合 640x540 画布坐标 */
export const PRESET_TRIANGLES: [Pt, Pt, Pt][] = [
  [{ x: 320, y: 90 }, { x: 130, y: 430 }, { x: 520, y: 400 }],
  [{ x: 200, y: 110 }, { x: 110, y: 420 }, { x: 560, y: 330 }],
  [{ x: 360, y: 120 }, { x: 160, y: 380 }, { x: 500, y: 250 }],
]
