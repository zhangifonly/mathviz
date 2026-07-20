/**
 * 最大似然估计 Canvas 绘制
 * 上半部：对数似然函数关于 mu 的曲线，标出最大值点(MLE)
 * 下半部：观测数据的直方图，虚线标出 MLE(=样本均值)所在位置
 */
import { likelihoodCurve, mleMu, type Dataset } from './maxLikelihood'

function histogram(values: number[], lo: number, hi: number, bins: number): number[] {
  const counts = new Array(bins).fill(0)
  const w = (hi - lo) / bins
  for (const v of values) {
    let b = Math.floor((v - lo) / w)
    if (b < 0) b = 0
    if (b >= bins) b = bins - 1
    counts[b]++
  }
  return counts
}

export function drawMaxLikelihood(
  canvas: HTMLCanvasElement,
  dataset: Dataset,
  sigma: number,
  currentMu: number | null,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const data = dataset.values
  const mle = mleMu(data)
  const lo = mle - 3 * sigma
  const hi = mle + 3 * sigma
  const curve = likelihoodCurve(data, sigma, lo, hi, 160)
  const lls = curve.map((p) => p.ll)
  const maxLl = Math.max(...lls)
  const minLl = Math.min(...lls)

  const padX = 48
  const topH = H * 0.58
  const xOf = (mu: number) => padX + ((mu - lo) / (hi - lo)) * (W - 2 * padX)
  const yOf = (ll: number) => 24 + (1 - (ll - minLl) / (maxLl - minLl)) * (topH - 40)

  // 曲线
  ctx.strokeStyle = '#6366f1'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  curve.forEach((p, i) => {
    const x = xOf(p.mu)
    const y = yOf(p.ll)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })
  ctx.stroke()

  // MLE 峰值点
  ctx.fillStyle = '#ec4899'
  ctx.beginPath()
  ctx.arc(xOf(mle), yOf(maxLl), 5, 0, 2 * Math.PI)
  ctx.fill()
  ctx.fillStyle = '#0f172a'
  ctx.font = '13px sans-serif'
  ctx.fillText(`MLE  mu=${mle.toFixed(2)}`, xOf(mle) + 8, yOf(maxLl) - 6)

  // 当前 mu 竖线
  if (currentMu !== null) {
    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = 1.5
    ctx.setLineDash([5, 4])
    ctx.beginPath()
    ctx.moveTo(xOf(currentMu), 20)
    ctx.lineTo(xOf(currentMu), topH)
    ctx.stroke()
    ctx.setLineDash([])
  }

  // 直方图
  const bins = 10
  const counts = histogram(data, lo, hi, bins)
  const maxC = Math.max(1, ...counts)
  const barBase = H - 24
  const barTop = topH + 24
  const bw = (W - 2 * padX) / bins
  ctx.fillStyle = '#22d3ee'
  counts.forEach((c, i) => {
    const h = (c / maxC) * (barBase - barTop)
    ctx.fillRect(padX + i * bw + 1, barBase - h, bw - 2, h)
  })
  ctx.strokeStyle = '#ec4899'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(xOf(mle), barTop)
  ctx.lineTo(xOf(mle), barBase)
  ctx.stroke()
  ctx.fillStyle = '#64748b'
  ctx.fillText('对数似然', padX, 16)
  ctx.fillText('数据直方图', padX, barTop - 6)
}
