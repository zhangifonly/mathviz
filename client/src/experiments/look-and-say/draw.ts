/**
 * 外观数列 Canvas 绘制
 * 左侧列出数列前几项，右侧画项长增长曲线（对数纵轴，斜率趋于康威常数）
 */
import { sequence, CONWAY_CONSTANT } from './lookAndSay'

/**
 * 绘制外观数列与增长曲线。
 * @param n 展示前 n 项
 * @param highlight 高亮到第几项（用于逐句展开），默认全部
 */
export function drawLookAndSay(
  canvas: HTMLCanvasElement,
  n: number,
  highlight = n,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const terms = sequence(n)
  const splitX = Math.round(W * 0.52)

  // ---- 左侧：数列各项 ----
  ctx.textBaseline = 'middle'
  const rowH = Math.min(46, (H - 30) / n)
  for (let i = 0; i < terms.length; i++) {
    const y = 26 + i * rowH
    const on = i < highlight
    ctx.fillStyle = on ? '#6366f1' : '#cbd5e1'
    ctx.font = 'bold 14px monospace'
    ctx.fillText('a' + (i + 1), 12, y)
    ctx.fillStyle = on ? '#0f172a' : '#e2e8f0'
    const s = terms[i]
    const shown = s.length > 22 ? s.slice(0, 22) + '..(' + s.length + ')' : s
    ctx.font = '13px monospace'
    ctx.fillText(shown, 44, y)
  }

  // ---- 右侧：项长增长曲线（半对数）----
  const ox = splitX + 34
  const oy = H - 34
  const gw = W - ox - 20
  const gh = H - 60
  const maxLog = Math.log(terms[n - 1].length) || 1
  ctx.strokeStyle = '#94a3b8'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(ox, 20)
  ctx.lineTo(ox, oy)
  ctx.lineTo(ox + gw, oy)
  ctx.stroke()
  ctx.fillStyle = '#64748b'
  ctx.font = '11px sans-serif'
  ctx.fillText('log(项长)', splitX + 6, 14)

  // 康威常数参考斜率线
  ctx.strokeStyle = '#f59e0b'
  ctx.setLineDash([4, 4])
  ctx.beginPath()
  ctx.moveTo(ox, oy)
  const refEndY = oy - (Math.log(CONWAY_CONSTANT) * (n - 1) / maxLog) * gh
  ctx.lineTo(ox + gw, refEndY)
  ctx.stroke()
  ctx.setLineDash([])

  // 实际项长折线
  ctx.strokeStyle = '#6366f1'
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let i = 0; i < highlight; i++) {
    const x = ox + (gw * i) / (n - 1)
    const y = oy - (Math.log(terms[i].length) / maxLog) * gh
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
  ctx.fillStyle = '#6366f1'
  for (let i = 0; i < highlight; i++) {
    const x = ox + (gw * i) / (n - 1)
    const y = oy - (Math.log(terms[i].length) / maxLog) * gh
    ctx.beginPath()
    ctx.arc(x, y, 3, 0, 2 * Math.PI)
    ctx.fill()
  }
}
