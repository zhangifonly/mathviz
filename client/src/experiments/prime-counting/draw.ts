/**
 * 素数计数 Canvas 绘制：π(x) 阶梯曲线 vs x/ln(x) 与 Li(x) 平滑曲线
 */
import { primePi, pnlApprox, logIntegral } from './primeCounting'

/**
 * 在 [2, upper] 区间画三条曲线：
 *  - π(x) 蓝色阶梯（真实素数个数）
 *  - x/ln(x) 橙色虚线（素数定理主项）
 *  - Li(x) 绿色实线（对数积分，更精确）
 */
export function drawPrimeCounting(canvas: HTMLCanvasElement, upper: number) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  const padL = 48
  const padB = 34
  const padT = 16
  const padR = 14
  const plotW = W - padL - padR
  const plotH = H - padT - padB
  const yMax = Math.max(primePi(upper), pnlApprox(upper), logIntegral(upper)) * 1.05
  const sx = (x: number) => padL + (x / upper) * plotW
  const sy = (y: number) => padT + plotH - (y / yMax) * plotH

  // 坐标轴
  ctx.strokeStyle = '#94a3b8'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padL, padT)
  ctx.lineTo(padL, padT + plotH)
  ctx.lineTo(padL + plotW, padT + plotH)
  ctx.stroke()

  const N = 400
  // Li(x) 绿色实线
  ctx.strokeStyle = '#10b981'
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let i = 0; i <= N; i++) {
    const x = 2 + (upper - 2) * (i / N)
    const px = sx(x)
    const py = sy(logIntegral(x))
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // x/ln(x) 橙色虚线
  ctx.strokeStyle = '#f97316'
  ctx.setLineDash([6, 4])
  ctx.beginPath()
  for (let i = 0; i <= N; i++) {
    const x = 2 + (upper - 2) * (i / N)
    const px = sx(x)
    const py = sy(pnlApprox(x))
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
  ctx.setLineDash([])

  // π(x) 蓝色阶梯
  ctx.strokeStyle = '#4f46e5'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(sx(2), sy(primePi(2)))
  const stepN = Math.min(upper, 600)
  let prev = primePi(2)
  for (let i = 1; i <= stepN; i++) {
    const x = 2 + (upper - 2) * (i / stepN)
    const val = primePi(x)
    ctx.lineTo(sx(x), sy(prev))
    ctx.lineTo(sx(x), sy(val))
    prev = val
  }
  ctx.stroke()

  // 图例
  ctx.font = '12px sans-serif'
  ctx.fillStyle = '#4f46e5'
  ctx.fillText('π(x) 素数个数', padL + 6, padT + 14)
  ctx.fillStyle = '#f97316'
  ctx.fillText('x / ln(x)', padL + 6, padT + 30)
  ctx.fillStyle = '#10b981'
  ctx.fillText('Li(x) 对数积分', padL + 6, padT + 46)
  ctx.fillStyle = '#64748b'
  ctx.fillText(`x = ${upper}`, padL + plotW - 60, padT + plotH - 6)
}
