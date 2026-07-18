/**
 * 本福特定律 Canvas 绘制
 * 柱状图 = 数据集实际首位分布；折线 = 本福特理论曲线。
 */
import { benfordProb, digitDistribution, generateDataset, type DatasetType } from './benfordsLaw'

/** 绘制首位1..9的实际分布柱状 + 本福特理论曲线 */
export function drawBenfordsLaw(
  canvas: HTMLCanvasElement,
  dataset: DatasetType,
  count: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const dist = digitDistribution(generateDataset(dataset, count))
  const padL = 44
  const padB = 34
  const padT = 20
  const plotW = W - padL - 20
  const plotH = H - padB - padT
  const maxP = 0.35
  const y0 = padT + plotH
  const barW = plotW / 9

  // 网格与Y轴刻度
  ctx.strokeStyle = '#e2e8f0'
  ctx.fillStyle = '#94a3b8'
  ctx.font = '11px sans-serif'
  for (let g = 0; g <= 5; g++) {
    const p = (maxP * g) / 5
    const y = y0 - (p / maxP) * plotH
    ctx.beginPath()
    ctx.moveTo(padL, y)
    ctx.lineTo(padL + plotW, y)
    ctx.stroke()
    ctx.fillText((p * 100).toFixed(0) + '%', 6, y + 4)
  }

  // 实际分布柱状
  for (let i = 0; i < 9; i++) {
    const h = (dist[i] / maxP) * plotH
    const x = padL + i * barW + barW * 0.18
    ctx.fillStyle = '#6366f1'
    ctx.fillRect(x, y0 - h, barW * 0.64, h)
    ctx.fillStyle = '#334155'
    ctx.font = 'bold 12px sans-serif'
    ctx.fillText(String(i + 1), x + barW * 0.24, y0 + 18)
  }

  // 本福特理论曲线
  ctx.strokeStyle = '#ef4444'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  for (let d = 1; d <= 9; d++) {
    const x = padL + (d - 1) * barW + barW / 2
    const y = y0 - (benfordProb(d) / maxP) * plotH
    if (d === 1) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
  // 理论点
  ctx.fillStyle = '#ef4444'
  for (let d = 1; d <= 9; d++) {
    const x = padL + (d - 1) * barW + barW / 2
    const y = y0 - (benfordProb(d) / maxP) * plotH
    ctx.beginPath()
    ctx.arc(x, y, 3, 0, 2 * Math.PI)
    ctx.fill()
  }
}
