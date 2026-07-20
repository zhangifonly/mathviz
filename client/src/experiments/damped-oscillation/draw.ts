/**
 * 阻尼振荡 Canvas 绘制：三种阻尼下的位移-时间曲线对比
 */
import { sampleCurve, ZETA_VALUES } from './dampedOscillation'

const COLORS = ['#6366f1', '#22c55e', '#f97316']
const LABELS = ['欠阻尼 ζ=0.2', '临界 ζ=1', '过阻尼 ζ=2']

/**
 * 绘制位移-时间曲线。
 * @param highlight 高亮的 zeta 值（其余淡化），undefined 表示全部同等显示
 */
export function drawDampedOscillation(
  canvas: HTMLCanvasElement,
  omega = 1,
  tMax = 20,
  highlight?: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const padL = 46
  const padR = 16
  const padT = 20
  const padB = 30
  const plotW = W - padL - padR
  const plotH = H - padT - padB
  const yMin = -1.1
  const yMax = 1.1
  const sx = (t: number) => padL + (t / tMax) * plotW
  const sy = (x: number) => padT + ((yMax - x) / (yMax - yMin)) * plotH

  // 坐标轴与零线
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padL, padT)
  ctx.lineTo(padL, padT + plotH)
  ctx.lineTo(padL + plotW, padT + plotH)
  ctx.stroke()
  ctx.strokeStyle = '#e2e8f0'
  ctx.setLineDash([4, 4])
  ctx.beginPath()
  ctx.moveTo(padL, sy(0))
  ctx.lineTo(padL + plotW, sy(0))
  ctx.stroke()
  ctx.setLineDash([])

  ctx.fillStyle = '#64748b'
  ctx.font = '12px sans-serif'
  ctx.fillText('位移 x', 6, padT + 10)
  ctx.fillText('时间 t', padL + plotW - 44, padT + plotH + 22)

  // 三条曲线
  ZETA_VALUES.forEach((zeta, i) => {
    const dim = highlight !== undefined && highlight !== zeta
    ctx.strokeStyle = COLORS[i]
    ctx.globalAlpha = dim ? 0.2 : 1
    ctx.lineWidth = dim ? 1.5 : 2.5
    ctx.beginPath()
    const pts = sampleCurve(zeta, omega, tMax, 400)
    pts.forEach(([t, x], k) => {
      const px = sx(t)
      const py = sy(x)
      if (k === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    })
    ctx.stroke()
  })
  ctx.globalAlpha = 1

  // 图例
  ctx.font = '12px sans-serif'
  LABELS.forEach((label, i) => {
    const y = padT + 6 + i * 18
    ctx.fillStyle = COLORS[i]
    ctx.fillRect(padL + plotW - 128, y - 8, 12, 10)
    ctx.fillStyle = '#334155'
    ctx.fillText(label, padL + plotW - 112, y)
  })
}
