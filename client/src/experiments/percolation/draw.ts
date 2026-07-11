/**
 * 渗流模型 Canvas 绘制
 *
 * 关闭格点画成深色背景；开放格点按所属簇上色。
 * 贯穿簇（发生渗流的簇）用醒目的高亮色，其余簇用调色板循环上色，
 * 让"巨簇涌现 / 相变"直观可见。
 */

import { labelClusters, spanningClusterId } from './percolation'

/** 非贯穿簇的循环调色板 */
const PALETTE = ['#38bdf8', '#818cf8', '#c084fc', '#f472b6', '#fb923c', '#a3e635', '#2dd4bf']

/** 贯穿簇的高亮色（发生渗流时的巨簇） */
const SPANNING_COLOR = '#facc15'

export interface PercolationDrawData {
  grid: boolean[][]
  p: number
}

/**
 * 绘制渗流点阵。
 * @param progress 0→1 逐行揭示（从顶行向底行铺开）
 */
export function drawPercolation(
  canvas: HTMLCanvasElement,
  data: PercolationDrawData,
  progress: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const { grid } = data
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const n = grid.length
  if (n === 0) return

  const res = labelClusters(grid)
  const spanId = spanningClusterId(res)

  const cell = Math.min(W, H) / n
  const offsetX = (W - cell * n) / 2
  const offsetY = (H - cell * n) / 2
  const upto = Math.max(1, Math.floor(n * Math.min(1, Math.max(0, progress))))

  for (let i = 0; i < upto; i++) {
    for (let j = 0; j < n; j++) {
      const label = res.labels[i][j]
      const x = offsetX + j * cell
      const y = offsetY + i * cell
      if (label === 0) {
        // 关闭格点，画一格暗底
        ctx.fillStyle = '#1e293b'
        ctx.fillRect(x + 0.5, y + 0.5, Math.max(1, cell - 1), Math.max(1, cell - 1))
        continue
      }
      if (spanId > 0 && label === spanId) {
        ctx.fillStyle = SPANNING_COLOR
      } else {
        ctx.fillStyle = PALETTE[(label - 1) % PALETTE.length]
      }
      ctx.fillRect(x + 0.5, y + 0.5, Math.max(1, cell - 1), Math.max(1, cell - 1))
    }
  }
}
