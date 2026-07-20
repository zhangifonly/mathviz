/**
 * 二项式定理 Canvas 绘制：帕斯卡三角 + (a+b)^n 展开式
 */
import { pascalRow, expandTerms } from './binomialTheorem'

/** 把某项渲染成可读字符串，如 6a^2b^2、4a^3b、a^4 */
export function termToString(coeff: number, aPow: number, bPow: number): string {
  const c = coeff === 1 && (aPow > 0 || bPow > 0) ? '' : String(coeff)
  const a = aPow === 0 ? '' : aPow === 1 ? 'a' : `a^${aPow}`
  const b = bPow === 0 ? '' : bPow === 1 ? 'b' : `b^${bPow}`
  const body = `${c}${a}${b}`
  return body === '' ? '1' : body
}

/**
 * 绘制帕斯卡三角（0..n 行），高亮第 highlight 行，并在下方列出展开式。
 */
export function drawBinomialTheorem(
  canvas: HTMLCanvasElement,
  highlight: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, W, H)

  const rows = highlight + 1
  const cell = 30
  const gapY = 34
  const topY = 24
  const triH = rows * gapY

  for (let n = 0; n < rows; n++) {
    const row = pascalRow(n)
    const rowW = (row.length - 1) * cell
    const startX = W / 2 - rowW / 2
    const y = topY + n * gapY
    for (let k = 0; k < row.length; k++) {
      const x = startX + k * cell
      const active = n === highlight
      ctx.beginPath()
      ctx.arc(x, y, 13, 0, 2 * Math.PI)
      ctx.fillStyle = active ? '#6366f1' : '#e0e7ff'
      ctx.fill()
      ctx.fillStyle = active ? '#ffffff' : '#4338ca'
      ctx.font = `${active ? 'bold ' : ''}13px sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(String(row[k]), x, y)
    }
  }

  // 底部展开式
  const terms = expandTerms(highlight)
  const parts = terms.map((t) => termToString(t.coeff, t.aPow, t.bPow))
  const expr = `(a+b)^${highlight} = ${parts.join(' + ')}`
  ctx.fillStyle = '#1e293b'
  ctx.font = 'bold 18px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const baseY = Math.max(topY + triH + 28, H - 40)
  wrapText(ctx, expr, W / 2, baseY, W - 40, 24)
}

/** 简单折行：按空格断词，超宽换行 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  y: number,
  maxW: number,
  lh: number,
) {
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line)
      line = w
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  const startY = y - ((lines.length - 1) * lh) / 2
  lines.forEach((l, i) => ctx.fillText(l, cx, startY + i * lh))
}
