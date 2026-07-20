/**
 * 泊松过程 Canvas 绘制
 * 上半区：到达事件时间轴（每次到达画一根竖线）
 * 下半区：累计计数阶梯函数 N(t)
 */
import { countProcess } from './poissonProcess'

/**
 * 绘制到达时间轴与计数阶梯函数。
 * @param arrivals 升序到达时刻
 * @param T 时间上限（横轴范围 0..T）
 */
export function drawPoissonProcess(
  canvas: HTMLCanvasElement,
  arrivals: number[],
  T: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx || T <= 0) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const padL = 42
  const padR = 16
  const plotW = W - padL - padR
  const axisY = H * 0.32
  const x = (t: number) => padL + (t / T) * plotW

  // ---- 上半区：到达事件竖线 ----
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padL, axisY)
  ctx.lineTo(W - padR, axisY)
  ctx.stroke()
  ctx.strokeStyle = '#6366f1'
  ctx.lineWidth = 2
  for (const a of arrivals) {
    const px = x(a)
    ctx.beginPath()
    ctx.moveTo(px, axisY - 26)
    ctx.lineTo(px, axisY)
    ctx.stroke()
    ctx.fillStyle = '#ec4899'
    ctx.beginPath()
    ctx.arc(px, axisY - 26, 3, 0, 2 * Math.PI)
    ctx.fill()
  }
  ctx.fillStyle = '#64748b'
  ctx.font = '12px sans-serif'
  ctx.fillText('到达事件', padL, axisY - 34)

  // ---- 下半区：计数阶梯 N(t) ----
  const baseY = H - 30
  const topY = axisY + 30
  const total = arrivals.length || 1
  const yOf = (n: number) => baseY - (n / total) * (baseY - topY)

  ctx.strokeStyle = '#94a3b8'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padL, baseY)
  ctx.lineTo(W - padR, baseY)
  ctx.moveTo(padL, baseY)
  ctx.lineTo(padL, topY)
  ctx.stroke()

  ctx.strokeStyle = '#0ea5e9'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(padL, yOf(0))
  let prev = 0
  for (const a of arrivals) {
    const px = x(a)
    ctx.lineTo(px, yOf(prev))
    prev++
    ctx.lineTo(px, yOf(prev))
  }
  ctx.lineTo(W - padR, yOf(prev))
  ctx.stroke()

  ctx.fillStyle = '#0369a1'
  ctx.fillText('N(t) 累计计数', padL, topY - 6)
  ctx.fillStyle = '#64748b'
  const nFinal = countProcess(arrivals, T)
  ctx.fillText(`共 ${nFinal} 次`, W - padR - 60, topY + 6)
  ctx.fillText('t', W - padR - 8, baseY + 16)
}
