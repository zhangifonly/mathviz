/**
 * 最小二乘法 Canvas 绘制：散点 + 拟合直线 + 竖直残差线段
 */
import { fitLine, rSquared, type Point } from './leastSquares'

const PAD = 40
const DOM_X = 100 // 数据 x 范围 0..100
const DOM_Y = 110 // 数据 y 范围 0..110

/** 把数据坐标映射到画布像素坐标（y 轴翻转） */
function project(canvas: HTMLCanvasElement, x: number, y: number): [number, number] {
  const w = canvas.width - PAD * 2
  const h = canvas.height - PAD * 2
  return [PAD + (x / DOM_X) * w, canvas.height - PAD - (y / DOM_Y) * h]
}

/**
 * 绘制散点、最小二乘拟合直线与残差竖直线段。
 * @param showResiduals 是否画出每个点到直线的红色残差线段
 * @param showLine 是否画出拟合直线
 */
export function drawLeastSquares(
  canvas: HTMLCanvasElement,
  points: Point[],
  showResiduals = true,
  showLine = true,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx || points.length === 0) return
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // 坐标轴
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1
  ctx.beginPath()
  const [ox, oy] = project(canvas, 0, 0)
  ctx.moveTo(ox, oy)
  ctx.lineTo(canvas.width - PAD, oy)
  ctx.moveTo(ox, oy)
  ctx.lineTo(ox, PAD)
  ctx.stroke()

  const line = fitLine(points)

  // 残差竖直线段
  if (showResiduals && showLine) {
    ctx.strokeStyle = 'rgba(239,68,68,0.55)'
    ctx.lineWidth = 1.5
    for (const p of points) {
      const pred = line.slope * p.x + line.intercept
      const [px, py] = project(canvas, p.x, p.y)
      const [, py2] = project(canvas, p.x, pred)
      ctx.beginPath()
      ctx.moveTo(px, py)
      ctx.lineTo(px, py2)
      ctx.stroke()
    }
  }

  // 拟合直线
  if (showLine) {
    ctx.strokeStyle = '#6366f1'
    ctx.lineWidth = 2.5
    const [x1, y1] = project(canvas, 0, line.intercept)
    const [x2, y2] = project(canvas, DOM_X, line.slope * DOM_X + line.intercept)
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }

  // 散点
  ctx.fillStyle = '#0f172a'
  for (const p of points) {
    const [px, py] = project(canvas, p.x, p.y)
    ctx.beginPath()
    ctx.arc(px, py, 3.5, 0, 2 * Math.PI)
    ctx.fill()
  }

  // 拟合信息
  if (showLine) {
    const r2 = rSquared(points, line)
    ctx.fillStyle = '#475569'
    ctx.font = '14px sans-serif'
    const b = line.intercept
    ctx.fillText(
      `y = ${line.slope.toFixed(2)}x ${b >= 0 ? '+' : '-'} ${Math.abs(b).toFixed(1)}   R² = ${r2.toFixed(3)}`,
      PAD + 6,
      PAD - 12,
    )
  }
}
