/**
 * 方向导数 Canvas 绘制：等高线条纹 + 固定点处方向导数玫瑰图。
 * 玫瑰图半径=该方向的方向导数，梯度方向最大、垂直方向为 0。
 */
import { dirDeriv, gradAngle, gradMagnitude, type Field } from './directionalDerivative'

// 数学坐标范围映射到画布
const RANGE = 3

function toCanvas(x: number, y: number, W: number, H: number): [number, number] {
  const px = ((x + RANGE) / (2 * RANGE)) * W
  const py = ((RANGE - y) / (2 * RANGE)) * H
  return [px, py]
}

function drawContours(ctx: CanvasRenderingContext2D, field: Field, W: number, H: number) {
  const img = ctx.createImageData(W, H)
  const data = img.data
  for (let py = 0; py < H; py++) {
    for (let px = 0; px < W; px++) {
      const x = (px / W) * 2 * RANGE - RANGE
      const y = RANGE - (py / H) * 2 * RANGE
      const v = field.f(x, y)
      // 等高线：按值取周期条纹
      const band = Math.abs(Math.sin(v * 1.5))
      const g = 200 - band * 150
      const p = (py * W + px) * 4
      data[p] = g
      data[p + 1] = g + 20
      data[p + 2] = 255 - band * 60
      data[p + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
}

/** 绘制方向导数玫瑰图与考察点。px,py 为考察点数学坐标，angle 为选中方向（弧度） */
export function drawDirectionalDerivative(
  canvas: HTMLCanvasElement,
  field: Field,
  px: number,
  py: number,
  angle: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  drawContours(ctx, field, W, H)

  const [cx, cy] = toCanvas(px, py, W, H)
  const mag = gradMagnitude(field.f, px, py)
  const scale = mag > 1e-6 ? 55 / mag : 0

  // 玫瑰曲线：半径 = |方向导数|，正负分色
  ctx.lineWidth = 2
  for (const [phase, color] of [[0, '#ef4444'], [Math.PI, '#3b82f6']] as const) {
    ctx.strokeStyle = color
    ctx.beginPath()
    let started = false
    for (let d = -90; d <= 90; d += 3) {
      const a = phase + (d * Math.PI) / 180
      const val = dirDeriv(field.f, px, py, a)
      if (val < 0) continue
      const r = val * scale
      const x = cx + r * Math.cos(a)
      const y = cy - r * Math.sin(a)
      if (!started) { ctx.moveTo(x, y); started = true } else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  // 梯度方向虚线（方向导数最大）
  const ga = gradAngle(field.f, px, py)
  ctx.strokeStyle = '#f59e0b'
  ctx.setLineDash([5, 4])
  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.lineTo(cx + mag * scale * Math.cos(ga), cy - mag * scale * Math.sin(ga))
  ctx.stroke()
  ctx.setLineDash([])

  // 当前选中方向箭头
  const cur = dirDeriv(field.f, px, py, angle)
  const r = cur * scale
  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.lineTo(cx + r * Math.cos(angle), cy - r * Math.sin(angle))
  ctx.stroke()

  // 考察点
  ctx.fillStyle = '#0f172a'
  ctx.beginPath()
  ctx.arc(cx, cy, 4, 0, 2 * Math.PI)
  ctx.fill()
}
