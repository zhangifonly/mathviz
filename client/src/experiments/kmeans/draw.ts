/**
 * K-means Canvas 绘制：按所属簇染色的数据点 + 大标记的中心
 */
import type { Point, Frame } from './kmeans'

const PALETTE = ['#6366f1', '#ec4899', '#22c55e', '#f59e0b', '#06b6d4', '#f43f5e']

/**
 * 绘制某一帧：先画点（按 assign 染色），再画中心大标记。
 */
export function drawKmeans(
  canvas: HTMLCanvasElement,
  points: Point[],
  frame: Frame,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, W, H)

  // 数据点，按所属簇染色
  for (let i = 0; i < points.length; i++) {
    const c = frame.assign[i] ?? 0
    ctx.fillStyle = PALETTE[c % PALETTE.length]
    ctx.globalAlpha = 0.75
    ctx.beginPath()
    ctx.arc(points[i].x, points[i].y, 4, 0, 2 * Math.PI)
    ctx.fill()
  }
  ctx.globalAlpha = 1

  // 簇中心：外圈白描边 + 内实心 + 十字标记
  for (let c = 0; c < frame.centers.length; c++) {
    const p = frame.centers[c]
    const color = PALETTE[c % PALETTE.length]
    ctx.beginPath()
    ctx.arc(p.x, p.y, 11, 0, 2 * Math.PI)
    ctx.fillStyle = '#ffffff'
    ctx.fill()
    ctx.beginPath()
    ctx.arc(p.x, p.y, 9, 0, 2 * Math.PI)
    ctx.fillStyle = color
    ctx.fill()
    ctx.strokeStyle = '#0f172a'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(p.x - 5, p.y)
    ctx.lineTo(p.x + 5, p.y)
    ctx.moveTo(p.x, p.y - 5)
    ctx.lineTo(p.x, p.y + 5)
    ctx.stroke()
  }
}
