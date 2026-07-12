/**
 * 一维初等元胞自动机 Canvas 绘制
 *
 * 网格 grid[g][i]：第 g 行是第 g 代，从上往下逐代揭示。
 * 存活格（1）涂亮色，死亡格（0）留暗背景。
 */

/** 存活格调色板：按所在代做渐变，让分形结构的层次更清晰。 */
const PALETTE = ['#38bdf8', '#22d3ee', '#34d399', '#a3e635', '#fbbf24', '#f472b6']

/**
 * 绘制元胞自动机演化网格。
 * @param grid evolve 生成的二维 0/1 网格（每行一代）
 * @param progress 0→1 逐代（逐行）揭示
 */
export function drawCellularAutomata(
  canvas: HTMLCanvasElement,
  grid: number[][],
  progress: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx || grid.length === 0) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const gens = grid.length
  const width = grid[0].length
  const cell = Math.min(W / width, H / gens)
  const gridW = width * cell
  const startX = (W - gridW) / 2
  const upto = Math.max(1, Math.floor(gens * progress))

  for (let g = 0; g < upto; g++) {
    const row = grid[g]
    const y = g * cell
    const color = PALETTE[Math.floor((g / gens) * PALETTE.length) % PALETTE.length]
    for (let i = 0; i < width; i++) {
      if (row[i] === 0) continue
      ctx.fillStyle = color
      ctx.fillRect(startX + i * cell, y, Math.max(1, cell - 0.4), Math.max(1, cell - 0.4))
    }
  }
}
