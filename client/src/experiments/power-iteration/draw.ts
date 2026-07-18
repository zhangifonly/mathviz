/**
 * 幂迭代 Canvas 绘制
 * 在单位圆上画出每步归一化向量的箭头，颜色由暗到亮表示迭代推进，
 * 直观展示向量逐步转向主特征向量方向。
 */
import { powerIteration, type Matrix2, type Vec2 } from './powerIteration'

function arrow(ctx: CanvasRenderingContext2D, ox: number, oy: number, x: number, y: number) {
  ctx.beginPath()
  ctx.moveTo(ox, oy)
  ctx.lineTo(x, y)
  ctx.stroke()
  const ang = Math.atan2(y - oy, x - ox)
  const h = 9
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x - h * Math.cos(ang - 0.4), y - h * Math.sin(ang - 0.4))
  ctx.lineTo(x - h * Math.cos(ang + 0.4), y - h * Math.sin(ang + 0.4))
  ctx.closePath()
  ctx.fill()
}

/**
 * 绘制幂迭代过程。
 * @param matrix 2x2 矩阵
 * @param v0 初始向量
 * @param upTo 只画到第几步（含），用于单步演示
 * @param iters 总迭代步数
 */
export function drawPowerIteration(
  canvas: HTMLCanvasElement,
  matrix: Matrix2,
  v0: Vec2,
  upTo: number,
  iters = 24,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  const cx = W / 2
  const cy = H / 2
  const R = Math.min(W, H) * 0.38
  ctx.clearRect(0, 0, W, H)

  // 单位圆
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.arc(cx, cy, R, 0, 2 * Math.PI)
  ctx.stroke()
  // 坐标轴
  ctx.strokeStyle = '#e2e8f0'
  ctx.beginPath()
  ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy)
  ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R)
  ctx.stroke()

  const steps = powerIteration(matrix, v0, iters)
  const shown = Math.max(0, Math.min(upTo, steps.length - 1))
  for (let i = 0; i <= shown; i++) {
    const v = steps[i].vector
    const px = cx + v[0] * R
    const py = cy - v[1] * R
    const isLast = i === shown
    const t = shown === 0 ? 1 : i / shown
    if (isLast) {
      ctx.strokeStyle = '#4f46e5'
      ctx.fillStyle = '#4f46e5'
      ctx.lineWidth = 3
    } else {
      const g = Math.round(160 - t * 120)
      ctx.strokeStyle = `rgb(${g},${g},220)`
      ctx.fillStyle = `rgb(${g},${g},220)`
      ctx.lineWidth = 1.5
    }
    arrow(ctx, cx, cy, px, py)
  }
}
