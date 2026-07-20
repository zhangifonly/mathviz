/**
 * Cholesky 分解 Canvas 绘制：A = L · L^T 三张矩阵表格，
 * 逐元素揭示 L 的计算过程，并标注正定性检查。
 */
import { cholesky, choleskySteps, transpose, type Matrix } from './cholesky'

function drawMatrix(
  ctx: CanvasRenderingContext2D,
  M: Matrix,
  x0: number,
  y0: number,
  cell: number,
  label: string,
  litUpTo: (i: number, j: number) => boolean,
) {
  const n = M.length
  ctx.font = 'bold 15px system-ui'
  ctx.fillStyle = '#334155'
  ctx.textAlign = 'center'
  ctx.fillText(label, x0 + (n * cell) / 2, y0 - 12)
  ctx.font = '14px system-ui'
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const px = x0 + j * cell
      const py = y0 + i * cell
      const lit = litUpTo(i, j)
      ctx.fillStyle = lit ? '#6366f1' : '#eef2ff'
      ctx.fillRect(px, py, cell - 3, cell - 3)
      ctx.fillStyle = lit ? '#ffffff' : '#94a3b8'
      const v = M[i][j]
      const txt = Math.abs(v) < 1e-9 ? '0' : (Math.round(v * 100) / 100).toString()
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(txt, px + (cell - 3) / 2, py + (cell - 3) / 2)
    }
  }
  ctx.textBaseline = 'alphabetic'
}

/**
 * @param step 已揭示的 L 元素个数（按列优先顺序），0..n(n+1)/2
 */
export function drawCholesky(canvas: HTMLCanvasElement, A: Matrix, step = 999) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, W, H)

  const n = A.length
  const L = cholesky(A)
  const cell = 46
  const gap = 48
  const blockW = n * cell
  const totalW = blockW * 3 + gap * 2
  const x0 = (W - totalW) / 2
  const y0 = 70

  if (!L) {
    drawMatrix(ctx, A, x0, y0, cell, 'A (非正定)', () => true)
    ctx.fillStyle = '#dc2626'
    ctx.font = 'bold 20px system-ui'
    ctx.textAlign = 'center'
    ctx.fillText('矩阵非正定，无法做 Cholesky 分解', W / 2, y0 + blockW + 70)
    return
  }

  const steps = choleskySteps(A)
  const litSet = new Set(steps.slice(0, step).map((s) => `${s.i},${s.j}`))
  const LT = transpose(L)

  drawMatrix(ctx, A, x0, y0, cell, 'A', () => true)
  drawMatrix(ctx, L, x0 + blockW + gap, y0, cell, 'L', (i, j) =>
    j <= i && litSet.has(`${i},${j}`),
  )
  drawMatrix(ctx, LT, x0 + (blockW + gap) * 2, y0, cell, 'Lᵀ', (i, j) =>
    i <= j && litSet.has(`${j},${i}`),
  )

  ctx.fillStyle = '#64748b'
  ctx.font = 'bold 26px system-ui'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const midY = y0 + blockW / 2
  ctx.fillText('=', x0 + blockW + gap / 2, midY)
  ctx.fillText('×', x0 + (blockW + gap) * 2 + gap / 2 - blockW - gap, midY)
  ctx.fillText('×', x0 + blockW * 2 + gap * 1.5, midY)
  ctx.textBaseline = 'alphabetic'

  ctx.fillStyle = '#16a34a'
  ctx.font = 'bold 17px system-ui'
  const done = step >= steps.length
  ctx.fillText(
    done ? '✓ 正定：所有对角平方项均为正，分解成功' : `逐元素计算中 ${Math.min(step, steps.length)}/${steps.length}`,
    W / 2,
    y0 + blockW + 60,
  )
}
