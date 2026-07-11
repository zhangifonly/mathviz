/**
 * 模乘法圆环 Canvas 绘制
 * 把 0..n-1 均匀点在圆周上，连线 i -> (i*k) mod n，
 * 不同乘数 k 会涌现心形线、肾脏线等包络曲线。
 */

import type { CircleData } from './modularArithmetic'
import { pointOnCircle } from './modularArithmetic'

/**
 * 绘制模乘法圆环。
 * @param canvas 目标画布
 * @param data buildCircleData 生成的圆环数据
 * @param progress 0→1 逐条揭示连线
 */
export function drawModularArithmetic(
  canvas: HTMLCanvasElement,
  data: CircleData,
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
  const radius = Math.min(W, H) / 2 - 24
  const { n, chords } = data
  if (n <= 0) return

  // 圆周
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.stroke()

  const upto = Math.max(0, Math.floor(chords.length * progress))
  for (let idx = 0; idx < upto; idx++) {
    const [from, to] = chords[idx]
    const p1 = pointOnCircle(from, n, radius)
    const p2 = pointOnCircle(to, n, radius)
    // 按弦的位置渐变着色，让包络曲线更醒目
    const hue = (from / n) * 300 + 20
    ctx.strokeStyle = `hsla(${hue}, 85%, 62%, 0.7)`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(cx + p1.x, cy + p1.y)
    ctx.lineTo(cx + p2.x, cy + p2.y)
    ctx.stroke()
  }

  // 圆周上的点（小圆点标记）
  ctx.fillStyle = 'rgba(226, 232, 240, 0.55)'
  const dotStep = n > 120 ? Math.ceil(n / 120) : 1
  for (let i = 0; i < n; i += dotStep) {
    const p = pointOnCircle(i, n, radius)
    ctx.beginPath()
    ctx.arc(cx + p.x, cy + p.y, 1.4, 0, Math.PI * 2)
    ctx.fill()
  }
}
