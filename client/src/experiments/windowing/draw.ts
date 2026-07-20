/**
 * 加窗函数 Canvas 绘制：上半画窗函数形状，下半画加窗后信号的 DFT 幅度谱。
 */
import {
  windowFn,
  makeSignal,
  applyWindow,
  dftMagnitude,
  WINDOW_LABELS,
  type WindowKind,
} from './windowing'

const COLORS: Record<WindowKind, string> = {
  rect: '#f87171',
  hann: '#6366f1',
  hamming: '#22d3ee',
  blackman: '#34d399',
}

/** 绘制窗形状(上)与频谱(下)。freq 用非整数(如 8.5)可见明显泄漏。 */
export function drawWindowing(
  canvas: HTMLCanvasElement,
  kind: WindowKind,
  N = 128,
  freq = 8.5,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  const color = COLORS[kind]
  const midY = H / 2

  // ---- 上半：窗函数形状 ----
  const win = windowFn(kind, N)
  ctx.strokeStyle = '#e2e8f0'
  ctx.beginPath()
  ctx.moveTo(0, midY - 10)
  ctx.lineTo(W, midY - 10)
  ctx.stroke()
  ctx.strokeStyle = color
  ctx.lineWidth = 2.5
  ctx.beginPath()
  for (let i = 0; i < N; i++) {
    const x = (i / (N - 1)) * W
    const y = midY - 20 - win[i] * (midY - 50)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
  ctx.fillStyle = '#0f172a'
  ctx.font = '15px sans-serif'
  ctx.fillText(WINDOW_LABELS[kind] + ' 窗形状', 12, 24)

  // ---- 下半：加窗后信号的幅度谱 ----
  const mag = dftMagnitude(applyWindow(makeSignal(N, freq), win))
  const maxMag = Math.max(...mag, 1e-6)
  const baseY = H - 24
  const plotW = W - 24
  const bw = plotW / mag.length
  ctx.fillStyle = color
  for (let k = 0; k < mag.length; k++) {
    const h = (mag[k] / maxMag) * (midY - 60)
    ctx.fillRect(12 + k * bw, baseY - h, Math.max(bw - 1, 1), h)
  }
  ctx.strokeStyle = '#cbd5e1'
  ctx.beginPath()
  ctx.moveTo(12, baseY)
  ctx.lineTo(12 + plotW, baseY)
  ctx.stroke()
  ctx.fillStyle = '#0f172a'
  ctx.fillText('加窗后频谱 (freq=' + freq + ')', 12, midY + 20)
}
