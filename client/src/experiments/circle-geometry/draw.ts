/**
 * 圆的几何 Canvas 绘制
 *
 * 根据主题（周长面积 / 弧长扇形 / 弦 / 圆周角）绘制对应的圆与标注，
 * progress 控制圆心角从 0 逐渐展开到目标角度的动画。
 */
import { degToRad } from './circleGeometry'

export interface CircleDrawData {
  topicId: string
  angleDeg: number
}

const BG = '#0f172a'
const RING = '#38bdf8'
const ACCENT = '#fbbf24'
const CHORD = '#ec4899'
const FILL = 'rgba(56,189,248,0.18)'

export function drawCircleGeometry(
  canvas: HTMLCanvasElement,
  data: CircleDrawData,
  progress: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = BG
  ctx.fillRect(0, 0, W, H)

  const cx = W / 2
  const cy = H / 2
  const r = Math.min(W, H) * 0.32
  const p = Math.max(0, Math.min(1, progress))
  const theta = degToRad(data.angleDeg) * p

  // 主圆
  ctx.strokeStyle = RING
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.stroke()

  // 圆心
  ctx.fillStyle = '#e2e8f0'
  ctx.beginPath()
  ctx.arc(cx, cy, 4, 0, Math.PI * 2)
  ctx.fill()

  if (data.topicId === 'circumference') {
    // 高亮周长 + 半径
    ctx.strokeStyle = ACCENT
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * p)
    ctx.stroke()
    drawRadius(ctx, cx, cy, r, 0)
    ctx.fillStyle = FILL
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fill()
    label(ctx, cx, cy - r - 18, 'C = 2πr,  S = πr²')
  } else if (data.topicId === 'arc') {
    // 扇形：填充 + 高亮弧
    drawSector(ctx, cx, cy, r, theta, FILL)
    ctx.strokeStyle = ACCENT
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, theta)
    ctx.stroke()
    drawRadius(ctx, cx, cy, r, 0)
    drawRadius(ctx, cx, cy, r, theta)
    label(ctx, cx, cy - r - 18, 'L = rθ,  扇形 S = ½r²θ')
  } else if (data.topicId === 'chord') {
    // 弦 + 两条半径
    drawSector(ctx, cx, cy, r, theta, FILL)
    drawRadius(ctx, cx, cy, r, 0)
    drawRadius(ctx, cx, cy, r, theta)
    ctx.strokeStyle = CHORD
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(cx + r, cy)
    ctx.lineTo(cx + r * Math.cos(theta), cy + r * Math.sin(theta))
    ctx.stroke()
    label(ctx, cx, cy - r - 18, '弦长 = 2r·sin(θ/2)')
  } else {
    // inscribed: 圆心角 vs 圆周角
    // 一段弧 AB，圆心角在圆心，圆周角在圆上另一点 P
    const a0 = -Math.PI * 0.75
    const a1 = a0 + theta
    const ax = cx + r * Math.cos(a0)
    const ay = cy + r * Math.sin(a0)
    const bx = cx + r * Math.cos(a1)
    const by = cy + r * Math.sin(a1)
    // 圆周角顶点取弧的对侧
    const pAng = a0 + theta / 2 + Math.PI
    const pxp = cx + r * Math.cos(pAng)
    const pyp = cy + r * Math.sin(pAng)
    // 高亮弧 AB
    ctx.strokeStyle = ACCENT
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(cx, cy, r, a0, a1)
    ctx.stroke()
    // 圆心角
    ctx.strokeStyle = RING
    ctx.lineWidth = 2
    line(ctx, cx, cy, ax, ay)
    line(ctx, cx, cy, bx, by)
    // 圆周角
    ctx.strokeStyle = CHORD
    line(ctx, pxp, pyp, ax, ay)
    line(ctx, pxp, pyp, bx, by)
    dot(ctx, pxp, pyp, CHORD)
    dot(ctx, ax, ay, ACCENT)
    dot(ctx, bx, by, ACCENT)
    label(ctx, cx, cy - r - 18, '圆周角 = 圆心角的一半')
  }
}

function drawRadius(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  ang: number,
) {
  ctx.strokeStyle = '#94a3b8'
  ctx.lineWidth = 2
  line(ctx, cx, cy, cx + r * Math.cos(ang), cy + r * Math.sin(ang))
}

function drawSector(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  theta: number,
  fill: string,
) {
  ctx.fillStyle = fill
  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.arc(cx, cy, r, 0, theta)
  ctx.closePath()
  ctx.fill()
}

function line(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) {
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
}

function dot(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(x, y, 4, 0, Math.PI * 2)
  ctx.fill()
}

function label(ctx: CanvasRenderingContext2D, x: number, y: number, text: string) {
  ctx.fillStyle = '#e2e8f0'
  ctx.font = '16px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, x, y)
}
