/**
 * 有理函数与渐近线 Canvas 绘制
 * 画坐标轴、有理函数曲线（分段避开竖直渐近线）+ 虚线渐近线
 */
import {
  evalRational,
  verticalAsymptotes,
  horizontalOrOblique,
  SAMPLES,
} from './rationalAsymptotes'

const X_MIN = -8
const X_MAX = 8
const Y_MIN = -8
const Y_MAX = 8

export function drawRationalAsymptotes(
  canvas: HTMLCanvasElement,
  num: number[],
  den: number[],
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  const px = (x: number) => ((x - X_MIN) / (X_MAX - X_MIN)) * W
  const py = (y: number) => H - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * H

  // 网格
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  for (let g = X_MIN; g <= X_MAX; g++) {
    ctx.beginPath(); ctx.moveTo(px(g), 0); ctx.lineTo(px(g), H); ctx.stroke()
  }
  for (let g = Y_MIN; g <= Y_MAX; g++) {
    ctx.beginPath(); ctx.moveTo(0, py(g)); ctx.lineTo(W, py(g)); ctx.stroke()
  }
  // 坐标轴
  ctx.strokeStyle = '#94a3b8'
  ctx.lineWidth = 1.5
  ctx.beginPath(); ctx.moveTo(0, py(0)); ctx.lineTo(W, py(0)); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(px(0), 0); ctx.lineTo(px(0), H); ctx.stroke()

  const vAsy = verticalAsymptotes(den)
  const end = horizontalOrOblique(num, den)

  // 竖直渐近线（红色虚线）
  ctx.setLineDash([6, 5])
  ctx.strokeStyle = '#ef4444'
  ctx.lineWidth = 1.5
  for (const a of vAsy) {
    if (a > X_MIN && a < X_MAX) {
      ctx.beginPath(); ctx.moveTo(px(a), 0); ctx.lineTo(px(a), H); ctx.stroke()
    }
  }
  // 水平/斜渐近线（蓝色虚线）
  if (end.kind !== 'none') {
    ctx.strokeStyle = '#3b82f6'
    ctx.beginPath()
    ctx.moveTo(px(X_MIN), py(end.slope * X_MIN + end.intercept))
    ctx.lineTo(px(X_MAX), py(end.slope * X_MAX + end.intercept))
    ctx.stroke()
  }
  ctx.setLineDash([])

  // 有理函数曲线（分段：跨过竖直渐近线或跳变则断开）
  ctx.strokeStyle = '#7c3aed'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  let pen = false
  let prevY = 0
  for (let i = 0; i <= SAMPLES; i++) {
    const x = X_MIN + ((X_MAX - X_MIN) * i) / SAMPLES
    const near = vAsy.some((a) => Math.abs(x - a) < 0.03)
    const y = evalRational(num, den, x)
    if (near || !Number.isFinite(y) || y < Y_MIN * 2 || y > Y_MAX * 2 ||
        (pen && Math.abs(y - prevY) > 12)) {
      pen = false
    } else {
      if (pen) ctx.lineTo(px(x), py(y))
      else { ctx.moveTo(px(x), py(y)); pen = true }
      prevY = y
    }
  }
  ctx.stroke()
}
