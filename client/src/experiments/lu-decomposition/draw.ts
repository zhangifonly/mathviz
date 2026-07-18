/**
 * LU 分解 Canvas 绘制：并排展示 A = L · U 三张矩阵表格
 */
import { luDecompose, type Matrix } from './luDecomposition'

function fmt(v: number): string {
  const r = Math.round(v * 100) / 100
  return Object.is(r, -0) ? '0' : String(r)
}

/** 画一张矩阵表格，返回其右边缘 x 坐标 */
function drawMatrix(
  ctx: CanvasRenderingContext2D,
  m: Matrix,
  ox: number,
  oy: number,
  cell: number,
  label: string,
  fill: string,
) {
  const n = m.length
  ctx.font = '600 13px system-ui, sans-serif'
  ctx.fillStyle = '#334155'
  ctx.textAlign = 'center'
  ctx.fillText(label, ox + (n * cell) / 2, oy - 12)
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const x = ox + j * cell
      const y = oy + i * cell
      ctx.fillStyle = fill
      ctx.fillRect(x, y, cell - 3, cell - 3)
      ctx.strokeStyle = '#cbd5e1'
      ctx.strokeRect(x, y, cell - 3, cell - 3)
      ctx.fillStyle = '#0f172a'
      ctx.font = '14px system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(fmt(m[i][j]), x + (cell - 3) / 2, y + (cell - 3) / 2)
    }
  }
  ctx.textBaseline = 'alphabetic'
  return ox + n * cell
}

/** 绘制 A、L、U 三张表格，直观呈现 A 分解为 L·U */
export function drawLuDecomposition(canvas: HTMLCanvasElement, A: Matrix) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, W, H)

  let U: Matrix, L: Matrix
  try {
    ;({ L, U } = luDecompose(A))
  } catch {
    ctx.fillStyle = '#dc2626'
    ctx.font = '16px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('该矩阵主元为零，需选主元', W / 2, H / 2)
    return
  }

  const cell = Math.min(56, (W - 120) / (A.length * 3))
  const rowW = A.length * cell
  const oy = H / 2 - rowW / 2 + 24
  let x = 40
  x = drawMatrix(ctx, A, x, oy, cell, 'A', '#e0e7ff') + 20
  ctx.fillStyle = '#6366f1'
  ctx.font = '600 22px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('=', x, oy + rowW / 2)
  x += 20
  x = drawMatrix(ctx, L, x, oy, cell, 'L (下三角)', '#dcfce7') + 12
  ctx.fillStyle = '#6366f1'
  ctx.fillText('×', x, oy + rowW / 2)
  x += 12
  drawMatrix(ctx, U, x, oy, cell, 'U (上三角)', '#fef9c3')
}
