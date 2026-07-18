/**
 * 九点圆 Canvas 绘制
 * 画三角形、九个特殊点、九点圆，可选高亮某一类点。
 */
import {
  ninePoints,
  ninePointCenter,
  ninePointRadius,
  orthocenter,
  type Pt,
} from './ninePointCircle'

// 九个点分三类：0-2 边中点，3-5 高垂足，6-8 垂心相关中点
export type Highlight = 'none' | 'mid' | 'foot' | 'ortho' | 'all'

const GROUP_COLOR: Record<string, string> = {
  mid: '#6366f1',
  foot: '#ec4899',
  ortho: '#f59e0b',
}

function groupOf(i: number): 'mid' | 'foot' | 'ortho' {
  return i < 3 ? 'mid' : i < 6 ? 'foot' : 'ortho'
}

export function drawNinePointCircle(
  canvas: HTMLCanvasElement,
  tri: [Pt, Pt, Pt],
  highlight: Highlight = 'all',
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  const [a, b, c] = tri

  // 三角形
  ctx.strokeStyle = '#334155'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(a.x, a.y)
  ctx.lineTo(b.x, b.y)
  ctx.lineTo(c.x, c.y)
  ctx.closePath()
  ctx.stroke()

  const center = ninePointCenter(a, b, c)
  const r = ninePointRadius(a, b, c)

  // 九点圆
  ctx.strokeStyle = '#0ea5e9'
  ctx.lineWidth = 2
  ctx.setLineDash([6, 4])
  ctx.beginPath()
  ctx.arc(center.x, center.y, r, 0, 2 * Math.PI)
  ctx.stroke()
  ctx.setLineDash([])

  // 高线（辅助显示垂足）
  if (highlight === 'foot' || highlight === 'all') {
    const h = orthocenter(a, b, c)
    ctx.strokeStyle = 'rgba(236,72,153,0.35)'
    ctx.lineWidth = 1
    for (const v of [a, b, c]) {
      ctx.beginPath()
      ctx.moveTo(v.x, v.y)
      ctx.lineTo(h.x, h.y)
      ctx.stroke()
    }
  }

  // 圆心
  ctx.fillStyle = '#0ea5e9'
  ctx.beginPath()
  ctx.arc(center.x, center.y, 3, 0, 2 * Math.PI)
  ctx.fill()

  // 九个点
  const pts = ninePoints(a, b, c)
  for (let i = 0; i < pts.length; i++) {
    const g = groupOf(i)
    const show = highlight === 'all' || highlight === g
    if (!show && highlight !== 'none') {
      ctx.fillStyle = '#cbd5e1'
    } else if (highlight === 'none') {
      ctx.fillStyle = '#cbd5e1'
    } else {
      ctx.fillStyle = GROUP_COLOR[g]
    }
    ctx.beginPath()
    ctx.arc(pts[i].x, pts[i].y, 5, 0, 2 * Math.PI)
    ctx.fill()
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 1.5
    ctx.stroke()
  }
}
