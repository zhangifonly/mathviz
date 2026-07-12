/**
 * 拉格朗日乘数法 Canvas 绘制
 *
 * 画面元素：
 *   - 目标 f 的等高线（一族平行直线，因为 f 线性）
 *   - 约束圆 g=0
 *   - 沿约束逐渐推进的相切点（progress 控制扫过的角度）
 *   - 切点处 ∇f 与 ∇g 两个平行梯度箭头
 */

import { solveCircle, gradObjective, gradConstraint, type Vec2 } from './lagrangeMultiplier'

export interface DrawData {
  a: number
  b: number
  r: number
}

const BG = '#0f172a'
const CIRCLE = '#38bdf8'
const CONTOUR = 'rgba(148,163,184,0.35)'
const TANGENT = '#fbbf24'
const GRAD_F = '#f472b6'
const GRAD_G = '#4ade80'
const POINT = '#facc15'

function drawArrow(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: string,
) {
  const head = 10
  const ang = Math.atan2(y1 - y0, x1 - x0)
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(x0, y0)
  ctx.lineTo(x1, y1)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x1 - head * Math.cos(ang - Math.PI / 6), y1 - head * Math.sin(ang - Math.PI / 6))
  ctx.lineTo(x1 - head * Math.cos(ang + Math.PI / 6), y1 - head * Math.sin(ang + Math.PI / 6))
  ctx.closePath()
  ctx.fill()
}

/**
 * @param progress 0→1，从初始角扫到解析最大值点的角度
 */
export function drawLagrangeMultiplier(
  canvas: HTMLCanvasElement,
  data: DrawData,
  progress: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = BG
  ctx.fillRect(0, 0, W, H)

  const cx = W / 2
  const cy = H / 2
  const scale = Math.min(W, H) / (data.r * 3)
  // 世界坐标 → 屏幕坐标（y 轴翻转）
  const sx = (x: number) => cx + x * scale
  const sy = (y: number) => cy - y * scale

  // 坐标轴
  ctx.strokeStyle = 'rgba(148,163,184,0.25)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, cy)
  ctx.lineTo(W, cy)
  ctx.moveTo(cx, 0)
  ctx.lineTo(cx, H)
  ctx.stroke()

  // 约束圆
  ctx.strokeStyle = CIRCLE
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.arc(cx, cy, data.r * scale, 0, Math.PI * 2)
  ctx.stroke()

  const sol = solveCircle(data.a, data.b, data.r, 'max')
  const gf = gradObjective(data.a, data.b) as Vec2
  const n = Math.hypot(gf[0], gf[1]) || 1
  // 目标等高线方向：垂直于梯度 (a,b)，即方向 (-b, a)
  const dirX = -gf[1] / n
  const dirY = gf[0] / n

  // 一族平行等高线（沿梯度方向平移）
  ctx.strokeStyle = CONTOUR
  ctx.lineWidth = 1.5
  const span = data.r * 2.4
  for (let k = -3; k <= 3; k++) {
    const off = (k / 3) * data.r * 1.6
    const px = (gf[0] / n) * off
    const py = (gf[1] / n) * off
    ctx.beginPath()
    ctx.moveTo(sx(px - dirX * span), sy(py - dirY * span))
    ctx.lineTo(sx(px + dirX * span), sy(py + dirY * span))
    ctx.stroke()
  }

  // 扫动切点：从角 startAng 推进到解的角度
  const startAng = sol.angle + Math.PI * 0.9
  const curAng = startAng + (sol.angle - startAng) * progress
  const px = data.r * Math.cos(curAng)
  const py = data.r * Math.sin(curAng)

  // 当前点处的目标等高线（高亮）
  ctx.strokeStyle = TANGENT
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(sx(px - dirX * span), sy(py - dirY * span))
  ctx.lineTo(sx(px + dirX * span), sy(py + dirY * span))
  ctx.stroke()

  // 两个梯度箭头（切点处）
  const arrowLen = data.r * 0.7 * scale
  const gg = gradConstraint(px, py) as Vec2
  const gn = Math.hypot(gg[0], gg[1]) || 1
  drawArrow(ctx, sx(px), sy(py), sx(px) + (gg[0] / gn) * arrowLen, sy(py) - (gg[1] / gn) * arrowLen, GRAD_G)
  drawArrow(ctx, sx(px), sy(py), sx(px) + (gf[0] / n) * arrowLen, sy(py) - (gf[1] / n) * arrowLen, GRAD_F)

  // 切点
  ctx.fillStyle = POINT
  ctx.beginPath()
  ctx.arc(sx(px), sy(py), 6, 0, Math.PI * 2)
  ctx.fill()

  // 收敛时标注解点
  if (progress > 0.98) {
    ctx.fillStyle = '#e2e8f0'
    ctx.font = '14px sans-serif'
    ctx.fillText(`最大值 ${sol.value.toFixed(3)}`, sx(px) + 12, sy(py) - 12)
  }
}
