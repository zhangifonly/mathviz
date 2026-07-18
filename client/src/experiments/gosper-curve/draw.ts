/**
 * 戈斯珀曲线 Canvas 绘制（沿曲线渐变着色）
 */
import { gosperPoints } from './gosperCurve'

/**
 * 绘制戈斯珀曲线。点列归一化到 [0,1]，这里按画布尺寸留白缩放。
 * 沿曲线用 HSL 色相渐变，呈现六边形流水般的分形铺砌。
 */
export function drawGosperCurve(
  canvas: HTMLCanvasElement,
  order: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const pts = gosperPoints(order)
  if (pts.length < 2) return

  const pad = 24
  const size = Math.min(W, H) - pad * 2
  const offX = (W - size) / 2
  const offY = (H - size) / 2
  const px = (p: { x: number; y: number }) => offX + p.x * size
  const py = (p: { x: number; y: number }) => offY + p.y * size

  ctx.lineWidth = Math.max(1, 3 - order * 0.4)
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'

  const n = pts.length - 1
  for (let i = 0; i < n; i++) {
    const hue = (i / n) * 300 // 从洋红扫到青绿
    ctx.strokeStyle = `hsl(${hue}, 75%, 55%)`
    ctx.beginPath()
    ctx.moveTo(px(pts[i]), py(pts[i]))
    ctx.lineTo(px(pts[i + 1]), py(pts[i + 1]))
    ctx.stroke()
  }

  // 起点、终点标记
  ctx.fillStyle = '#0f172a'
  ctx.beginPath()
  ctx.arc(px(pts[0]), py(pts[0]), 4, 0, 2 * Math.PI)
  ctx.fill()
  ctx.fillStyle = '#dc2626'
  ctx.beginPath()
  ctx.arc(px(pts[n]), py(pts[n]), 4, 0, 2 * Math.PI)
  ctx.fill()
}
