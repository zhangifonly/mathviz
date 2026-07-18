/**
 * 一维卷积 Canvas 绘制：上排信号、滑动的翻转核窗口、下排输出。
 */
import { frames } from './convolution'

/**
 * @param signal 输入信号
 * @param kernel 卷积核（未翻转，函数内部翻转对齐）
 * @param step   当前滑动到的帧下标（-1 表示只画最终结果）
 */
export function drawConvolution(
  canvas: HTMLCanvasElement,
  signal: number[],
  kernel: number[],
  step = -1,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const fs = frames(signal, kernel)
  const n = signal.length
  const pad = 40
  const bw = (W - pad * 2) / n
  const half = Math.floor(kernel.length / 2)
  const topY = 150
  const botY = H - 60
  const sMax = Math.max(1, ...signal.map(Math.abs))
  const oMax = Math.max(1, ...fs.map((f) => Math.abs(f.sum)))
  const barH = 90

  const bar = (i: number, v: number, base: number, max: number, col: string) => {
    const h = (v / max) * barH
    ctx.fillStyle = col
    ctx.fillRect(pad + i * bw + 2, base - Math.max(0, h), bw - 4, Math.abs(h))
  }

  // 输入信号（上排）
  ctx.fillStyle = '#334155'
  ctx.font = '13px sans-serif'
  ctx.fillText('输入信号', pad, topY - barH - 12)
  for (let i = 0; i < n; i++) bar(i, signal[i], topY, sMax, '#93c5fd')

  // 滑动窗口：高亮当前核覆盖的信号区间
  if (step >= 0 && step < n) {
    const x0 = pad + (step - half) * bw
    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = 2
    ctx.strokeRect(x0, topY - barH - 6, bw * kernel.length, barH + 12)
    ctx.fillStyle = '#b45309'
    const flipped = [...kernel].reverse()
    ctx.fillText('翻转核 ' + flipped.map((t) => t.toFixed(2)).join(', '), pad, topY + 26)
  }

  // 输出信号（下排），已算出的部分实心，未到的浅色
  ctx.fillStyle = '#334155'
  ctx.fillText('卷积输出', pad, botY - barH - 12)
  for (let i = 0; i < n; i++) {
    const done = step < 0 || i <= step
    bar(i, fs[i].sum, botY, oMax, done ? '#34d399' : '#d1fae5')
  }

  // 基线
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(pad, topY); ctx.lineTo(W - pad, topY)
  ctx.moveTo(pad, botY); ctx.lineTo(W - pad, botY)
  ctx.stroke()

  // 当前帧数值提示
  if (step >= 0 && step < n) {
    ctx.fillStyle = '#059669'
    ctx.font = 'bold 14px sans-serif'
    ctx.fillText('输出[' + step + '] = ' + fs[step].sum.toFixed(2), pad, botY + 34)
  }
}
