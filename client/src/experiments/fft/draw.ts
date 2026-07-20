/**
 * FFT Canvas 绘制：上半画时域信号，下半画 FFT 幅度谱（标注频率峰）。
 */
import { fft, makeSignal, magnitude, naiveOps, fftOps, type SignalPreset } from './fft'

function drawGrid(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  ctx.strokeRect(x, y, w, h)
  ctx.beginPath()
  ctx.moveTo(x, y + h / 2)
  ctx.lineTo(x + w, y + h / 2)
  ctx.stroke()
}

/** 绘制主视图。n 为采样点数（2 的幂） */
export function drawFft(canvas: HTMLCanvasElement, preset: SignalPreset, n: number) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, W, H)

  const pad = 36
  const topH = H * 0.42
  const botY = topH + 48
  const botH = H - botY - pad
  const plotW = W - pad * 2

  const signal = makeSignal(preset, n)
  const spectrum = fft(signal)
  const mag = magnitude(spectrum)

  // ---- 时域信号 ----
  drawGrid(ctx, pad, pad, plotW, topH - pad)
  ctx.fillStyle = '#475569'
  ctx.font = '13px sans-serif'
  ctx.fillText('时域信号 (合成正弦叠加)', pad, pad - 12)
  let maxA = 0
  for (const c of signal) maxA = Math.max(maxA, Math.abs(c.re))
  maxA = maxA || 1
  ctx.strokeStyle = '#6366f1'
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let t = 0; t < n; t++) {
    const px = pad + (t / (n - 1)) * plotW
    const py = pad + (topH - pad) / 2 - (signal[t].re / maxA) * ((topH - pad) / 2 - 6)
    if (t === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
  ctx.fillStyle = '#6366f1'
  for (let t = 0; t < n; t++) {
    const px = pad + (t / (n - 1)) * plotW
    const py = pad + (topH - pad) / 2 - (signal[t].re / maxA) * ((topH - pad) / 2 - 6)
    ctx.beginPath()
    ctx.arc(px, py, 2, 0, 2 * Math.PI)
    ctx.fill()
  }

  // ---- 幅度谱 ----
  const half = Math.floor(n / 2)
  ctx.fillStyle = '#475569'
  ctx.fillText('FFT 幅度谱 (频率 bin)', pad, botY - 12)
  ctx.strokeStyle = '#e2e8f0'
  ctx.strokeRect(pad, botY, plotW, botH)
  let maxM = 0
  for (let k = 0; k < half; k++) maxM = Math.max(maxM, mag[k])
  maxM = maxM || 1
  const bw = plotW / half
  for (let k = 0; k < half; k++) {
    const bh = (mag[k] / maxM) * (botH - 20)
    const bx = pad + k * bw
    const by = botY + botH - bh
    const isPeak = mag[k] > maxM * 0.5
    ctx.fillStyle = isPeak ? '#ec4899' : '#94a3b8'
    ctx.fillRect(bx + 1, by, Math.max(bw - 2, 1), bh)
    if (isPeak) {
      ctx.fillStyle = '#be185d'
      ctx.font = 'bold 11px sans-serif'
      ctx.fillText(String(k), bx + bw / 2 - 3, by - 4)
    }
  }

  // ---- 运算次数对比 ----
  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 12px sans-serif'
  ctx.fillText(
    `n=${n}  朴素DFT: ${naiveOps(n)} 次   FFT: ${fftOps(n)} 次   提速约 ${(naiveOps(n) / (fftOps(n) || 1)).toFixed(1)}x`,
    pad,
    H - 8,
  )
}
