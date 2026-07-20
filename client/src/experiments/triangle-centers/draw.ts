/**
 * 三角形四心 Canvas 绘制
 * 画三角形、四心（不同颜色）、可选外接圆与内切圆。
 */
import {
  centroid, circumcenter, incenter, orthocenter,
  circumradius, inradius, type Triangle, type Point,
} from './triangleCenters'

const CENTERS = {
  centroid: { color: '#6366f1', label: '重心 G' },
  circumcenter: { color: '#ec4899', label: '外心 O' },
  incenter: { color: '#22c55e', label: '内心 I' },
  orthocenter: { color: '#f59e0b', label: '垂心 H' },
}

function dot(ctx: CanvasRenderingContext2D, p: Point, color: string) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI)
  ctx.fill()
}

function circle(ctx: CanvasRenderingContext2D, c: Point, r: number, color: string) {
  ctx.strokeStyle = color
  ctx.lineWidth = 1.5
  ctx.setLineDash([5, 4])
  ctx.beginPath()
  ctx.arc(c.x, c.y, r, 0, 2 * Math.PI)
  ctx.stroke()
  ctx.setLineDash([])
}

export function drawTriangleCenters(
  canvas: HTMLCanvasElement,
  t: Triangle,
  opts: { showCircum?: boolean; showIn?: boolean; showCenters?: boolean } = {},
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const { showCircum = true, showIn = true, showCenters = true } = opts
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // 三角形本体
  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth = 2.5
  ctx.fillStyle = 'rgba(99,102,241,0.08)'
  ctx.beginPath()
  ctx.moveTo(t[0].x, t[0].y)
  ctx.lineTo(t[1].x, t[1].y)
  ctx.lineTo(t[2].x, t[2].y)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // 顶点标注
  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 15px sans-serif'
  const names = ['A', 'B', 'C']
  t.forEach((p, i) => ctx.fillText(names[i], p.x - 6, p.y - 8))

  if (showCircum) {
    circle(ctx, circumcenter(t), circumradius(t), CENTERS.circumcenter.color)
  }
  if (showIn) {
    circle(ctx, incenter(t), inradius(t), CENTERS.incenter.color)
  }

  if (showCenters) {
    dot(ctx, centroid(t), CENTERS.centroid.color)
    dot(ctx, circumcenter(t), CENTERS.circumcenter.color)
    dot(ctx, incenter(t), CENTERS.incenter.color)
    dot(ctx, orthocenter(t), CENTERS.orthocenter.color)
  }
}

export { CENTERS }
