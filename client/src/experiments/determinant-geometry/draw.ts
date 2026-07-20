/**
 * 行列式几何意义 Canvas 绘制
 * 画出原单位正方形与经矩阵变换后的平行四边形，标注 |det| 面积与定向。
 */
import { det2, transformUnitSquare, type Matrix2, type Point } from './determinantGeometry'

/** 世界坐标 -> 屏幕坐标：原点居左下偏中，y 轴向上，unit 像素/单位 */
function project(p: Point, cx: number, cy: number, unit: number): Point {
  return { x: cx + p.x * unit, y: cy - p.y * unit }
}

function drawGrid(ctx: CanvasRenderingContext2D, W: number, H: number, cx: number, cy: number, unit: number) {
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  for (let gx = -6; gx <= 6; gx++) {
    ctx.beginPath()
    ctx.moveTo(cx + gx * unit, 0)
    ctx.lineTo(cx + gx * unit, H)
    ctx.stroke()
  }
  for (let gy = -6; gy <= 6; gy++) {
    ctx.beginPath()
    ctx.moveTo(0, cy - gy * unit)
    ctx.lineTo(W, cy - gy * unit)
    ctx.stroke()
  }
  ctx.strokeStyle = '#94a3b8'
  ctx.lineWidth = 1.5
  ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke()
}

function fillPolygon(ctx: CanvasRenderingContext2D, pts: Point[], fill: string, stroke: string) {
  ctx.beginPath()
  ctx.moveTo(pts[0].x, pts[0].y)
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y)
  ctx.closePath()
  ctx.fillStyle = fill
  ctx.fill()
  ctx.strokeStyle = stroke
  ctx.lineWidth = 2.5
  ctx.stroke()
}

export function drawDeterminantGeometry(
  canvas: HTMLCanvasElement,
  matrix: Matrix2,
  showLabels = true,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  const unit = 60
  const cx = W * 0.42
  const cy = H * 0.62
  ctx.clearRect(0, 0, W, H)
  drawGrid(ctx, W, H, cx, cy, unit)

  const unitSq: Point[] = [
    { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 },
  ]
  const orig = unitSq.map((p) => project(p, cx, cy, unit))
  fillPolygon(ctx, orig, 'rgba(148,163,184,0.25)', '#94a3b8')

  const para = transformUnitSquare(matrix).map((p) => project(p, cx, cy, unit))
  const d = det2(matrix)
  const flipped = d < 0
  const fill = flipped ? 'rgba(244,114,182,0.28)' : 'rgba(99,102,241,0.28)'
  const stroke = flipped ? '#ec4899' : '#6366f1'
  fillPolygon(ctx, para, fill, stroke)

  if (showLabels) {
    const cxp = (para[0].x + para[2].x) / 2
    const cyp = (para[0].y + para[2].y) / 2
    ctx.fillStyle = '#0f172a'
    ctx.font = 'bold 18px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`面积 = ${Math.abs(d).toFixed(2)}`, cxp, cyp)
    ctx.font = '13px system-ui, sans-serif'
    ctx.fillStyle = stroke
    const tag = d === 0 ? 'det = 0 压扁降维' : flipped ? `det = ${d.toFixed(2)} 定向翻转` : `det = ${d.toFixed(2)}`
    ctx.fillText(tag, cxp, cyp + 22)
  }
}
