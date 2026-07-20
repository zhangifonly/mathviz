/**
 * 动态规划 DP 表 Canvas 绘制（热力图 + 数字 + 填充进度 + 回溯高亮）
 */
import type { Cell } from './dynamicProgramming'

export interface DpView {
  table: number[][]
  rowLabels: string[]   // 行首标签（含空串占位）
  colLabels: string[]   // 列首标签
  path: Cell[]          // 最优回溯路径格子
}

/**
 * @param filled 已填充格子数（按行优先），用于展示填表顺序；<=0 表示全表
 */
export function drawDynamicProgramming(
  canvas: HTMLCanvasElement,
  view: DpView,
  filled = -1,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const rows = view.table.length
  const cols = view.table[0].length
  const pad = 34
  const cw = (W - pad) / cols
  const ch = (H - pad) / rows
  let max = 1
  for (const row of view.table) for (const v of row) if (v > max) max = v

  const onPath = new Set(view.path.map((c) => `${c.r},${c.c}`))
  const total = filled < 0 ? rows * cols : filled

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = '13px system-ui, sans-serif'

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = pad + c * cw
      const y = pad + r * ch
      const seq = r * cols + c
      const shown = seq < total
      const v = view.table[r][c]
      const t = v / max
      if (shown) {
        ctx.fillStyle = `rgba(99,102,241,${0.12 + 0.6 * t})`
      } else {
        ctx.fillStyle = '#f1f5f9'
      }
      ctx.fillRect(x + 1, y + 1, cw - 2, ch - 2)
      if (shown && onPath.has(`${r},${c}`)) {
        ctx.strokeStyle = '#f59e0b'
        ctx.lineWidth = 3
        ctx.strokeRect(x + 2, y + 2, cw - 4, ch - 4)
      }
      if (shown) {
        ctx.fillStyle = t > 0.6 ? '#ffffff' : '#1e293b'
        ctx.fillText(String(v), x + cw / 2, y + ch / 2)
      }
    }
  }

  ctx.fillStyle = '#64748b'
  ctx.font = 'bold 13px system-ui, sans-serif'
  for (let c = 0; c < cols; c++) {
    ctx.fillText(view.colLabels[c] ?? '', pad + c * cw + cw / 2, pad / 2)
  }
  for (let r = 0; r < rows; r++) {
    ctx.fillText(view.rowLabels[r] ?? '', pad / 2, pad + r * ch + ch / 2)
  }
}
