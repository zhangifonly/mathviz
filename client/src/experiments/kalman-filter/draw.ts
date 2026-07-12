/**
 * 卡尔曼滤波 Canvas 绘制
 * 三条线：灰色真值、散点测量、亮色滤波估计；估计外包一层浅色置信带。
 */

import type { KalmanDataset } from './kalmanFilter'

const COLOR_BG = '#0f172a'
const COLOR_TRUTH = '#64748b'
const COLOR_MEAS = '#f87171'
const COLOR_KF = '#22d3ee'
const COLOR_BAND = 'rgba(34, 211, 238, 0.18)'
const COLOR_GRID = 'rgba(148, 163, 184, 0.15)'

/**
 * @param data generateDataset 的结果
 * @param progress 0→1 从左到右逐点揭示
 */
export function drawKalmanFilter(
  canvas: HTMLCanvasElement,
  data: KalmanDataset,
  progress: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = COLOR_BG
  ctx.fillRect(0, 0, W, H)

  const n = data.truth.length
  if (n === 0) return

  // 计算纵向范围（含置信带），留边距
  let lo = Infinity
  let hi = -Infinity
  for (let i = 0; i < n; i++) {
    const sd = Math.sqrt(Math.max(data.steps[i].P, 0))
    lo = Math.min(lo, data.truth[i], data.measurements[i], data.steps[i].x - 2 * sd)
    hi = Math.max(hi, data.truth[i], data.measurements[i], data.steps[i].x + 2 * sd)
  }
  const pad = 40
  const span = hi - lo || 1
  const xAt = (i: number) => pad + (i / (n - 1)) * (W - 2 * pad)
  const yAt = (v: number) => H - pad - ((v - lo) / span) * (H - 2 * pad)

  drawGrid(ctx, W, H, pad)

  const upto = Math.max(1, Math.floor(n * progress))

  // 置信带（±2 标准差）
  ctx.beginPath()
  for (let i = 0; i < upto; i++) {
    const sd = Math.sqrt(Math.max(data.steps[i].P, 0))
    const y = yAt(data.steps[i].x + 2 * sd)
    if (i === 0) ctx.moveTo(xAt(i), y)
    else ctx.lineTo(xAt(i), y)
  }
  for (let i = upto - 1; i >= 0; i--) {
    const sd = Math.sqrt(Math.max(data.steps[i].P, 0))
    ctx.lineTo(xAt(i), yAt(data.steps[i].x - 2 * sd))
  }
  ctx.closePath()
  ctx.fillStyle = COLOR_BAND
  ctx.fill()

  // 真值线
  strokeLine(ctx, upto, xAt, (i) => yAt(data.truth[i]), COLOR_TRUTH, 2)

  // 测量散点
  ctx.fillStyle = COLOR_MEAS
  for (let i = 0; i < upto; i++) {
    ctx.beginPath()
    ctx.arc(xAt(i), yAt(data.measurements[i]), 2.5, 0, Math.PI * 2)
    ctx.fill()
  }

  // 滤波估计线
  strokeLine(ctx, upto, xAt, (i) => yAt(data.steps[i].x), COLOR_KF, 2.5)

  drawLegend(ctx, W, data)
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  pad: number,
) {
  ctx.strokeStyle = COLOR_GRID
  ctx.lineWidth = 1
  for (let k = 0; k <= 4; k++) {
    const y = pad + (k / 4) * (H - 2 * pad)
    ctx.beginPath()
    ctx.moveTo(pad, y)
    ctx.lineTo(W - pad, y)
    ctx.stroke()
  }
}

function strokeLine(
  ctx: CanvasRenderingContext2D,
  upto: number,
  xAt: (i: number) => number,
  yAt: (i: number) => number,
  color: string,
  width: number,
) {
  ctx.beginPath()
  for (let i = 0; i < upto; i++) {
    if (i === 0) ctx.moveTo(xAt(i), yAt(i))
    else ctx.lineTo(xAt(i), yAt(i))
  }
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.stroke()
}

function drawLegend(
  ctx: CanvasRenderingContext2D,
  W: number,
  data: KalmanDataset,
) {
  const items: [string, string][] = [
    [COLOR_TRUTH, '真值'],
    [COLOR_MEAS, '测量'],
    [COLOR_KF, '卡尔曼估计'],
  ]
  ctx.font = '13px sans-serif'
  ctx.textBaseline = 'middle'
  let x = 50
  const y = 22
  for (const [color, label] of items) {
    ctx.fillStyle = color
    ctx.fillRect(x, y - 5, 18, 4)
    ctx.fillStyle = '#e2e8f0'
    ctx.fillText(label, x + 24, y)
    x += 24 + ctx.measureText(label).width + 26
  }
  ctx.fillStyle = '#94a3b8'
  ctx.textAlign = 'right'
  ctx.fillText(`Q=${data.Q}  R=${data.R}`, W - 20, y)
  ctx.textAlign = 'left'
}
