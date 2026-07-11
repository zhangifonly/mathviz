/**
 * 矩阵变换 Canvas 绘制
 *
 * 在坐标网格上展示一个 2x2 矩阵如何把平面「掰弯」：
 * 网格线、基向量 i/j、以及单位正方形都随 progress 从恒等矩阵
 * 平滑插值到目标矩阵。
 */

import { applyMatrix, lerpMatrix, determinant, IDENTITY, type Mat2 } from './matrixTransform'

export interface MatrixTransformData {
  /** 目标矩阵 */
  matrix: Mat2
}

/**
 * @param progress 0→1，恒等矩阵到目标矩阵的过渡比例
 */
export function drawMatrixTransform(
  canvas: HTMLCanvasElement,
  data: MatrixTransformData,
  progress: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  const cx = W / 2
  const cy = H / 2
  const unit = Math.min(W, H) / 10 // 每个单位格的像素

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const m = lerpMatrix(IDENTITY, data.matrix, progress)

  // 数学坐标 → 画布像素（y 轴向上）
  const toPx = (x: number, y: number) => {
    const p = applyMatrix(m, { x, y })
    return { px: cx + p.x * unit, py: cy - p.y * unit }
  }

  // 变换后的网格
  const N = 5
  ctx.lineWidth = 1
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)'
  ctx.beginPath()
  for (let i = -N; i <= N; i++) {
    const a = toPx(i, -N)
    const b = toPx(i, N)
    ctx.moveTo(a.px, a.py)
    ctx.lineTo(b.px, b.py)
    const c = toPx(-N, i)
    const d = toPx(N, i)
    ctx.moveTo(c.px, c.py)
    ctx.lineTo(d.px, d.py)
  }
  ctx.stroke()

  // 变换后的单位正方形（i、j 张成的平行四边形）
  const o = toPx(0, 0)
  const pi = toPx(1, 0)
  const pj = toPx(0, 1)
  const pij = toPx(1, 1)
  const det = determinant(m)
  ctx.fillStyle = det >= 0 ? 'rgba(96, 165, 250, 0.28)' : 'rgba(248, 113, 113, 0.28)'
  ctx.beginPath()
  ctx.moveTo(o.px, o.py)
  ctx.lineTo(pi.px, pi.py)
  ctx.lineTo(pij.px, pij.py)
  ctx.lineTo(pj.px, pj.py)
  ctx.closePath()
  ctx.fill()

  // 基向量 i（红）、j（绿）
  drawArrow(ctx, o.px, o.py, pi.px, pi.py, '#f87171')
  drawArrow(ctx, o.px, o.py, pj.px, pj.py, '#4ade80')

  // 行列式读数
  ctx.fillStyle = '#e2e8f0'
  ctx.font = '16px system-ui, sans-serif'
  ctx.fillText(`行列式 det = ${det.toFixed(2)}`, 16, 28)
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
) {
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
  const ang = Math.atan2(y2 - y1, x2 - x1)
  const head = 10
  ctx.beginPath()
  ctx.moveTo(x2, y2)
  ctx.lineTo(x2 - head * Math.cos(ang - Math.PI / 6), y2 - head * Math.sin(ang - Math.PI / 6))
  ctx.lineTo(x2 - head * Math.cos(ang + Math.PI / 6), y2 - head * Math.sin(ang + Math.PI / 6))
  ctx.closePath()
  ctx.fill()
}
