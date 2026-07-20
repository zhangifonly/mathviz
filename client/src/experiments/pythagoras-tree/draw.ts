/**
 * 毕达哥拉斯树 Canvas 绘制
 * 内核给出数学坐标（y 向上），这里缩放平移并翻转到屏幕坐标。
 */
import { buildTree, treeBounds, type Square } from './pythagorasTree'

// 按层级渐变的树冠配色：由树干褐到叶绿
const PALETTE = [
  '#78350f', '#92400e', '#b45309', '#65a30d', '#4d7c0f',
  '#16a34a', '#22c55e', '#4ade80', '#86efac', '#a7f3d0',
  '#6ee7b7', '#34d399', '#10b981',
]

function drawSquare(ctx: CanvasRenderingContext2D, sq: Square, project: (p: { x: number; y: number }) => [number, number]) {
  ctx.beginPath()
  const [x0, y0] = project(sq.points[0])
  ctx.moveTo(x0, y0)
  for (let i = 1; i < 4; i++) {
    const [x, y] = project(sq.points[i])
    ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.fillStyle = PALETTE[Math.min(sq.level, PALETTE.length - 1)]
  ctx.fill()
  ctx.strokeStyle = 'rgba(15,23,42,0.25)'
  ctx.lineWidth = 0.6
  ctx.stroke()
}

/**
 * 绘制毕达哥拉斯树。
 * @param depth 递归深度
 * @param angleDeg 倾角（度）
 */
export function drawPythagorasTree(canvas: HTMLCanvasElement, depth: number, angleDeg = 45) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const squares = buildTree(depth, angleDeg)
  const b = treeBounds(squares)
  const pad = 24
  const spanX = b.maxX - b.minX || 1
  const spanY = b.maxY - b.minY || 1
  const scale = Math.min((W - 2 * pad) / spanX, (H - 2 * pad) / spanY)
  const offX = (W - spanX * scale) / 2
  const offY = (H - spanY * scale) / 2
  const project = (p: { x: number; y: number }): [number, number] => [
    offX + (p.x - b.minX) * scale,
    // 翻转 y：数学坐标向上，画布向下
    H - offY - (p.y - b.minY) * scale,
  ]

  // 深层先画（在底），浅层后画（在上），保证树干压住树冠根部
  const ordered = [...squares].sort((s1, s2) => s2.level - s1.level)
  for (const sq of ordered) drawSquare(ctx, sq, project)
}
