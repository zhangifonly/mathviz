/**
 * 列维C形曲线 Canvas 绘制
 * 计算曲线包围盒，缩放居中铺满画布，沿路径渐变着色。
 */
import { levyPoints, type Point } from './levyCCurve'

/**
 * 绘制指定阶数的列维C曲线。
 * @param order 递归阶数
 */
export function drawLevyCCurve(canvas: HTMLCanvasElement, order: number) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  // 初始水平线段，具体坐标无所谓，稍后按包围盒缩放
  const pts = levyPoints(order, { x: 0, y: 0 }, { x: 1, y: 0 })

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  for (const p of pts) {
    if (p.x < minX) minX = p.x
    if (p.x > maxX) maxX = p.x
    if (p.y < minY) minY = p.y
    if (p.y > maxY) maxY = p.y
  }
  const pad = 30
  const bw = maxX - minX || 1
  const bh = maxY - minY || 1
  const scale = Math.min((W - 2 * pad) / bw, (H - 2 * pad) / bh)
  const ox = (W - bw * scale) / 2 - minX * scale
  const oy = (H - bh * scale) / 2 - minY * scale
  const tx = (p: Point) => p.x * scale + ox
  const ty = (p: Point) => p.y * scale + oy

  ctx.lineWidth = 1
  ctx.lineJoin = 'round'
  const n = pts.length - 1
  for (let i = 0; i < n; i++) {
    const hue = Math.round((i / n) * 300)
    ctx.strokeStyle = `hsl(${hue}, 75%, 55%)`
    ctx.beginPath()
    ctx.moveTo(tx(pts[i]), ty(pts[i]))
    ctx.lineTo(tx(pts[i + 1]), ty(pts[i + 1]))
    ctx.stroke()
  }
}
