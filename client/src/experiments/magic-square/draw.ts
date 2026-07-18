/**
 * 幻方 Canvas 绘制：画 n×n 方格填入数字，可高亮某条线。
 */
import { lineCells, magicConstant, type LineKind } from './magicSquare'

export interface HighlightLine {
  kind: LineKind
  index?: number
}

/**
 * 绘制幻方。
 * @param highlight 可选，高亮的行/列/对角线
 */
export function drawMagicSquare(
  canvas: HTMLCanvasElement,
  square: number[][],
  highlight?: HighlightLine,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  const n = square.length
  if (n === 0) return

  ctx.clearRect(0, 0, W, H)
  const pad = 30
  const cell = Math.min(W - pad * 2, H - pad * 2) / n
  const ox = (W - cell * n) / 2
  const oy = (H - cell * n) / 2

  const hot = new Set<string>()
  if (highlight) {
    for (const [r, c] of lineCells(n, highlight.kind, highlight.index ?? 0)) {
      hot.add(`${r},${c}`)
    }
  }

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `bold ${Math.floor(cell * 0.38)}px sans-serif`
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const x = ox + c * cell
      const y = oy + r * cell
      const on = hot.has(`${r},${c}`)
      ctx.fillStyle = on ? '#6366f1' : '#eef2ff'
      ctx.fillRect(x, y, cell, cell)
      ctx.strokeStyle = '#c7d2fe'
      ctx.lineWidth = 1.5
      ctx.strokeRect(x, y, cell, cell)
      ctx.fillStyle = on ? '#ffffff' : '#3730a3'
      ctx.fillText(String(square[r][c]), x + cell / 2, y + cell / 2)
    }
  }

  if (highlight) {
    ctx.fillStyle = '#4338ca'
    ctx.font = 'bold 18px sans-serif'
    ctx.fillText(`这条线之和 = ${magicConstant(n)}`, W / 2, oy + cell * n + 16)
  }
}
