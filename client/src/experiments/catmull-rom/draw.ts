/**
 * Catmull-Rom 样条 Canvas 绘制
 * 画控制点 + 过点的 Catmull-Rom 曲线，并可叠加不过点的 B 样条做对比。
 */
import { catmullRomCurve, type Point } from './catmullRom'
import { bsplineCurve, DEGREE } from '../b-spline/bSpline'

function stroke(ctx: CanvasRenderingContext2D, pts: Point[], color: string, width: number) {
  if (pts.length < 2) return
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.beginPath()
  ctx.moveTo(pts[0].x, pts[0].y)
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y)
  ctx.stroke()
}

/**
 * 绘制 Catmull-Rom 样条。
 * @param samples 每段采样数
 * @param showBSpline 是否叠加 B 样条对比曲线
 * @param hover 高亮的控制点索引（-1 表示无）
 */
export function drawCatmullRom(
  canvas: HTMLCanvasElement,
  points: Point[],
  samples: number,
  showBSpline = true,
  hover = -1,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // 控制多边形（浅灰虚线）
  ctx.setLineDash([6, 6])
  stroke(ctx, points, '#cbd5e1', 1.5)
  ctx.setLineDash([])

  // 对比：不过点的 B 样条（橙色，半透明）
  if (showBSpline && points.length > DEGREE) {
    stroke(ctx, bsplineCurve(points, DEGREE, samples * (points.length - 1)), 'rgba(251,146,60,0.7)', 2.5)
  }

  // 主角：过点的 Catmull-Rom 样条（靛蓝）
  stroke(ctx, catmullRomCurve(points, samples), '#6366f1', 3)

  // 控制点
  for (let i = 0; i < points.length; i++) {
    const p = points[i]
    ctx.beginPath()
    ctx.arc(p.x, p.y, i === hover ? 8 : 5.5, 0, 2 * Math.PI)
    ctx.fillStyle = i === hover ? '#ec4899' : '#0f172a'
    ctx.fill()
    ctx.lineWidth = 2
    ctx.strokeStyle = '#ffffff'
    ctx.stroke()
  }
}
