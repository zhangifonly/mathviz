/**
 * 庞加莱截面 Canvas 绘制
 * 把相空间 (x, v) 的频闪采样点画成点云，
 * 自动根据点云范围缩放到画布，并画坐标轴。
 */
import { poincareMap, type DuffingParams, type PoincarePoint } from './poincareSection'

function bounds(pts: PoincarePoint[]) {
  let minX = Infinity
  let maxX = -Infinity
  let minV = Infinity
  let maxV = -Infinity
  for (const p of pts) {
    if (p.x < minX) minX = p.x
    if (p.x > maxX) maxX = p.x
    if (p.v < minV) minV = p.v
    if (p.v > maxV) maxV = p.v
  }
  // 加边距，避免退化
  const padX = (maxX - minX) * 0.15 + 0.3
  const padV = (maxV - minV) * 0.15 + 0.3
  return { minX: minX - padX, maxX: maxX + padX, minV: minV - padV, maxV: maxV + padV }
}

/**
 * 绘制庞加莱截面。
 * @param steps 采样周期数（点数量）
 * @param color 点颜色
 */
export function drawPoincareSection(
  canvas: HTMLCanvasElement,
  params: DuffingParams,
  steps: number,
  color = '#6366f1',
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const pts = poincareMap(params, steps)
  if (pts.length === 0) return
  const b = bounds(pts)
  const sx = (x: number) => ((x - b.minX) / (b.maxX - b.minX)) * W
  const sy = (v: number) => H - ((v - b.minV) / (b.maxV - b.minV)) * H

  // 坐标轴 (x=0, v=0)
  ctx.strokeStyle = 'rgba(148,163,184,0.35)'
  ctx.lineWidth = 1
  if (b.minX < 0 && b.maxX > 0) {
    ctx.beginPath()
    ctx.moveTo(sx(0), 0)
    ctx.lineTo(sx(0), H)
    ctx.stroke()
  }
  if (b.minV < 0 && b.maxV > 0) {
    ctx.beginPath()
    ctx.moveTo(0, sy(0))
    ctx.lineTo(W, sy(0))
    ctx.stroke()
  }

  // 点云
  ctx.fillStyle = color
  const r = pts.length > 400 ? 1.1 : 2.4
  for (const p of pts) {
    ctx.beginPath()
    ctx.arc(sx(p.x), sy(p.v), r, 0, 2 * Math.PI)
    ctx.fill()
  }

  ctx.fillStyle = 'rgba(226,232,240,0.75)'
  ctx.font = '13px sans-serif'
  ctx.fillText('x (位置)', W - 70, H - 10)
  ctx.fillText('v (速度)', 8, 18)
}
