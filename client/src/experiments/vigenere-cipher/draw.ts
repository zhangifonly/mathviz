/**
 * 维吉尼亚密码 Canvas 绘制
 * 上方：26x26 维吉尼亚方阵，高亮当前明文行、密钥列与交点。
 * 下方：明文 / 密钥 / 密文 对齐三行，高亮当前列。
 */
import { tabulaRecta, alignedRows, toIndex } from './vigenereCipher'

const MATRIX = tabulaRecta()

/**
 * @param col 当前聚焦的列（对齐三行里的第几个字母），-1 表示不聚焦
 */
export function drawVigenereCipher(
  canvas: HTMLCanvasElement,
  text: string,
  key: string,
  col = -1,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, W, H)

  const rows = alignedRows(text, key)
  const focus = col >= 0 && col < rows.plain.length ? col : -1
  const pIdx = focus >= 0 ? toIndex(rows.plain[focus]) : -1
  const kIdx = focus >= 0 ? toIndex(rows.key[focus]) : -1

  // ---- 维吉尼亚方阵 ----
  const cell = Math.floor(Math.min(W / 27, (H - 120) / 27))
  const ox = (W - cell * 27) / 2
  const oy = 6
  ctx.font = `${Math.max(8, cell - 3)}px monospace`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  for (let r = -1; r < 26; r++) {
    for (let c = -1; c < 26; c++) {
      const x = ox + (c + 1) * cell
      const y = oy + (r + 1) * cell
      const header = r === -1 || c === -1
      let bg = header ? '#e2e8f0' : '#ffffff'
      let fg = '#334155'
      if (!header && r === pIdx && c === kIdx) { bg = '#f59e0b'; fg = '#fff' }
      else if (!header && (r === pIdx || c === kIdx)) bg = '#fef3c7'
      else if (r === -1 && c === kIdx) bg = '#fde68a'
      else if (c === -1 && r === pIdx) bg = '#fde68a'
      ctx.fillStyle = bg
      ctx.fillRect(x, y, cell - 0.5, cell - 0.5)
      const ch = header
        ? (r === -1 && c === -1 ? '+' : r === -1 ? MATRIX[0][c] : MATRIX[r][0])
        : MATRIX[r][c]
      ctx.fillStyle = fg
      ctx.fillText(ch, x + cell / 2, y + cell / 2)
    }
  }

  // ---- 对齐三行 ----
  drawRows(ctx, W, oy + 27 * cell + 14, rows, focus)
}

function drawRows(
  ctx: CanvasRenderingContext2D,
  W: number,
  top: number,
  rows: { plain: string[]; key: string[]; cipher: string[] },
  focus: number,
) {
  const n = rows.plain.length
  const cw = n > 0 ? Math.min(26, (W - 90) / n) : 20
  const labels = ['明文', '密钥', '密文']
  const data = [rows.plain, rows.key, rows.cipher]
  const colors = ['#2563eb', '#059669', '#dc2626']
  ctx.font = '14px monospace'
  for (let row = 0; row < 3; row++) {
    const y = top + row * 30
    ctx.textAlign = 'left'
    ctx.fillStyle = colors[row]
    ctx.fillText(labels[row], 8, y + 11)
    ctx.textAlign = 'center'
    for (let i = 0; i < n; i++) {
      const x = 80 + i * cw
      if (i === focus) {
        ctx.fillStyle = '#f59e0b'
        ctx.fillRect(x - cw / 2 + 1, y - 2, cw - 2, 26)
        ctx.fillStyle = '#fff'
      } else {
        ctx.fillStyle = colors[row]
      }
      ctx.fillText(data[row][i], x, y + 11)
    }
  }
}
