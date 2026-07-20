/**
 * 奈奎斯特采样 Canvas 绘制：原信号 + 采样点 + sinc 重建波形
 */
import { signal, sampleSignal, reconstruct, isSufficient } from './nyquistSampling'

const DURATION = 2 // 显示时长（秒）

/**
 * 绘制原始信号（灰）、采样点（红点+竖线）、sinc 重建波形（蓝）。
 * 充分采样时重建与原信号重合，欠采样时明显偏离。
 */
export function drawNyquistSampling(
  canvas: HTMLCanvasElement,
  freq: number,
  fs: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const midY = H / 2
  const ampY = H * 0.34
  const tx = (t: number) => (t / DURATION) * W
  const vy = (v: number) => midY - v * ampY

  // 零轴
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, midY)
  ctx.lineTo(W, midY)
  ctx.stroke()

  // 原始连续信号（灰色细线）
  ctx.strokeStyle = '#94a3b8'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  for (let px = 0; px <= W; px++) {
    const t = (px / W) * DURATION
    const y = vy(signal(freq, t))
    if (px === 0) ctx.moveTo(px, y); else ctx.lineTo(px, y)
  }
  ctx.stroke()

  const samples = sampleSignal(freq, fs, DURATION)
  const ok = isSufficient(freq, fs)

  // sinc 重建波形（蓝色实线，欠采样时橙红）
  ctx.strokeStyle = ok ? '#2563eb' : '#f97316'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  for (let px = 0; px <= W; px++) {
    const t = (px / W) * DURATION
    const y = vy(reconstruct(samples, fs, t))
    if (px === 0) ctx.moveTo(px, y); else ctx.lineTo(px, y)
  }
  ctx.stroke()

  // 采样点：竖线 + 红点
  ctx.strokeStyle = '#ef4444'
  ctx.fillStyle = '#dc2626'
  ctx.lineWidth = 1
  for (const s of samples) {
    const x = tx(s.t)
    const y = vy(s.v)
    ctx.beginPath()
    ctx.moveTo(x, midY)
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(x, y, 3.5, 0, 2 * Math.PI)
    ctx.fill()
  }

  // 状态标注
  ctx.fillStyle = ok ? '#16a34a' : '#ea580c'
  ctx.font = 'bold 16px system-ui, sans-serif'
  ctx.fillText(ok ? '完美重建 (fs > 2f)' : '重建失真 (fs ≤ 2f)', 12, 24)
}
