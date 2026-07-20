/**
 * 欧拉线 Canvas 绘制：三角形 + 三心（异色）+ 欧拉线 + 1:2 比例标注
 */
import {
  centroid,
  circumcenter,
  orthocenter,
  eulerLineEndpoints,
  type Pt,
} from './eulerLine'

function dot(ctx: CanvasRenderingContext2D, p: Pt, color: string, label: string) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(p.x, p.y, 5.5, 0, 2 * Math.PI)
  ctx.fill()
  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 14px sans-serif'
  ctx.fillText(label, p.x + 8, p.y - 8)
}

export function drawEulerLine(
  canvas: HTMLCanvasElement,
  A: Pt,
  B: Pt,
  C: Pt,
  showEuler = true,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const G = centroid(A, B, C)
  const O = circumcenter(A, B, C)
  const H = orthocenter(A, B, C)

  // 欧拉线
  if (showEuler) {
    const [p, q] = eulerLineEndpoints(A, B, C)
    ctx.strokeStyle = '#a855f7'
    ctx.lineWidth = 2
    ctx.setLineDash([8, 6])
    ctx.beginPath()
    ctx.moveTo(p.x, p.y)
    ctx.lineTo(q.x, q.y)
    ctx.stroke()
    ctx.setLineDash([])
  }

  // 三角形
  ctx.strokeStyle = '#334155'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(A.x, A.y)
  ctx.lineTo(B.x, B.y)
  ctx.lineTo(C.x, C.y)
  ctx.closePath()
  ctx.stroke()

  // O->H 线段与 1:2 标注
  ctx.strokeStyle = '#f97316'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(O.x, O.y)
  ctx.lineTo(G.x, G.y)
  ctx.stroke()
  ctx.strokeStyle = '#0ea5e9'
  ctx.beginPath()
  ctx.moveTo(G.x, G.y)
  ctx.lineTo(H.x, H.y)
  ctx.stroke()
  ctx.fillStyle = '#f97316'
  ctx.font = 'bold 13px sans-serif'
  const m1 = { x: (O.x + G.x) / 2, y: (O.y + G.y) / 2 }
  const m2 = { x: (G.x + H.x) / 2, y: (G.y + H.y) / 2 }
  ctx.fillText('1', m1.x - 4, m1.y - 6)
  ctx.fillStyle = '#0ea5e9'
  ctx.fillText('2', m2.x - 4, m2.y - 6)

  // 三心
  dot(ctx, O, '#ef4444', 'O 外心')
  dot(ctx, G, '#16a34a', 'G 重心')
  dot(ctx, H, '#2563eb', 'H 垂心')
}
