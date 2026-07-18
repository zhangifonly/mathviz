/**
 * 龙形曲线 Canvas 绘制
 * 自适应缩放并居中，沿路径用渐变色描边，直观展现折纸展开的分形。
 */
import { dragonPoints, boundingBox } from './dragonCurve'

/**
 * 绘制 n 次迭代的龙形曲线。
 * @param n       对折次数（迭代数）
 * @param padding 画布边距
 */
export function drawDragonCurve(
  canvas: HTMLCanvasElement,
  n: number,
  padding = 24,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const pts = dragonPoints(n, 1)
  const box = boundingBox(pts)
  const scale = Math.min(
    (W - 2 * padding) / (box.width || 1),
    (H - 2 * padding) / (box.height || 1),
  )
  // 居中偏移
  const offX = (W - box.width * scale) / 2 - box.minX * scale
  const offY = (H - box.height * scale) / 2 - box.minY * scale
  const tx = (p: { x: number; y: number }) => ({
    x: p.x * scale + offX,
    y: p.y * scale + offY,
  })

  ctx.lineWidth = Math.max(1, Math.min(2.4, 900 / pts.length))
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'

  // 沿路径分段上色，形成从蓝到品红的渐变
  const total = pts.length - 1
  for (let i = 0; i < total; i++) {
    const t = i / total
    const hue = 210 + t * 150 // 蓝(210) -> 品红(360)
    ctx.strokeStyle = `hsl(${hue}, 85%, 55%)`
    const a = tx(pts[i])
    const b = tx(pts[i + 1])
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.stroke()
  }

  // 起点标记
  const start = tx(pts[0])
  ctx.fillStyle = '#0f172a'
  ctx.beginPath()
  ctx.arc(start.x, start.y, 3.5, 0, 2 * Math.PI)
  ctx.fill()
}
