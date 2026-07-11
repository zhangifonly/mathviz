/**
 * 幂级数收敛 Canvas 绘制
 *
 * 画出精确函数曲线与部分和曲线的对照，并用竖线标出收敛半径边界，
 * progress 控制部分和曲线从左到右逐步描出，直观呈现"逼近"过程。
 */

import type { SeriesOption } from './powerSeries'
import { partialSum } from './powerSeries'

export interface DrawData {
  series: SeriesOption
  terms: number
  /** 横轴范围 [xMin, xMax] */
  xMin: number
  xMax: number
  /** 纵轴范围 [yMin, yMax] */
  yMin: number
  yMax: number
}

/**
 * 绘制精确曲线 + 部分和曲线 + 收敛半径边界。
 * @param progress 0→1 部分和曲线从左往右揭示的比例
 */
export function drawPowerSeries(
  canvas: HTMLCanvasElement,
  data: DrawData,
  progress: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const { series, terms, xMin, xMax, yMin, yMax } = data
  const pad = 36
  const toX = (x: number) => pad + ((x - xMin) / (xMax - xMin)) * (W - 2 * pad)
  const toY = (y: number) => H - pad - ((y - yMin) / (yMax - yMin)) * (H - 2 * pad)

  drawAxes(ctx, W, H, pad, toX, toY, xMin, xMax, yMin, yMax)
  drawRadius(ctx, series.radius, toX, toY, yMin, yMax)
  drawCurve(ctx, xMin, xMax, toX, toY, yMin, yMax, 1, '#38bdf8', (x) => series.exact(x))
  drawCurve(
    ctx, xMin, xMax, toX, toY, yMin, yMax, progress, '#fbbf24',
    (x) => partialSum(series, x, terms),
  )
  drawLegend(ctx, terms)
}

function drawAxes(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  pad: number,
  toX: (x: number) => number,
  toY: (y: number) => number,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
) {
  ctx.strokeStyle = '#334155'
  ctx.lineWidth = 1
  if (yMin <= 0 && yMax >= 0) {
    const y0 = toY(0)
    ctx.beginPath()
    ctx.moveTo(pad, y0)
    ctx.lineTo(W - pad, y0)
    ctx.stroke()
  }
  if (xMin <= 0 && xMax >= 0) {
    const x0 = toX(0)
    ctx.beginPath()
    ctx.moveTo(x0, pad)
    ctx.lineTo(x0, H - pad)
    ctx.stroke()
  }
}

function drawRadius(
  ctx: CanvasRenderingContext2D,
  radius: number,
  toX: (x: number) => number,
  toY: (y: number) => number,
  yMin: number,
  yMax: number,
) {
  if (!Number.isFinite(radius)) return
  ctx.strokeStyle = '#f87171'
  ctx.lineWidth = 1.5
  ctx.setLineDash([6, 5])
  for (const r of [-radius, radius]) {
    ctx.beginPath()
    ctx.moveTo(toX(r), toY(yMax))
    ctx.lineTo(toX(r), toY(yMin))
    ctx.stroke()
  }
  ctx.setLineDash([])
}

function drawCurve(
  ctx: CanvasRenderingContext2D,
  xMin: number,
  xMax: number,
  toX: (x: number) => number,
  toY: (y: number) => number,
  yMin: number,
  yMax: number,
  progress: number,
  color: string,
  fn: (x: number) => number,
) {
  const samples = 400
  const upto = Math.max(1, Math.floor(samples * progress))
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.beginPath()
  let started = false
  for (let i = 0; i <= upto; i++) {
    const x = xMin + ((xMax - xMin) * i) / samples
    const y = fn(x)
    if (!Number.isFinite(y) || y < yMin - 1 || y > yMax + 1) {
      started = false
      continue
    }
    const px = toX(x)
    const py = toY(y)
    if (!started) {
      ctx.moveTo(px, py)
      started = true
    } else {
      ctx.lineTo(px, py)
    }
  }
  ctx.stroke()
}

function drawLegend(ctx: CanvasRenderingContext2D, terms: number) {
  ctx.font = '13px sans-serif'
  ctx.fillStyle = '#38bdf8'
  ctx.fillText('精确函数', 46, 24)
  ctx.fillStyle = '#fbbf24'
  ctx.fillText(`部分和 (前 ${terms} 项)`, 46, 44)
  ctx.fillStyle = '#f87171'
  ctx.fillText('收敛半径边界', 46, 64)
}
