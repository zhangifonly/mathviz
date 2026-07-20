/**
 * 逻辑回归 Canvas 绘制
 * 概率梯度背景 + 两类数据点 + 决策边界(sigmoid=0.5 直线)
 */
import { predict, type Point, type Weights } from './logisticRegression'

// 数据坐标范围 [-DOM, DOM]，映射到画布
const DOM = 4.5

function toPx(p: Point, W: number, H: number): [number, number] {
  return [((p.x + DOM) / (2 * DOM)) * W, H - ((p.y + DOM) / (2 * DOM)) * H]
}

/**
 * 绘制逻辑回归当前状态。
 * @param w 当前权重 [w0,w1,w2]
 * @param step 背景降采样步长
 */
export function drawLogisticRegression(
  canvas: HTMLCanvasElement,
  points: Point[],
  labels: number[],
  w: Weights,
  step = 4,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  // 概率梯度背景：蓝(负类)到红(正类)
  for (let py = 0; py < H; py += step) {
    for (let px = 0; px < W; px += step) {
      const dx = (px / W) * 2 * DOM - DOM
      const dy = (1 - py / H) * 2 * DOM - DOM
      const p = predict(w, { x: dx, y: dy })
      const r = Math.round(80 + p * 160)
      const b = Math.round(80 + (1 - p) * 160)
      ctx.fillStyle = `rgba(${r},90,${b},0.28)`
      ctx.fillRect(px, py, step, step)
    }
  }

  // 决策边界 w0 + w1*x + w2*y = 0
  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  if (Math.abs(w[2]) > 1e-6) {
    const yAt = (x: number) => -(w[0] + w[1] * x) / w[2]
    const [x0, y0] = toPx({ x: -DOM, y: yAt(-DOM) }, W, H)
    const [x1, y1] = toPx({ x: DOM, y: yAt(DOM) }, W, H)
    ctx.moveTo(x0, y0)
    ctx.lineTo(x1, y1)
  } else if (Math.abs(w[1]) > 1e-6) {
    const xv = -w[0] / w[1]
    const [xp] = toPx({ x: xv, y: 0 }, W, H)
    ctx.moveTo(xp, 0)
    ctx.lineTo(xp, H)
  }
  ctx.stroke()

  // 数据点
  for (let i = 0; i < points.length; i++) {
    const [px, py] = toPx(points[i], W, H)
    ctx.beginPath()
    ctx.arc(px, py, 6, 0, 2 * Math.PI)
    ctx.fillStyle = labels[i] === 1 ? '#dc2626' : '#2563eb'
    ctx.fill()
    ctx.lineWidth = 1.5
    ctx.strokeStyle = '#ffffff'
    ctx.stroke()
  }
}
