/**
 * 反常积分 Canvas 绘制：画曲线、无限延伸区间上的阴影面积、当前上限。
 */
import { integrate, START_A, type Fn } from './improperIntegral'

/**
 * @param fn 被积函数
 * @param upper 当前积分上限 T
 * @param maxT 坐标系可视 x 范围上界（用于比例尺）
 */
export function drawImproperIntegral(
  canvas: HTMLCanvasElement,
  fn: Fn,
  upper: number,
  maxT: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const padL = 46
  const padB = 34
  const x0 = START_A
  const x1 = maxT
  const yMax = 1.15
  const sx = (x: number) => padL + ((x - x0) / (x1 - x0)) * (W - padL - 12)
  const sy = (y: number) => H - padB - (y / yMax) * (H - padB - 16)

  // 坐标轴
  ctx.strokeStyle = '#94a3b8'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padL, 12)
  ctx.lineTo(padL, H - padB)
  ctx.lineTo(W - 8, H - padB)
  ctx.stroke()

  // 阴影面积（从 a 到 upper）
  ctx.beginPath()
  ctx.moveTo(sx(x0), sy(0))
  const N = 300
  for (let i = 0; i <= N; i++) {
    const x = x0 + ((upper - x0) * i) / N
    ctx.lineTo(sx(x), sy(Math.min(fn(x), yMax)))
  }
  ctx.lineTo(sx(upper), sy(0))
  ctx.closePath()
  ctx.fillStyle = 'rgba(99,102,241,0.28)'
  ctx.fill()

  // 曲线（整段可视范围）
  ctx.beginPath()
  ctx.strokeStyle = '#6366f1'
  ctx.lineWidth = 2
  for (let i = 0; i <= N; i++) {
    const x = x0 + ((x1 - x0) * i) / N
    const py = sy(Math.min(fn(x), yMax))
    if (i === 0) ctx.moveTo(sx(x), py)
    else ctx.lineTo(sx(x), py)
  }
  ctx.stroke()

  // 上限竖线 T
  ctx.strokeStyle = '#ec4899'
  ctx.setLineDash([5, 4])
  ctx.beginPath()
  ctx.moveTo(sx(upper), 12)
  ctx.lineTo(sx(upper), H - padB)
  ctx.stroke()
  ctx.setLineDash([])

  // 文字：当前面积
  const area = integrate(fn, x0, upper, 2000)
  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 15px system-ui, sans-serif'
  ctx.fillText(`T = ${upper.toFixed(1)}`, sx(upper) - 20, 26)
  ctx.fillText(`面积 ≈ ${area.toFixed(4)}`, padL + 8, 24)
}
