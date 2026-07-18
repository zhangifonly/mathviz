/**
 * 反向传播 Canvas 绘制：网络结构 + 前向激活 + 反向梯度流 + 损失曲线
 */
import { forward, type Network, type Grads } from './backpropagation'

interface Node { x: number; y: number }

function layout(W: number, H: number) {
  const netH = H * 0.62
  const inN: Node[] = [{ x: W * 0.16, y: netH * 0.35 }, { x: W * 0.16, y: netH * 0.65 }]
  const hidN: Node[] = [{ x: W * 0.5, y: netH * 0.3 }, { x: W * 0.5, y: netH * 0.7 }]
  const outN: Node[] = [{ x: W * 0.84, y: netH * 0.5 }]
  return { inN, hidN, outN, netH }
}

function edge(ctx: CanvasRenderingContext2D, a: Node, b: Node, w: number, grad: number) {
  ctx.lineWidth = Math.min(6, 1 + Math.abs(w) * 2.5)
  ctx.strokeStyle = grad > 0 ? 'rgba(239,68,68,0.85)' : grad < 0 ? 'rgba(59,130,246,0.85)' : 'rgba(148,163,184,0.6)'
  ctx.beginPath()
  ctx.moveTo(a.x, a.y)
  ctx.lineTo(b.x, b.y)
  ctx.stroke()
}

function dot(ctx: CanvasRenderingContext2D, n: Node, act: number, label: string) {
  ctx.fillStyle = `rgb(99,${Math.round(80 + act * 150)},241)`
  ctx.beginPath()
  ctx.arc(n.x, n.y, 20, 0, 2 * Math.PI)
  ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 12px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, n.x, n.y)
}

export function drawBackpropagation(
  canvas: HTMLCanvasElement,
  net: Network,
  input: number[],
  target: number,
  grads: Grads | null,
  losses: number[],
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  const { inN, hidN, outN, netH } = layout(W, H)
  const f = forward(net, input)

  // 连线：宽度=权重大小，颜色=梯度方向（红=正需减小，蓝=负）
  for (let j = 0; j < 2; j++)
    for (let i = 0; i < 2; i++)
      edge(ctx, inN[i], hidN[j], net.w1[j][i], grads ? grads.dw1[j][i] : 0)
  for (let j = 0; j < 2; j++)
    edge(ctx, hidN[j], outN[0], net.w2[j], grads ? grads.dw2[j] : 0)

  // 节点：亮度=激活值
  dot(ctx, inN[0], input[0], input[0].toFixed(0))
  dot(ctx, inN[1], input[1], input[1].toFixed(0))
  dot(ctx, hidN[0], f.a1[0], f.a1[0].toFixed(2))
  dot(ctx, hidN[1], f.a1[1], f.a1[1].toFixed(2))
  dot(ctx, outN[0], f.a2, f.a2.toFixed(2))

  ctx.fillStyle = '#0f172a'
  ctx.font = '12px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(`目标 ${target} · 输出 ${f.a2.toFixed(3)}`, outN[0].x, outN[0].y + 40)
  ctx.fillText('输入', inN[0].x, 14)
  ctx.fillText('隐藏层', hidN[0].x, 14)
  ctx.fillText('输出', outN[0].x, 14)
  drawLoss(ctx, losses, W, netH, H)
}

function drawLoss(ctx: CanvasRenderingContext2D, losses: number[], W: number, top: number, H: number) {
  const pad = 40
  const y0 = top + 20
  const y1 = H - 16
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(pad, y0); ctx.lineTo(pad, y1); ctx.lineTo(W - 16, y1)
  ctx.stroke()
  ctx.fillStyle = '#64748b'
  ctx.font = '11px sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('损失曲线', pad + 4, y0 + 4)
  if (losses.length < 2) return
  const max = Math.max(...losses, 0.01)
  ctx.strokeStyle = '#8b5cf6'; ctx.lineWidth = 2
  ctx.beginPath()
  losses.forEach((l, i) => {
    const x = pad + (i / (losses.length - 1)) * (W - 16 - pad)
    const y = y1 - (l / max) * (y1 - y0)
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
  })
  ctx.stroke()
}
