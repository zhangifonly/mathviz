/**
 * 混叠现象 Canvas 绘制
 * 灰色连续高频真实波 + 采样点 + 采样点连成的假低频波(混叠)
 */
import { signal, aliasFrequency, sampleSignal } from './aliasing'

const DURATION = 1 // 展示 1 秒信号

/** 绘制混叠可视化 */
export function drawAliasing(canvas: HTMLCanvasElement, f: number, fs: number) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  const midY = H / 2
  const amp = H * 0.35
  ctx.clearRect(0, 0, W, H)

  const xOf = (t: number) => (t / DURATION) * W
  const yOf = (v: number) => midY - v * amp

  // 零线
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, midY)
  ctx.lineTo(W, midY)
  ctx.stroke()

  // 真实高频波(灰色，密集采样)
  ctx.strokeStyle = '#94a3b8'
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let px = 0; px <= W; px++) {
    const t = (px / W) * DURATION
    const y = yOf(signal(f, t))
    if (px === 0) ctx.moveTo(px, y)
    else ctx.lineTo(px, y)
  }
  ctx.stroke()

  // 采样点连成的假低频波(表观频率)
  const fa = aliasFrequency(f, fs)
  ctx.strokeStyle = '#ef4444'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  for (let px = 0; px <= W; px++) {
    const t = (px / W) * DURATION
    // 混叠波与采样点在采样时刻重合，用相位对齐的低频正弦近似重建
    const y = yOf(signal(fa, t))
    if (px === 0) ctx.moveTo(px, y)
    else ctx.lineTo(px, y)
  }
  ctx.stroke()

  // 采样点
  const samples = sampleSignal(f, fs, DURATION)
  ctx.fillStyle = '#1d4ed8'
  for (const s of samples) {
    ctx.beginPath()
    ctx.arc(xOf(s.t), yOf(s.v), 4, 0, 2 * Math.PI)
    ctx.fill()
  }
}
