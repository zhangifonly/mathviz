/**
 * 布朗运动 Canvas 绘制
 * 1D 模式：纵轴位置、横轴时间，画随机漫步曲线。
 * 2D 模式：平面游走轨迹，颜色随时间由蓝到红渐变。
 */
import { brownianPath1D, brownianPath2D, type Mode } from './brownianMotion'

function clear(ctx: CanvasRenderingContext2D, W: number, H: number) {
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, W, H)
}

/** 一维：横轴时间步、纵轴位置，居中基线。 */
function draw1D(ctx: CanvasRenderingContext2D, W: number, H: number, path: number[]) {
  const mid = H / 2
  let amp = 0
  for (const v of path) amp = Math.max(amp, Math.abs(v))
  const scale = amp > 0 ? (H * 0.42) / amp : 1
  ctx.strokeStyle = '#cbd5e1'
  ctx.beginPath()
  ctx.moveTo(0, mid)
  ctx.lineTo(W, mid)
  ctx.stroke()
  ctx.strokeStyle = '#6366f1'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  for (let i = 0; i < path.length; i++) {
    const x = (i / (path.length - 1)) * W
    const y = mid - path[i] * scale
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
}

/** 二维：平面游走轨迹，逐段颜色随时间渐变。 */
function draw2D(ctx: CanvasRenderingContext2D, W: number, H: number, path: { x: number; y: number }[]) {
  let maxR = 1
  for (const p of path) maxR = Math.max(maxR, Math.abs(p.x), Math.abs(p.y))
  const scale = (Math.min(W, H) * 0.45) / maxR
  const cx = W / 2
  const cy = H / 2
  ctx.lineWidth = 1.4
  for (let i = 1; i < path.length; i++) {
    const t = i / (path.length - 1)
    const r = Math.round(60 + 180 * t)
    const b = Math.round(230 - 180 * t)
    ctx.strokeStyle = `rgb(${r},80,${b})`
    ctx.beginPath()
    ctx.moveTo(cx + path[i - 1].x * scale, cy + path[i - 1].y * scale)
    ctx.lineTo(cx + path[i].x * scale, cy + path[i].y * scale)
    ctx.stroke()
  }
  // 起点绿、终点红
  ctx.fillStyle = '#22c55e'
  ctx.beginPath()
  ctx.arc(cx, cy, 4, 0, 2 * Math.PI)
  ctx.fill()
  const last = path[path.length - 1]
  ctx.fillStyle = '#ef4444'
  ctx.beginPath()
  ctx.arc(cx + last.x * scale, cy + last.y * scale, 4, 0, 2 * Math.PI)
  ctx.fill()
}

export function drawBrownianMotion(
  canvas: HTMLCanvasElement,
  mode: Mode,
  steps: number,
  seed = 1,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  clear(ctx, W, H)
  if (mode === '1d') draw1D(ctx, W, H, brownianPath1D(steps, 1, seed))
  else draw2D(ctx, W, H, brownianPath2D(steps, 1, seed))
}
