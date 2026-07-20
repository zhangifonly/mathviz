/**
 * 阿波罗尼垫片 Canvas 绘制
 * 内核在单位圆坐标 [-1,1]，此处映射到画布并按半径着色。
 */
import { generateGasket, type Circle } from './apollonianGasket'

const PALETTE = [
  '#6366f1', '#ec4899', '#22d3ee', '#a3e635', '#fbbf24',
  '#f87171', '#34d399', '#a78bfa', '#fb923c', '#38bdf8',
]

/** 按半径大小选色：越大越靠前，形成层次感 */
function colorFor(r: number): string {
  const level = Math.min(9, Math.max(0, Math.floor(-Math.log2(r))))
  return PALETTE[level % PALETTE.length]
}

/**
 * 绘制阿波罗尼垫片。
 * @param depth 递归深度
 * @param fill 是否填充圆（否则只描边）
 */
export function drawApollonianGasket(
  canvas: HTMLCanvasElement,
  depth: number,
  fill = true,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const pad = 16
  const scale = (Math.min(W, H) - pad * 2) / 2
  const cx = W / 2
  const cy = H / 2
  const toPx = (c: Circle) => ({
    px: cx + c.x * scale,
    py: cy + c.y * scale,
    pr: c.r * scale,
  })

  const circles = generateGasket(depth)
  // 先画大圆再画小圆，避免小圆被覆盖
  circles.sort((a, b) => b.r - a.r)

  for (const c of circles) {
    const { px, py, pr } = toPx(c)
    if (pr < 0.4) continue
    ctx.beginPath()
    ctx.arc(px, py, pr, 0, 2 * Math.PI)
    if (c.k < 0) {
      // 外圆只描白边
      ctx.strokeStyle = '#e2e8f0'
      ctx.lineWidth = 2
      ctx.stroke()
      continue
    }
    if (fill) {
      ctx.fillStyle = colorFor(c.r)
      ctx.globalAlpha = 0.85
      ctx.fill()
      ctx.globalAlpha = 1
    }
    ctx.strokeStyle = 'rgba(226,232,240,0.6)'
    ctx.lineWidth = 0.8
    ctx.stroke()
  }
}
