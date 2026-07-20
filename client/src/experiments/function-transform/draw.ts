/**
 * 函数图象变换 Canvas 绘制
 * 同图画出基曲线（灰）与变换后曲线（彩），并标注参数效果。
 */
import { transform, sample, describe, type BaseFn, type Transform } from './functionTransform'

const X0 = -6
const X1 = 6

/** 画坐标轴与网格 */
function drawAxes(ctx: CanvasRenderingContext2D, W: number, H: number, sx: (x: number) => number, sy: (y: number) => number) {
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  for (let gx = X0; gx <= X1; gx++) {
    ctx.beginPath(); ctx.moveTo(sx(gx), 0); ctx.lineTo(sx(gx), H); ctx.stroke()
  }
  for (let gy = -6; gy <= 6; gy++) {
    ctx.beginPath(); ctx.moveTo(0, sy(gy)); ctx.lineTo(W, sy(gy)); ctx.stroke()
  }
  ctx.strokeStyle = '#94a3b8'
  ctx.lineWidth = 1.5
  ctx.beginPath(); ctx.moveTo(0, sy(0)); ctx.lineTo(W, sy(0)); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(sx(0), 0); ctx.lineTo(sx(0), H); ctx.stroke()
}

function drawCurve(ctx: CanvasRenderingContext2D, fn: BaseFn, color: string, width: number, sx: (x: number) => number, sy: (y: number) => number) {
  const pts = sample(fn, X0, X1, 240)
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.beginPath()
  let started = false
  for (const [x, y] of pts) {
    if (!isFinite(y) || Math.abs(y) > 40) { started = false; continue }
    const px = sx(x); const py = sy(y)
    if (!started) { ctx.moveTo(px, py); started = true } else ctx.lineTo(px, py)
  }
  ctx.stroke()
}

/** 绘制主入口 */
export function drawFunctionTransform(canvas: HTMLCanvasElement, base: BaseFn, t: Transform) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  const scale = W / (X1 - X0)
  const cy = H / 2
  const sx = (x: number) => (x - X0) * scale
  const sy = (y: number) => cy - y * scale

  ctx.clearRect(0, 0, W, H)
  drawAxes(ctx, W, H, sx, sy)
  drawCurve(ctx, base, '#cbd5e1', 2, sx, sy)          // 基曲线：灰
  drawCurve(ctx, transform(base, t), '#6366f1', 3, sx, sy) // 变换后：靛蓝

  ctx.fillStyle = '#4338ca'
  ctx.font = '14px system-ui'
  ctx.fillText(describe(t), 12, 22)
  ctx.fillStyle = '#64748b'
  ctx.font = '12px system-ui'
  ctx.fillText(`a=${t.a} b=${t.b} h=${t.h} k=${t.k}`, 12, 40)
}
