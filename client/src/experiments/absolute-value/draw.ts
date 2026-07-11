/**
 * 绝对值函数 Canvas 绘制
 */
import { absFunction, vertex, roots } from './absoluteValue'

export interface AbsDrawData {
  a: number
  h: number
  k: number
  /** 坐标系半宽，x 范围 [-range, range]，y 同比 */
  range: number
}

/**
 * 绘制 y = a|x-h|+k 的 V 形折线，含坐标轴、顶点、零点。
 * @param progress 0→1，控制折线从顶点向两侧生长
 */
export function drawAbsoluteValue(
  canvas: HTMLCanvasElement,
  data: AbsDrawData,
  progress: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  const { a, h, k, range } = data

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const cx = W / 2
  const cy = H / 2
  const scale = W / (2 * range)
  const toPx = (x: number) => cx + x * scale
  const toPy = (y: number) => cy - y * scale

  // 网格
  ctx.strokeStyle = 'rgba(148,163,184,0.12)'
  ctx.lineWidth = 1
  for (let g = -range; g <= range; g++) {
    ctx.beginPath()
    ctx.moveTo(toPx(g), 0)
    ctx.lineTo(toPx(g), H)
    ctx.moveTo(0, toPy(g))
    ctx.lineTo(W, toPy(g))
    ctx.stroke()
  }

  // 坐标轴
  ctx.strokeStyle = 'rgba(203,213,225,0.6)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(0, cy)
  ctx.lineTo(W, cy)
  ctx.moveTo(cx, 0)
  ctx.lineTo(cx, H)
  ctx.stroke()

  // V 形折线：从顶点向两侧按 progress 展开
  const vtx = vertex(h, k)
  const span = range * progress
  const leftX = vtx.x - span
  const rightX = vtx.x + span

  ctx.strokeStyle = '#38bdf8'
  ctx.lineWidth = 3
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(toPx(leftX), toPy(absFunction(leftX, a, h, k)))
  ctx.lineTo(toPx(vtx.x), toPy(vtx.y))
  ctx.lineTo(toPx(rightX), toPy(absFunction(rightX, a, h, k)))
  ctx.stroke()

  // 顶点
  ctx.fillStyle = '#fbbf24'
  ctx.beginPath()
  ctx.arc(toPx(vtx.x), toPy(vtx.y), 5, 0, Math.PI * 2)
  ctx.fill()

  // 零点（进度接近完成时显示）
  if (progress > 0.85) {
    ctx.fillStyle = '#f472b6'
    for (const r of roots(a, h, k)) {
      ctx.beginPath()
      ctx.arc(toPx(r), toPy(0), 4, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}
