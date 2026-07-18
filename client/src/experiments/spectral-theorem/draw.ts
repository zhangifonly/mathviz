/**
 * 谱分解 Canvas 绘制
 * 画单位圆经对称矩阵 M 变换后的椭圆：
 *   主轴方向 = 特征向量，半轴长 = |特征值|。
 */
import { eigenSym2x2, applyMatrix, type SymMatrix2 } from './spectralTheorem'

/** 绘制单位圆 -> 椭圆变换与特征主轴 */
export function drawSpectralTheorem(
  canvas: HTMLCanvasElement,
  m: SymMatrix2,
  showAxes = true,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  const cx = W / 2
  const cy = H / 2
  const scale = 52 // 每单位像素

  drawGrid(ctx, W, H, cx, cy, scale)

  // 单位圆（变换前，灰色虚线）
  ctx.strokeStyle = '#94a3b8'
  ctx.setLineDash([5, 5])
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.arc(cx, cy, scale, 0, 2 * Math.PI)
  ctx.stroke()
  ctx.setLineDash([])

  // 变换后的椭圆（对单位圆上采样点逐一 M 作用）
  ctx.strokeStyle = '#6366f1'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  for (let i = 0; i <= 120; i++) {
    const t = (i / 120) * 2 * Math.PI
    const p = applyMatrix(m, [Math.cos(t), Math.sin(t)])
    const px = cx + p[0] * scale
    const py = cy - p[1] * scale
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  if (showAxes) drawEigenAxes(ctx, m, cx, cy, scale)
}

/** 画特征向量主轴：方向=特征向量，长度=|特征值| */
function drawEigenAxes(
  ctx: CanvasRenderingContext2D,
  m: SymMatrix2,
  cx: number,
  cy: number,
  scale: number,
) {
  const e = eigenSym2x2(m)
  const colors = ['#ec4899', '#22c55e']
  for (let i = 0; i < 2; i++) {
    const v = e.vectors[i]
    const len = e.values[i] * scale
    const ex = cx + v[0] * len
    const ey = cy - v[1] * len
    ctx.strokeStyle = colors[i]
    ctx.fillStyle = colors[i]
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(ex, ey)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(ex, ey, 5, 0, 2 * Math.PI)
    ctx.fill()
  }
}

/** 背景网格与坐标轴 */
function drawGrid(
  ctx: CanvasRenderingContext2D,
  W: number, H: number, cx: number, cy: number, scale: number,
) {
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  for (let x = cx % scale; x < W; x += scale) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
  }
  for (let y = cy % scale; y < H; y += scale) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
  }
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(0, cy); ctx.lineTo(W, cy)
  ctx.moveTo(cx, 0); ctx.lineTo(cx, H)
  ctx.stroke()
}
