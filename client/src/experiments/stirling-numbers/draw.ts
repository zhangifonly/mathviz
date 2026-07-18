/**
 * 斯特林三角 Canvas 绘制（类似帕斯卡三角的数字三角）
 */
import { stirlingTriangle } from './stirlingNumbers'

/**
 * 绘制斯特林三角。逐行居中排列数字，可高亮某个格子 (hn, hk)。
 * @param kind 'second' 第二类 | 'first' 第一类
 * @param highlight 需要高亮的格子坐标 [n, k]，为空则不高亮
 */
export function drawStirlingNumbers(
  canvas: HTMLCanvasElement,
  maxN: number,
  kind: 'first' | 'second' = 'second',
  highlight: [number, number] | null = null,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const tri = stirlingTriangle(maxN, kind)
  const rows = tri.length
  const rowH = (H - 40) / rows
  const cellW = Math.min(rowH * 1.4, (W - 40) / (rows + 1))
  const topColor = kind === 'first' ? '#7c3aed' : '#0ea5e9'

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `${Math.max(10, Math.min(18, rowH * 0.42))}px system-ui, sans-serif`

  for (let n = 0; n < rows; n++) {
    const row = tri[n]
    const cy = 30 + n * rowH
    const startX = W / 2 - (row.length - 1) * cellW / 2
    for (let k = 0; k < row.length; k++) {
      const cx = startX + k * cellW
      const isHi = highlight && highlight[0] === n && highlight[1] === k
      const val = row[k]
      // 数值越大颜色越深，直观呈现三角的增长
      const alpha = val === 0 ? 0.06 : Math.min(0.85, 0.15 + Math.log10(val + 1) * 0.28)
      ctx.beginPath()
      ctx.arc(cx, cy, Math.min(cellW, rowH) * 0.42, 0, 2 * Math.PI)
      ctx.fillStyle = isHi ? '#f59e0b' : topColor
      ctx.globalAlpha = isHi ? 0.95 : alpha
      ctx.fill()
      ctx.globalAlpha = 1
      ctx.fillStyle = isHi || alpha > 0.5 ? '#ffffff' : '#0f172a'
      ctx.fillText(String(val), cx, cy)
    }
  }
}
