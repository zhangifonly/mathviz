/**
 * Delaunay 三角剖分核心算法（纯函数，便于测试）
 *
 * 采用 Bowyer-Watson 增量法：先放一个包含所有点的超级三角形，
 * 逐点插入时删去外接圆包含该点的"坏三角形"，用它们围成的
 * 空洞边界与新点重新连边，最后去掉带超级顶点的三角形。
 * Delaunay 剖分的核心不变量：任何三角形的外接圆内不含其他点（空圆性质）。
 */

export interface Pt {
  x: number
  y: number
}

/** 三角形，存 3 个点在 points 数组里的索引 */
export type Tri = [number, number, number]

/** 生成 n 个随机点（线性同余伪随机，同种子可复现） */
export function makePoints(n: number, width: number, height: number, seed = 1): Pt[] {
  let s = seed
  const rand = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
  const pad = 24
  const pts: Pt[] = []
  for (let i = 0; i < n; i++) {
    pts.push({
      x: pad + rand() * (width - 2 * pad),
      y: pad + rand() * (height - 2 * pad),
    })
  }
  return pts
}

/** 外接圆判定：点 p 是否落在三角形 tri 的外接圆内部（空圆性质的核心） */
export function inCircumcircle(points: Pt[], tri: Tri, p: Pt): boolean {
  const a = points[tri[0]]
  const b = points[tri[1]]
  const c = points[tri[2]]
  const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y))
  if (d === 0) return false
  const a2 = a.x * a.x + a.y * a.y
  const b2 = b.x * b.x + b.y * b.y
  const c2 = c.x * c.x + c.y * c.y
  const ux = (a2 * (b.y - c.y) + b2 * (c.y - a.y) + c2 * (a.y - b.y)) / d
  const uy = (a2 * (c.x - b.x) + b2 * (a.x - c.x) + c2 * (b.x - a.x)) / d
  const r2 = (a.x - ux) ** 2 + (a.y - uy) ** 2
  return (p.x - ux) ** 2 + (p.y - uy) ** 2 < r2 - 1e-9
}

/** 两三角形是否共享无向边 (u,v) */
function hasEdge(t: Tri, u: number, v: number): boolean {
  const has = (x: number) => t[0] === x || t[1] === x || t[2] === x
  return has(u) && has(v)
}

/** Bowyer-Watson 增量法生成 Delaunay 三角剖分，返回原始点索引构成的三角形列表 */
export function triangulate(points: Pt[]): Tri[] {
  const n = points.length
  if (n < 3) return []
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  for (const p of points) {
    if (p.x < minX) minX = p.x
    if (p.y < minY) minY = p.y
    if (p.x > maxX) maxX = p.x
    if (p.y > maxY) maxY = p.y
  }
  const dmax = Math.max(maxX - minX, maxY - minY) || 1
  const mx = (minX + maxX) / 2
  const my = (minY + maxY) / 2
  const pts = points.slice()
  const s0 = n, s1 = n + 1, s2 = n + 2
  pts.push({ x: mx - 20 * dmax, y: my - dmax })
  pts.push({ x: mx, y: my + 20 * dmax })
  pts.push({ x: mx + 20 * dmax, y: my - dmax })
  let tris: Tri[] = [[s0, s1, s2]]
  for (let i = 0; i < n; i++) {
    const p = pts[i]
    const bad = tris.filter((t) => inCircumcircle(pts, t, p))
    const edges: [number, number][] = []
    for (const t of bad) {
      const te: [number, number][] = [[t[0], t[1]], [t[1], t[2]], [t[2], t[0]]]
      for (const [u, v] of te) {
        const shared = bad.some((t2) => t2 !== t && hasEdge(t2, u, v))
        if (!shared) edges.push([u, v])
      }
    }
    tris = tris.filter((t) => !bad.includes(t))
    for (const [u, v] of edges) tris.push([u, v, i])
  }
  return tris.filter((t) => t[0] < n && t[1] < n && t[2] < n)
}

export const POINT_COUNTS = [8, 16, 30]
