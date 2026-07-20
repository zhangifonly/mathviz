/**
 * Delaunay 三角剖分 Canvas 绘制
 * 画点 + 三角网，可选叠加外接圆演示空圆性质。
 */
import { triangulate, type Pt, type Tri } from './delaunayTriangulation'

function circumcircle(a: Pt, b: Pt, c: Pt): { x: number; y: number; r: number } | null {
  const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y))
  if (d === 0) return null
  const a2 = a.x * a.x + a.y * a.y
  const b2 = b.x * b.x + b.y * b.y
  const c2 = c.x * c.x + c.y * c.y
  const x = (a2 * (b.y - c.y) + b2 * (c.y - a.y) + c2 * (a.y - b.y)) / d
  const y = (a2 * (c.x - b.x) + b2 * (a.x - c.x) + c2 * (b.x - a.x)) / d
  const r = Math.hypot(a.x - x, a.y - y)
  return { x, y, r }
}

/**
 * 绘制三角网。showCircles>=0 时高亮该索引三角形的外接圆（-1 不画）。
 */
export function drawDelaunayTriangulation(
  canvas: HTMLCanvasElement,
  points: Pt[],
  showCircles = -1,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  const tris: Tri[] = triangulate(points)

  ctx.lineWidth = 1.2
  ctx.strokeStyle = '#6366f1'
  ctx.fillStyle = 'rgba(99,102,241,0.06)'
  for (const t of tris) {
    const a = points[t[0]], b = points[t[1]], c = points[t[2]]
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.lineTo(c.x, c.y)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  }

  if (showCircles >= 0 && showCircles < tris.length) {
    const t = tris[showCircles]
    const cc = circumcircle(points[t[0]], points[t[1]], points[t[2]])
    if (cc) {
      ctx.beginPath()
      ctx.arc(cc.x, cc.y, cc.r, 0, 2 * Math.PI)
      ctx.strokeStyle = '#ec4899'
      ctx.lineWidth = 1.6
      ctx.setLineDash([5, 4])
      ctx.stroke()
      ctx.setLineDash([])
      ctx.fillStyle = '#ec4899'
      ctx.beginPath()
      ctx.arc(cc.x, cc.y, 2.5, 0, 2 * Math.PI)
      ctx.fill()
    }
  }

  ctx.fillStyle = '#0f172a'
  for (const p of points) {
    ctx.beginPath()
    ctx.arc(p.x, p.y, 3.5, 0, 2 * Math.PI)
    ctx.fill()
  }
}
