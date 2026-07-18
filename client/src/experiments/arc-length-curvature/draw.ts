/**
 * 弧长与曲率 Canvas 绘制：画曲线 + 某点密切圆 + 切向/法向。
 */
import {
  osculatingCenter, radiusOfCurvature, unitTangent, unitNormal, type ParamCurve,
} from './arcLengthCurvature'

/** 世界坐标 → 画布坐标（scale 像素/单位，中心为原点） */
function project(w: number, h: number, scale: number, wx: number, wy: number): [number, number] {
  return [w / 2 + wx * scale, h / 2 - wy * scale]
}

export function drawArcLengthCurvature(
  canvas: HTMLCanvasElement,
  curve: ParamCurve,
  t: number,
  scale = 60,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, W, H)

  // 坐标轴
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2)
  ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H)
  ctx.stroke()

  // 曲线
  ctx.strokeStyle = '#6366f1'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  const steps = 600
  for (let i = 0; i <= steps; i++) {
    const tt = curve.tMin + (curve.tMax - curve.tMin) * (i / steps)
    const [px, py] = project(W, H, scale, curve.x(tt), curve.y(tt))
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py)
  }
  ctx.stroke()

  const [wx, wy] = [curve.x(t), curve.y(t)]
  const [px, py] = project(W, H, scale, wx, wy)

  // 密切圆（曲率圆）
  const r = radiusOfCurvature(curve, t)
  if (isFinite(r) && r * scale < 6000) {
    const [cx, cy] = osculatingCenter(curve, t)
    const [pcx, pcy] = project(W, H, scale, cx, cy)
    ctx.strokeStyle = '#ec4899'
    ctx.lineWidth = 1.8
    ctx.beginPath()
    ctx.arc(pcx, pcy, r * scale, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.fillStyle = '#ec4899'
    ctx.beginPath(); ctx.arc(pcx, pcy, 3, 0, 2 * Math.PI); ctx.fill()
  }

  // 切向量（绿）与法向量（橙）
  const [tx, ty] = unitTangent(curve, t)
  const [nx, ny] = unitNormal(curve, t)
  drawArrow(ctx, px, py, tx * scale, -ty * scale, '#22c55e')
  drawArrow(ctx, px, py, nx * scale, -ny * scale, '#f59e0b')

  // 当前点
  ctx.fillStyle = '#0f172a'
  ctx.beginPath(); ctx.arc(px, py, 5, 0, 2 * Math.PI); ctx.fill()
}

function drawArrow(
  ctx: CanvasRenderingContext2D, x: number, y: number, dx: number, dy: number, color: string,
) {
  const ex = x + dx
  const ey = y + dy
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = 2.5
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, ey); ctx.stroke()
  const ang = Math.atan2(dy, dx)
  ctx.beginPath()
  ctx.moveTo(ex, ey)
  ctx.lineTo(ex - 9 * Math.cos(ang - 0.4), ey - 9 * Math.sin(ang - 0.4))
  ctx.lineTo(ex - 9 * Math.cos(ang + 0.4), ey - 9 * Math.sin(ang + 0.4))
  ctx.closePath(); ctx.fill()
}
