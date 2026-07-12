/**
 * 格林公式 Canvas 绘制
 * 左侧向量场箭头 + 闭曲线(圆) + 旋度热力, progress 控制曲线揭示进度。
 */
import type { VectorField } from './greenTheorem'

export interface GreenDrawData {
  field: VectorField
  radius: number
  /** 是否叠加旋度热力底图 */
  showCurl: boolean
}

/** 把数学坐标 (x,y) 映射到画布像素, scale = 每单位像素数 */
function toPixel(cx: number, cy: number, scale: number, x: number, y: number): [number, number] {
  return [cx + x * scale, cy - y * scale]
}

export function drawGreenTheorem(
  canvas: HTMLCanvasElement,
  data: GreenDrawData,
  progress: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  const cx = W / 2
  const cy = H / 2
  const range = 3 // 显示 [-3, 3]
  const scale = Math.min(W, H) / (2 * range)

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const { field, radius, showCurl } = data

  // 旋度热力底图(采样网格)
  if (showCurl) {
    const step = 12
    let maxAbs = 0.001
    for (let px = 0; px < W; px += step)
      for (let py = 0; py < H; py += step) {
        const x = (px - cx) / scale
        const y = (cy - py) / scale
        maxAbs = Math.max(maxAbs, Math.abs(field.curl(x, y)))
      }
    for (let px = 0; px < W; px += step)
      for (let py = 0; py < H; py += step) {
        const x = (px - cx) / scale
        const y = (cy - py) / scale
        const c = field.curl(x, y) / maxAbs
        const alpha = Math.min(0.5, Math.abs(c) * 0.5)
        ctx.fillStyle = c >= 0
          ? `rgba(56, 189, 248, ${alpha})`
          : `rgba(248, 113, 113, ${alpha})`
        ctx.fillRect(px, py, step, step)
      }
  }

  // 坐标轴
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, cy)
  ctx.lineTo(W, cy)
  ctx.moveTo(cx, 0)
  ctx.lineTo(cx, H)
  ctx.stroke()

  // 向量场箭头
  const grid = 0.6
  ctx.strokeStyle = 'rgba(226, 232, 240, 0.55)'
  ctx.fillStyle = 'rgba(226, 232, 240, 0.55)'
  ctx.lineWidth = 1.2
  for (let gx = -range; gx <= range; gx += grid)
    for (let gy = -range; gy <= range; gy += grid) {
      const vx = field.P(gx, gy)
      const vy = field.Q(gx, gy)
      const mag = Math.hypot(vx, vy)
      if (mag < 1e-9) continue
      const len = Math.min(0.45, mag * 0.12)
      const ux = (vx / mag) * len
      const uy = (vy / mag) * len
      const [x0, y0] = toPixel(cx, cy, scale, gx, gy)
      const [x1, y1] = toPixel(cx, cy, scale, gx + ux, gy + uy)
      ctx.beginPath()
      ctx.moveTo(x0, y0)
      ctx.lineTo(x1, y1)
      ctx.stroke()
      const ang = Math.atan2(y1 - y0, x1 - x0)
      const head = 4
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x1 - head * Math.cos(ang - 0.5), y1 - head * Math.sin(ang - 0.5))
      ctx.lineTo(x1 - head * Math.cos(ang + 0.5), y1 - head * Math.sin(ang + 0.5))
      ctx.closePath()
      ctx.fill()
    }

  // 闭曲线(圆), 逆时针, 按 progress 揭示
  const end = Math.PI * 2 * Math.max(0, Math.min(1, progress))
  ctx.strokeStyle = '#fbbf24'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(cx, cy, radius * scale, 0, end)
  ctx.stroke()

  // 前进方向箭头
  if (progress > 0.05) {
    const t = end
    const [ax, ay] = toPixel(cx, cy, scale, radius * Math.cos(t), radius * Math.sin(t))
    const dir = t + Math.PI / 2
    ctx.fillStyle = '#fbbf24'
    ctx.beginPath()
    ctx.moveTo(ax, ay)
    ctx.lineTo(ax - 9 * Math.cos(dir - 0.4), ay + 9 * Math.sin(dir - 0.4))
    ctx.lineTo(ax - 9 * Math.cos(dir + 0.4), ay + 9 * Math.sin(dir + 0.4))
    ctx.closePath()
    ctx.fill()
  }
}
