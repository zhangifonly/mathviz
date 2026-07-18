/**
 * 法里数列 Canvas 绘制
 * 在 [0,1] 数轴上画出每个既约分数，并为其绘制福特圆（相切圆）。
 */
import { farey, fordRadius, type Fraction } from './fareySequence'

const PALETTE = [
  '#6366f1', '#ec4899', '#22d3ee', '#a3e635', '#fbbf24',
  '#f87171', '#34d399', '#a78bfa', '#fb923c', '#38bdf8',
]

/**
 * 绘制 n 阶法里数列。
 * @param showCircles 是否画福特圆（否则只画数轴上的刻度点）
 */
export function drawFareySequence(
  canvas: HTMLCanvasElement,
  n: number,
  showCircles = true,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const pad = 40
  const axisY = H - 70
  const span = W - pad * 2
  const xOf = (f: Fraction) => pad + (f.n / f.d) * span
  const seq = farey(n)

  if (showCircles) {
    // 福特圆：半径按分母缩放，坐落在数轴上方并与之相切
    const scale = span * 0.9
    for (let i = 0; i < seq.length; i++) {
      const f = seq[i]
      const r = fordRadius(f) * scale
      const cx = xOf(f)
      const cy = axisY - r
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, 2 * Math.PI)
      ctx.fillStyle = PALETTE[f.d % PALETTE.length] + '55'
      ctx.fill()
      ctx.strokeStyle = PALETTE[f.d % PALETTE.length]
      ctx.lineWidth = 1.2
      ctx.stroke()
    }
  }

  // 数轴
  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(pad, axisY)
  ctx.lineTo(W - pad, axisY)
  ctx.stroke()

  // 刻度点与分数标签
  ctx.fillStyle = '#0f172a'
  ctx.font = '11px sans-serif'
  ctx.textAlign = 'center'
  for (const f of seq) {
    const x = xOf(f)
    ctx.beginPath()
    ctx.arc(x, axisY, 3, 0, 2 * Math.PI)
    ctx.fillStyle = PALETTE[f.d % PALETTE.length]
    ctx.fill()
    // 分母小的（重要分数）才标注，避免拥挤
    if (f.d <= Math.min(n, 4) || f.d === 1) {
      ctx.fillStyle = '#334155'
      ctx.fillText(`${f.n}/${f.d}`, x, axisY + 20)
    }
  }

  ctx.fillStyle = '#64748b'
  ctx.textAlign = 'left'
  ctx.fillText(`F${n}: ${seq.length} 个既约分数`, pad, 24)
}
