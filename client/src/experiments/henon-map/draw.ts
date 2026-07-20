/**
 * 埃农映射 Canvas 绘制：把吸引子点云归一化后绘成分形点图
 */
import { iterate, bounds } from './henonMap'

/**
 * 绘制埃农吸引子点云。
 * @param a 参数 a
 * @param b 参数 b
 * @param n 采集点数（越多分形结构越清晰）
 */
export function drawHenonMap(
  canvas: HTMLCanvasElement,
  a = 1.4,
  b = 0.3,
  n = 20000,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const pts = iterate(a, b, n)
  const box = bounds(pts)
  const pad = 24
  const spanX = box.maxX - box.minX || 1
  const spanY = box.maxY - box.minY || 1
  const sx = (W - 2 * pad) / spanX
  const sy = (H - 2 * pad) / spanY

  ctx.fillStyle = 'rgba(56, 189, 248, 0.75)'
  for (const p of pts) {
    const px = pad + (p.x - box.minX) * sx
    // y 轴翻转，让吸引子正立显示
    const py = H - pad - (p.y - box.minY) * sy
    ctx.fillRect(px, py, 1, 1)
  }
}
