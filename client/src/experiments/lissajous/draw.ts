/**
 * 居中参数曲线的通用 Canvas 绘制（利萨茹/玫瑰共用）
 */
import type { Point } from './lissajous'

export function drawFigure(canvas: HTMLCanvasElement, pts: Point[], progress: number) {
  const ctx = canvas.getContext('2d')
  if (!ctx || pts.length === 0) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#fafafa'
  ctx.fillRect(0, 0, W, H)

  // 居中等比缩放（图形对称，范围约 [-1,1]）
  const pad = 40
  const R = (Math.min(W, H) - 2 * pad) / 2
  const cx = W / 2
  const cy = H / 2
  const sx = (x: number) => cx + x * R
  const sy = (y: number) => cy - y * R

  // 坐标轴
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, cy); ctx.lineTo(W, cy)
  ctx.moveTo(cx, 0); ctx.lineTo(cx, H)
  ctx.stroke()

  // 描线
  const upto = Math.max(2, Math.floor(pts.length * progress))
  const grad = ctx.createLinearGradient(0, 0, W, H)
  grad.addColorStop(0, '#ec4899')
  grad.addColorStop(1, '#6366f1')
  ctx.strokeStyle = grad
  ctx.lineWidth = 2
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(sx(pts[0].x), sy(pts[0].y))
  for (let i = 1; i < upto; i++) ctx.lineTo(sx(pts[i].x), sy(pts[i].y))
  ctx.stroke()

  // 动点
  const head = pts[upto - 1]
  ctx.fillStyle = '#ef4444'
  ctx.beginPath()
  ctx.arc(sx(head.x), sy(head.y), 4, 0, 2 * Math.PI)
  ctx.fill()
}
