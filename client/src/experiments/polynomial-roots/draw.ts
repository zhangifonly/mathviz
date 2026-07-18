/**
 * 多项式求根 Canvas 绘制：坐标轴 + 曲线 + 实根标记
 */
import { evalPoly, findRealRoots } from './polynomialRoots'

/**
 * 绘制多项式曲线并标出实根（与 x 轴交点）。
 * 坐标范围固定 x∈[-6,6]，y 自适应并裁剪，保证曲线可见。
 */
export function drawPolynomialRoots(
  canvas: HTMLCanvasElement,
  coeffs: number[],
  xMin = -6,
  xMax = 6,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const yMax = 12
  const yMin = -12
  const sx = (x: number) => ((x - xMin) / (xMax - xMin)) * W
  const sy = (y: number) => H - ((y - yMin) / (yMax - yMin)) * H

  // 网格
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  for (let gx = Math.ceil(xMin); gx <= xMax; gx++) {
    ctx.beginPath(); ctx.moveTo(sx(gx), 0); ctx.lineTo(sx(gx), H); ctx.stroke()
  }
  for (let gy = Math.ceil(yMin); gy <= yMax; gy += 3) {
    ctx.beginPath(); ctx.moveTo(0, sy(gy)); ctx.lineTo(W, sy(gy)); ctx.stroke()
  }

  // 坐标轴
  ctx.strokeStyle = '#94a3b8'
  ctx.lineWidth = 1.5
  ctx.beginPath(); ctx.moveTo(0, sy(0)); ctx.lineTo(W, sy(0)); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(sx(0), 0); ctx.lineTo(sx(0), H); ctx.stroke()

  // 曲线
  ctx.strokeStyle = '#6366f1'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  let started = false
  for (let px = 0; px <= W; px++) {
    const x = xMin + (px / W) * (xMax - xMin)
    const y = evalPoly(coeffs, x)
    const py = sy(y)
    if (py < -50 || py > H + 50) { started = false; continue }
    if (!started) { ctx.moveTo(px, py); started = true } else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // 实根标记
  const roots = findRealRoots(coeffs, xMin, xMax)
  for (const r of roots) {
    const px = sx(r)
    const py = sy(0)
    ctx.fillStyle = '#ec4899'
    ctx.beginPath(); ctx.arc(px, py, 6, 0, 2 * Math.PI); ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.fillStyle = '#be185d'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`x=${r.toFixed(2)}`, px, py + 22)
  }
}
