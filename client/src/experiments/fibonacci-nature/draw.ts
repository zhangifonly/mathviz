/**
 * 向日葵种子螺旋 Canvas 绘制
 * 按黄金角排布点阵，用色相沿索引渐变凸显螺旋线。
 */
import { phyllotaxis } from './fibonacciNature'

/**
 * 绘制向日葵种子点阵。
 * @param angleDeg 发散角（度），默认黄金角 137.5
 * @param count 种子数量
 */
export function drawFibonacciNature(
  canvas: HTMLCanvasElement,
  count: number,
  angleDeg: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const seeds = phyllotaxis(count, angleDeg)
  const cx = W / 2
  const cy = H / 2
  // 缩放使最外圈刚好落在画布内
  const maxR = Math.sqrt(count)
  const scale = (Math.min(W, H) / 2 - 12) / maxR
  const dotR = Math.max(1.5, scale * 0.42)

  for (let i = 0; i < seeds.length; i++) {
    const px = cx + seeds[i].x * scale
    const py = cy + seeds[i].y * scale
    const hue = (i * 137.5) % 360
    ctx.fillStyle = `hsl(${hue}, 70%, 55%)`
    ctx.beginPath()
    ctx.arc(px, py, dotR, 0, 2 * Math.PI)
    ctx.fill()
  }
}
