/**
 * 二次剩余 Canvas 绘制：把 0..p-1 排成圆环，高亮二次剩余点，
 * 并画 x -> x^2 mod p 的配对连线（弦）。
 */
import { quadraticResidues, squarePairs } from './quadraticResidue'

function nodePos(i: number, p: number, cx: number, cy: number, r: number) {
  const ang = (-Math.PI / 2) + (2 * Math.PI * i) / p
  return { x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang) }
}

/**
 * 绘制模 p 圆环。
 * @param showChords 是否画 x->x^2 的弦
 */
export function drawQuadraticResidue(
  canvas: HTMLCanvasElement,
  p: number,
  showChords = true,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  const cx = W / 2
  const cy = H / 2
  const r = Math.min(W, H) / 2 - 48
  const qr = new Set(quadraticResidues(p))

  // 弦：x -> x^2 mod p
  if (showChords) {
    ctx.lineWidth = 1.2
    for (const { x, sq } of squarePairs(p)) {
      const a = nodePos(x, p, cx, cy, r)
      const b = nodePos(sq, p, cx, cy, r)
      ctx.strokeStyle = 'rgba(99,102,241,0.28)'
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.stroke()
    }
  }

  // 圆环节点
  ctx.font = '13px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  for (let i = 0; i < p; i++) {
    const pos = nodePos(i, p, cx, cy, r)
    const isRes = qr.has(i)
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, 15, 0, 2 * Math.PI)
    ctx.fillStyle = i === 0 ? '#cbd5e1' : isRes ? '#22c55e' : '#f8fafc'
    ctx.fill()
    ctx.lineWidth = 2
    ctx.strokeStyle = isRes ? '#15803d' : '#94a3b8'
    ctx.stroke()
    ctx.fillStyle = isRes ? '#052e16' : '#334155'
    ctx.fillText(String(i), pos.x, pos.y)
  }
}
