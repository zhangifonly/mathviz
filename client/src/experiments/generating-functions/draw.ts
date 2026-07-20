/**
 * 生成函数系数柱状图 Canvas 绘制
 * 把系数序列画成柱状图，横轴为幂次(下标)，纵轴为该幂次系数。
 */
import type { Poly } from './generatingFunctions'

/**
 * 绘制系数柱状图。
 * @param coeffs 系数序列，下标 i 对应 x^i 的系数
 * @param color  柱子颜色
 */
export function drawGeneratingFunctions(
  canvas: HTMLCanvasElement,
  coeffs: Poly,
  color = '#6366f1',
) {
  const ctx = canvas.getContext('2d')
  if (!ctx || coeffs.length === 0) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const padL = 44
  const padB = 34
  const padT = 20
  const plotW = W - padL - 16
  const plotH = H - padB - padT
  const maxV = Math.max(1, ...coeffs)
  const n = coeffs.length
  const slot = plotW / n
  const barW = Math.max(2, slot * 0.7)

  // 坐标轴
  ctx.strokeStyle = '#94a3b8'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padL, padT)
  ctx.lineTo(padL, padT + plotH)
  ctx.lineTo(padL + plotW, padT + plotH)
  ctx.stroke()

  ctx.fillStyle = '#64748b'
  ctx.font = '11px system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText(String(maxV), padL - 6, padT + 10)
  ctx.fillText('0', padL - 6, padT + plotH)

  // 柱子 + 下标标签
  for (let i = 0; i < n; i++) {
    const h = (coeffs[i] / maxV) * plotH
    const x = padL + i * slot + (slot - barW) / 2
    const y = padT + plotH - h
    ctx.fillStyle = color
    ctx.fillRect(x, y, barW, h)
    if (coeffs[i] > 0) {
      ctx.fillStyle = '#0f172a'
      ctx.textAlign = 'center'
      ctx.font = '10px system-ui, sans-serif'
      ctx.fillText(String(coeffs[i]), x + barW / 2, y - 3)
    }
    if (n <= 24 || i % 2 === 0) {
      ctx.fillStyle = '#94a3b8'
      ctx.textAlign = 'center'
      ctx.font = '10px system-ui, sans-serif'
      ctx.fillText(String(i), x + barW / 2, padT + plotH + 14)
    }
  }
}
