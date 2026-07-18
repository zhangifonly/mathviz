/**
 * 格雷码 Canvas 绘制
 *
 * 竖排画出格雷码序列，每行是一个码字的二进制格子（1 实心、0 空心），
 * 并高亮相邻两行发生翻转的那一位，直观展示"相邻只差一位"。
 */
import { grayCodeSequence, changedBitIndex } from './grayCode'

/**
 * @param bits    位数（决定序列长度 2^bits 与列数）
 * @param active  当前高亮到的行索引（负数表示不高亮翻转位）
 */
export function drawGrayCode(
  canvas: HTMLCanvasElement,
  bits: number,
  active = -1,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const seq = grayCodeSequence(bits)
  const rows = seq.length
  const padX = 60
  const padY = 24
  const cell = Math.min((W - padX * 2) / bits, (H - padY * 2) / rows)
  const gridW = cell * bits
  const startX = (W - gridW) / 2

  for (let r = 0; r < rows; r++) {
    const y = padY + r * cell
    const changed = r > 0 ? changedBitIndex(seq[r - 1], seq[r]) : -1

    // 行号（十进制序号）
    ctx.fillStyle = '#64748b'
    ctx.font = `${Math.min(cell * 0.5, 16)}px monospace`
    ctx.textAlign = 'right'
    ctx.textBaseline = 'middle'
    ctx.fillText(String(r), startX - 10, y + cell / 2)

    for (let c = 0; c < bits; c++) {
      const x = startX + c * cell
      const bit = seq[r][c]
      const isHot = r === active && c === changed

      ctx.beginPath()
      ctx.rect(x + 2, y + 2, cell - 4, cell - 4)
      if (bit === 1) {
        ctx.fillStyle = isHot ? '#f97316' : '#6366f1'
        ctx.fill()
      } else {
        ctx.fillStyle = isHot ? '#fed7aa' : '#eef2ff'
        ctx.fill()
      }
      ctx.strokeStyle = isHot ? '#ea580c' : '#c7d2fe'
      ctx.lineWidth = isHot ? 2.5 : 1
      ctx.stroke()
    }
  }
}
