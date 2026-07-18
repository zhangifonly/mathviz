/**
 * 偏导数与梯度 Canvas 绘制
 * 填色等高线图 + 指定点的梯度箭头（垂直于等高线，指向最陡上升）
 */
import { gradient, type FieldDef } from './partialDerivative'

/** 域坐标范围 [-D, D]，屏幕坐标像素级映射 */
export const DOMAIN = 3

function heightColor(t: number): [number, number, number] {
  // t in [0,1]: 低=靛蓝, 中=青, 高=橙黄
  return [40 + t * 215, 70 + Math.sin(t * Math.PI) * 150, 200 - t * 170]
}

export function drawPartialDerivative(
  canvas: HTMLCanvasElement,
  def: FieldDef,
  px: number,
  py: number,
  step = 3,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  const [lo, hi] = def.range
  const span = hi - lo || 1
  const toX = (i: number) => (i / W) * 2 * DOMAIN - DOMAIN
  const toY = (j: number) => DOMAIN - (j / H) * 2 * DOMAIN

  const img = ctx.createImageData(W, H)
  const data = img.data
  for (let j = 0; j < H; j += step) {
    for (let i = 0; i < W; i += step) {
      const v = def.f(toX(i), toY(j))
      const t = Math.max(0, Math.min(1, (v - lo) / span))
      // 等高线暗纹：接近整数层级处压暗
      const band = Math.abs(((t * 8) % 1) - 0.5) * 2
      const shade = 0.55 + 0.45 * band
      const [r, g, b] = heightColor(t)
      for (let dy = 0; dy < step && j + dy < H; dy++) {
        for (let dx = 0; dx < step && i + dx < W; dx++) {
          const p = ((j + dy) * W + (i + dx)) * 4
          data[p] = r * shade
          data[p + 1] = g * shade
          data[p + 2] = b * shade
          data[p + 3] = 255
        }
      }
    }
  }
  ctx.putImageData(img, 0, 0)

  // 域坐标 -> 像素
  const sx = ((px + DOMAIN) / (2 * DOMAIN)) * W
  const sy = ((DOMAIN - py) / (2 * DOMAIN)) * H
  const [gx, gy] = gradient(def.f, px, py)
  const mag = Math.hypot(gx, gy)

  ctx.fillStyle = '#0f172a' // 采样点
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(sx, sy, 6, 0, 2 * Math.PI)
  ctx.fill()
  ctx.stroke()

  if (mag > 1e-6) {
    // 屏幕 y 向下，故 dy 取反；箭头长度按模长缩放并限幅
    const scale = Math.min(90, 18 * mag) / mag
    const ex = sx + gx * scale
    const ey = sy - gy * scale
    drawArrow(ctx, sx, sy, ex, ey, '#f8fafc')
  }
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: string,
) {
  const ang = Math.atan2(y1 - y0, x1 - x0)
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(x0, y0)
  ctx.lineTo(x1, y1)
  ctx.stroke()
  const head = 11
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x1 - head * Math.cos(ang - 0.4), y1 - head * Math.sin(ang - 0.4))
  ctx.lineTo(x1 - head * Math.cos(ang + 0.4), y1 - head * Math.sin(ang + 0.4))
  ctx.closePath()
  ctx.fill()
}
