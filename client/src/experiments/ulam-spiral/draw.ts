/**
 * 素数螺旋 Canvas 绘制
 */
import type { Cell } from './ulam'

/**
 * 绘制乌拉姆螺旋。
 * @param progress 0→1 逐格揭示进度
 */
export function drawSpiral(canvas: HTMLCanvasElement, cells: Cell[], progress: number) {
  const ctx = canvas.getContext('2d')
  if (!ctx || cells.length === 0) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  // 网格范围
  let maxR = 0
  for (const c of cells) maxR = Math.max(maxR, Math.abs(c.x), Math.abs(c.y))
  const side = 2 * maxR + 1
  const cell = Math.floor(Math.min(W, H) / side)
  const cx = W / 2
  const cy = H / 2

  const upto = Math.max(1, Math.floor(cells.length * progress))
  for (let i = 0; i < upto; i++) {
    const c = cells[i]
    const px = cx + c.x * cell - cell / 2
    const py = cy - c.y * cell - cell / 2
    if (c.prime) {
      ctx.fillStyle = '#fbbf24' // 素数：金色
      ctx.fillRect(px, py, cell - 1, cell - 1)
    } else {
      ctx.fillStyle = 'rgba(99,102,241,0.12)' // 合数：淡紫
      ctx.fillRect(px, py, cell - 1, cell - 1)
    }
  }
}
