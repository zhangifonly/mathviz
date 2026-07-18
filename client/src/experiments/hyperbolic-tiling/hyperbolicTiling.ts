/**
 * 双曲镶嵌核心算法（纯函数，便于测试）
 *
 * 庞加莱圆盘上生成 {p,q} 正则镶嵌：正 p 边形每顶点聚 q 个多边形。中心瓦片是
 * 双曲正 p 边形，对各边做"圆反演"翻折，BFS 逐层生成邻居；越靠边界欧氏越小。
 */

export interface Pt { x: number; y: number }

/** 测地线边所在的反演圆：过圆心时退化为直径（circle=null） */
export interface EdgeCircle { cx: number; cy: number; r: number }

/** {p,q} 中心正多边形的欧氏外接半径（标准双曲镶嵌公式） */
export function tileRadius(p: number, q: number): number {
  const num = Math.cos(Math.PI / p + Math.PI / q)
  const den = Math.cos(Math.PI / p - Math.PI / q)
  return Math.sqrt(num / den)
}

/** 中心正 p 边形的 p 个顶点 */
export function centerPolygon(p: number, q: number): Pt[] {
  const r = tileRadius(p, q)
  const verts: Pt[] = []
  for (let i = 0; i < p; i++) {
    const a = (2 * Math.PI * i) / p - Math.PI / 2
    verts.push({ x: r * Math.cos(a), y: r * Math.sin(a) })
  }
  return verts
}

/** 过 a,b 且垂直于单位圆的测地线圆；若 a,b 与原点共线则返回 null(直径) */
export function edgeCircle(a: Pt, b: Pt): EdgeCircle | null {
  const cross = a.x * b.y - a.y * b.x
  if (Math.abs(cross) < 1e-9) return null
  const s1 = a.x * a.x + a.y * a.y + 1
  const s2 = b.x * b.x + b.y * b.y + 1
  const det = 2 * (a.x * b.y - b.x * a.y)
  const cx = (s1 * b.y - s2 * a.y) / det
  const cy = (a.x * s2 - b.x * s1) / det
  const r = Math.sqrt(cx * cx + cy * cy - 1)
  return { cx, cy, r }
}

/** 把点 p 关于反演圆 c 做圆反演 */
export function invert(p: Pt, c: EdgeCircle): Pt {
  const vx = p.x - c.cx
  const vy = p.y - c.cy
  const k = (c.r * c.r) / (vx * vx + vy * vy)
  return { x: c.cx + k * vx, y: c.cy + k * vy }
}

/** 把点 p 关于过原点的直径(a,b 方向)做镜像反射 */
export function reflectLine(p: Pt, a: Pt, b: Pt): Pt {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const t = (p.x * dx + p.y * dy) / (dx * dx + dy * dy)
  return { x: 2 * t * dx - p.x, y: 2 * t * dy - p.y }
}

/** 把整块瓦片按其某条边翻折为相邻瓦片 */
export function reflectTile(verts: Pt[], a: Pt, b: Pt): Pt[] {
  const c = edgeCircle(a, b)
  return c ? verts.map((v) => invert(v, c)) : verts.map((v) => reflectLine(v, a, b))
}

/** 瓦片质心去重键（浮点四舍五入到 3 位） */
export function tileKey(verts: Pt[]): string {
  let cx = 0
  let cy = 0
  for (const v of verts) { cx += v.x; cy += v.y }
  return `${(cx / verts.length).toFixed(3)},${(cy / verts.length).toFixed(3)}`
}

/** BFS 逐层翻折生成 {p,q} 镶嵌的全部瓦片（含中心瓦片） */
export function generateTiling(p: number, q: number, layers: number): Pt[][] {
  const center = centerPolygon(p, q)
  const tiles: Pt[][] = [center]
  const seen = new Set([tileKey(center)])
  let frontier: Pt[][] = [center]
  for (let l = 0; l < layers; l++) {
    const next: Pt[][] = []
    for (const tile of frontier) {
      for (let i = 0; i < tile.length; i++) {
        const nb = reflectTile(tile, tile[i], tile[(i + 1) % tile.length])
        const key = tileKey(nb)
        if (seen.has(key)) continue
        seen.add(key)
        tiles.push(nb)
        next.push(nb)
      }
    }
    frontier = next
  }
  return tiles
}

export const TILINGS: Array<{ p: number; q: number }> = [
  { p: 5, q: 4 },
  { p: 7, q: 3 },
]
