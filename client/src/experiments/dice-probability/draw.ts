/**
 * 骰子古典概率 Canvas 绘制
 * 理论分布（蓝色实心柱）与模拟频率（橙色描边叠加）对比。
 */
import { sumDistribution, simulate, sumOffset } from './diceProbability'

/**
 * 绘制理论分布与模拟频率对比柱状图。
 * @param trials 模拟投掷次数（0 表示只画理论分布）
 */
export function drawDiceProbability(
  canvas: HTMLCanvasElement,
  numDice: number,
  trials: number,
  seed = 1,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const dist = sumDistribution(numDice)
  const counts = trials > 0 ? simulate(numDice, trials, seed) : []
  const offset = sumOffset(numDice)
  const n = dist.length

  const padL = 44
  const padR = 16
  const padT = 20
  const padB = 40
  const plotW = W - padL - padR
  const plotH = H - padT - padB
  const freq = counts.map((c) => (trials > 0 ? c / trials : 0))
  const maxP = Math.max(...dist, ...freq, 0.001)

  const slot = plotW / n
  const barW = slot * 0.62

  // 坐标轴
  ctx.strokeStyle = '#94a3b8'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padL, padT)
  ctx.lineTo(padL, padT + plotH)
  ctx.lineTo(padL + plotW, padT + plotH)
  ctx.stroke()

  for (let i = 0; i < n; i++) {
    const cx = padL + slot * (i + 0.5)
    // 理论柱
    const hT = (dist[i] / maxP) * plotH
    ctx.fillStyle = 'rgba(99,102,241,0.85)'
    ctx.fillRect(cx - barW / 2, padT + plotH - hT, barW, hT)
    // 模拟频率描边叠加
    if (trials > 0) {
      const hF = (freq[i] / maxP) * plotH
      ctx.strokeStyle = '#f97316'
      ctx.lineWidth = 2
      ctx.strokeRect(cx - barW / 2, padT + plotH - hF, barW, hF)
    }
    // x 轴点数标签
    ctx.fillStyle = '#334155'
    ctx.font = '11px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(String(i + offset), cx, padT + plotH + 16)
  }

  // 图例
  ctx.textAlign = 'left'
  ctx.font = '12px sans-serif'
  ctx.fillStyle = 'rgba(99,102,241,0.85)'
  ctx.fillRect(padL + 4, padT + 2, 14, 10)
  ctx.fillStyle = '#334155'
  ctx.fillText('理论概率', padL + 22, padT + 11)
  if (trials > 0) {
    ctx.strokeStyle = '#f97316'
    ctx.lineWidth = 2
    ctx.strokeRect(padL + 90, padT + 2, 14, 10)
    ctx.fillText('模拟频率', padL + 108, padT + 11)
  }
}
