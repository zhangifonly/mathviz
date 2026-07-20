/**
 * 进制转换 Canvas 绘制
 * 把一个十进制数在若干进制下的位值展开画成方块行，
 * 每一行是一个进制，行内每一格标注 digit×base^power。
 */
import { toBase, toBaseString } from './numberBases'

const COLORS = ['#6366f1', '#ec4899', '#22d3ee', '#f59e0b', '#34d399', '#a78bfa']

/**
 * 绘制 n 在 bases 各进制下的位值展开表。
 */
export function drawNumberBases(
  canvas: HTMLCanvasElement,
  n: number,
  bases: number[],
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const padX = 24
  const topY = 56
  const rowH = (H - topY - 20) / bases.length

  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 22px system-ui, sans-serif'
  ctx.textBaseline = 'middle'
  ctx.fillText(`十进制数 ${n} 的位值展开`, padX, 28)

  bases.forEach((base, row) => {
    const y = topY + row * rowH
    const digits = toBase(n, base)
    const cellW = Math.min(58, (W - padX * 2 - 90) / Math.max(digits.length, 1))
    const cellH = Math.min(rowH - 26, 46)

    ctx.fillStyle = '#334155'
    ctx.font = 'bold 15px system-ui, sans-serif'
    ctx.fillText(`base ${base}`, padX, y + cellH / 2)
    ctx.fillStyle = '#0f172a'
    ctx.font = 'bold 16px monospace'
    ctx.fillText(toBaseString(n, base), padX, y + cellH + 10)

    digits.forEach((d, i) => {
      const power = digits.length - 1 - i
      const x = padX + 78 + i * (cellW + 6)
      const color = COLORS[power % COLORS.length]
      ctx.fillStyle = d === 0 ? '#e2e8f0' : color
      ctx.fillRect(x, y, cellW, cellH)
      ctx.fillStyle = d === 0 ? '#94a3b8' : '#ffffff'
      ctx.font = 'bold 18px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(String(d), x + cellW / 2, y + cellH / 2 - 4)
      ctx.font = '10px monospace'
      ctx.fillText(`${base}^${power}`, x + cellW / 2, y + cellH / 2 + 13)
      ctx.textAlign = 'left'
    })
  })
}
