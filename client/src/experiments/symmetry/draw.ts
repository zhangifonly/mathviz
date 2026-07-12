/**
 * 对称之美 Canvas 绘制
 */
import { buildSymmetricPattern, petalMotif, type Point, type SymmetryOption } from './symmetry'

const PALETTE = ['#f472b6', '#c084fc', '#22d3ee', '#fbbf24', '#a3e635', '#fb7185']

/**
 * 绘制一个对称图案。
 * @param option 当前对称选项（决定旋转重数与是否镜像）
 * @param progress 0→1，逐份揭示各对称拷贝
 */
export function drawSymmetry(
  canvas: HTMLCanvasElement,
  option: SymmetryOption,
  progress: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const cx = W / 2
  const cy = H / 2
  const scale = Math.min(W, H) * 0.42

  const motif = petalMotif(48)
  const copies = buildSymmetricPattern(motif, option.order, option.mirror)
  const total = copies.length
  const shown = Math.max(1, Math.floor(total * progress + 0.0001))

  const toScreen = (p: Point) => ({ x: cx + p.x * scale, y: cy - p.y * scale })

  for (let k = 0; k < shown && k < total; k++) {
    const pts = copies[k]
    ctx.beginPath()
    pts.forEach((p, i) => {
      const s = toScreen(p)
      if (i === 0) ctx.moveTo(s.x, s.y)
      else ctx.lineTo(s.x, s.y)
    })
    ctx.closePath()
    const color = PALETTE[k % PALETTE.length]
    ctx.fillStyle = color + 'cc'
    ctx.fill()
    ctx.strokeStyle = '#f8fafc'
    ctx.lineWidth = 1.5
    ctx.stroke()
  }

  // 中心点
  ctx.beginPath()
  ctx.arc(cx, cy, 4, 0, Math.PI * 2)
  ctx.fillStyle = '#f8fafc'
  ctx.fill()

  // 镜像时画出竖直对称轴
  if (option.mirror && progress > 0.95) {
    ctx.strokeStyle = 'rgba(248,250,252,0.35)'
    ctx.lineWidth = 1
    ctx.setLineDash([6, 6])
    ctx.beginPath()
    ctx.moveTo(cx, cy - scale * 1.05)
    ctx.lineTo(cx, cy + scale * 1.05)
    ctx.stroke()
    ctx.setLineDash([])
  }
}
