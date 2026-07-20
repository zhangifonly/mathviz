/**
 * 吉布斯现象 Canvas 绘制：目标方波 + n 项傅里叶部分和逼近，标出过冲峰。
 */
import { squarePartialSum, squareTarget, overshootPeak, TARGET_AMP } from './gibbsPhenomenon'

/** 画一个周期区间 [-π, π] 上的方波与部分和 */
export function drawGibbs(canvas: HTMLCanvasElement, nTerms: number) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const xMin = -Math.PI
  const xMax = Math.PI
  const yMax = TARGET_AMP * 1.6
  const px = (x: number) => ((x - xMin) / (xMax - xMin)) * W
  const py = (y: number) => H / 2 - (y / yMax) * (H / 2 - 20)

  // 网格与坐标轴
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, H / 2)
  ctx.lineTo(W, H / 2)
  ctx.moveTo(px(0), 0)
  ctx.lineTo(px(0), H)
  ctx.stroke()

  // 目标方波（虚线灰）
  ctx.strokeStyle = '#94a3b8'
  ctx.lineWidth = 2
  ctx.setLineDash([6, 4])
  ctx.beginPath()
  ctx.moveTo(px(xMin), py(squareTarget(xMin + 1e-6)))
  for (let i = 1; i <= W; i++) {
    const x = xMin + (i / W) * (xMax - xMin)
    ctx.lineTo(px(x), py(squareTarget(x)))
  }
  ctx.stroke()
  ctx.setLineDash([])

  // n 项部分和（靛蓝实线，跳变处过冲振铃）
  ctx.strokeStyle = '#6366f1'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  for (let i = 0; i <= W; i++) {
    const x = xMin + (i / W) * (xMax - xMin)
    const y = squarePartialSum(x, nTerms)
    if (i === 0) ctx.moveTo(px(x), py(y))
    else ctx.lineTo(px(x), py(y))
  }
  ctx.stroke()

  // 目标电平参考线
  ctx.strokeStyle = '#f59e0b'
  ctx.lineWidth = 1
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  ctx.moveTo(px(0), py(TARGET_AMP))
  ctx.lineTo(px(xMax), py(TARGET_AMP))
  ctx.stroke()
  ctx.setLineDash([])

  // 标出跳变点右侧过冲峰
  const peak = overshootPeak(nTerms)
  ctx.fillStyle = '#ef4444'
  ctx.beginPath()
  ctx.arc(px(peak.x), py(peak.value), 5, 0, 2 * Math.PI)
  ctx.fill()
  const pct = ((peak.value - TARGET_AMP) / (2 * TARGET_AMP)) * 100
  ctx.fillStyle = '#ef4444'
  ctx.font = 'bold 14px sans-serif'
  ctx.fillText(`过冲 +${pct.toFixed(1)}%`, px(peak.x) + 8, py(peak.value) - 6)

  ctx.fillStyle = '#64748b'
  ctx.font = '13px sans-serif'
  ctx.fillText(`${nTerms} 项部分和`, 12, 20)
}
