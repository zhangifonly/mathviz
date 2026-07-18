/**
 * 割线法 Canvas 绘制
 * 画出目标函数曲线、坐标轴，以及每一步的割线（两点连线延长到 x 轴），
 * 直观展现估计值如何逐步逼近方程的根。
 */
import { secant, type Fn, type SecantStep } from './secantMethod'

interface View {
  xmin: number
  xmax: number
  ymin: number
  ymax: number
}

const VIEW: View = { xmin: -1, xmax: 3, ymin: -4, ymax: 6 }

function sx(x: number, W: number, v: View): number {
  return ((x - v.xmin) / (v.xmax - v.xmin)) * W
}
function sy(y: number, H: number, v: View): number {
  return H - ((y - v.ymin) / (v.ymax - v.ymin)) * H
}

function drawAxes(ctx: CanvasRenderingContext2D, W: number, H: number, v: View) {
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1
  ctx.beginPath()
  const y0 = sy(0, H, v)
  ctx.moveTo(0, y0)
  ctx.lineTo(W, y0)
  const x0 = sx(0, W, v)
  ctx.moveTo(x0, 0)
  ctx.lineTo(x0, H)
  ctx.stroke()
}

function drawCurve(ctx: CanvasRenderingContext2D, fn: Fn, W: number, H: number, v: View) {
  ctx.strokeStyle = '#6366f1'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  for (let px = 0; px <= W; px++) {
    const x = v.xmin + (px / W) * (v.xmax - v.xmin)
    const py = sy(fn(x), H, v)
    if (px === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
}

function drawStep(ctx: CanvasRenderingContext2D, s: SecantStep, W: number, H: number, v: View, active: boolean) {
  const y0 = sy(0, H, v)
  // 割线：两点连线延长到 x 轴
  ctx.strokeStyle = active ? '#ec4899' : '#f9a8d4'
  ctx.lineWidth = active ? 2 : 1.2
  ctx.beginPath()
  ctx.moveTo(sx(s.x0, W, v), sy(s.y0, H, v))
  ctx.lineTo(sx(s.xNext, W, v), y0)
  ctx.stroke()
  // 两个数据点
  ctx.fillStyle = '#0f172a'
  for (const [px, py] of [[s.x0, s.y0], [s.x1, s.y1]] as const) {
    ctx.beginPath()
    ctx.arc(sx(px, W, v), sy(py, H, v), 3, 0, 2 * Math.PI)
    ctx.fill()
  }
  // 交点（新估计）
  ctx.fillStyle = active ? '#ec4899' : '#fbcfe8'
  ctx.beginPath()
  ctx.arc(sx(s.xNext, W, v), y0, 4, 0, 2 * Math.PI)
  ctx.fill()
}

export function drawSecantMethod(
  canvas: HTMLCanvasElement,
  fn: Fn,
  x0: number,
  x1: number,
  step: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  drawAxes(ctx, W, H, VIEW)
  drawCurve(ctx, fn, W, H, VIEW)
  const steps = secant(fn, x0, x1, Math.max(step, 0))
  const shown = steps.slice(0, step)
  shown.forEach((s, i) => drawStep(ctx, s, W, H, VIEW, i === shown.length - 1))
}
