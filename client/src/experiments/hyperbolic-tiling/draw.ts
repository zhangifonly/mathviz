/**
 * 双曲镶嵌 Canvas 绘制：单位圆盘 + {p,q} 镶嵌（测地线弧为边）
 */
import { generateTiling, edgeCircle, type Pt } from './hyperbolicTiling'

const PALETTE = ['#c7d2fe', '#a5b4fc', '#bae6fd', '#bbf7d0', '#fde68a', '#fbcfe8', '#fca5a5']

/** 沿测地线（垂直边界的圆弧，或过圆心的直径）画一条边 */
function strokeEdge(ctx: CanvasRenderingContext2D, a: Pt, b: Pt, R: number, ox: number, oy: number) {
  const c = edgeCircle(a, b)
  ctx.beginPath()
  if (!c) {
    ctx.moveTo(ox + a.x * R, oy - a.y * R)
    ctx.lineTo(ox + b.x * R, oy - b.y * R)
  } else {
    const a0 = Math.atan2(a.y - c.cy, a.x - c.cx)
    let a1 = Math.atan2(b.y - c.cy, b.x - c.cx)
    let d = a1 - a0
    while (d > Math.PI) d -= 2 * Math.PI
    while (d < -Math.PI) d += 2 * Math.PI
    a1 = a0 + d
    ctx.arc(ox + c.cx * R, oy - c.cy * R, c.r * R, -a0, -a1, d > 0)
  }
  ctx.stroke()
}

function fillTile(ctx: CanvasRenderingContext2D, verts: Pt[], R: number, ox: number, oy: number, fill: string) {
  ctx.fillStyle = fill
  ctx.beginPath()
  verts.forEach((p, i) => {
    const px = ox + p.x * R
    const py = oy - p.y * R
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  })
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = '#4338ca'
  ctx.lineWidth = 1.2
  for (let i = 0; i < verts.length; i++) {
    strokeEdge(ctx, verts[i], verts[(i + 1) % verts.length], R, ox, oy)
  }
}

/**
 * 绘制 {p,q} 双曲镶嵌。
 * @param tiling {p,q} 参数
 * @param layers BFS 翻折层数（层数越多越靠近边界）
 */
export function drawHyperbolicTiling(
  canvas: HTMLCanvasElement,
  tiling: { p: number; q: number },
  layers = 3,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  const R = Math.min(canvas.width, canvas.height) / 2 - 12
  const ox = canvas.width / 2
  const oy = canvas.height / 2

  // 圆盘背景
  ctx.fillStyle = '#f8fafc'
  ctx.beginPath()
  ctx.arc(ox, oy, R, 0, 2 * Math.PI)
  ctx.fill()

  const tiles = generateTiling(tiling.p, tiling.q, layers)
  tiles.forEach((tile, i) => {
    fillTile(ctx, tile, R, ox, oy, PALETTE[i % PALETTE.length])
  })

  // 边界单位圆
  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.arc(ox, oy, R, 0, 2 * Math.PI)
  ctx.stroke()
}
