/**
 * 庞加莱圆盘 Canvas 绘制：单位圆盘 + 测地线弧 + 双曲镶嵌
 */
import { geodesic, tilingVertices, type Pt, type Geodesic } from './poincareDisk'

/** 反演一点到测地线圆（用于把中心瓦片翻折成邻居瓦片） */
function reflect(p: Pt, g: Geodesic): Pt {
  if (g.kind === 'line') {
    const dx = g.p2.x - g.p1.x, dy = g.p2.y - g.p1.y
    const len2 = dx * dx + dy * dy
    const t = ((p.x - g.p1.x) * dx + (p.y - g.p1.y) * dy) / len2
    const px = g.p1.x + t * dx, py = g.p1.y + t * dy
    return { x: 2 * px - p.x, y: 2 * py - p.y }
  }
  const vx = p.x - g.cx!, vy = p.y - g.cy!
  const d2 = vx * vx + vy * vy
  const k = (g.r! * g.r!) / d2
  return { x: g.cx! + k * vx, y: g.cy! + k * vy }
}

function strokeGeodesic(ctx: CanvasRenderingContext2D, g: Geodesic, R: number, ox: number, oy: number) {
  ctx.beginPath()
  if (g.kind === 'line') {
    ctx.moveTo(ox + g.p1.x * R, oy - g.p1.y * R)
    ctx.lineTo(ox + g.p2.x * R, oy - g.p2.y * R)
  } else {
    const start = g.a0!, end = g.a1!
    ctx.arc(ox + g.cx! * R, oy - g.cy! * R, g.r! * R, -start, -end, start < end)
  }
  ctx.stroke()
}

function drawTile(ctx: CanvasRenderingContext2D, verts: Pt[], R: number, ox: number, oy: number, fill: string) {
  ctx.fillStyle = fill
  ctx.beginPath()
  for (let i = 0; i < verts.length; i++) {
    const p = verts[i]
    if (i === 0) ctx.moveTo(ox + p.x * R, oy - p.y * R)
    else ctx.lineTo(ox + p.x * R, oy - p.y * R)
  }
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = '#6366f1'
  ctx.lineWidth = 1.5
  for (let i = 0; i < verts.length; i++) {
    strokeGeodesic(ctx, geodesic(verts[i], verts[(i + 1) % verts.length]), R, ox, oy)
  }
}

/**
 * 绘制庞加莱圆盘镶嵌。
 * @param tiling {p,q} 镶嵌参数
 * @param extra 额外测地线（例如过某点的多条"平行线"）
 */
export function drawPoincareDisk(
  canvas: HTMLCanvasElement,
  tiling: { p: number; q: number },
  extra: Geodesic[] = [],
  dots: Pt[] = [],
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  const R = Math.min(canvas.width, canvas.height) / 2 - 12
  const ox = canvas.width / 2
  const oy = canvas.height / 2

  ctx.fillStyle = '#f8fafc'
  ctx.beginPath()
  ctx.arc(ox, oy, R, 0, 2 * Math.PI)
  ctx.fill()
  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth = 2.5
  ctx.stroke()

  const center = tilingVertices(tiling.p, tiling.q)
  const palette = ['#c7d2fe', '#a5b4fc', '#bae6fd', '#bbf7d0', '#fde68a', '#fbcfe8']
  drawTile(ctx, center, R, ox, oy, palette[0])
  // 第一环：把中心瓦片按每条边翻折成邻居
  for (let i = 0; i < center.length; i++) {
    const g = geodesic(center[i], center[(i + 1) % center.length])
    const neigh = center.map((v) => reflect(v, g))
    drawTile(ctx, neigh, R, ox, oy, palette[(i % (palette.length - 1)) + 1])
  }

  ctx.strokeStyle = '#dc2626'
  ctx.lineWidth = 2
  for (const g of extra) strokeGeodesic(ctx, g, R, ox, oy)

  ctx.fillStyle = '#dc2626'
  for (const p of dots) {
    ctx.beginPath()
    ctx.arc(ox + p.x * R, oy - p.y * R, 5, 0, 2 * Math.PI)
    ctx.fill()
  }
}
