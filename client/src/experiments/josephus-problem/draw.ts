/**
 * 约瑟夫问题 Canvas 绘制：n 人围圈，按出局顺序标灰，幸存者高亮。
 */
import { josephusOrder, josephusSurvivor } from './josephusProblem'

/**
 * 绘制围圈报数图。
 * @param step 已经历的出局次数（0..n-1）。已出局者涂灰，未出局者浅色，幸存者高亮。
 */
export function drawJosephusProblem(
  canvas: HTMLCanvasElement,
  n: number,
  k: number,
  step: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx || n < 1) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const order = josephusOrder(n, k)
  const survivor = josephusSurvivor(n, k)
  const clamped = Math.max(0, Math.min(step, n - 1))
  const outSet = new Set(order.slice(0, clamped))

  const cx = W / 2
  const cy = H / 2
  const R = Math.min(W, H) * 0.38
  const r = Math.max(9, Math.min(22, (2 * Math.PI * R) / n / 2.6))

  for (let i = 1; i <= n; i++) {
    const ang = -Math.PI / 2 + (2 * Math.PI * (i - 1)) / n
    const x = cx + R * Math.cos(ang)
    const y = cy + R * Math.sin(ang)
    const isOut = outSet.has(i)
    const isSurvivor = clamped >= n - 1 && i === survivor
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 2 * Math.PI)
    ctx.fillStyle = isSurvivor ? '#22c55e' : isOut ? '#cbd5e1' : '#6366f1'
    ctx.fill()
    ctx.lineWidth = isSurvivor ? 3 : 1.5
    ctx.strokeStyle = isSurvivor ? '#15803d' : '#1e293b'
    ctx.stroke()
    ctx.fillStyle = isOut && !isSurvivor ? '#64748b' : '#ffffff'
    ctx.font = `${Math.round(r * 0.9)}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(String(i), x, y)
  }

  // 中心提示文字
  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 18px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  if (clamped >= n - 1) {
    ctx.fillText(`幸存者：${survivor} 号`, cx, cy)
  } else {
    ctx.fillText(`每数到 ${k} 出局`, cx, cy - 12)
    ctx.font = '14px sans-serif'
    ctx.fillStyle = '#475569'
    ctx.fillText(`已出局 ${clamped} / ${n - 1}`, cx, cy + 12)
  }
}
