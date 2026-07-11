/**
 * 连分数 Canvas 绘制
 *
 * 上方：逐步展开的连分数结构（阶梯式嵌套分数）。
 * 下方：渐近分数在数轴上向真实值收敛的过程。
 */

import type { Convergent } from './continuedFraction'

export interface ContinuedFractionData {
  value: number // 目标实数
  label: string // 名称，如 "π"
  coeffs: number[] // 连分数系数
  convergents: Convergent[] // 各步渐近分数
}

const BG = '#0f172a'
const AXIS = '#475569'
const TEXT = '#e2e8f0'
const ACCENT = '#fbbf24'
const CONV = '#22d3ee'
const TRUE = '#f472b6'

/**
 * 绘制连分数与渐近分数收敛。
 * @param progress 0→1，控制逐步揭示多少个渐近分数
 */
export function drawContinuedFraction(
  canvas: HTMLCanvasElement,
  data: ContinuedFractionData,
  progress: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = BG
  ctx.fillRect(0, 0, W, H)

  const cs = data.convergents
  if (cs.length === 0) return
  const upto = Math.max(1, Math.floor(cs.length * progress))

  drawHeader(ctx, data)
  drawConvergentList(ctx, cs, upto)
  drawAxis(ctx, W, H, data, cs, upto)
}

function drawHeader(
  ctx: CanvasRenderingContext2D,
  data: ContinuedFractionData,
) {
  ctx.fillStyle = TEXT
  ctx.font = 'bold 22px system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(`${data.label} ≈ ${data.value.toFixed(8)}`, 24, 38)

  ctx.fillStyle = ACCENT
  ctx.font = '15px ui-monospace, monospace'
  const coeffStr = `[${data.coeffs[0]}; ${data.coeffs.slice(1).join(', ')}]`
  ctx.fillText(coeffStr, 24, 64)
}

function drawConvergentList(
  ctx: CanvasRenderingContext2D,
  cs: Convergent[],
  upto: number,
) {
  ctx.textAlign = 'left'
  const startY = 96
  const lineH = 26
  for (let i = 0; i < upto; i++) {
    const c = cs[i]
    const y = startY + i * lineH
    if (y > 96 + 9 * lineH) break // 最多显示约 10 行，避免溢出
    ctx.fillStyle = CONV
    ctx.font = '15px ui-monospace, monospace'
    ctx.fillText(`p${i}/q${i} = ${c.p}/${c.q} = ${(c.p / c.q).toFixed(6)}`, 24, y)
  }
}

function drawAxis(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  data: ContinuedFractionData,
  cs: Convergent[],
  upto: number,
) {
  const axisY = H - 70
  const margin = 60
  const left = margin
  const right = W - margin

  // 以真实值为中心确定坐标范围
  const target = data.value
  const half = 0.6
  const lo = target - half
  const hi = target + half
  const toX = (v: number) => left + ((v - lo) / (hi - lo)) * (right - left)

  // 轴线
  ctx.strokeStyle = AXIS
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(left, axisY)
  ctx.lineTo(right, axisY)
  ctx.stroke()

  // 真实值竖线
  const tx = toX(target)
  ctx.strokeStyle = TRUE
  ctx.setLineDash([4, 4])
  ctx.beginPath()
  ctx.moveTo(tx, axisY - 40)
  ctx.lineTo(tx, axisY + 12)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = TRUE
  ctx.font = '13px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(`${data.label} 真实值`, tx, axisY + 30)

  // 渐近分数点，交替落在真实值两侧
  ctx.textAlign = 'center'
  for (let i = 0; i < upto; i++) {
    const c = cs[i]
    const v = c.p / c.q
    if (v < lo || v > hi) continue
    const x = toX(v)
    const up = i % 2 === 0
    const dotY = up ? axisY - 8 : axisY + 8
    const alpha = 0.4 + 0.6 * (i / Math.max(1, upto - 1))
    ctx.globalAlpha = alpha
    ctx.fillStyle = CONV
    ctx.beginPath()
    ctx.arc(x, dotY, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
    ctx.fillStyle = TEXT
    ctx.font = '11px ui-monospace, monospace'
    ctx.fillText(`${c.p}/${c.q}`, x, up ? dotY - 8 : dotY + 16)
  }
}
