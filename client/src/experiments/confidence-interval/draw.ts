/**
 * 置信区间 Canvas 绘制
 * 画多条水平置信区间条：覆盖真值=绿，未覆盖=红，并画出真值竖线。
 */
import type { Interval } from './confidenceInterval'

/**
 * 绘制多条置信区间。
 * @param intervals 每次抽样得到的区间
 * @param trueMu 真实均值（画竖线）
 * @param sigma 用于确定横向坐标范围
 * @param n 样本量（用于估算合理跨度）
 */
export function drawConfidenceInterval(
  canvas: HTMLCanvasElement,
  intervals: Interval[],
  trueMu: number,
  sigma: number,
  n: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx || intervals.length === 0) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const se = sigma / Math.sqrt(n)
  const span = 4 * se + 1e-6
  const xMin = trueMu - span
  const xMax = trueMu + span
  const toX = (v: number) => ((v - xMin) / (xMax - xMin)) * (W - 40) + 20

  // 真值竖线
  const tx = toX(trueMu)
  ctx.strokeStyle = '#334155'
  ctx.setLineDash([6, 4])
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(tx, 10)
  ctx.lineTo(tx, H - 10)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = '#334155'
  ctx.font = '13px sans-serif'
  ctx.fillText('真值 μ', tx + 6, 20)

  const rows = intervals.length
  const gap = (H - 30) / rows
  for (let i = 0; i < rows; i++) {
    const iv = intervals[i]
    const y = 20 + i * gap
    const x1 = toX(iv.lower)
    const x2 = toX(iv.upper)
    const cx = toX(iv.mean)
    ctx.strokeStyle = iv.covers ? '#22c55e' : '#ef4444'
    ctx.fillStyle = ctx.strokeStyle
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(x1, y)
    ctx.lineTo(x2, y)
    ctx.stroke()
    // 端点竖帽
    ctx.beginPath()
    ctx.moveTo(x1, y - 3)
    ctx.lineTo(x1, y + 3)
    ctx.moveTo(x2, y - 3)
    ctx.lineTo(x2, y + 3)
    ctx.stroke()
    // 均值点
    ctx.beginPath()
    ctx.arc(cx, y, 2.2, 0, 2 * Math.PI)
    ctx.fill()
  }
}
