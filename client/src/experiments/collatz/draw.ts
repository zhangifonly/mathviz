/**
 * 考拉兹序列 Canvas 绘制：纵轴数值、横轴步数的折线图。
 * 可叠加多个起点的轨迹，形成“意大利面”式的冰雹图。
 */
import { collatzSequence } from './collatz'

const COLORS = ['#6366f1', '#ec4899', '#22d3ee', '#fbbf24', '#34d399', '#fb923c']

/**
 * 绘制若干起点的考拉兹轨迹。
 * @param starts 起点数组，每个起点画一条折线
 */
export function drawCollatz(canvas: HTMLCanvasElement, starts: number[]) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const seqs = starts.map((s) => collatzSequence(s)).filter((q) => q.length > 0)
  if (seqs.length === 0) return
  const maxLen = Math.max(...seqs.map((q) => q.length))
  const maxVal = Math.max(...seqs.map((q) => Math.max(...q)))

  const padL = 46
  const padB = 28
  const padT = 14
  const plotW = W - padL - 14
  const plotH = H - padB - padT
  const xAt = (i: number) => padL + (i / Math.max(1, maxLen - 1)) * plotW
  const yAt = (v: number) => padT + plotH - (v / maxVal) * plotH

  // 坐标轴
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padL, padT)
  ctx.lineTo(padL, padT + plotH)
  ctx.lineTo(padL + plotW, padT + plotH)
  ctx.stroke()
  ctx.fillStyle = '#64748b'
  ctx.font = '11px sans-serif'
  ctx.fillText(String(maxVal), 4, yAt(maxVal) + 4)
  ctx.fillText('0', 30, padT + plotH + 4)
  ctx.fillText('步数', padL + plotW - 24, padT + plotH + 22)

  seqs.forEach((seq, k) => {
    ctx.strokeStyle = COLORS[k % COLORS.length]
    ctx.lineWidth = 1.6
    ctx.beginPath()
    seq.forEach((v, i) => {
      const x = xAt(i)
      const y = yAt(v)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()
  })
}
