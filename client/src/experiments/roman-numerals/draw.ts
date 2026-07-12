/**
 * 罗马数字 Canvas 绘制
 * 逐个符号揭示分解结果，并标注每个符号对应的数值。
 */

import type { RomanBreakdown } from './romanNumerals'

const SUB = '#f59e0b' // 减法组合高亮色
const ADD = '#38bdf8' // 加法符号色

/**
 * 绘制一个数的罗马数字分解。
 * @param data decompose 生成的分解结果
 * @param progress 0→1 逐个符号揭示
 */
export function drawRomanNumerals(
  canvas: HTMLCanvasElement,
  data: RomanBreakdown,
  progress: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const steps = data.steps
  const shown = Math.max(0, Math.min(steps.length, Math.floor(steps.length * progress + 0.0001)))

  // 顶部显示阿拉伯数字
  ctx.fillStyle = '#e2e8f0'
  ctx.font = 'bold 40px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(`${data.value}`, W / 2, 56)

  ctx.font = '18px system-ui, sans-serif'
  ctx.fillStyle = '#94a3b8'
  ctx.fillText('等于', W / 2, 100)

  if (steps.length === 0) return

  // 计算每个符号方块的宽度，居中排布
  const gap = 12
  const boxH = 90
  const y = 150
  const widths = steps.map((s) => Math.max(52, 28 + s.symbol.length * 26))
  const totalW = widths.reduce((a, b) => a + b, 0) + gap * (steps.length - 1)
  let x = (W - totalW) / 2
  let running = 0

  for (let i = 0; i < steps.length; i++) {
    const s = steps[i]
    const w = widths[i]
    if (i < shown) {
      const isSub = s.symbol.length > 1
      ctx.fillStyle = isSub ? SUB : ADD
      ctx.globalAlpha = 0.18
      ctx.fillRect(x, y, w, boxH)
      ctx.globalAlpha = 1
      ctx.strokeStyle = isSub ? SUB : ADD
      ctx.lineWidth = 2
      ctx.strokeRect(x, y, w, boxH)

      ctx.fillStyle = '#f8fafc'
      ctx.font = 'bold 34px system-ui, sans-serif'
      ctx.fillText(s.symbol, x + w / 2, y + 34)

      ctx.fillStyle = isSub ? SUB : ADD
      ctx.font = '16px system-ui, sans-serif'
      ctx.fillText(`${s.value}`, x + w / 2, y + 70)

      running += s.value
    } else {
      ctx.strokeStyle = '#334155'
      ctx.lineWidth = 1.5
      ctx.setLineDash([5, 5])
      ctx.strokeRect(x, y, w, boxH)
      ctx.setLineDash([])
    }
    x += w + gap
  }

  // 底部累加进度
  ctx.fillStyle = '#cbd5e1'
  ctx.font = '20px system-ui, sans-serif'
  ctx.fillText(`累加 = ${running}`, W / 2, y + boxH + 44)

  if (shown === steps.length) {
    ctx.fillStyle = '#34d399'
    ctx.font = 'bold 26px system-ui, sans-serif'
    ctx.fillText(data.roman, W / 2, y + boxH + 88)
  }
}
