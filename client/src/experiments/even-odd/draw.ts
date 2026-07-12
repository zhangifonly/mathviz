/**
 * 奇偶数与整除 Canvas 绘制
 * 把 1..N 排成方格，被 divisor 整除的格子点亮，其余留暗。
 */

import type { NumberCell } from './evenOdd'

const HIT = '#22d3ee'   // 被整除：亮青
const MISS = '#1e293b'  // 不被整除：暗底
const TEXT = '#e2e8f0'
const TEXT_DIM = '#64748b'

/**
 * 绘制数格。
 * @param cells buildGrid 生成的数格
 * @param progress 0→1 逐格揭示
 */
export function drawEvenOdd(
  canvas: HTMLCanvasElement,
  cells: NumberCell[],
  progress: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx || cells.length === 0) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const total = cells.length
  const cols = Math.ceil(Math.sqrt(total))
  const rows = Math.ceil(total / cols)
  const pad = 6
  const cell = Math.min((W - pad * 2) / cols, (H - pad * 2) / rows)
  const gridW = cols * cell
  const gridH = rows * cell
  const originX = (W - gridW) / 2
  const originY = (H - gridH) / 2

  const upto = Math.max(1, Math.floor(total * progress))
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const fontSize = Math.max(8, Math.floor(cell * 0.36))
  ctx.font = `${fontSize}px sans-serif`

  for (let i = 0; i < upto; i++) {
    const c = cells[i]
    const col = i % cols
    const row = Math.floor(i / cols)
    const x = originX + col * cell
    const y = originY + row * cell
    const g = Math.max(1, cell - 2)

    ctx.fillStyle = c.divisible ? HIT : MISS
    ctx.fillRect(x + 1, y + 1, g, g)

    if (cell >= 18) {
      ctx.fillStyle = c.divisible ? '#0f172a' : TEXT_DIM
      ctx.fillText(String(c.n), x + cell / 2, y + cell / 2 + 1)
    }
  }

  // 顶部计数
  const hitCount = cells.slice(0, upto).filter((c) => c.divisible).length
  ctx.fillStyle = TEXT
  ctx.textAlign = 'left'
  ctx.font = '13px sans-serif'
  ctx.fillText(`已点亮 ${hitCount} 个`, 8, 14)
}
