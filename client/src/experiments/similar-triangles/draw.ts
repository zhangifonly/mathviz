/**
 * 相似三角形 Canvas 绘制
 */
import type { SimilarData, Point } from './similarTriangles'

const BASE_COLOR = '#38bdf8'
const SCALED_COLOR = '#f472b6'
const VERTEX_LABELS = ['A', 'B', 'C']

/** 把 world 坐标映射到画布像素坐标 */
function makeTransform(canvas: HTMLCanvasElement, data: SimilarData) {
  const pts = [...data.base, ...data.scaled]
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const p of pts) {
    minX = Math.min(minX, p.x)
    minY = Math.min(minY, p.y)
    maxX = Math.max(maxX, p.x)
    maxY = Math.max(maxY, p.y)
  }
  const pad = 60
  const w = canvas.width - pad * 2
  const h = canvas.height - pad * 2
  const spanX = maxX - minX || 1
  const spanY = maxY - minY || 1
  const scale = Math.min(w / spanX, h / spanY)
  const offX = pad + (w - spanX * scale) / 2
  const offY = pad + (h - spanY * scale) / 2
  // y 轴翻转，使数学坐标向上为正
  return (p: Point) => ({
    x: offX + (p.x - minX) * scale,
    y: canvas.height - (offY + (p.y - minY) * scale),
  })
}

function drawTriangle(
  ctx: CanvasRenderingContext2D,
  tri: { x: number; y: number }[],
  color: string,
  alpha: number,
  labels: boolean,
) {
  ctx.globalAlpha = alpha
  ctx.beginPath()
  ctx.moveTo(tri[0].x, tri[0].y)
  ctx.lineTo(tri[1].x, tri[1].y)
  ctx.lineTo(tri[2].x, tri[2].y)
  ctx.closePath()
  ctx.fillStyle = color + '33'
  ctx.fill()
  ctx.strokeStyle = color
  ctx.lineWidth = 2.5
  ctx.stroke()

  ctx.fillStyle = color
  for (let i = 0; i < 3; i++) {
    ctx.beginPath()
    ctx.arc(tri[i].x, tri[i].y, 4, 0, Math.PI * 2)
    ctx.fill()
    if (labels) {
      ctx.font = 'bold 15px sans-serif'
      ctx.fillText(VERTEX_LABELS[i], tri[i].x + 8, tri[i].y - 8)
    }
  }
  ctx.globalAlpha = 1
}

/**
 * 绘制基准三角形与相似三角形。
 * @param progress 0→1，相似三角形从基准逐渐生长到目标大小
 */
export function drawSimilarTriangles(
  canvas: HTMLCanvasElement,
  data: SimilarData,
  progress: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const t = makeTransform(canvas, data)
  const base = data.base.map(t)
  drawTriangle(ctx, base, BASE_COLOR, 1, true)

  // 相似三角形在 base 与目标 scaled 之间按 progress 插值
  const p = Math.max(0, Math.min(1, progress))
  const grown = data.base.map((bp, i) => ({
    x: bp.x + (data.scaled[i].x - bp.x) * p,
    y: bp.y + (data.scaled[i].y - bp.y) * p,
  }))
  drawTriangle(ctx, grown.map(t), SCALED_COLOR, 0.9, false)

  // 顶部标注相似比与面积比
  ctx.fillStyle = '#e2e8f0'
  ctx.font = '14px sans-serif'
  ctx.fillText(`相似比 k = ${data.k}`, 16, 24)
  ctx.fillText(`面积比 = ${data.areaRatio.toFixed(2)} (= k 的平方)`, 16, 44)
}
