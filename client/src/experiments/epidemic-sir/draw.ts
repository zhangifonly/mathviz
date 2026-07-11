/**
 * SIR 传染病模型 Canvas 绘制：S/I/R 三条比例曲线随时间演化。
 */
import type { SIRPoint } from './epidemicSir'

const COLORS = {
  s: '#38bdf8', // 易感 - 蓝
  i: '#f87171', // 感染 - 红
  r: '#4ade80', // 康复 - 绿
  axis: '#475569',
  grid: '#1e293b',
  text: '#94a3b8',
}

/**
 * 绘制 SIR 三条曲线。
 * @param series simulateSIR 生成的逐日比例序列
 * @param progress 0→1 逐步揭示时间轴
 */
export function drawEpidemicSir(
  canvas: HTMLCanvasElement,
  series: SIRPoint[],
  progress: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx || series.length === 0) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const padL = 52
  const padR = 20
  const padT = 20
  const padB = 36
  const plotW = W - padL - padR
  const plotH = H - padT - padB
  const maxT = series[series.length - 1].t || 1

  const xOf = (t: number) => padL + (t / maxT) * plotW
  const yOf = (v: number) => padT + (1 - v) * plotH

  // 网格 + Y 轴刻度（0, 25%, 50%, 75%, 100%）
  ctx.strokeStyle = COLORS.grid
  ctx.fillStyle = COLORS.text
  ctx.lineWidth = 1
  ctx.font = '11px system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  for (let k = 0; k <= 4; k++) {
    const v = k / 4
    const y = yOf(v)
    ctx.beginPath()
    ctx.moveTo(padL, y)
    ctx.lineTo(W - padR, y)
    ctx.stroke()
    ctx.fillText(`${v * 100}%`, padL - 6, y)
  }

  // 坐标轴
  ctx.strokeStyle = COLORS.axis
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(padL, padT)
  ctx.lineTo(padL, H - padB)
  ctx.lineTo(W - padR, H - padB)
  ctx.stroke()

  // X 轴标注
  ctx.fillStyle = COLORS.text
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText(`时间 / 天（0 → ${Math.round(maxT)}）`, padL + plotW / 2, H - padB + 8)

  const upto = Math.max(1, Math.floor(series.length * progress))

  const drawCurve = (pick: (p: SIRPoint) => number, color: string) => {
    ctx.strokeStyle = color
    ctx.lineWidth = 2.5
    ctx.beginPath()
    for (let n = 0; n < upto; n++) {
      const p = series[n]
      const x = xOf(p.t)
      const y = yOf(pick(p))
      if (n === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  drawCurve((p) => p.s, COLORS.s)
  drawCurve((p) => p.r, COLORS.r)
  drawCurve((p) => p.i, COLORS.i)

  // 图例
  const legend: [string, string][] = [
    ['易感 S', COLORS.s],
    ['感染 I', COLORS.i],
    ['康复 R', COLORS.r],
  ]
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.font = '12px system-ui, sans-serif'
  let lx = padL + 12
  const ly = padT + 12
  for (const [label, color] of legend) {
    ctx.fillStyle = color
    ctx.fillRect(lx, ly - 5, 14, 10)
    ctx.fillStyle = COLORS.text
    ctx.fillText(label, lx + 20, ly)
    lx += 20 + ctx.measureText(label).width + 22
  }
}
