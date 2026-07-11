/**
 * 点积与叉积 Canvas 绘制
 *
 * 在二维平面上画出向量 a、b，并可视化：
 * - 点积：a 在 b 上的投影（虚线 + 投影段）
 * - 叉积：a、b 张成的平行四边形（面积 = |a×b|）
 */

import { cross2d, magnitude, type Vec3 } from './dotCrossProduct'

export type DrawMode = 'dot' | 'cross'

export interface DrawData {
  a: Vec3
  b: Vec3
  mode: DrawMode
}

const COL_A = '#22d3ee'
const COL_B = '#fbbf24'
const COL_ACCENT = '#ec4899'
const COL_GRID = '#1e293b'

function drawArrow(
  ctx: CanvasRenderingContext2D,
  ox: number,
  oy: number,
  tx: number,
  ty: number,
  color: string,
  width = 3,
) {
  const ang = Math.atan2(ty - oy, tx - ox)
  const head = 12
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = width
  ctx.beginPath()
  ctx.moveTo(ox, oy)
  ctx.lineTo(tx, ty)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(tx, ty)
  ctx.lineTo(tx - head * Math.cos(ang - Math.PI / 6), ty - head * Math.sin(ang - Math.PI / 6))
  ctx.lineTo(tx - head * Math.cos(ang + Math.PI / 6), ty - head * Math.sin(ang + Math.PI / 6))
  ctx.closePath()
  ctx.fill()
}

/**
 * 绘制点积/叉积可视化。
 * @param progress 0→1 逐步揭示（向量伸长/平行四边形填充）
 */
export function drawDotCrossProduct(
  canvas: HTMLCanvasElement,
  data: DrawData,
  progress: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  // 原点在画布中心，y 轴向上，单位缩放
  const ox = W / 2
  const oy = H / 2
  const scale = 48
  const p = Math.max(0, Math.min(1, progress))

  // 网格
  ctx.strokeStyle = COL_GRID
  ctx.lineWidth = 1
  for (let gx = ox % scale; gx < W; gx += scale) {
    ctx.beginPath()
    ctx.moveTo(gx, 0)
    ctx.lineTo(gx, H)
    ctx.stroke()
  }
  for (let gy = oy % scale; gy < H; gy += scale) {
    ctx.beginPath()
    ctx.moveTo(0, gy)
    ctx.lineTo(W, gy)
    ctx.stroke()
  }
  // 坐标轴
  ctx.strokeStyle = '#475569'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(0, oy)
  ctx.lineTo(W, oy)
  ctx.moveTo(ox, 0)
  ctx.lineTo(ox, H)
  ctx.stroke()

  const { a, b, mode } = data
  // 画布坐标（y 翻转），乘以进度实现伸长动画
  const ax = ox + a.x * scale * p
  const ay = oy - a.y * scale * p
  const bx = ox + b.x * scale * p
  const by = oy - b.y * scale * p

  if (mode === 'cross') {
    // 平行四边形：O, a, a+b, b
    const abx = ox + (a.x + b.x) * scale * p
    const aby = oy - (a.y + b.y) * scale * p
    ctx.fillStyle = 'rgba(236, 72, 153, 0.22)'
    ctx.beginPath()
    ctx.moveTo(ox, oy)
    ctx.lineTo(ax, ay)
    ctx.lineTo(abx, aby)
    ctx.lineTo(bx, by)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = COL_ACCENT
    ctx.lineWidth = 1.5
    ctx.stroke()

    const area = Math.abs(cross2d(a.x, a.y, b.x, b.y))
    ctx.fillStyle = COL_ACCENT
    ctx.font = '15px system-ui, sans-serif'
    ctx.fillText('平行四边形面积 = |a×b| = ' + area.toFixed(2), 14, H - 18)
  } else {
    // 点积：a 在 b 上的投影
    const mb = magnitude(b)
    if (mb > 0) {
      const t = (a.x * b.x + a.y * b.y) / (mb * mb)
      const projx = ox + b.x * t * scale * p
      const projy = oy - b.y * t * scale * p
      // 投影段（沿 b 方向）
      ctx.strokeStyle = COL_ACCENT
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(ox, oy)
      ctx.lineTo(projx, projy)
      ctx.stroke()
      // 从 a 顶点到投影点的垂线（虚线）
      ctx.setLineDash([5, 5])
      ctx.strokeStyle = '#94a3b8'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(ax, ay)
      ctx.lineTo(projx, projy)
      ctx.stroke()
      ctx.setLineDash([])

      const d = a.x * b.x + a.y * b.y
      ctx.fillStyle = COL_ACCENT
      ctx.font = '15px system-ui, sans-serif'
      ctx.fillText('点积 a·b = ' + d.toFixed(2), 14, H - 18)
    }
  }

  // 向量 a、b
  drawArrow(ctx, ox, oy, ax, ay, COL_A)
  drawArrow(ctx, ox, oy, bx, by, COL_B)

  ctx.font = 'bold 16px system-ui, sans-serif'
  ctx.fillStyle = COL_A
  ctx.fillText('a', ax + 6, ay - 6)
  ctx.fillStyle = COL_B
  ctx.fillText('b', bx + 6, by - 6)
}
