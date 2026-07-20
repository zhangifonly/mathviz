/**
 * 卢卡斯数 Canvas 绘制
 * 上半区：数列方块（面积正比于数值）
 * 下半区：相邻比曲线趋于黄金比 φ（可叠加斐波那契比对比）
 */
import { lucasSequence, fibonacciSequence, ratios, PHI } from './lucasNumbers'

function drawBlocks(ctx: CanvasRenderingContext2D, W: number, top: number, h: number, terms: number) {
  const seq = lucasSequence(Math.max(2, terms))
  const max = seq[seq.length - 1] || 1
  const gap = 6
  const bw = (W - gap * (seq.length + 1)) / seq.length
  ctx.font = '11px sans-serif'
  ctx.textAlign = 'center'
  for (let i = 0; i < seq.length; i++) {
    const bh = (seq[i] / max) * (h - 26)
    const x = gap + i * (bw + gap)
    const y = top + h - bh
    ctx.fillStyle = i < 2 ? '#f59e0b' : '#6366f1'
    ctx.fillRect(x, y, bw, bh)
    ctx.fillStyle = '#0f172a'
    ctx.fillText(String(seq[i]), x + bw / 2, top + h + 4)
  }
}

function drawRatioCurve(
  ctx: CanvasRenderingContext2D,
  W: number,
  top: number,
  h: number,
  terms: number,
  showFib: boolean,
) {
  const lr = ratios(lucasSequence(Math.max(3, terms)))
  const lo = 1.0
  const hi = 2.2
  const px = (i: number, n: number) => 40 + (i / (n - 1)) * (W - 60)
  const py = (v: number) => top + h - ((v - lo) / (hi - lo)) * h
  // 黄金比参考线
  ctx.strokeStyle = '#f59e0b'
  ctx.setLineDash([6, 4])
  ctx.beginPath()
  ctx.moveTo(40, py(PHI))
  ctx.lineTo(W - 20, py(PHI))
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = '#b45309'
  ctx.font = '12px sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('phi ' + PHI.toFixed(4), W - 120, py(PHI) - 6)

  const plot = (arr: number[], color: string) => {
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let i = 0; i < arr.length; i++) {
      const x = px(i, arr.length)
      const y = py(Math.min(hi, Math.max(lo, arr[i])))
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
    for (let i = 0; i < arr.length; i++) {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(px(i, arr.length), py(Math.min(hi, Math.max(lo, arr[i]))), 3, 0, 2 * Math.PI)
      ctx.fill()
    }
  }
  if (showFib) plot(ratios(fibonacciSequence(Math.max(4, terms + 1))).slice(1), '#94a3b8')
  plot(lr, '#6366f1')
}

export function drawLucasNumbers(
  canvas: HTMLCanvasElement,
  terms = 12,
  showFib = false,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, W, H)

  const blockH = H * 0.42
  drawBlocks(ctx, W, 16, blockH - 32, terms)
  drawRatioCurve(ctx, W, blockH + 20, H - blockH - 40, terms, showFib)
}
