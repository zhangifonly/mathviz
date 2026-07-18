/**
 * Softmax Canvas 绘制：上排输入 logits 柱状图，下排 softmax 概率柱状图（和为1）。
 */
import { softmax, argmax } from './softmax'

/** 绘制左侧输入 logits + 右侧输出概率的对比柱状图。 */
export function drawSoftmax(
  canvas: HTMLCanvasElement,
  logits: number[],
  temperature = 1,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx || logits.length === 0) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const probs = softmax(logits, temperature)
  const best = argmax(probs)
  const n = logits.length
  const pad = 44
  const half = (H - pad * 2) / 2
  const topBase = pad + half - 12
  const botBase = H - pad
  const slot = (W - pad * 2) / n
  const bw = slot * 0.6
  const maxAbs = Math.max(1e-6, ...logits.map((v) => Math.abs(v)))

  ctx.font = '12px system-ui, sans-serif'
  ctx.textAlign = 'center'

  // 上排：logits（可正可负，以 topBase 为零线）
  ctx.fillStyle = '#64748b'
  ctx.fillText('输入 logits', pad + 4 + 40, pad - 20)
  ctx.strokeStyle = '#cbd5e1'
  ctx.beginPath()
  ctx.moveTo(pad, topBase)
  ctx.lineTo(W - pad, topBase)
  ctx.stroke()
  for (let i = 0; i < n; i++) {
    const x = pad + slot * i + (slot - bw) / 2
    const h = (logits[i] / maxAbs) * (half - 16)
    ctx.fillStyle = i === best ? '#6366f1' : '#a5b4fc'
    ctx.fillRect(x, topBase - Math.max(h, 0), bw, Math.abs(h))
    if (h < 0) ctx.fillRect(x, topBase, bw, -h)
    ctx.fillStyle = '#334155'
    ctx.fillText(logits[i].toFixed(1), x + bw / 2, topBase + (h < 0 ? -h + 14 : 14))
  }

  // 下排：概率（0..1，向上生长）
  ctx.fillStyle = '#64748b'
  ctx.fillText('softmax 概率 (和=1)', pad + 4 + 70, botBase - half + 6)
  const maxP = Math.max(...probs)
  for (let i = 0; i < n; i++) {
    const x = pad + slot * i + (slot - bw) / 2
    const h = (probs[i] / (maxP || 1)) * (half - 24)
    ctx.fillStyle = i === best ? '#ec4899' : '#f9a8d4'
    ctx.fillRect(x, botBase - h, bw, h)
    ctx.fillStyle = '#334155'
    ctx.fillText((probs[i] * 100).toFixed(0) + '%', x + bw / 2, botBase - h - 6)
  }
  ctx.strokeStyle = '#cbd5e1'
  ctx.beginPath()
  ctx.moveTo(pad, botBase)
  ctx.lineTo(W - pad, botBase)
  ctx.stroke()

  ctx.fillStyle = '#94a3b8'
  ctx.fillText('T = ' + temperature, W - pad - 30, H - 12)
}
