/**
 * 错排问题 Canvas 绘制
 * mode='ratio'：画 D(n)/n! 随 n 收敛到 1/e 的曲线
 * mode='grid' ：列举给定 n 的所有错排（每行一个排列，格子无对角命中）
 */
import { derangementRatio, listDerangements, INV_E } from './derangements'

function drawRatio(ctx: CanvasRenderingContext2D, W: number, H: number, maxN: number) {
  const padL = 46
  const padB = 30
  const padT = 20
  const x = (n: number) => padL + (n / maxN) * (W - padL - 20)
  const y = (r: number) => padT + (1 - r) * (H - padT - padB)
  // 1/e 参考线
  ctx.strokeStyle = '#f472b6'
  ctx.setLineDash([6, 5])
  ctx.beginPath()
  ctx.moveTo(padL, y(INV_E))
  ctx.lineTo(W - 20, y(INV_E))
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = '#be185d'
  ctx.font = '13px sans-serif'
  ctx.fillText('1/e ≈ 0.368', W - 130, y(INV_E) - 6)
  // 比值曲线 + 点
  ctx.strokeStyle = '#6366f1'
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let n = 1; n <= maxN; n++) {
    const px = x(n)
    const py = y(derangementRatio(n))
    if (n === 1) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
  ctx.fillStyle = '#4338ca'
  for (let n = 1; n <= maxN; n++) {
    ctx.beginPath()
    ctx.arc(x(n), y(derangementRatio(n)), 3, 0, 2 * Math.PI)
    ctx.fill()
  }
  ctx.fillStyle = '#334155'
  ctx.fillText('D(n)/n!', padL, padT + 2)
  ctx.fillText('n', W - 24, H - 8)
}

function drawGrid(ctx: CanvasRenderingContext2D, W: number, H: number, n: number) {
  const all = listDerangements(n)
  const show = all.slice(0, Math.min(all.length, 12))
  const cell = Math.min(26, (W - 40) / n)
  const rowH = cell + 8
  const startY = 18
  ctx.font = '12px sans-serif'
  show.forEach((perm, r) => {
    const y0 = startY + r * rowH
    for (let i = 0; i < n; i++) {
      const x0 = 30 + i * cell
      // 对角线格子(位置 i 放了元素 i)标红，错排里不会出现，正好凸显"无对角"
      ctx.fillStyle = perm[i] === i ? '#fecaca' : '#e0e7ff'
      ctx.fillRect(x0, y0, cell - 2, cell - 2)
      ctx.strokeStyle = '#cbd5e1'
      ctx.strokeRect(x0, y0, cell - 2, cell - 2)
      // 该列放置的元素值
      ctx.fillStyle = '#4338ca'
      ctx.fillText(String(perm[i]), x0 + cell / 2 - 4, y0 + cell / 2 + 4)
    }
  })
  ctx.fillStyle = '#64748b'
  ctx.fillText(`共 ${all.length} 种错排` + (all.length > show.length ? `（显示前 ${show.length} 种）` : ''), 30, H - 10)
}

export function drawDerangements(
  canvas: HTMLCanvasElement,
  mode: 'ratio' | 'grid',
  n = 6,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, W, H)
  if (mode === 'ratio') drawRatio(ctx, W, H, Math.max(n, 8))
  else drawGrid(ctx, W, H, n)
}
