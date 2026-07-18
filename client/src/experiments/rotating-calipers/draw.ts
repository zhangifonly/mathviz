/**
 * 旋转卡壳 Canvas 绘制：散点 + 凸包 + 直径线段 + 最小外接矩形
 */
import { convexHull, diameter, minAreaRect, type Point } from './rotatingCalipers'

export function drawRotatingCalipers(
  canvas: HTMLCanvasElement,
  points: Point[],
  opts: { showRect?: boolean; showDiameter?: boolean } = {},
) {
  const ctx = canvas.getContext('2d')
  if (!ctx || points.length === 0) return
  const { showRect = true, showDiameter = true } = opts
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  const hull = convexHull(points)

  // 最小外接矩形
  if (showRect && hull.length >= 3) {
    const { corners } = minAreaRect(hull)
    ctx.beginPath()
    ctx.moveTo(corners[0].x, corners[0].y)
    for (let i = 1; i < corners.length; i++) ctx.lineTo(corners[i].x, corners[i].y)
    ctx.closePath()
    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = 2
    ctx.setLineDash([6, 4])
    ctx.stroke()
    ctx.setLineDash([])
  }

  // 凸包
  if (hull.length >= 3) {
    ctx.beginPath()
    ctx.moveTo(hull[0].x, hull[0].y)
    for (let i = 1; i < hull.length; i++) ctx.lineTo(hull[i].x, hull[i].y)
    ctx.closePath()
    ctx.fillStyle = 'rgba(99,102,241,0.12)'
    ctx.fill()
    ctx.strokeStyle = '#6366f1'
    ctx.lineWidth = 2
    ctx.stroke()
  }

  // 直径线段（对踵点对）
  if (showDiameter && hull.length >= 2) {
    const { a, b } = diameter(hull)
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.strokeStyle = '#ec4899'
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.fillStyle = '#ec4899'
    for (const p of [a, b]) {
      ctx.beginPath()
      ctx.arc(p.x, p.y, 6, 0, 2 * Math.PI)
      ctx.fill()
    }
  }

  // 散点
  ctx.fillStyle = '#0f172a'
  for (const p of points) {
    ctx.beginPath()
    ctx.arc(p.x, p.y, 3, 0, 2 * Math.PI)
    ctx.fill()
  }
}
