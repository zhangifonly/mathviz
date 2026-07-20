/**
 * 离散余弦变换 Canvas 绘制
 * 三栏：原信号折线 + DCT 系数柱状图（能量集中低频）+ 只保留前 keep 个系数的重建
 */
import { dct, keepLowFreq, idct } from './discreteCosineTransform'

function panel(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, title: string) {
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(x, y, w, h)
  ctx.strokeStyle = '#e2e8f0'
  ctx.strokeRect(x, y, w, h)
  ctx.fillStyle = '#334155'
  ctx.font = 'bold 13px system-ui, sans-serif'
  ctx.fillText(title, x + 8, y + 18)
}

function polyline(ctx: CanvasRenderingContext2D, vals: number[], x: number, y: number, w: number, h: number, lo: number, hi: number, color: string) {
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.beginPath()
  vals.forEach((v, i) => {
    const px = x + (i / (vals.length - 1)) * w
    const py = y + h - ((v - lo) / (hi - lo)) * h
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  })
  ctx.stroke()
}

export function drawDiscreteCosineTransform(
  canvas: HTMLCanvasElement,
  signal: number[],
  keep: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx || signal.length === 0) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const coeffs = dct(signal)
  const recon = idct(keepLowFreq(coeffs, keep))
  const pad = 12
  const pw = W - pad * 2
  const ph = (H - pad * 4) / 3

  const all = signal.concat(recon)
  const lo = Math.min(...all) - 5
  const hi = Math.max(...all) + 5

  // 1. 原信号
  let py = pad
  panel(ctx, pad, py, pw, ph, '原始信号 x[n]')
  polyline(ctx, signal, pad + 4, py + 24, pw - 8, ph - 34, lo, hi, '#6366f1')

  // 2. DCT 系数（柱状，能量集中低频）
  py = pad * 2 + ph
  panel(ctx, pad, py, pw, ph, 'DCT 系数（左侧低频能量大）')
  const cmax = Math.max(...coeffs.map((c) => Math.abs(c)), 1)
  const bw = (pw - 16) / coeffs.length
  const mid = py + 24 + (ph - 34) / 2
  coeffs.forEach((c, i) => {
    const bh = (Math.abs(c) / cmax) * ((ph - 40) / 2)
    ctx.fillStyle = i < keep ? '#22c55e' : '#cbd5e1'
    const bx = pad + 8 + i * bw
    ctx.fillRect(bx, c >= 0 ? mid - bh : mid, Math.max(bw - 1.5, 1), bh)
  })

  // 3. 重建信号（保留前 keep 个系数）
  py = pad * 3 + ph * 2
  panel(ctx, pad, py, pw, ph, `重建（保留前 ${keep} 个系数）`)
  ctx.setLineDash([4, 3])
  polyline(ctx, signal, pad + 4, py + 24, pw - 8, ph - 34, lo, hi, '#cbd5e1')
  ctx.setLineDash([])
  polyline(ctx, recon, pad + 4, py + 24, pw - 8, ph - 34, lo, hi, '#ec4899')
}
