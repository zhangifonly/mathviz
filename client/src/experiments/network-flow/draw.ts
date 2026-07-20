/**
 * 最大流网络 Canvas 绘制
 * 画节点、带箭头的边（标注 流量/容量），高亮增广路径与最小割边。
 */
import { maxFlow, type FlowNetwork } from './networkFlow'

export interface DrawOptions {
  showFlow?: boolean          // 是否显示流量结果
  highlightCut?: boolean      // 是否高亮最小割边
}

function drawArrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
  const ang = Math.atan2(y2 - y1, x2 - x1)
  const shrink = 22
  const ex = x2 - Math.cos(ang) * shrink
  const ey = y2 - Math.sin(ang) * shrink
  const sx = x1 + Math.cos(ang) * shrink
  const sy = y1 + Math.sin(ang) * shrink
  ctx.beginPath()
  ctx.moveTo(sx, sy)
  ctx.lineTo(ex, ey)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(ex, ey)
  ctx.lineTo(ex - Math.cos(ang - 0.4) * 10, ey - Math.sin(ang - 0.4) * 10)
  ctx.lineTo(ex - Math.cos(ang + 0.4) * 10, ey - Math.sin(ang + 0.4) * 10)
  ctx.closePath()
  ctx.fill()
}

export function drawNetworkFlow(
  canvas: HTMLCanvasElement,
  net: FlowNetwork,
  opts: DrawOptions = {},
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const result = maxFlow(net)
  const cutEdges = new Set(opts.highlightCut ? result.minCutEdges : [])

  net.edges.forEach((e, i) => {
    const a = net.nodes[e.from]
    const b = net.nodes[e.to]
    const isCut = cutEdges.has(i)
    const f = result.flow[i]
    const active = opts.showFlow && f > 0
    ctx.strokeStyle = isCut ? '#ef4444' : active ? '#6366f1' : '#cbd5e1'
    ctx.fillStyle = ctx.strokeStyle
    ctx.lineWidth = isCut ? 4 : active ? 2 + (f / e.capacity) * 3 : 1.5
    drawArrow(ctx, a.x, a.y, b.x, b.y)

    const mx = (a.x + b.x) / 2
    const my = (a.y + b.y) / 2
    ctx.fillStyle = isCut ? '#dc2626' : '#334155'
    ctx.font = 'bold 13px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const label = opts.showFlow ? `${f}/${e.capacity}` : `${e.capacity}`
    ctx.fillText(label, mx, my - 10)
  })

  for (const node of net.nodes) {
    const isEnd = node.id === net.source || node.id === net.sink
    ctx.beginPath()
    ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI)
    ctx.fillStyle = node.id === net.source ? '#22c55e' : node.id === net.sink ? '#f97316' : '#e0e7ff'
    ctx.fill()
    ctx.lineWidth = 2
    ctx.strokeStyle = '#4338ca'
    ctx.stroke()
    ctx.fillStyle = isEnd ? '#ffffff' : '#3730a3'
    ctx.font = 'bold 15px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(node.label, node.x, node.y)
  }

  if (opts.showFlow) {
    ctx.fillStyle = '#0f172a'
    ctx.font = 'bold 18px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(`最大流 = ${result.value}`, 16, 26)
  }
}
