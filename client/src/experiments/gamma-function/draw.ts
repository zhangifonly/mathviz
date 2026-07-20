/**
 * 伽马函数 Canvas 绘制：Γ(x) 曲线（x>0）+ 整数点阶乘值
 */
import { gamma, factorial } from './gammaFunction'

const X_MIN = 0.05
const X_MAX = 5.6
const Y_MAX = 26 // 纵轴裁剪上限，避免 x→0 处发散撑爆画面

/**
 * 绘制 Γ(x)（x>0）曲线，并在整数 x 处标出阶乘点 Γ(n)=(n-1)!。
 * @param highlightX 若给定，则高亮该 x 处的 (x, Γ(x)) 点
 */
export function drawGammaFunction(
  canvas: HTMLCanvasElement,
  highlightX?: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  const pad = 40
  const sx = (x: number) => pad + ((x - X_MIN) / (X_MAX - X_MIN)) * (W - 2 * pad)
  const sy = (y: number) => H - pad - (Math.min(y, Y_MAX) / Y_MAX) * (H - 2 * pad)

  // 网格 + 坐标轴
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  for (let x = 1; x <= 5; x++) {
    ctx.beginPath(); ctx.moveTo(sx(x), pad); ctx.lineTo(sx(x), H - pad); ctx.stroke()
  }
  ctx.strokeStyle = '#94a3b8'
  ctx.beginPath(); ctx.moveTo(pad, H - pad); ctx.lineTo(W - pad, H - pad); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(pad, pad); ctx.lineTo(pad, H - pad); ctx.stroke()
  ctx.fillStyle = '#64748b'
  ctx.font = '12px sans-serif'
  for (let x = 1; x <= 5; x++) ctx.fillText(String(x), sx(x) - 3, H - pad + 16)

  // Γ(x) 曲线
  ctx.strokeStyle = '#6366f1'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  let started = false
  for (let px = 0; px <= 600; px++) {
    const x = X_MIN + ((X_MAX - X_MIN) * px) / 600
    const y = gamma(x)
    if (y > Y_MAX * 1.3) { started = false; continue }
    const cx = sx(x); const cy = sy(y)
    if (!started) { ctx.moveTo(cx, cy); started = true } else ctx.lineTo(cx, cy)
  }
  ctx.stroke()

  // 整数点阶乘值 Γ(n)=(n-1)!
  ctx.fillStyle = '#ec4899'
  for (let n = 1; n <= 5; n++) {
    const y = factorial(n - 1)
    if (y > Y_MAX) continue
    const cx = sx(n); const cy = sy(y)
    ctx.beginPath(); ctx.arc(cx, cy, 4, 0, 2 * Math.PI); ctx.fill()
    ctx.fillText(`${n - 1}!=${y}`, cx + 6, cy - 6)
  }

  // 高亮交互点
  if (highlightX !== undefined) {
    const y = gamma(highlightX)
    const cx = sx(highlightX); const cy = sy(y)
    ctx.fillStyle = '#f59e0b'
    ctx.beginPath(); ctx.arc(cx, cy, 6, 0, 2 * Math.PI); ctx.fill()
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.moveTo(cx, H - pad); ctx.lineTo(cx, cy); ctx.stroke()
    ctx.fillStyle = '#b45309'
    ctx.fillText(`Γ(${highlightX})=${y.toFixed(3)}`, cx + 8, cy + 4)
  }
}
