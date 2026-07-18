/**
 * 威尔逊定理 Canvas 绘制
 * 为 2..N 的每个 n 画一条条形，高度 = (n-1)! mod n。
 * 素数处该值等于 n-1（几乎顶到对角线），高亮为绿色；合数处多为 0。
 */
import { wilsonTable } from './wilsonTheorem'

export function drawWilsonTheorem(
  canvas: HTMLCanvasElement,
  upTo: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const rows = wilsonTable(upTo)
  const padL = 44
  const padB = 28
  const padT = 16
  const plotW = W - padL - 16
  const plotH = H - padB - padT
  const bw = plotW / rows.length
  // 纵轴以最大可能值 (upTo-1) 归一，素数条恰好接近满高
  const maxV = upTo - 1

  // 坐标轴
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padL, padT)
  ctx.lineTo(padL, padT + plotH)
  ctx.lineTo(padL + plotW, padT + plotH)
  ctx.stroke()

  ctx.fillStyle = '#64748b'
  ctx.font = '11px sans-serif'
  ctx.fillText('(n-1)! mod n', padL + 4, padT + 10)

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i]
    const x = padL + i * bw
    const h = maxV === 0 ? 0 : (r.value / maxV) * plotH
    const y = padT + plotH - h
    ctx.fillStyle = r.prime ? '#22c55e' : '#f87171'
    ctx.fillRect(x + 1, y, Math.max(1, bw - 2), h)

    // 稀疏标注 n 值，避免拥挤
    if (rows.length <= 24 || r.n % 5 === 0 || r.prime) {
      ctx.fillStyle = r.prime ? '#15803d' : '#94a3b8'
      ctx.font = '9px sans-serif'
      ctx.fillText(String(r.n), x + bw / 2 - 4, padT + plotH + 12)
    }
  }
}
