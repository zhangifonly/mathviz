/**
 * 康托三分集 Canvas 绘制
 * 逐层堆叠：每一层占一行，画出该层剩余的所有线段。
 */
import { cantorSegments } from './cantorSet'

const PALETTE = [
  '#6366f1', '#7c3aed', '#a21caf', '#c026d3',
  '#db2777', '#e11d48', '#ea580c', '#d97706',
]

/**
 * 画出从第 0 层到第 levels 层的康托集堆叠图。
 * @param levels 最大层数（含）
 */
export function drawCantorSet(
  canvas: HTMLCanvasElement,
  levels: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const padX = 30
  const padTop = 24
  const padBottom = 24
  const usableW = W - padX * 2
  const rows = levels + 1
  const rowH = (H - padTop - padBottom) / rows
  const barH = Math.max(6, rowH * 0.5)

  for (let n = 0; n <= levels; n++) {
    const segs = cantorSegments(n)
    const y = padTop + n * rowH
    ctx.fillStyle = PALETTE[n % PALETTE.length]
    for (const s of segs) {
      const x = padX + s.start * usableW
      const w = Math.max(0.6, (s.end - s.start) * usableW)
      ctx.fillRect(x, y, w, barH)
    }
    // 层号标签
    ctx.fillStyle = '#64748b'
    ctx.font = '11px sans-serif'
    ctx.textBaseline = 'middle'
    ctx.fillText(`n=${n}`, 2, y + barH / 2)
  }
}
