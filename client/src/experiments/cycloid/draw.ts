/**
 * 旋轮线 Canvas 绘制（含滚动圆动画）
 */
import type { Point, CurveKind } from './cycloid'

/** 计算点集包围盒，用于自适应缩放 */
function bounds(pts: Point[]) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
  for (const p of pts) {
    if (p.x < minX) minX = p.x
    if (p.x > maxX) maxX = p.x
    if (p.y < minY) minY = p.y
    if (p.y > maxY) maxY = p.y
  }
  return { minX, maxX, minY, maxY }
}

/**
 * 绘制曲线场景。
 * @param progress 0→1 描线进度
 */
export function drawCurveScene(
  canvas: HTMLCanvasElement,
  kind: CurveKind,
  pts: Point[],
  progress: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx || pts.length === 0) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#fafafa'
  ctx.fillRect(0, 0, W, H)

  const b = bounds(pts)
  const pad = 40
  const spanX = b.maxX - b.minX || 1
  const spanY = b.maxY - b.minY || 1
  const scale = Math.min((W - 2 * pad) / spanX, (H - 2 * pad) / spanY)
  const offX = (W - spanX * scale) / 2 - b.minX * scale
  const offY = (H - spanY * scale) / 2 - b.minY * scale
  const sx = (x: number) => offX + x * scale
  const sy = (y: number) => H - (offY + y * scale) // y 轴翻转

  // 坐标轴
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, sy(0)); ctx.lineTo(W, sy(0))
  ctx.moveTo(sx(0), 0); ctx.lineTo(sx(0), H)
  ctx.stroke()

  // 已描出的曲线
  const upto = Math.max(1, Math.floor(pts.length * progress))
  const grad = ctx.createLinearGradient(0, 0, W, H)
  grad.addColorStop(0, '#6366f1')
  grad.addColorStop(1, '#a855f7')
  ctx.strokeStyle = grad
  ctx.lineWidth = 2.5
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(sx(pts[0].x), sy(pts[0].y))
  for (let i = 1; i < upto; i++) ctx.lineTo(sx(pts[i].x), sy(pts[i].y))
  ctx.stroke()

  // 描线端点的动点
  const head = pts[upto - 1]
  ctx.fillStyle = '#ef4444'
  ctx.beginPath()
  ctx.arc(sx(head.x), sy(head.y), 5, 0, 2 * Math.PI)
  ctx.fill()

  // 滚动圆（仅摆线展示直观滚动）
  if (kind === 'cycloid' && progress < 1) {
    const r = 1 * scale // 单位圆半径
    const cx = sx(head.x)
    const cyCenter = sy(1) // 圆心在 y=r=1 高度
    ctx.strokeStyle = 'rgba(99,102,241,0.5)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(cx, cyCenter, r, 0, 2 * Math.PI)
    ctx.stroke()
    // 圆心到动点的辐条
    ctx.beginPath()
    ctx.moveTo(cx, cyCenter)
    ctx.lineTo(sx(head.x), sy(head.y))
    ctx.stroke()
  }
}
