/**
 * 数字根 Canvas 绘制：展示逐步坍缩过程 + 弃九验算对照
 */
import { digitalRootSteps, digitalRoot, type CastResult } from './digitalRoot'

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#22c55e']

/** 绘制某个数逐步坍缩到数字根的链条 */
export function drawDigitalRoot(canvas: HTMLCanvasElement, n: number) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const steps = digitalRootSteps(n)
  const root = digitalRoot(n)
  const cx = W / 2
  const gap = Math.min(90, (H - 120) / Math.max(steps.length, 1))
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  steps.forEach((v, i) => {
    const y = 70 + i * gap
    const isLast = i === steps.length - 1
    ctx.fillStyle = isLast ? '#16a34a' : COLORS[i % COLORS.length]
    const r = isLast ? 34 : 28
    ctx.beginPath()
    ctx.arc(cx, y, r, 0, 2 * Math.PI)
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.font = `bold ${isLast ? 26 : 20}px sans-serif`
    ctx.fillText(String(v), cx, y)
    if (i > 0) {
      ctx.strokeStyle = '#94a3b8'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(cx, y - gap + 30)
      ctx.lineTo(cx, y - r)
      ctx.stroke()
      ctx.fillStyle = '#64748b'
      ctx.font = '13px sans-serif'
      ctx.fillText('各位相加', cx + 70, y - gap / 2 + 15)
    }
  })

  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 18px sans-serif'
  ctx.fillText(`数字根 = ${root}`, cx, H - 26)
}

/** 绘制弃九验算的两边对照 */
export function drawCasting(canvas: HTMLCanvasElement, r: CastResult) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const sign = r.op === 'add' ? '+' : '×'
  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 24px sans-serif'
  ctx.fillText(`${r.a} ${sign} ${r.b} = ${r.result}`, W / 2, 70)

  ctx.font = '16px sans-serif'
  ctx.fillStyle = '#6366f1'
  ctx.fillText(`左边: dr(${r.a})=${r.rootA}  ${sign}  dr(${r.b})=${r.rootB}  →  ${r.rootCombined}`, W / 2, 150)
  ctx.fillStyle = '#ec4899'
  ctx.fillText(`右边: dr(${r.result}) = ${r.rootResult}`, W / 2, 200)

  const ok = r.valid
  ctx.fillStyle = ok ? '#16a34a' : '#dc2626'
  ctx.font = 'bold 22px sans-serif'
  ctx.fillText(ok ? `${r.rootCombined} = ${r.rootResult}  验算通过` : `${r.rootCombined} ≠ ${r.rootResult}  发现错误`, W / 2, 280)

  ctx.strokeStyle = ok ? '#16a34a' : '#dc2626'
  ctx.lineWidth = 3
  ctx.strokeRect(W / 2 - 210, 250, 420, 60)
}
