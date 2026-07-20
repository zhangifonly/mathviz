/**
 * 希尔伯特曲线 Canvas 绘制
 * 用 HSL 渐变色沿遍历顺序着色，直观展示一维距离在二维空间中的走向。
 */
import { hilbertPoints } from './hilbertCurve'

/**
 * 绘制 order 阶希尔伯特曲线，填满整个画布。
 * @param showDots 是否在折点画小圆点
 */
export function drawHilbertCurve(
  canvas: HTMLCanvasElement,
  order: number,
  showDots = false,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const n = 1 << order
  const pad = 16
  const cell = Math.min(W - pad * 2, H - pad * 2) / n
  const ox = (W - cell * n) / 2 + cell / 2
  const oy = (H - cell * n) / 2 + cell / 2

  const pts = hilbertPoints(order)
  const toPx = (p: { x: number; y: number }) => ({
    px: ox + p.x * cell,
    // 翻转 y，让 (0,0) 显示在左下角，符合直觉
    py: H - (oy + p.y * cell),
  })

  ctx.lineWidth = Math.max(1.2, cell * 0.35)
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'

  for (let i = 1; i < pts.length; i++) {
    const a = toPx(pts[i - 1])
    const b = toPx(pts[i])
    // 沿遍历顺序做彩虹渐变，色相从 0 走到 300
    const hue = (i / pts.length) * 300
    ctx.strokeStyle = `hsl(${hue}, 78%, 55%)`
    ctx.beginPath()
    ctx.moveTo(a.px, a.py)
    ctx.lineTo(b.px, b.py)
    ctx.stroke()
  }

  if (showDots) {
    for (let i = 0; i < pts.length; i++) {
      const { px, py } = toPx(pts[i])
      const hue = (i / pts.length) * 300
      ctx.fillStyle = `hsl(${hue}, 78%, 45%)`
      ctx.beginPath()
      ctx.arc(px, py, Math.max(1, cell * 0.18), 0, 2 * Math.PI)
      ctx.fill()
    }
  }
}
