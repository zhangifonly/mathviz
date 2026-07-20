/**
 * 凸包 Canvas 绘制：散点 + 凸包多边形（橡皮筋轮廓）
 */
import { convexHull, type Point } from './convexHull'

/**
 * 绘制散点与凸包。
 * @param showHull 是否画出凸包多边形与顶点高亮
 */
export function drawConvexHull(
  canvas: HTMLCanvasElement,
  points: Point[],
  showHull = true,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  if (showHull && points.length >= 3) {
    const hull = convexHull(points)
    if (hull.length >= 3) {
      ctx.beginPath()
      ctx.moveTo(hull[0].x, hull[0].y)
      for (let i = 1; i < hull.length; i++) ctx.lineTo(hull[i].x, hull[i].y)
      ctx.closePath()
      ctx.fillStyle = 'rgba(99, 102, 241, 0.12)'
      ctx.fill()
      ctx.strokeStyle = '#6366f1'
      ctx.lineWidth = 2.5
      ctx.stroke()
    }
    // 凸包顶点高亮
    ctx.fillStyle = '#ec4899'
    for (const p of hull) {
      ctx.beginPath()
      ctx.arc(p.x, p.y, 6, 0, 2 * Math.PI)
      ctx.fill()
    }
  }

  // 全部散点
  ctx.fillStyle = '#0f172a'
  for (const p of points) {
    ctx.beginPath()
    ctx.arc(p.x, p.y, 3.5, 0, 2 * Math.PI)
    ctx.fill()
  }
}
