/**
 * 高斯朴素贝叶斯 Canvas 绘制
 * 决策区域（网格背景色）+ 训练点（按类着色）+ 各类高斯等高线
 */
import { classify, fit, type Point } from './naiveBayes'

const DMIN = 0
const DMAX = 6
const COLORS = ['#6366f1', '#ec4899'] // 类0 靛蓝 / 类1 品红
const REGION = ['rgba(99,102,241,0.14)', 'rgba(236,72,153,0.14)']

function toPx(v: number, size: number): number {
  return ((v - DMIN) / (DMAX - DMIN)) * size
}
function toData(px: number, size: number): number {
  return DMIN + (px / size) * (DMAX - DMIN)
}

/** 绘制决策区域、等高线与训练点 */
export function drawNaiveBayes(
  canvas: HTMLCanvasElement,
  train: Point[],
  step = 8,
  showPoints = true,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx || train.length === 0) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  // 1) 决策区域：网格上每格按预测类别填底色
  for (let py = 0; py < H; py += step) {
    for (let px = 0; px < W; px += step) {
      const dx = toData(px + step / 2, W)
      const dy = toData(H - (py + step / 2), H)
      const label = classify(train, dx, dy)
      ctx.fillStyle = REGION[label]
      ctx.fillRect(px, py, step, step)
    }
  }

  // 2) 各类高斯等高线（在均值附近画若干椭圆）
  const models = fit(train)
  for (let label = 0; label < models.length; label++) {
    const m = models[label]
    ctx.strokeStyle = COLORS[label]
    ctx.globalAlpha = 0.5
    const cx = toPx(m.meanX, W)
    const cy = H - toPx(m.meanY, H)
    const sx = Math.sqrt(m.varX)
    const sy = Math.sqrt(m.varY)
    for (let k = 1; k <= 3; k++) {
      ctx.beginPath()
      ctx.ellipse(cx, cy, toPx(k * sx, W) - toPx(0, W), toPx(k * sy, H) - toPx(0, H), 0, 0, 2 * Math.PI)
      ctx.stroke()
    }
  }
  ctx.globalAlpha = 1

  // 3) 训练点
  if (showPoints) {
    for (const p of train) {
      ctx.fillStyle = COLORS[p.label]
      ctx.beginPath()
      ctx.arc(toPx(p.x, W), H - toPx(p.y, H), 4, 0, 2 * Math.PI)
      ctx.fill()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 1
      ctx.stroke()
    }
  }
}

/** 供组件展示：一个查询点及其预测类别 */
export function drawQuery(canvas: HTMLCanvasElement, train: Point[], qx: number, qy: number) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  const label = classify(train, qx, qy)
  const px = toPx(qx, W)
  const py = H - toPx(qy, H)
  ctx.fillStyle = COLORS[label]
  ctx.beginPath()
  ctx.arc(px, py, 8, 0, 2 * Math.PI)
  ctx.fill()
  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth = 2
  ctx.stroke()
}
