/**
 * K 近邻分类 Canvas 绘制
 * 背景：网格每点按 KNN 分类染色（决策区域）
 * 前景：训练点（按类染色）+ 查询点与其 k 近邻的连线
 */
import { classify, nearestK, CLASS_COLORS, type LabeledPoint } from './knn'

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export interface QueryPoint {
  x: number
  y: number
}

export function drawKnn(
  canvas: HTMLCanvasElement,
  train: LabeledPoint[],
  k: number,
  query: QueryPoint | null,
  step = 6,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx || train.length === 0) return
  const W = canvas.width
  const H = canvas.height
  const rgb = CLASS_COLORS.map(hexToRgb)

  // 决策区域：网格每点分类，填色块
  const img = ctx.createImageData(W, H)
  const data = img.data
  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) {
      const lab = classify(train, x, y, k)
      const [r, g, b] = rgb[lab] || [200, 200, 200]
      for (let dy = 0; dy < step && y + dy < H; dy++) {
        for (let dx = 0; dx < step && x + dx < W; dx++) {
          const p = ((y + dy) * W + (x + dx)) * 4
          data[p] = r
          data[p + 1] = g
          data[p + 2] = b
          data[p + 3] = 70
        }
      }
    }
  }
  ctx.putImageData(img, 0, 0)

  // 训练点
  for (const pt of train) {
    ctx.beginPath()
    ctx.arc(pt.x, pt.y, 5, 0, 2 * Math.PI)
    ctx.fillStyle = CLASS_COLORS[pt.label] || '#64748b'
    ctx.fill()
    ctx.lineWidth = 1.5
    ctx.strokeStyle = '#0f172a'
    ctx.stroke()
  }

  if (!query) return
  // 查询点到 k 近邻的连线
  const neighbors = nearestK(train, query.x, query.y, k)
  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth = 1.5
  for (const i of neighbors) {
    ctx.beginPath()
    ctx.moveTo(query.x, query.y)
    ctx.lineTo(train[i].x, train[i].y)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(train[i].x, train[i].y, 8, 0, 2 * Math.PI)
    ctx.stroke()
  }
  // 查询点（用预测类别描边的白心圆）
  const predicted = classify(train, query.x, query.y, k)
  ctx.beginPath()
  ctx.arc(query.x, query.y, 9, 0, 2 * Math.PI)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
  ctx.lineWidth = 4
  ctx.strokeStyle = CLASS_COLORS[predicted] || '#0f172a'
  ctx.stroke()
}
