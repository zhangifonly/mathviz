/**
 * 蒲丰投针 Canvas 绘制
 * 画等距平行线 + 投下的针（相交红、不相交灰）+ pi 估计值。
 */
import { simulate } from './buffonNeedle'

const SPACING = 60
const LENGTH = 60

/**
 * 绘制一次投针模拟。
 * @param n 投针数量
 * @param seed 随机种子（同种子结果可复现）
 * @param showValue 是否在左上角标注 pi 估计值
 */
export function drawBuffonNeedle(
  canvas: HTMLCanvasElement,
  n: number,
  seed = 1,
  showValue = true,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, W, H)

  // 等距平行线
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1
  for (let y = 0; y <= H; y += SPACING) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(W, y)
    ctx.stroke()
  }

  const { needles, crossings, total, piEstimate } = simulate(n, seed, W, H, SPACING, LENGTH)

  // 针数太多时只画一部分，避免糊成一团
  const drawLimit = Math.min(total, 1200)
  ctx.lineWidth = 1.4
  for (let i = 0; i < drawLimit; i++) {
    const nd = needles[i]
    ctx.strokeStyle = nd.crosses ? 'rgba(239,68,68,0.7)' : 'rgba(100,116,139,0.5)'
    ctx.beginPath()
    ctx.moveTo(nd.x1, nd.y1)
    ctx.lineTo(nd.x2, nd.y2)
    ctx.stroke()
  }

  if (showValue) {
    ctx.fillStyle = 'rgba(15,23,42,0.85)'
    ctx.fillRect(10, 10, 210, 66)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 20px monospace'
    const shown = Number.isNaN(piEstimate) ? '—' : piEstimate.toFixed(5)
    ctx.fillText(`pi ≈ ${shown}`, 22, 38)
    ctx.font = '13px monospace'
    ctx.fillStyle = '#cbd5e1'
    ctx.fillText(`投针 ${total} · 相交 ${crossings}`, 22, 62)
  }
}
