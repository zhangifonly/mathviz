/**
 * 科赫雪花 Canvas 绘制（描出迭代 n 层的雪花轮廓并填充）
 */
import { snowflake, type Point } from './kochSnowflake'

function tracePath(ctx: CanvasRenderingContext2D, pts: Point[]) {
  ctx.beginPath()
  ctx.moveTo(pts[0].x, pts[0].y)
  for (let i = 1; i < pts.length; i++) {
    ctx.lineTo(pts[i].x, pts[i].y)
  }
  ctx.closePath()
}

/**
 * 绘制迭代 n 层的科赫雪花。
 * @param n 迭代层数
 * @param fill 是否填充内部
 */
export function drawKochSnowflake(
  canvas: HTMLCanvasElement,
  n: number,
  fill = true,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const r = Math.min(W, H) * 0.42
  // 外接圆心略下移，让雪花在画布里居中
  const pts = snowflake(W / 2, H / 2 + r * 0.15, r, n)

  tracePath(ctx, pts)
  if (fill) {
    const grad = ctx.createLinearGradient(0, 0, W, H)
    grad.addColorStop(0, '#a5f3fc')
    grad.addColorStop(1, '#818cf8')
    ctx.fillStyle = grad
    ctx.fill()
  }
  ctx.lineWidth = 1.6
  ctx.strokeStyle = '#1e3a8a'
  ctx.lineJoin = 'round'
  ctx.stroke()
}
