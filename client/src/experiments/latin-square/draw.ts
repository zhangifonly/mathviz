/**
 * 拉丁方 Canvas 绘制：n×n 网格，每格按符号着色并标注数字。
 */
import { symbolColor } from './latinSquare'

/**
 * 绘制拉丁方。每格填充符号对应的颜色，并在格中写出符号数字。
 * @param highlight 可选高亮的行索引（画整行边框，用于讲解“每行唯一”）
 */
export function drawLatinSquare(
  canvas: HTMLCanvasElement,
  grid: number[][],
  highlight = -1,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx || grid.length === 0) return
  const W = canvas.width
  const H = canvas.height
  const n = grid.length
  const size = Math.min(W, H)
  const cell = size / n
  const ox = (W - size) / 2
  const oy = (H - size) / 2

  ctx.clearRect(0, 0, W, H)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `bold ${Math.floor(cell * 0.42)}px system-ui, sans-serif`

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const v = grid[i][j]
      const x = ox + j * cell
      const y = oy + i * cell
      ctx.fillStyle = symbolColor(v)
      ctx.globalAlpha = 0.85
      ctx.fillRect(x, y, cell, cell)
      ctx.globalAlpha = 1
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.strokeRect(x, y, cell, cell)
      ctx.fillStyle = '#0f172a'
      ctx.fillText(String(v + 1), x + cell / 2, y + cell / 2)
    }
  }

  if (highlight >= 0 && highlight < n) {
    ctx.strokeStyle = '#111827'
    ctx.lineWidth = 4
    ctx.strokeRect(ox, oy + highlight * cell, size, cell)
  }
}
