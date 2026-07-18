/**
 * 赠券收集问题 Canvas 绘制
 * 横轴 = 抽取次数，纵轴 = 已集齐种数（阶梯上升，越到后面越平缓）。
 * 竖线标出理论期望 n*H(n)。
 */
import { simulate, expectedDraws } from './couponCollector'

export function drawCouponCollector(
  canvas: HTMLCanvasElement,
  n: number,
  seed = 1,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const progress = simulate(n, seed)
  const exp = expectedDraws(n)
  const total = progress.length ? progress[progress.length - 1] : 1
  const xMax = Math.max(total, exp) * 1.08
  const pad = 46
  const plotW = W - pad * 2
  const plotH = H - pad * 2
  const sx = (d: number) => pad + (d / xMax) * plotW
  const sy = (c: number) => pad + plotH - (c / n) * plotH

  // 坐标轴
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(pad, pad)
  ctx.lineTo(pad, pad + plotH)
  ctx.lineTo(pad + plotW, pad + plotH)
  ctx.stroke()

  // 期望竖线标记
  ctx.strokeStyle = '#ec4899'
  ctx.setLineDash([6, 5])
  ctx.beginPath()
  ctx.moveTo(sx(exp), pad)
  ctx.lineTo(sx(exp), pad + plotH)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = '#ec4899'
  ctx.font = '13px sans-serif'
  ctx.fillText(`期望 ${exp.toFixed(0)} 次`, sx(exp) + 6, pad + 16)

  // 阶梯进度曲线
  ctx.strokeStyle = '#6366f1'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(sx(0), sy(0))
  for (let i = 0; i < progress.length; i++) {
    ctx.lineTo(sx(progress[i]), sy(i))
    ctx.lineTo(sx(progress[i]), sy(i + 1))
  }
  ctx.stroke()

  // 每收集一张的圆点
  ctx.fillStyle = '#4f46e5'
  for (let i = 0; i < progress.length; i++) {
    ctx.beginPath()
    ctx.arc(sx(progress[i]), sy(i + 1), 3, 0, 2 * Math.PI)
    ctx.fill()
  }

  // 文字标签
  ctx.fillStyle = '#475569'
  ctx.font = '13px sans-serif'
  ctx.fillText(`${n} 种赠券 · 本次共抽 ${total} 次`, pad, pad - 14)
  ctx.fillText('已集齐种数', pad - 40, pad - 2)
  ctx.fillText('抽取次数 →', pad + plotW - 74, pad + plotH + 26)
}
