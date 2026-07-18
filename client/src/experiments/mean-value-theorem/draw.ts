/**
 * 中值定理 Canvas 绘制：曲线 + 割线 + c 点平行切线
 */
import { secantSlope, findMeanValuePoints } from './meanValueTheorem'

interface Bounds { xMin: number; xMax: number; yMin: number; yMax: number }

function computeBounds(f: (x: number) => number, a: number, b: number): Bounds {
  const pad = (b - a) * 0.15
  const xMin = a - pad
  const xMax = b + pad
  let yMin = Infinity
  let yMax = -Infinity
  for (let i = 0; i <= 200; i++) {
    const y = f(xMin + ((xMax - xMin) * i) / 200)
    if (!Number.isFinite(y)) continue
    yMin = Math.min(yMin, y)
    yMax = Math.max(yMax, y)
  }
  const yPad = (yMax - yMin) * 0.15 || 1
  return { xMin, xMax, yMin: yMin - yPad, yMax: yMax + yPad }
}

/** 绘制主图。返回找到的中值点数组，供上层显示。 */
export function drawMeanValueTheorem(
  canvas: HTMLCanvasElement,
  f: (x: number) => number,
  a: number,
  b: number,
): number[] {
  const ctx = canvas.getContext('2d')
  if (!ctx) return []
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  const bd = computeBounds(f, a, b)
  const sx = (x: number) => ((x - bd.xMin) / (bd.xMax - bd.xMin)) * W
  const sy = (y: number) => H - ((y - bd.yMin) / (bd.yMax - bd.yMin)) * H

  // 坐标轴（x 轴）
  if (bd.yMin < 0 && bd.yMax > 0) {
    ctx.strokeStyle = '#e2e8f0'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, sy(0))
    ctx.lineTo(W, sy(0))
    ctx.stroke()
  }

  // 曲线
  ctx.strokeStyle = '#6366f1'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  for (let i = 0; i <= 400; i++) {
    const x = bd.xMin + ((bd.xMax - bd.xMin) * i) / 400
    const px = sx(x)
    const py = sy(f(x))
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  const slope = secantSlope(f, a, b)
  // 割线（端点 A、B 连线）
  ctx.strokeStyle = '#ef4444'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(sx(a), sy(f(a)))
  ctx.lineTo(sx(b), sy(f(b)))
  ctx.stroke()
  drawDot(ctx, sx(a), sy(f(a)), '#ef4444')
  drawDot(ctx, sx(b), sy(f(b)), '#ef4444')

  // 中值点 c 及其平行切线
  const cs = findMeanValuePoints(f, a, b)
  const half = (bd.xMax - bd.xMin) * 0.22
  ctx.font = '13px sans-serif'
  for (const c of cs) {
    const yc = f(c)
    ctx.strokeStyle = '#10b981'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(sx(c - half), sy(yc - slope * half))
    ctx.lineTo(sx(c + half), sy(yc + slope * half))
    ctx.stroke()
    drawDot(ctx, sx(c), sy(yc), '#10b981')
    ctx.fillStyle = '#065f46'
    ctx.fillText('c=' + c.toFixed(2), sx(c) + 6, sy(yc) - 8)
  }
  return cs
}

function drawDot(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(x, y, 4.5, 0, 2 * Math.PI)
  ctx.fill()
}
