/**
 * L-系统 Canvas 绘制（自适应缩放 + 深度着色）
 */
import type { Segment } from './lsystem'

/**
 * 绘制线段集合，自动缩放居中。
 * @param progress 0→1 逐段生长
 * @param greenish true 用绿色系（植物），false 用紫青系（曲线）
 */
export function drawLSystem(
  canvas: HTMLCanvasElement,
  segs: Segment[],
  progress: number,
  greenish: boolean,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx || segs.length === 0) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  // 包围盒
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
  for (const s of segs) {
    minX = Math.min(minX, s.x1, s.x2)
    maxX = Math.max(maxX, s.x1, s.x2)
    minY = Math.min(minY, s.y1, s.y2)
    maxY = Math.max(maxY, s.y1, s.y2)
  }
  const pad = 30
  const spanX = maxX - minX || 1
  const spanY = maxY - minY || 1
  const scale = Math.min((W - 2 * pad) / spanX, (H - 2 * pad) / spanY)
  const offX = (W - spanX * scale) / 2 - minX * scale
  const offY = (H - spanY * scale) / 2 - minY * scale
  const sx = (x: number) => offX + x * scale
  const sy = (y: number) => H - (offY + y * scale) // y 向上

  let maxDepth = 0
  for (const s of segs) maxDepth = Math.max(maxDepth, s.depth)

  const upto = Math.max(1, Math.floor(segs.length * progress))
  ctx.lineWidth = 1.2
  ctx.lineCap = 'round'
  for (let i = 0; i < upto; i++) {
    const s = segs[i]
    const t = maxDepth > 0 ? s.depth / maxDepth : 0
    if (greenish) {
      // 树干棕 → 枝叶绿
      const r = Math.round(120 - 80 * t)
      const g = Math.round(80 + 140 * t)
      const b = Math.round(40 + 40 * t)
      ctx.strokeStyle = `rgb(${r},${g},${b})`
    } else {
      const hue = 250 - 60 * t
      ctx.strokeStyle = `hsl(${hue},80%,65%)`
    }
    ctx.beginPath()
    ctx.moveTo(sx(s.x1), sy(s.y1))
    ctx.lineTo(sx(s.x2), sy(s.y2))
    ctx.stroke()
  }
}
