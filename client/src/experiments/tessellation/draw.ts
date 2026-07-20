/**
 * 密铺镶嵌 Canvas 绘制（每个多边形不同色）
 */
import { tilingCells, type TilingType } from './tessellation'

/**
 * 绘制指定类型的正多边形密铺图案，铺满画布。
 */
export function drawTessellation(
  canvas: HTMLCanvasElement,
  type: TilingType,
  size = 40,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  // 多铺几圈以保证覆盖整个画布
  const cols = Math.ceil(W / size) + 3
  const rows = Math.ceil(H / size) + 3
  const cells = tilingCells(type, cols, rows, size)

  ctx.lineJoin = 'round'
  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth = 1.2

  for (const cell of cells) {
    ctx.beginPath()
    const pts = cell.points
    ctx.moveTo(pts[0].x, pts[0].y)
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i].x, pts[i].y)
    }
    ctx.closePath()
    ctx.fillStyle = cell.color
    ctx.globalAlpha = 0.75
    ctx.fill()
    ctx.globalAlpha = 1
    ctx.stroke()
  }
}
