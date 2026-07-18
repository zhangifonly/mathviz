/**
 * 单摆相空间 Canvas 绘制
 * 横轴 theta (角度), 纵轴 omega (角速度)。
 * 画多条不同能量轨线, 并用虚线标出分界线(separatrix)。
 */
import { simulate, SEPARATRIX_ENERGY, type State } from './pendulumPhase'

const TH_MAX = Math.PI * 1.15
const OM_MAX = 9

function mapX(theta: number, W: number): number {
  return ((theta + TH_MAX) / (2 * TH_MAX)) * W
}
function mapY(omega: number, H: number): number {
  return H - ((omega + OM_MAX) / (2 * OM_MAX)) * H
}

function drawPath(ctx: CanvasRenderingContext2D, path: State[], W: number, H: number) {
  ctx.beginPath()
  path.forEach((s, i) => {
    const x = mapX(s.theta, W)
    const y = mapY(s.omega, H)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })
  ctx.stroke()
}

const COLORS = ['#22d3ee', '#34d399', '#a3e635', '#fbbf24', '#fb923c', '#f87171']

/**
 * 绘制相空间。
 * @param n 轨线数量(能量从低到高), highlight 高亮索引(-1 不高亮)
 */
export function drawPendulumPhase(
  canvas: HTMLCanvasElement,
  n = 6,
  highlight = -1,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  // 坐标轴
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, mapY(0, H)); ctx.lineTo(W, mapY(0, H))
  ctx.moveTo(mapX(0, W), 0); ctx.lineTo(mapX(0, W), H)
  ctx.stroke()

  // 分界线: 两支从鞍点(±pi,0)出发, 能量恰为 SEPARATRIX_ENERGY
  ctx.setLineDash([6, 5])
  ctx.strokeStyle = '#ef4444'
  ctx.lineWidth = 2
  drawPath(ctx, simulate(0, Math.sqrt(2 * SEPARATRIX_ENERGY) - 0.0005, 900, 0.01), W, H)
  drawPath(ctx, simulate(0, -(Math.sqrt(2 * SEPARATRIX_ENERGY) - 0.0005), 900, 0.01), W, H)
  ctx.setLineDash([])

  // 振荡轨线(闭合): 起始角度递增, 能量低于分界线
  for (let i = 0; i < n; i++) {
    const th0 = 0.35 + (i / n) * (Math.PI - 0.5)
    const path = simulate(th0, 0, 700, 0.012)
    ctx.strokeStyle = COLORS[i % COLORS.length]
    ctx.lineWidth = highlight === i ? 3.5 : 1.8
    ctx.globalAlpha = highlight === -1 || highlight === i ? 1 : 0.35
    drawPath(ctx, path, W, H)
  }

  // 翻转轨线(波浪线): 高能越顶
  for (let k = 0; k < 2; k++) {
    const om0 = Math.sqrt(2 * SEPARATRIX_ENERGY) + 0.9 + k * 1.3
    ctx.strokeStyle = '#a78bfa'
    ctx.lineWidth = 1.8
    ctx.globalAlpha = highlight === -1 ? 1 : 0.35
    drawPath(ctx, simulate(-TH_MAX, om0, 500, 0.012), W, H)
    drawPath(ctx, simulate(-TH_MAX, -om0, 500, 0.012), W, H)
  }
  ctx.globalAlpha = 1

  // 平衡点
  ctx.fillStyle = '#0f172a'
  ctx.beginPath()
  ctx.arc(mapX(0, W), mapY(0, H), 4, 0, 2 * Math.PI)
  ctx.fill()
}
