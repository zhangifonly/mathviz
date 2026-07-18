/**
 * 贝尔三角 Canvas 绘制。
 * 每行末尾的元素就是贝尔数，用高亮色标出。
 */
import { bellTriangle } from './bellNumbers'

/**
 * 绘制贝尔三角。
 * @param rows 显示的行数（三角画到第 rows 行）
 * @param progress 0→1 逐行揭示
 */
export function drawBellNumbers(
  canvas: HTMLCanvasElement,
  rows: number,
  progress = 1,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const tri = bellTriangle(rows)
  const total = tri.length
  const upto = Math.max(1, Math.floor(total * progress))
  const rowH = Math.min((H - 30) / total, 56)
  const cellW = Math.min((W - 40) / total, 78)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `${Math.max(11, Math.floor(rowH * 0.34))}px monospace`

  for (let i = 0; i < upto; i++) {
    const row = tri[i]
    const y = 20 + i * rowH + rowH / 2
    const startX = (W - row.length * cellW) / 2 + cellW / 2
    for (let j = 0; j < row.length; j++) {
      const x = startX + j * cellW
      const isBell = j === row.length - 1
      ctx.fillStyle = isBell ? '#fbbf24' : '#1e293b'
      ctx.beginPath()
      ctx.roundRect(x - cellW / 2 + 3, y - rowH / 2 + 3, cellW - 6, rowH - 6, 6)
      ctx.fill()
      ctx.fillStyle = isBell ? '#0f172a' : '#e2e8f0'
      ctx.fillText(String(row[j]), x, y)
    }
  }

  ctx.fillStyle = '#fbbf24'
  ctx.textAlign = 'left'
  ctx.font = '13px sans-serif'
  ctx.fillText('每行末尾 = 贝尔数 B(n)', 12, H - 12)
}
