/**
 * 大数定律 Canvas 绘制
 * 画累计样本均值曲线随 n 收敛到期望水平线，可叠加多条随机轨迹。
 */
import { meanTrajectory, getDistribution } from './lawLargeNumbers'

const TRACE_COLORS = ['#6366f1', '#ec4899', '#22d3ee', '#fbbf24', '#34d399']

/**
 * 绘制若干条累计均值轨迹 + 期望水平线。
 * @param traces 轨迹条数（不同种子）
 */
export function drawLawLargeNumbers(
  canvas: HTMLCanvasElement,
  distId: string,
  n: number,
  traces = 3,
  baseSeed = 1,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const dist = getDistribution(distId)
  const pad = { l: 44, r: 16, t: 16, b: 28 }
  const plotW = W - pad.l - pad.r
  const plotH = H - pad.t - pad.b

  // 纵轴范围：围绕期望上下取一段，骰子用 1~6，其余用 0~1
  const isDice = dist.id === 'dice'
  const yMin = isDice ? 1 : 0
  const yMax = isDice ? 6 : 1
  const toY = (v: number) => pad.t + plotH * (1 - (v - yMin) / (yMax - yMin))
  const toX = (i: number) => pad.l + plotW * (i / (n - 1 || 1))

  // 背景网格
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  ctx.fillStyle = '#64748b'
  ctx.font = '11px sans-serif'
  for (let g = 0; g <= 5; g++) {
    const v = yMin + ((yMax - yMin) * g) / 5
    const y = toY(v)
    ctx.beginPath()
    ctx.moveTo(pad.l, y)
    ctx.lineTo(W - pad.r, y)
    ctx.stroke()
    ctx.fillText(v.toFixed(isDice ? 1 : 2), 6, y + 4)
  }

  // 期望水平线（红色虚线）
  const meanY = toY(dist.mean)
  ctx.strokeStyle = '#ef4444'
  ctx.lineWidth = 2
  ctx.setLineDash([6, 4])
  ctx.beginPath()
  ctx.moveTo(pad.l, meanY)
  ctx.lineTo(W - pad.r, meanY)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = '#ef4444'
  ctx.fillText('E[X] = ' + dist.mean, W - pad.r - 78, meanY - 6)

  // 多条累计均值轨迹
  for (let t = 0; t < traces; t++) {
    const traj = meanTrajectory(distId, n, baseSeed + t * 7919)
    ctx.strokeStyle = TRACE_COLORS[t % TRACE_COLORS.length]
    ctx.lineWidth = 1.6
    ctx.beginPath()
    for (let i = 0; i < traj.length; i++) {
      const x = toX(i)
      const y = toY(traj[i])
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  // 轴标签
  ctx.fillStyle = '#334155'
  ctx.fillText('样本量 n = ' + n, pad.l, H - 8)
}
