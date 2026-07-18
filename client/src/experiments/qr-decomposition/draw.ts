/**
 * QR 分解 Canvas 绘制
 * 左侧：把矩阵各列向量投影到平面（取前两分量），
 *       画出原始列 a_j 与正交化后的 q_j，展示正交化效果；
 * 右侧：以文本表格显示 Q 与 R 的分解结果。
 */
import { qrDecompose, getColumn, type Matrix } from './qrDecomposition'

const COLORS = ['#6366f1', '#ec4899', '#22d3ee']

function arrow(ctx: CanvasRenderingContext2D, ox: number, oy: number, x: number, y: number, color: string) {
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(ox, oy)
  ctx.lineTo(x, y)
  ctx.stroke()
  const ang = Math.atan2(y - oy, x - ox)
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x - 10 * Math.cos(ang - 0.4), y - 10 * Math.sin(ang - 0.4))
  ctx.lineTo(x - 10 * Math.cos(ang + 0.4), y - 10 * Math.sin(ang + 0.4))
  ctx.closePath()
  ctx.fill()
}

function drawTable(ctx: CanvasRenderingContext2D, x: number, y: number, title: string, M: Matrix) {
  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 15px monospace'
  ctx.fillText(title, x, y)
  ctx.font = '13px monospace'
  ctx.fillStyle = '#334155'
  M.forEach((row, i) => {
    const s = row.map((v) => (v >= 0 ? ' ' : '') + v.toFixed(2)).join('  ')
    ctx.fillText('[ ' + s + ' ]', x, y + 24 + i * 20)
  })
}

/**
 * @param showQ 是否叠加正交化后的 Q 列（true 显示分解结果）
 */
export function drawQrDecomposition(canvas: HTMLCanvasElement, A: Matrix, showQ = true) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const cx = W * 0.28
  const cy = H * 0.55
  const scale = Math.min(W, H) * 0.16
  // 坐标轴
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(cx - 130, cy); ctx.lineTo(cx + 130, cy)
  ctx.moveTo(cx, cy - 130); ctx.lineTo(cx, cy + 130)
  ctx.stroke()

  const n = A[0].length
  // 原始列向量（虚线）
  ctx.setLineDash([5, 4])
  for (let j = 0; j < n; j++) {
    const c = getColumn(A, j)
    arrow(ctx, cx, cy, cx + c[0] * scale, cy - (c[1] ?? 0) * scale, COLORS[j % 3] + '88')
  }
  ctx.setLineDash([])

  if (showQ) {
    const { Q } = qrDecompose(A)
    for (let j = 0; j < n; j++) {
      const q = getColumn(Q, j)
      arrow(ctx, cx, cy, cx + q[0] * scale, cy - (q[1] ?? 0) * scale, COLORS[j % 3])
    }
  }
  ctx.fillStyle = '#64748b'
  ctx.font = '12px sans-serif'
  ctx.fillText('虚线=原始列 A  实线=正交列 Q', cx - 120, cy + 150)

  const { Q, R } = qrDecompose(A)
  drawTable(ctx, W * 0.56, 60, 'Q (正交阵)', Q)
  drawTable(ctx, W * 0.56, 60 + Q.length * 20 + 70, 'R (上三角)', R)
}
