/**
 * 平方和定理 Canvas 绘制
 * 两种模式：
 *  - 'grid' 在 1..N 的方格网中高亮能表示为两平方和的数
 *  - 'circle' 画 a^2+b^2=n 的格点圆（半径 sqrt(n)），标出落在圆上的整点
 */
import { sumsInRange, waysToSumTwoSquares } from './sumOfSquares'

export function drawSumOfSquares(
  canvas: HTMLCanvasElement,
  N: number,
  mode: 'grid' | 'circle' = 'grid',
  highlightN = 0,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  if (mode === 'circle') return drawCircle(ctx, W, H, highlightN || N)

  const cols = Math.ceil(Math.sqrt(N))
  const rows = Math.ceil(N / cols)
  const cell = Math.min(W / cols, H / rows)
  const ox = (W - cell * cols) / 2
  const oy = (H - cell * rows) / 2
  const flags = sumsInRange(N)
  ctx.font = `${Math.max(8, cell * 0.32)}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  for (let i = 0; i < N; i++) {
    const n = i + 1
    const cx = ox + (i % cols) * cell
    const cy = oy + Math.floor(i / cols) * cell
    const on = flags[i]
    ctx.fillStyle = n === highlightN ? '#f59e0b' : on ? '#6366f1' : '#e2e8f0'
    ctx.fillRect(cx + 1, cy + 1, cell - 2, cell - 2)
    ctx.fillStyle = on || n === highlightN ? '#ffffff' : '#94a3b8'
    ctx.fillText(String(n), cx + cell / 2, cy + cell / 2)
  }
}

function drawCircle(ctx: CanvasRenderingContext2D, W: number, H: number, n: number) {
  const pairs = waysToSumTwoSquares(n)
  const r = Math.sqrt(n)
  const scale = (Math.min(W, H) * 0.42) / (r || 1)
  const ox = W / 2
  const oy = H / 2
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, oy)
  ctx.lineTo(W, oy)
  ctx.moveTo(ox, 0)
  ctx.lineTo(ox, H)
  ctx.stroke()
  ctx.strokeStyle = '#6366f1'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(ox, oy, r * scale, 0, 2 * Math.PI)
  ctx.stroke()
  ctx.fillStyle = '#f59e0b'
  for (const { a, b } of pairs) {
    for (const [px, py] of [[a, b], [b, a], [-a, b], [-b, a], [a, -b], [b, -a], [-a, -b], [-b, -a]]) {
      ctx.beginPath()
      ctx.arc(ox + px * scale, oy - py * scale, 5, 0, 2 * Math.PI)
      ctx.fill()
    }
  }
  ctx.fillStyle = '#0f172a'
  ctx.font = '16px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(`n = ${n}, 半径 sqrt(${n})`, ox, H - 14)
}
