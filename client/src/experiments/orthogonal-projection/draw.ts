/**
 * 正交投影 Canvas 绘制
 * 画向量 v、投影方向直线、垂足（投影点）、残差虚线（垂直）。
 */
import { projectOnto, dirFromAngle, type Vec2 } from './orthogonalProjection'

const SCALE = 60 // 每单位数学坐标对应像素

function toScreen(p: Vec2, cx: number, cy: number): [number, number] {
  return [cx + p.x * SCALE, cy - p.y * SCALE]
}

function arrow(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, color: string) {
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(x0, y0)
  ctx.lineTo(x1, y1)
  ctx.stroke()
  const a = Math.atan2(y1 - y0, x1 - x0)
  const h = 9
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x1 - h * Math.cos(a - 0.4), y1 - h * Math.sin(a - 0.4))
  ctx.lineTo(x1 - h * Math.cos(a + 0.4), y1 - h * Math.sin(a + 0.4))
  ctx.closePath()
  ctx.fill()
}

/**
 * 绘制正交投影。
 * @param v 被投影向量（数学坐标）
 * @param angleDeg 投影方向直线与 x 轴夹角（度）
 */
export function drawOrthogonalProjection(
  canvas: HTMLCanvasElement,
  v: Vec2,
  angleDeg: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  const cx = W / 2
  const cy = H / 2
  ctx.clearRect(0, 0, W, H)

  const u = dirFromAngle((angleDeg * Math.PI) / 180)
  const p = projectOnto(v, u)

  // 网格坐标轴
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, cy); ctx.lineTo(W, cy)
  ctx.moveTo(cx, 0); ctx.lineTo(cx, H)
  ctx.stroke()

  // 投影方向直线（过原点，向两端延伸）
  ctx.strokeStyle = '#94a3b8'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(cx - u.x * 400, cy + u.y * 400)
  ctx.lineTo(cx + u.x * 400, cy - u.y * 400)
  ctx.stroke()

  const [vx, vy] = toScreen(v, cx, cy)
  const [px, py] = toScreen(p, cx, cy)

  // 残差虚线：v 到垂足，垂直于直线
  ctx.setLineDash([6, 5])
  ctx.strokeStyle = '#f97316'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(vx, vy)
  ctx.lineTo(px, py)
  ctx.stroke()
  ctx.setLineDash([])

  // 向量 v（蓝）、投影 proj（绿）
  arrow(ctx, cx, cy, vx, vy, '#2563eb')
  arrow(ctx, cx, cy, px, py, '#16a34a')

  // 垂足点
  ctx.fillStyle = '#16a34a'
  ctx.beginPath()
  ctx.arc(px, py, 5, 0, 2 * Math.PI)
  ctx.fill()

  // 标注
  ctx.fillStyle = '#1e293b'
  ctx.font = '14px sans-serif'
  ctx.fillText('v', vx + 8, vy - 4)
  ctx.fillText('proj', px + 8, py + 16)
}
