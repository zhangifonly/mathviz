/**
 * 高斯混合模型 Canvas 绘制：数据直方图 + 各分量曲线 + 混合总曲线
 */
import { gaussianPdf, type Component } from './gaussianMixture'

const COLORS = ['#6366f1', '#ec4899', '#22c55e', '#f59e0b']

function bounds(data: number[]): [number, number] {
  const lo = Math.min(...data)
  const hi = Math.max(...data)
  const pad = (hi - lo) * 0.08 || 1
  return [lo - pad, hi + pad]
}

/** 把数据分箱，返回每箱的密度（面积归一） */
function histogram(data: number[], lo: number, hi: number, bins: number): number[] {
  const counts = new Array(bins).fill(0)
  const w = (hi - lo) / bins
  for (const x of data) {
    let b = Math.floor((x - lo) / w)
    if (b < 0) b = 0
    if (b >= bins) b = bins - 1
    counts[b]++
  }
  return counts.map((c) => c / (data.length * w))
}

export function drawGaussianMixture(
  canvas: HTMLCanvasElement,
  data: number[],
  params: Component[],
) {
  const ctx = canvas.getContext('2d')
  if (!ctx || data.length === 0) return
  const W = canvas.width
  const H = canvas.height
  const padL = 40
  const padB = 30
  ctx.clearRect(0, 0, W, H)

  const [lo, hi] = bounds(data)
  const bins = 32
  const hist = histogram(data, lo, hi, bins)

  const xs = (v: number) => padL + ((v - lo) / (hi - lo)) * (W - padL - 10)
  let maxY = Math.max(...hist)
  for (let x = lo; x <= hi; x += (hi - lo) / 120) {
    let m = 0
    for (const c of params) m += c.weight * gaussianPdf(x, c.mu, c.sigma)
    if (m > maxY) maxY = m
  }
  maxY = maxY * 1.1 || 1
  const ys = (v: number) => H - padB - (v / maxY) * (H - padB - 12)

  const bw = (W - padL - 10) / bins
  ctx.fillStyle = 'rgba(148,163,184,0.45)'
  for (let i = 0; i < bins; i++) {
    const bx = padL + i * bw
    const bh = H - padB - ys(hist[i])
    ctx.fillRect(bx, ys(hist[i]), bw - 1, bh)
  }

  params.forEach((c, j) => {
    ctx.strokeStyle = COLORS[j % COLORS.length]
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let px = 0; px <= 120; px++) {
      const x = lo + ((hi - lo) * px) / 120
      const y = c.weight * gaussianPdf(x, c.mu, c.sigma)
      if (px === 0) ctx.moveTo(xs(x), ys(y))
      else ctx.lineTo(xs(x), ys(y))
    }
    ctx.stroke()
  })

  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  for (let px = 0; px <= 160; px++) {
    const x = lo + ((hi - lo) * px) / 160
    let m = 0
    for (const c of params) m += c.weight * gaussianPdf(x, c.mu, c.sigma)
    if (px === 0) ctx.moveTo(xs(x), ys(m))
    else ctx.lineTo(xs(x), ys(m))
  }
  ctx.stroke()

  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padL, H - padB)
  ctx.lineTo(W - 10, H - padB)
  ctx.stroke()
}
