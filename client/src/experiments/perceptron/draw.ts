/**
 * 感知机 Canvas 绘制：两类样本点 + 当前决策直线
 */
import { predict, type Boundary, type Point } from './perceptron'

const PAD = 30
const CLASS_POS = '#6366f1' // +1 类
const CLASS_NEG = '#ec4899' // -1 类

/** 把特征坐标 [0,1] 映射到画布像素 */
function toPx(v: number, size: number): number {
  return PAD + v * (size - 2 * PAD)
}

/**
 * 绘制感知机分类图。
 * @param boundary 当前决策边界；若 w0=w1=0 则不画直线（尚未学习）
 * @param showResult 是否按预测结果给点描边（分对为绿、分错为红）
 */
export function drawPerceptron(
  canvas: HTMLCanvasElement,
  points: Point[],
  boundary: Boundary,
  showResult = false,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  // 决策直线 w0*x + w1*y + b = 0，取两端交点
  if (boundary.w0 !== 0 || boundary.w1 !== 0) {
    const pts: Array<[number, number]> = []
    if (Math.abs(boundary.w1) > 1e-9) {
      for (const x of [0, 1]) {
        const y = -(boundary.w0 * x + boundary.b) / boundary.w1
        if (y >= -0.2 && y <= 1.2) pts.push([x, y])
      }
    }
    if (Math.abs(boundary.w0) > 1e-9) {
      for (const y of [0, 1]) {
        const x = -(boundary.w1 * y + boundary.b) / boundary.w0
        if (x >= -0.2 && x <= 1.2) pts.push([x, y])
      }
    }
    if (pts.length >= 2) {
      ctx.strokeStyle = '#0f172a'
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.moveTo(toPx(pts[0][0], W), toPx(1 - pts[0][1], H))
      ctx.lineTo(toPx(pts[1][0], W), toPx(1 - pts[1][1], H))
      ctx.stroke()
    }
  }

  // 样本点
  for (const p of points) {
    const cx = toPx(p.x, W)
    const cy = toPx(1 - p.y, H)
    ctx.beginPath()
    ctx.arc(cx, cy, 5, 0, 2 * Math.PI)
    ctx.fillStyle = p.label === 1 ? CLASS_POS : CLASS_NEG
    ctx.fill()
    if (showResult) {
      const ok = predict(boundary, p) === p.label
      ctx.strokeStyle = ok ? '#22c55e' : '#ef4444'
      ctx.lineWidth = 2.5
      ctx.stroke()
    }
  }
}
