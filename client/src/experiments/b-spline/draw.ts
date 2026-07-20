/**
 * B 样条曲线 Canvas 绘制：控制多边形 + B 样条曲线 + 基函数图
 */
import { bsplineCurve, uniformKnots, basisFunction, type Point } from './bSpline'

const CURVE_H_RATIO = 0.7 // 上方 70% 画曲线，下方 30% 画基函数

/** 绘制控制多边形与控制点 */
function drawControls(ctx: CanvasRenderingContext2D, pts: Point[], highlight: number) {
  ctx.strokeStyle = '#cbd5e1'
  ctx.setLineDash([6, 5])
  ctx.lineWidth = 1.5
  ctx.beginPath()
  pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)))
  ctx.stroke()
  ctx.setLineDash([])
  pts.forEach((p, i) => {
    ctx.beginPath()
    ctx.arc(p.x, p.y, i === highlight ? 8 : 5.5, 0, 2 * Math.PI)
    ctx.fillStyle = i === highlight ? '#ec4899' : '#6366f1'
    ctx.fill()
    ctx.fillStyle = '#475569'
    ctx.font = '11px sans-serif'
    ctx.fillText('P' + i, p.x + 8, p.y - 8)
  })
}

/** 绘制下方基函数图（每个控制点一条曲线） */
function drawBasis(ctx: CanvasRenderingContext2D, W: number, H: number, n: number, degree: number) {
  const top = H * CURVE_H_RATIO + 10
  const h = H - top - 12
  const knots = uniformKnots(n, degree)
  const uMax = knots[n]
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  ctx.strokeRect(0, top, W, h)
  const palette = ['#6366f1', '#ec4899', '#22d3ee', '#a3e635', '#fbbf24', '#f87171', '#34d399', '#a78bfa']
  for (let i = 0; i < n; i++) {
    ctx.strokeStyle = palette[i % palette.length]
    ctx.lineWidth = 1.6
    ctx.beginPath()
    for (let s = 0; s <= 160; s++) {
      const u = (s / 160) * uMax * 0.99999
      const v = basisFunction(i, degree, knots, u)
      const px = (u / uMax) * W
      const py = top + h - v * h
      if (s === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()
  }
}

/**
 * 绘制完整 B 样条视图。
 * @param highlight 高亮的控制点下标（-1 表示不高亮）
 * @param showBasis 是否绘制下方基函数图
 */
export function drawBSpline(
  canvas: HTMLCanvasElement,
  controlPoints: Point[],
  degree: number,
  highlight = -1,
  showBasis = true,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  drawControls(ctx, controlPoints, highlight)

  const curve = bsplineCurve(controlPoints, degree, 200)
  ctx.strokeStyle = '#4f46e5'
  ctx.lineWidth = 3
  ctx.beginPath()
  curve.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)))
  ctx.stroke()

  if (showBasis) drawBasis(ctx, W, H, controlPoints.length, degree)
}
