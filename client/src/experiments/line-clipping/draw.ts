/**
 * Cohen-Sutherland 线段裁剪 Canvas 绘制
 * 窗外部分画灰色虚线，窗内部分高亮，矩形窗口描边。
 */
import { clipLine, type Rect, type Segment } from './lineClipping'

/**
 * @param showOutside 是否显示窗外的原始线段（灰色）
 * @param window 裁剪窗口
 * @param segments 待裁剪线段集合
 */
export function drawLineClipping(
  canvas: HTMLCanvasElement,
  window: Rect,
  segments: Segment[],
  showOutside = true,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  // 原始线段（灰色，代表窗外/裁剪前）
  if (showOutside) {
    ctx.strokeStyle = '#cbd5e1'
    ctx.lineWidth = 1.5
    ctx.setLineDash([5, 4])
    for (const s of segments) {
      ctx.beginPath()
      ctx.moveTo(s.x1, s.y1)
      ctx.lineTo(s.x2, s.y2)
      ctx.stroke()
    }
    ctx.setLineDash([])
  }

  // 裁剪窗口矩形
  ctx.strokeStyle = '#6366f1'
  ctx.lineWidth = 2
  ctx.strokeRect(
    window.xmin,
    window.ymin,
    window.xmax - window.xmin,
    window.ymax - window.ymin,
  )
  ctx.fillStyle = 'rgba(99, 102, 241, 0.06)'
  ctx.fillRect(
    window.xmin,
    window.ymin,
    window.xmax - window.xmin,
    window.ymax - window.ymin,
  )

  // 裁剪后落在窗内的部分（高亮）
  ctx.strokeStyle = '#ec4899'
  ctx.lineWidth = 3
  ctx.lineCap = 'round'
  for (const s of segments) {
    const clipped = clipLine(s, window)
    if (!clipped) continue
    ctx.beginPath()
    ctx.moveTo(clipped.x1, clipped.y1)
    ctx.lineTo(clipped.x2, clipped.y2)
    ctx.stroke()
    // 端点标记
    ctx.fillStyle = '#be185d'
    for (const [px, py] of [
      [clipped.x1, clipped.y1],
      [clipped.x2, clipped.y2],
    ]) {
      ctx.beginPath()
      ctx.arc(px, py, 3.5, 0, 2 * Math.PI)
      ctx.fill()
    }
  }
}
