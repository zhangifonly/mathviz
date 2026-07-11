/**
 * 等差等比数列 Canvas 绘制
 * 把数列前若干项画成柱状图，柱高按数值等比缩放，逐项揭示。
 */

/**
 * 绘制数列柱状图。
 * @param seq 数列前若干项的数值
 * @param progress 0→1 逐项揭示
 */
export function drawSequences(
  canvas: HTMLCanvasElement,
  seq: number[],
  progress: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)
  if (seq.length === 0) return

  const padL = 44
  const padR = 20
  const padTop = 30
  const padBottom = 40
  const plotW = W - padL - padR
  const plotH = H - padTop - padBottom

  // 数值范围（含 0 基线），避免全相等时除零
  const maxV = Math.max(0, ...seq)
  const minV = Math.min(0, ...seq)
  const span = maxV - minV || 1
  const zeroY = padTop + (maxV / span) * plotH

  // 基线（0 轴）
  ctx.strokeStyle = '#334155'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padL, zeroY)
  ctx.lineTo(W - padR, zeroY)
  ctx.stroke()

  const n = seq.length
  const slot = plotW / n
  const barW = Math.max(4, slot * 0.6)
  const shown = Math.max(1, Math.floor(n * progress))

  ctx.textAlign = 'center'
  ctx.font = '12px system-ui, sans-serif'

  for (let i = 0; i < shown; i++) {
    const v = seq[i]
    const x = padL + i * slot + (slot - barW) / 2
    const h = (Math.abs(v) / span) * plotH
    const y = v >= 0 ? zeroY - h : zeroY
    const grad = ctx.createLinearGradient(0, y, 0, y + h)
    grad.addColorStop(0, '#22d3ee')
    grad.addColorStop(1, '#6366f1')
    ctx.fillStyle = grad
    ctx.fillRect(x, y, barW, Math.max(1, h))

    // 项数值标签
    ctx.fillStyle = '#e2e8f0'
    const label = Number.isInteger(v) ? String(v) : v.toFixed(2)
    const ly = v >= 0 ? y - 6 : y + h + 14
    ctx.fillText(label, x + barW / 2, ly)

    // 下标 a1 a2 ...
    ctx.fillStyle = '#64748b'
    ctx.fillText('a' + (i + 1), x + barW / 2, H - padBottom + 20)
  }
}
