/**
 * 洛特卡-沃尔泰拉 Canvas 绘制
 * 上半：种群数量随时间的振荡曲线；下半：相平面闭合轨道。
 */
import { simulate, type LVParams, type LVPoint } from './lotkaVolterra'

const PREY_COLOR = '#22c55e' // 兔子=绿
const PRED_COLOR = '#f97316' // 狐狸=橙

function maxPop(series: LVPoint[]): number {
  let m = 1
  for (const p of series) m = Math.max(m, p.prey, p.pred)
  return m * 1.1
}

function drawSeries(
  ctx: CanvasRenderingContext2D,
  series: LVPoint[],
  key: 'prey' | 'pred',
  color: string,
  x0: number,
  y0: number,
  w: number,
  h: number,
  tMax: number,
  vMax: number,
) {
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.beginPath()
  series.forEach((p, i) => {
    const px = x0 + (p.t / tMax) * w
    const py = y0 + h - (p[key] / vMax) * h
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  })
  ctx.stroke()
}

/**
 * 绘制时间序列（两条振荡曲线）+ 相平面轨道。
 */
export function drawLotkaVolterra(
  canvas: HTMLCanvasElement,
  params: LVParams,
  x0: number,
  y0: number,
  steps: number,
  dt: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const series = simulate(params, x0, y0, steps, dt)
  const vMax = maxPop(series)
  const tMax = steps * dt

  // ===== 上半：时间序列 =====
  const tx = 40
  const ty = 20
  const tw = W - 60
  const th = H * 0.52 - 40
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1
  ctx.strokeRect(tx, ty, tw, th)
  drawSeries(ctx, series, 'prey', PREY_COLOR, tx, ty, tw, th, tMax, vMax)
  drawSeries(ctx, series, 'pred', PRED_COLOR, tx, ty, tw, th, tMax, vMax)
  ctx.fillStyle = '#64748b'
  ctx.font = '12px sans-serif'
  ctx.fillText('数量', tx + 4, ty + 14)
  ctx.fillText('时间 t', tx + tw - 44, ty + th - 6)

  // ===== 下半：相平面（猎物 x 对 捕食者 y）=====
  const size = H * 0.44 - 30
  const px0 = (W - size) / 2
  const py0 = H * 0.54
  ctx.strokeStyle = '#cbd5e1'
  ctx.strokeRect(px0, py0, size, size)
  ctx.strokeStyle = '#6366f1'
  ctx.lineWidth = 2
  ctx.beginPath()
  series.forEach((p, i) => {
    const px = px0 + (p.prey / vMax) * size
    const py = py0 + size - (p.pred / vMax) * size
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  })
  ctx.stroke()
  ctx.fillStyle = '#64748b'
  ctx.fillText('猎物 x', px0 + size - 44, py0 + size - 6)
  ctx.fillText('捕食者 y', px0 + 4, py0 + 14)
}
