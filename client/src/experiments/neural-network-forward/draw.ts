/**
 * 神经网络前向传播 Canvas 绘制
 * 画出网络结构：神经元圆 + 连线。
 * 节点亮度 = 激活值，连线粗细/颜色 = 权重正负与大小。
 */
import { forward, layerSizes, type Layer } from './neuralNetworkForward'

interface Pos {
  x: number
  y: number
}

/** 计算每一层每个神经元的圆心坐标 */
function layout(sizes: number[], W: number, H: number): Pos[][] {
  const cols: Pos[][] = []
  const marginX = 90
  const gap = sizes.length > 1 ? (W - 2 * marginX) / (sizes.length - 1) : 0
  for (let l = 0; l < sizes.length; l++) {
    const n = sizes[l]
    const stepY = H / (n + 1)
    const col: Pos[] = []
    for (let j = 0; j < n; j++) col.push({ x: marginX + l * gap, y: stepY * (j + 1) })
    cols.push(col)
  }
  return cols
}

/**
 * 绘制网络。给定输入与层结构，先做前向传播拿到各层激活值。
 */
export function drawNeuralNetworkForward(
  canvas: HTMLCanvasElement,
  input: number[],
  layers: Layer[],
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const sizes = layerSizes(input, layers)
  const acts = forward(input, layers)
  const pos = layout(sizes, W, H)

  // 先画连线（权重）
  for (let l = 0; l < layers.length; l++) {
    const layer = layers[l]
    for (let j = 0; j < layer.weights.length; j++) {
      for (let i = 0; i < layer.weights[j].length; i++) {
        const w = layer.weights[j][i]
        const a = pos[l][i]
        const b = pos[l + 1][j]
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = w >= 0 ? 'rgba(59,130,246,0.65)' : 'rgba(244,63,94,0.65)'
        ctx.lineWidth = Math.min(6, 0.6 + Math.abs(w) * 1.8)
        ctx.stroke()
      }
    }
  }

  // 再画神经元圆（亮度 = 激活值）
  for (let l = 0; l < pos.length; l++) {
    for (let j = 0; j < pos[l].length; j++) {
      const p = pos[l][j]
      const v = acts[l][j]
      const t = Math.max(0, Math.min(1, v))
      const g = Math.round(80 + t * 175)
      ctx.beginPath()
      ctx.arc(p.x, p.y, 20, 0, 2 * Math.PI)
      ctx.fillStyle = `rgb(${Math.round(40 + t * 60)},${g},${Math.round(120 + t * 100)})`
      ctx.fill()
      ctx.lineWidth = 2
      ctx.strokeStyle = '#0f172a'
      ctx.stroke()
      ctx.fillStyle = t > 0.5 ? '#0f172a' : '#e2e8f0'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(v.toFixed(2), p.x, p.y)
    }
  }

  // 层标签
  const labels = ['输入层', ...layers.map((_, i) => (i === layers.length - 1 ? '输出层' : '隐藏层'))]
  ctx.fillStyle = '#475569'
  ctx.font = 'bold 14px sans-serif'
  for (let l = 0; l < pos.length; l++) {
    if (pos[l].length === 0) continue
    ctx.fillText(labels[l], pos[l][0].x, 22)
  }
}
