/**
 * 卡普雷卡例程 Canvas 绘制：竖直排列迭代链，每步显示 大数 - 小数 = 结果
 */
import { kaprekarChain, KAPREKAR_CONSTANT, type KaprekarStep } from './kaprekar'

function pad4(n: number): string {
  return String(n).padStart(4, '0')
}

/** 绘制从 n 出发的卡普雷卡迭代链 */
export function drawKaprekar(canvas: HTMLCanvasElement, n: number, maxSteps = 7) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, W, H)

  const chain: KaprekarStep[] = kaprekarChain(n, maxSteps)
  const rows = chain.length
  const top = 40
  const rowH = Math.min(64, (H - top - 20) / Math.max(rows, 1))
  const cx = W / 2

  for (let i = 0; i < rows; i++) {
    const step = chain[i]
    const y = top + i * rowH
    const reached = step.result === KAPREKAR_CONSTANT

    // 步骤标签
    ctx.fillStyle = '#94a3b8'
    ctx.font = '13px system-ui, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(`第 ${i + 1} 步`, 16, y + rowH / 2 + 4)

    // 算式 big - small = result
    ctx.textAlign = 'center'
    ctx.font = 'bold 22px ui-monospace, monospace'
    const eq = `${pad4(step.big)} - ${pad4(step.small)} = ${pad4(step.result)}`
    ctx.fillStyle = reached ? '#059669' : '#1e293b'
    ctx.fillText(eq, cx, y + rowH / 2 + 8)

    // 结果高亮框
    if (reached) {
      ctx.strokeStyle = '#10b981'
      ctx.lineWidth = 2
      ctx.strokeRect(cx + 78, y + rowH / 2 - 16, 72, 30)
    }

    // 向下箭头（承接到下一行输入）
    if (i < rows - 1) {
      ctx.strokeStyle = '#cbd5e1'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(cx, y + rowH / 2 + 14)
      ctx.lineTo(cx, y + rowH - 4)
      ctx.stroke()
    }
  }

  // 收敛提示
  const last = chain[rows - 1]
  ctx.textAlign = 'center'
  ctx.font = 'bold 16px system-ui, sans-serif'
  if (last.result === KAPREKAR_CONSTANT) {
    ctx.fillStyle = '#059669'
    ctx.fillText(`收敛到卡普雷卡常数 6174（共 ${rows} 步）`, cx, H - 12)
  } else if (last.result === 0) {
    ctx.fillStyle = '#dc2626'
    ctx.fillText('数字全相同，落入 0', cx, H - 12)
  }
}
