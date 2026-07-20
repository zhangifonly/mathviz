/**
 * 级数部分和序列 Canvas 绘制
 * 横轴 N，纵轴 S_N。收敛级数趋于水平渐近线，发散级数持续增长。
 */
import { partialSums, type TermFn } from './seriesConvergence'

/**
 * 绘制部分和序列的折线+散点。
 * @param term 通项函数
 * @param N 项数
 * @param asymptote 若给出且级数收敛，画出水平渐近线
 */
export function drawSeriesConvergence(
  canvas: HTMLCanvasElement,
  term: TermFn,
  N: number,
  asymptote?: number,
  color = '#6366f1',
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const sums = partialSums(term, N)
  const padL = 46
  const padR = 16
  const padT = 20
  const padB = 30
  let lo = Math.min(0, ...sums)
  let hi = Math.max(...sums, asymptote ?? -Infinity)
  if (hi - lo < 1e-6) hi = lo + 1
  const span = hi - lo
  lo -= span * 0.08
  hi += span * 0.08

  const px = (i: number) => padL + (i / Math.max(1, N - 1)) * (W - padL - padR)
  const py = (v: number) => H - padB - ((v - lo) / (hi - lo)) * (H - padT - padB)

  // 坐标轴
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padL, padT)
  ctx.lineTo(padL, H - padB)
  ctx.lineTo(W - padR, H - padB)
  ctx.stroke()

  // 水平渐近线
  if (asymptote !== undefined && Number.isFinite(asymptote)) {
    ctx.strokeStyle = '#10b981'
    ctx.setLineDash([6, 4])
    ctx.beginPath()
    ctx.moveTo(padL, py(asymptote))
    ctx.lineTo(W - padR, py(asymptote))
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = '#059669'
    ctx.font = '13px sans-serif'
    ctx.fillText('极限 S = ' + asymptote.toFixed(4), padL + 8, py(asymptote) - 6)
  }

  // 折线
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.beginPath()
  sums.forEach((v, i) => (i === 0 ? ctx.moveTo(px(i), py(v)) : ctx.lineTo(px(i), py(v))))
  ctx.stroke()

  // 散点
  ctx.fillStyle = color
  const r = N > 60 ? 1.8 : 2.8
  sums.forEach((v, i) => {
    ctx.beginPath()
    ctx.arc(px(i), py(v), r, 0, 2 * Math.PI)
    ctx.fill()
  })

  // 轴标签
  ctx.fillStyle = '#64748b'
  ctx.font = '12px sans-serif'
  ctx.fillText('N=' + N, W - padR - 42, H - padB + 20)
  ctx.fillText('S_N', 6, padT + 4)
}
