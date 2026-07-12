/**
 * 奇异值分解 Canvas 绘制
 * 展示单位圆（及其上一组彩色采样点）经矩阵 A 变换成椭圆的过程，
 * 并画出两条主轴——它们的半轴长正是奇异值 σ1、σ2。
 */
import { applyMat2, svd2, type Mat2, type Vec2 } from './svd'

const BG = '#0f172a'
const GRID = 'rgba(148,163,184,0.15)'
const CIRCLE_COL = 'rgba(96,165,250,0.5)'
const ELLIPSE_COL = '#f472b6'
const AXIS1 = '#f87171'
const AXIS2 = '#4ade80'

/** 在圆与椭圆之间线性插值一个方向上的点 */
function lerp(a: Vec2, b: Vec2, t: number): Vec2 {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
}

/**
 * 绘制 SVD 变换动画。
 * @param A 2x2 变换矩阵
 * @param progress 0→1，圆逐渐形变为椭圆
 */
export function drawSvd(canvas: HTMLCanvasElement, A: Mat2, progress: number) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  const cx = W / 2
  const cy = H / 2
  const unit = Math.min(W, H) / 6 // 每个单位长度对应的像素

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = BG
  ctx.fillRect(0, 0, W, H)

  // 坐标网格
  ctx.strokeStyle = GRID
  ctx.lineWidth = 1
  for (let g = -3; g <= 3; g++) {
    ctx.beginPath()
    ctx.moveTo(cx + g * unit, 0)
    ctx.lineTo(cx + g * unit, H)
    ctx.moveTo(0, cy + g * unit)
    ctx.lineTo(W, cy + g * unit)
    ctx.stroke()
  }
  // 坐标轴
  ctx.strokeStyle = 'rgba(203,213,225,0.4)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(0, cy)
  ctx.lineTo(W, cy)
  ctx.moveTo(cx, 0)
  ctx.lineTo(cx, H)
  ctx.stroke()

  const toPx = (v: Vec2): [number, number] => [cx + v[0] * unit, cy - v[1] * unit]

  // 原始单位圆（虚线参考）
  ctx.strokeStyle = CIRCLE_COL
  ctx.setLineDash([5, 5])
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.arc(cx, cy, unit, 0, Math.PI * 2)
  ctx.stroke()
  ctx.setLineDash([])

  // 形变曲线：单位圆上每个方向按 progress 插值到椭圆
  ctx.strokeStyle = ELLIPSE_COL
  ctx.lineWidth = 2.5
  ctx.beginPath()
  const N = 120
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * Math.PI * 2
    const base: Vec2 = [Math.cos(t), Math.sin(t)]
    const mapped = applyMat2(A, base)
    const pt = lerp(base, mapped, progress)
    const [px, py] = toPx(pt)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
  ctx.stroke()

  // 主轴：沿左奇异向量方向、长度为奇异值
  const { U, S } = svd2(A)
  const drawAxis = (col: string, dir: Vec2, len: number) => {
    const end: Vec2 = [dir[0] * len * progress, dir[1] * len * progress]
    const [ex, ey] = toPx(end)
    ctx.strokeStyle = col
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(ex, ey)
    ctx.stroke()
    ctx.fillStyle = col
    ctx.beginPath()
    ctx.arc(ex, ey, 5, 0, Math.PI * 2)
    ctx.fill()
  }
  drawAxis(AXIS1, [U[0], U[2]], S[0])
  drawAxis(AXIS2, [U[1], U[3]], S[1])

  // 标注奇异值
  ctx.fillStyle = '#e2e8f0'
  ctx.font = '14px sans-serif'
  ctx.fillText(`σ1 = ${S[0].toFixed(2)}`, 12, 22)
  ctx.fillText(`σ2 = ${S[1].toFixed(2)}`, 12, 42)
}
