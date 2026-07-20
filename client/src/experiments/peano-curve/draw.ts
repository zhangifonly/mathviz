/**
 * 皮亚诺曲线 Canvas 绘制。
 * 沿曲线把每一小段涂成渐变色（hue 随顺序推进），直观展示遍历次序。
 */
import { peanoPoints, type Point } from './peanoCurve'

/**
 * 绘制 order 阶皮亚诺曲线。
 * @param order 阶数
 * @param progress 只画前 progress 比例（0~1），用于动画逐步填充
 */
export function drawPeanoCurve(
  canvas: HTMLCanvasElement,
  order: number,
  progress = 1,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, W, H)

  const pad = 24
  const size = Math.min(W, H) - pad * 2
  const ox = (W - size) / 2
  const oy = (H - size) / 2
  const map = (p: Point) => ({ x: ox + p.x * size, y: oy + (1 - p.y) * size })

  const pts = peanoPoints(order)
  const n = pts.length
  const last = Math.max(1, Math.floor(n * Math.min(1, Math.max(0, progress))))

  ctx.lineWidth = order >= 4 ? 1.2 : order === 3 ? 2 : 3.5
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'

  for (let i = 1; i < last; i++) {
    const a = map(pts[i - 1])
    const b = map(pts[i])
    const hue = Math.round((i / n) * 300) // 蓝→紫→红，展示顺序
    ctx.strokeStyle = `hsl(${hue}, 78%, 52%)`
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.stroke()
  }

  // 起点(绿)与当前终点(红)标记
  const s = map(pts[0])
  const e = map(pts[last - 1])
  ctx.fillStyle = '#22c55e'
  ctx.beginPath()
  ctx.arc(s.x, s.y, 4, 0, 2 * Math.PI)
  ctx.fill()
  ctx.fillStyle = '#ef4444'
  ctx.beginPath()
  ctx.arc(e.x, e.y, 4, 0, 2 * Math.PI)
  ctx.fill()
}
