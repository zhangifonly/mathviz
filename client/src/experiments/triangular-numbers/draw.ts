/**
 * 图形数点阵 Canvas 绘制
 */
import { dotsFor, figurate, type FigurateType } from './triangularNumbers'

const COLORS: Record<FigurateType, string> = {
  triangular: '#6366f1',
  square: '#10b981',
  pentagonal: '#f59e0b',
}

/** 绘制第 n 个 type 图形数的点阵，自动居中缩放 */
export function drawTriangularNumbers(
  canvas: HTMLCanvasElement,
  type: FigurateType,
  n: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, W, H)

  const dots = dotsFor(type, n)
  if (dots.length === 0) return

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
  for (const d of dots) {
    minX = Math.min(minX, d.x); maxX = Math.max(maxX, d.x)
    minY = Math.min(minY, d.y); maxY = Math.max(maxY, d.y)
  }
  const pad = 60
  const spanX = maxX - minX || 1
  const spanY = maxY - minY || 1
  const scale = Math.min((W - 2 * pad) / spanX, (H - 2 * pad) / spanY)
  const drawnW = spanX * scale
  const drawnH = spanY * scale
  const ox = (W - drawnW) / 2 - minX * scale
  const oy = (H - drawnH) / 2 - minY * scale
  const r = Math.max(4, Math.min(16, scale * 0.14))

  ctx.fillStyle = COLORS[type]
  for (const d of dots) {
    const px = ox + d.x * scale
    const py = oy + d.y * scale
    ctx.beginPath()
    ctx.arc(px, py, r, 0, 2 * Math.PI)
    ctx.fill()
  }

  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 20px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(`第 ${n} 个 = ${figurate(type, n)} 个点`, W / 2, H - 20)
}
