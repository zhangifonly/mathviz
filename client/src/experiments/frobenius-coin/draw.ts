/**
 * Frobenius 硬币问题 Canvas 绘制
 * 画出 0..N 的金额条：可凑=绿，不可凑=红，Frobenius 数(最后一个红)高亮描边。
 */
import { representable, frobeniusNumber } from './frobeniusCoin'

/**
 * 绘制金额格阵。每格代表一个金额，绿色=可凑，红色=不可凑。
 * @param coins 硬币面额
 * @param maxAmount 展示到的最大金额
 */
export function drawFrobeniusCoin(
  canvas: HTMLCanvasElement,
  coins: number[],
  maxAmount = 48,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const reach = representable(coins, maxAmount)
  const frob = frobeniusNumber(coins)

  const cols = 12
  const rows = Math.ceil((maxAmount + 1) / cols)
  const pad = 10
  const gap = 4
  const cw = (W - pad * 2 - gap * (cols - 1)) / cols
  const ch = Math.min(cw, (H - pad * 2 - gap * (rows - 1)) / rows)

  ctx.font = `${Math.max(10, ch * 0.32)}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  for (let a = 0; a <= maxAmount; a++) {
    const r = Math.floor(a / cols)
    const c = a % cols
    const x = pad + c * (cw + gap)
    const y = pad + r * (ch + gap)
    const ok = reach[a]
    ctx.fillStyle = ok ? '#22c55e' : '#ef4444'
    ctx.globalAlpha = ok ? 0.85 : 0.9
    ctx.fillRect(x, y, cw, ch)
    ctx.globalAlpha = 1

    if (a === frob) {
      ctx.strokeStyle = '#facc15'
      ctx.lineWidth = 3
      ctx.strokeRect(x + 1.5, y + 1.5, cw - 3, ch - 3)
    }
    ctx.fillStyle = '#ffffff'
    ctx.fillText(String(a), x + cw / 2, y + ch / 2)
  }
}
