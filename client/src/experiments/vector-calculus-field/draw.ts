/**
 * 保守场与势函数 Canvas 绘制
 * 画向量场箭头 + 等势线(保守场) + 两条路径(直线/折线)
 */
import { straightPath, cornerPath, START, END, type Field, type Vec } from './vectorCalculusField'

const LO = -2
const HI = 2

function makeMap(W: number, H: number) {
  const sx = (x: number) => ((x - LO) / (HI - LO)) * W
  const sy = (y: number) => H - ((y - LO) / (HI - LO)) * H
  return { sx, sy }
}

function drawArrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
  const ang = Math.atan2(y2 - y1, x2 - x1)
  const h = 4
  ctx.beginPath()
  ctx.moveTo(x2, y2)
  ctx.lineTo(x2 - h * Math.cos(ang - 0.4), y2 - h * Math.sin(ang - 0.4))
  ctx.lineTo(x2 - h * Math.cos(ang + 0.4), y2 - h * Math.sin(ang + 0.4))
  ctx.closePath()
  ctx.fill()
}

function drawPath(ctx: CanvasRenderingContext2D, sx: (x: number) => number, sy: (y: number) => number, pts: Vec[], color: string) {
  ctx.strokeStyle = color
  ctx.lineWidth = 3
  ctx.beginPath()
  pts.forEach((p, i) => (i === 0 ? ctx.moveTo(sx(p.x), sy(p.y)) : ctx.lineTo(sx(p.x), sy(p.y))))
  ctx.stroke()
}

export interface DrawOpts {
  showEquipotential?: boolean
  showPaths?: boolean
}

export function drawVectorCalculusField(canvas: HTMLCanvasElement, field: Field, opts: DrawOpts = {}) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  const { sx, sy } = makeMap(W, H)
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, W, H)

  // 等势线（保守场专属）：势函数为常数的圈层
  if (opts.showEquipotential && field.conservative && field.potential) {
    ctx.strokeStyle = '#cbd5e1'
    ctx.lineWidth = 1
    for (let lv = 0.5; lv <= 8; lv += 1) {
      ctx.beginPath()
      for (let a = 0; a <= 64; a++) {
        const t = (a / 64) * 2 * Math.PI
        const r = Math.sqrt(lv)
        const px = sx(r * Math.cos(t))
        const py = sy(r * Math.sin(t))
        if (a === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.stroke()
    }
  }

  // 向量场箭头网格
  const N = 11
  const stepW = (HI - LO) / (N - 1)
  ctx.strokeStyle = '#6366f1'
  ctx.fillStyle = '#6366f1'
  ctx.lineWidth = 1.2
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const wx = LO + i * stepW
      const wy = LO + j * stepW
      const vx = field.P(wx, wy)
      const vy = field.Q(wx, wy)
      const mag = Math.hypot(vx, vy) || 1
      const scale = 14 / mag
      drawArrow(ctx, sx(wx), sy(wy), sx(wx) + vx * scale, sy(wy) - vy * scale)
    }
  }

  // 两条路径 + 起终点
  if (opts.showPaths) {
    drawPath(ctx, sx, sy, straightPath(START, END), '#ef4444')
    drawPath(ctx, sx, sy, cornerPath(START, END), '#10b981')
    ctx.fillStyle = '#0f172a'
    for (const p of [START, END]) {
      ctx.beginPath()
      ctx.arc(sx(p.x), sy(p.y), 5, 0, 2 * Math.PI)
      ctx.fill()
    }
  }
}
