/**
 * 快速幂 Canvas 绘制：上方指数二进制分解，下方逐步平方累乘表格
 */
import { fastPow } from './fastExponentiation'

/**
 * 绘制快速幂过程。highlight 高亮到第几步（-1 表示全部显示）。
 */
export function drawFastExponentiation(
  canvas: HTMLCanvasElement,
  base: number,
  exp: number,
  mod = 0,
  highlight = -1,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const trace = fastPow(base, exp, mod)
  const bits = trace.bits
  const hi = highlight < 0 ? trace.steps.length - 1 : highlight

  // 标题
  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 18px sans-serif'
  ctx.textBaseline = 'middle'
  const modText = mod > 0 ? ` mod ${mod}` : ''
  ctx.fillText(`${base}^${exp}${modText}`, 20, 26)

  // 二进制位（高位在左）
  ctx.font = 'bold 15px monospace'
  ctx.fillStyle = '#475569'
  ctx.fillText('指数二进制:', 20, 54)
  const cell = 30
  const startX = 130
  for (let i = 0; i < bits.length; i++) {
    const b = bits[bits.length - 1 - i]
    const bitIdx = bits.length - 1 - i
    const x = startX + i * (cell + 4)
    ctx.fillStyle = b === 1 ? '#6366f1' : '#e2e8f0'
    ctx.fillRect(x, 40, cell, cell)
    if (bitIdx <= hi) {
      ctx.strokeStyle = '#f59e0b'
      ctx.lineWidth = 2
      ctx.strokeRect(x, 40, cell, cell)
    }
    ctx.fillStyle = b === 1 ? '#ffffff' : '#94a3b8'
    ctx.textAlign = 'center'
    ctx.fillText(String(b), x + cell / 2, 55)
  }
  ctx.textAlign = 'left'

  // 表格：位 | 底数 | 是否乘 | 结果
  const cols = ['位', '底数(平方)', '乘入?', '累乘结果']
  const colX = [24, 90, 260, 360]
  const top = 100
  const rowH = Math.min(34, (H - top - 20) / (trace.steps.length + 1))
  ctx.font = 'bold 14px sans-serif'
  ctx.fillStyle = '#334155'
  cols.forEach((c, i) => ctx.fillText(c, colX[i], top))

  ctx.font = '13px monospace'
  for (let i = 0; i < trace.steps.length; i++) {
    const s = trace.steps[i]
    const y = top + rowH * (i + 1)
    const active = i === hi
    if (active) {
      ctx.fillStyle = '#eef2ff'
      ctx.fillRect(16, y - rowH / 2 + 2, W - 32, rowH - 2)
    }
    ctx.fillStyle = i <= hi ? '#0f172a' : '#cbd5e1'
    ctx.fillText(`第${s.bitIndex}位=${s.bit}`, colX[0], y)
    ctx.fillText(clip(s.base), colX[1], y)
    ctx.fillStyle = s.multiplied ? '#16a34a' : (i <= hi ? '#94a3b8' : '#cbd5e1')
    ctx.fillText(s.multiplied ? '是 x' : '跳过', colX[2], y)
    ctx.fillStyle = i <= hi ? '#6366f1' : '#cbd5e1'
    ctx.fillText(clip(s.result), colX[3], y)
  }

  // 底部对比
  ctx.font = 'bold 13px sans-serif'
  ctx.fillStyle = '#334155'
  ctx.fillText(`乘法次数  快速幂 ${trace.fastMults} 次  vs  朴素法 ${trace.naiveMults} 次`, 20, H - 12)
}

function clip(s: string): string {
  return s.length > 16 ? s.slice(0, 15) + '…' : s
}
