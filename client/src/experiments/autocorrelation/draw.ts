/**
 * 自相关 Canvas 绘制：上半画带噪信号，下半画自相关函数并标出检测到的周期。
 */
import { autocorr, detectPeriod } from './autocorrelation'

function plotLine(
  ctx: CanvasRenderingContext2D,
  data: number[], x0: number, y0: number, w: number, h: number,
  color: string, vmax = 1,
) {
  const mid = y0 + h / 2
  ctx.strokeStyle = '#e2e8f0'
  ctx.beginPath(); ctx.moveTo(x0, mid); ctx.lineTo(x0 + w, mid); ctx.stroke()
  ctx.strokeStyle = color
  ctx.lineWidth = 1.8
  ctx.beginPath()
  for (let i = 0; i < data.length; i++) {
    const x = x0 + (i / (data.length - 1)) * w
    const y = mid - (data[i] / vmax) * (h / 2) * 0.92
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
  }
  ctx.stroke()
}

/** 绘制信号(上)与自相关(下)，红线标出检测周期 */
export function drawAutocorrelation(canvas: HTMLCanvasElement, signal: number[]) {
  const ctx = canvas.getContext('2d')
  if (!ctx || signal.length === 0) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const pad = 24
  const w = W - pad * 2
  const topH = H * 0.42
  const botY = H * 0.52
  const botH = H * 0.42

  ctx.fillStyle = '#64748b'
  ctx.font = '13px sans-serif'
  ctx.fillText('带噪信号 x(t)', pad, 16)
  const smax = Math.max(...signal.map((v) => Math.abs(v)), 1)
  plotLine(ctx, signal, pad, 20, w, topH, '#6366f1', smax)

  const ac = autocorr(signal, Math.min(signal.length - 1, 120))
  const period = detectPeriod(ac)
  ctx.fillText('自相关 R(lag)', pad, botY - 4)
  plotLine(ctx, ac, pad, botY, w, botH, '#ec4899', 1)

  if (period > 0) {
    const x = pad + (period / (ac.length - 1)) * w
    ctx.strokeStyle = '#ef4444'
    ctx.setLineDash([4, 3])
    ctx.beginPath(); ctx.moveTo(x, botY); ctx.lineTo(x, botY + botH); ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = '#ef4444'
    ctx.fillText(`周期 ≈ ${period}`, x + 4, botY + 14)
  }
}
