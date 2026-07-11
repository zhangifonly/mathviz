/**
 * 施密特正交化 Canvas 绘制（二维）
 *
 * 画出：原始向量 v1/v2、v2 在 u1 上的投影、正交化结果 u2，
 * 以及两条互相垂直的正交基。progress 控制正交化过程的动画揭示。
 */

import { gramSchmidt, scale, type Vec } from './gramSchmidt'

const COLORS = {
  bg: '#0f172a',
  grid: '#1e293b',
  axis: '#334155',
  v1: '#fbbf24', // 原始 v1
  v2: '#60a5fa', // 原始 v2
  proj: '#f87171', // 投影分量
  u2: '#34d399', // 正交化结果
  text: '#e2e8f0',
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  ox: number,
  oy: number,
  x: number,
  y: number,
  color: string,
  width = 2.5,
) {
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = width
  ctx.beginPath()
  ctx.moveTo(ox, oy)
  ctx.lineTo(x, y)
  ctx.stroke()
  const ang = Math.atan2(y - oy, x - ox)
  const head = 10
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x - head * Math.cos(ang - Math.PI / 6), y - head * Math.sin(ang - Math.PI / 6))
  ctx.lineTo(x - head * Math.cos(ang + Math.PI / 6), y - head * Math.sin(ang + Math.PI / 6))
  ctx.closePath()
  ctx.fill()
}

/**
 * 绘制二维施密特正交化。
 * @param vectors 输入向量组（取前两个二维向量演示）
 * @param progress 0→1，控制投影/正交化的渐进揭示
 */
export function drawGramSchmidt(
  canvas: HTMLCanvasElement,
  vectors: Vec[],
  progress: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = COLORS.bg
  ctx.fillRect(0, 0, W, H)

  const cx = W / 2
  const cy = H / 2
  const unit = Math.min(W, H) / 10 // 每个坐标单位的像素

  // 网格
  ctx.strokeStyle = COLORS.grid
  ctx.lineWidth = 1
  for (let gx = cx % unit; gx < W; gx += unit) {
    ctx.beginPath()
    ctx.moveTo(gx, 0)
    ctx.lineTo(gx, H)
    ctx.stroke()
  }
  for (let gy = cy % unit; gy < H; gy += unit) {
    ctx.beginPath()
    ctx.moveTo(0, gy)
    ctx.lineTo(W, gy)
    ctx.stroke()
  }

  // 坐标轴
  ctx.strokeStyle = COLORS.axis
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(0, cy)
  ctx.lineTo(W, cy)
  ctx.moveTo(cx, 0)
  ctx.lineTo(cx, H)
  ctx.stroke()

  const vs = vectors.slice(0, 2)
  if (vs.length < 2) return
  const { steps } = gramSchmidt(vs)

  // 屏幕坐标（y 轴向上为正）
  const toX = (v: Vec) => cx + v[0] * unit
  const toY = (v: Vec) => cy - v[1] * unit

  const v1 = steps[0].v
  const v2 = steps[1].v
  const u1 = steps[0].u
  const proj = steps[1].projections[0]
  const u2 = steps[1].u

  // v1（作为 u1 的方向，始终显示）
  drawArrow(ctx, cx, cy, toX(v1), toY(v1), COLORS.v1, 3)
  // v2 原始向量
  drawArrow(ctx, cx, cy, toX(v2), toY(v2), COLORS.v2, 3)

  // 投影分量（沿 u1 方向），progress 前半段增长
  const projShown = scale(proj, Math.min(1, progress * 2))
  drawArrow(ctx, cx, cy, toX(projShown), toY(projShown), COLORS.proj, 2)

  // 正交化结果 u2 = v2 - proj，progress 后半段从投影终点“拉出”
  if (progress > 0.5) {
    const t = (progress - 0.5) * 2
    const u2Shown = scale(u2, t)
    // 从投影终点出发画 u2
    const px = toX(proj)
    const py = toY(proj)
    drawArrow(
      ctx,
      px,
      py,
      px + u2Shown[0] * unit,
      py - u2Shown[1] * unit,
      COLORS.u2,
      3,
    )
    // 正交基 u2（从原点画出，虚线提示）
    ctx.setLineDash([5, 4])
    drawArrow(ctx, cx, cy, toX(u2Shown), toY(u2Shown), COLORS.u2, 1.5)
    ctx.setLineDash([])
  }

  // 直角标记：u1 与 u2 垂直
  if (progress >= 1) {
    const nu1 = u1[0] === 0 && u1[1] === 0 ? [0, 0] : scale(u1, 1 / Math.hypot(u1[0], u1[1]))
    const nu2 = u2[0] === 0 && u2[1] === 0 ? [0, 0] : scale(u2, 1 / Math.hypot(u2[0], u2[1]))
    const s = unit * 0.5
    const c1x = cx + nu1[0] * s
    const c1y = cy - nu1[1] * s
    ctx.strokeStyle = COLORS.u2
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(c1x, c1y)
    ctx.lineTo(c1x + nu2[0] * s, c1y - nu2[1] * s)
    ctx.lineTo(cx + nu2[0] * s, cy - nu2[1] * s)
    ctx.stroke()
  }

  // 图例
  ctx.font = '13px sans-serif'
  ctx.textAlign = 'left'
  const legend: [string, string][] = [
    ['v1 = u1', COLORS.v1],
    ['v2', COLORS.v2],
    ['v2 在 u1 上的投影', COLORS.proj],
    ['u2 = v2 - 投影', COLORS.u2],
  ]
  legend.forEach(([label, color], i) => {
    const ly = 20 + i * 20
    ctx.fillStyle = color
    ctx.fillRect(12, ly - 10, 14, 4)
    ctx.fillStyle = COLORS.text
    ctx.fillText(label, 32, ly)
  })
}
