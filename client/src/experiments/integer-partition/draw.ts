/**
 * 整数分拆 Canvas 绘制：把一个分拆画成杨氏图（Ferrers 图）
 * 每个部件是一行方块，行长等于该部件大小；可选叠画共轭（转置）网格。
 */
import { conjugate } from './integerPartition'

/**
 * 绘制一个分拆的杨氏图。
 * @param showConjugate 为 true 时用虚线画出转置后的列，直观展示共轭
 */
export function drawIntegerPartition(
  canvas: HTMLCanvasElement,
  partition: number[],
  showConjugate = false,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  if (partition.length === 0) return

  const maxCol = partition[0]
  const rows = partition.length
  // 方块边长，留出边距，取行列约束的较小值
  const cell = Math.max(12, Math.min(56, Math.floor(Math.min((W - 80) / maxCol, (H - 80) / rows))))
  const gw = maxCol * cell
  const gh = rows * cell
  const ox = (W - gw) / 2
  const oy = (H - gh) / 2

  // 填充方块
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < partition[r]; c++) {
      const x = ox + c * cell
      const y = oy + r * cell
      ctx.fillStyle = '#6366f1'
      ctx.fillRect(x + 1.5, y + 1.5, cell - 3, cell - 3)
      ctx.strokeStyle = '#c7d2fe'
      ctx.lineWidth = 1
      ctx.strokeRect(x + 1.5, y + 1.5, cell - 3, cell - 3)
    }
  }

  if (showConjugate) {
    const conj = conjugate(partition)
    ctx.strokeStyle = '#ec4899'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 4])
    // 沿列方向画出转置分拆的每一列高度框
    for (let c = 0; c < conj.length; c++) {
      const x = ox + c * cell
      ctx.strokeRect(x + 1.5, oy + 1.5, cell - 3, conj[c] * cell - 3)
    }
    ctx.setLineDash([])
  }

  // 底部标注部件序列
  ctx.fillStyle = '#334155'
  ctx.font = '16px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(partition.join(' + '), W / 2, oy + gh + 30)
}
