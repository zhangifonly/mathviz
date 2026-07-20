/**
 * 庞加莱圆盘核心算法（纯函数，便于测试）
 *
 * 单位圆盘 D = { z : |z| < 1 } 是双曲平面的一个模型。
 * 测地线是垂直于边界单位圆的圆弧（若过圆心则退化为直径）。
 * 距离沿边界发散到无穷，边界代表"无穷远"。
 */

export interface Pt {
  x: number
  y: number
}

/** 测地线：要么是一段圆弧，要么是过圆心的直径线段 */
export interface Geodesic {
  kind: 'arc' | 'line'
  cx?: number
  cy?: number
  r?: number
  a0?: number
  a1?: number
  p1: Pt
  p2: Pt
}

function dot(a: Pt, b: Pt): number {
  return a.x * b.x + a.y * b.y
}

/** 两点间测地线。共线过圆心时返回直径，否则返回垂直边界的圆弧参数。 */
export function geodesic(p1: Pt, p2: Pt): Geodesic {
  const cross = p1.x * p2.y - p1.y * p2.x
  if (Math.abs(cross) < 1e-9) return { kind: 'line', p1, p2 }
  const s1 = dot(p1, p1)
  const s2 = dot(p2, p2)
  // 反演圆心：垂直单位圆 => cx^2+cy^2 = r^2 + 1，解线性方程组
  const a1 = 2 * p1.x, b1 = 2 * p1.y, c1 = s1 + 1
  const a2 = 2 * p2.x, b2 = 2 * p2.y, c2 = s2 + 1
  const det = a1 * b2 - a2 * b1
  const cx = (c1 * b2 - c2 * b1) / det
  const cy = (a1 * c2 - a2 * c1) / det
  const r = Math.sqrt(cx * cx + cy * cy - 1)
  const a0 = Math.atan2(p1.y - cy, p1.x - cx)
  let a1e = Math.atan2(p2.y - cy, p2.x - cx)
  // 归一化到取劣弧（圆弧应在圆盘内）
  let d = a1e - a0
  while (d > Math.PI) d -= 2 * Math.PI
  while (d < -Math.PI) d += 2 * Math.PI
  a1e = a0 + d
  return { kind: 'arc', cx, cy, r, a0, a1: a1e, p1, p2 }
}

/** 庞加莱圆盘双曲距离：d = arcosh(1 + 2|p1-p2|^2 / ((1-|p1|^2)(1-|p2|^2))) */
export function hyperbolicDistance(p1: Pt, p2: Pt): number {
  const dx = p1.x - p2.x
  const dy = p1.y - p2.y
  const num = 2 * (dx * dx + dy * dy)
  const den = (1 - dot(p1, p1)) * (1 - dot(p2, p2))
  return Math.acosh(1 + num / den)
}

/** 生成正 p 边形理想镶嵌瓦片的顶点（{p,q} 镶嵌的中心瓦片） */
export function tilingVertices(p: number, q: number): Pt[] {
  // 中心正 p 边形外接欧氏半径（双曲 {p,q} 镶嵌标准公式）
  const num = Math.cos(Math.PI / p + Math.PI / q)
  const den = Math.cos(Math.PI / p - Math.PI / q)
  const r = Math.sqrt(num / den)
  const verts: Pt[] = []
  for (let i = 0; i < p; i++) {
    const a = (2 * Math.PI * i) / p - Math.PI / 2
    verts.push({ x: r * Math.cos(a), y: r * Math.sin(a) })
  }
  return verts
}

/** 一组过原点、按角度均匀分布的直径端点对（可视化"过一点的无穷多平行线") */
export function radialGeodesics(n: number): Geodesic[] {
  const out: Geodesic[] = []
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * i) / n
    const p1 = { x: 0.92 * Math.cos(a), y: 0.92 * Math.sin(a) }
    const p2 = { x: -0.92 * Math.cos(a), y: -0.92 * Math.sin(a) }
    out.push(geodesic(p1, p2))
  }
  return out
}

export const TILINGS: Array<{ p: number; q: number }> = [
  { p: 7, q: 3 },
  { p: 5, q: 4 },
  { p: 4, q: 6 },
]
