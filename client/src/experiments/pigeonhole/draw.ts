/**
 * 鸽巢原理 Canvas 绘制
 * 画 holes 个鸽巢和分配进去的鸽子，高亮装了 ≥2 只的巢。
 */
import { distribute } from './pigeonhole'

/**
 * 绘制鸽巢分配图。
 * @param items 鸽子数量
 * @param holes 鸽巢数量
 * @param seed 随机种子
 */
export function drawPigeonhole(
  canvas: HTMLCanvasElement,
  items: number,
  holes: number,
  seed = 1,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx || holes <= 0) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const counts = distribute(items, holes, seed)
  const cols = Math.min(holes, Math.ceil(Math.sqrt(holes * (W / H))))
  const rows = Math.ceil(holes / cols)
  const pad = 16
  const cw = (W - pad * 2) / cols
  const ch = (H - pad * 2) / rows

  for (let i = 0; i < holes; i++) {
    const r = Math.floor(i / cols)
    const c = i % cols
    const x = pad + c * cw
    const y = pad + r * ch
    const n = counts[i]
    const crowded = n >= 2

    ctx.fillStyle = crowded ? '#fef3c7' : '#eef2ff'
    ctx.strokeStyle = crowded ? '#f59e0b' : '#c7d2fe'
    ctx.lineWidth = crowded ? 3 : 1.5
    roundRect(ctx, x + 4, y + 4, cw - 8, ch - 8, 8)
    ctx.fill()
    ctx.stroke()

    drawPigeons(ctx, x + 4, y + 4, cw - 8, ch - 8, n)

    ctx.fillStyle = crowded ? '#b45309' : '#6366f1'
    ctx.font = 'bold 12px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(String(n), x + 10, y + ch - 12)
  }
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function drawPigeons(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, n: number) {
  const cx = x + w / 2
  const cy = y + h / 2
  const rad = Math.min(w, h) * 0.28
  ctx.font = `${Math.max(12, Math.min(w, h) * 0.22)}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  if (n === 0) return
  if (n === 1) {
    ctx.fillText('🐦', cx, cy)
    return
  }
  const show = Math.min(n, 6)
  for (let k = 0; k < show; k++) {
    const a = (2 * Math.PI * k) / show - Math.PI / 2
    ctx.fillText('🐦', cx + Math.cos(a) * rad, cy + Math.sin(a) * rad)
  }
  ctx.textBaseline = 'alphabetic'
}
