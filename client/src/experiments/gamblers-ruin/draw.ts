/**
 * 赌徒破产 Canvas 绘制：多局资金随时间轨迹 + 理论破产概率标注
 */
import { simulate, ruinProbability } from './gamblersRuin'

/**
 * 画 runs 局的资金轨迹。横轴=步数，纵轴=资金(0..N)。
 * 触 0 的轨迹画红（破产），触 N 的画绿（达标）。
 */
export function drawGamblersRuin(
  canvas: HTMLCanvasElement,
  i: number,
  N: number,
  p: number,
  runs = 12,
  seed = 1,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  const padL = 44
  const padR = 16
  const padT = 16
  const padB = 28
  const plotW = W - padL - padR
  const plotH = H - padT - padB

  // 先模拟，确定最大步数用于 x 轴缩放
  const results = []
  let maxSteps = 1
  for (let k = 0; k < runs; k++) {
    const res = simulate(i, N, p, seed + k * 7919)
    maxSteps = Math.max(maxSteps, res.steps)
    results.push(res)
  }
  const yOf = (m: number) => padT + plotH - (m / N) * plotH
  const xOf = (t: number) => padL + (t / maxSteps) * plotW

  // 坐标轴 + 目标/破产参考线
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padL, padT)
  ctx.lineTo(padL, padT + plotH)
  ctx.lineTo(padL + plotW, padT + plotH)
  ctx.stroke()
  ctx.setLineDash([4, 4])
  ctx.strokeStyle = '#94a3b8'
  ctx.beginPath()
  ctx.moveTo(padL, yOf(N))
  ctx.lineTo(padL + plotW, yOf(N))
  ctx.moveTo(padL, yOf(i))
  ctx.lineTo(padL + plotW, yOf(i))
  ctx.stroke()
  ctx.setLineDash([])

  ctx.fillStyle = '#64748b'
  ctx.font = '11px sans-serif'
  ctx.fillText('目标 ' + N, padL + 4, yOf(N) + 12)
  ctx.fillText('本金 ' + i, padL + 4, yOf(i) - 4)
  ctx.fillText('0', padL - 14, yOf(0))

  // 轨迹
  for (const res of results) {
    ctx.strokeStyle = res.ruined ? 'rgba(239,68,68,0.75)' : 'rgba(34,197,94,0.75)'
    ctx.lineWidth = 1.4
    ctx.beginPath()
    for (let t = 0; t < res.path.length; t++) {
      const x = xOf(t)
      const y = yOf(res.path[t])
      if (t === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  // 理论破产概率标注
  const pr = ruinProbability(i, N, p)
  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 13px sans-serif'
  ctx.fillText('理论破产概率 ' + (pr * 100).toFixed(1) + '%', padL + 8, padT + 14)
}
