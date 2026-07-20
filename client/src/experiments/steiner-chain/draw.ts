/**
 * 斯坦纳链 Canvas 绘制：外圆 + 内圆 + 中间的相切圆链，支持旋转。
 */
import { steinerChain, concentricChain, type Chain, type Circle } from './steinerChain'

const PALETTE = [
  '#6366f1', '#ec4899', '#22d3ee', '#a3e635', '#fbbf24',
  '#f87171', '#34d399', '#a78bfa', '#fb923c', '#38bdf8',
]

/** 计算把 chain 的所有圆装进画布的缩放与平移 */
function fit(chain: Chain, W: number, H: number, pad = 24) {
  const all = [chain.outer, chain.inner, ...chain.circles]
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  for (const c of all) {
    minX = Math.min(minX, c.x - c.r); maxX = Math.max(maxX, c.x + c.r)
    minY = Math.min(minY, c.y - c.r); maxY = Math.max(maxY, c.y + c.r)
  }
  const scale = Math.min((W - 2 * pad) / (maxX - minX), (H - 2 * pad) / (maxY - minY))
  const cx = (minX + maxX) / 2
  const cy = (minY + maxY) / 2
  return { scale, cx, cy }
}

function stroke(ctx: CanvasRenderingContext2D, c: Circle, t: (c: Circle) => Circle, color: string, fill = false) {
  const p = t(c)
  ctx.beginPath()
  ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI)
  if (fill) {
    ctx.fillStyle = color
    ctx.globalAlpha = 0.55
    ctx.fill()
    ctx.globalAlpha = 1
  }
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.stroke()
}

/**
 * @param mode 'general' 反演后的一般链，'concentric' 同心链
 */
export function drawSteinerChain(
  canvas: HTMLCanvasElement,
  n: number,
  rotation = 0,
  mode: 'general' | 'concentric' = 'general',
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const chain = mode === 'concentric'
    ? concentricChain(n, 1, rotation)
    : steinerChain(n, rotation, 1)
  const { scale, cx, cy } = fit(chain, W, H)
  const t = (c: Circle): Circle => ({
    x: W / 2 + (c.x - cx) * scale,
    y: H / 2 + (c.y - cy) * scale,
    r: c.r * scale,
  })

  stroke(ctx, chain.outer, t, '#1e293b')
  stroke(ctx, chain.inner, t, '#64748b')
  chain.circles.forEach((c, i) => stroke(ctx, c, t, PALETTE[i % PALETTE.length], true))
}
