/**
 * 四叉树 Canvas 绘制: 画出递归四分的矩形网格 + 散布的点
 * 点密处网格自动细分, 直观呈现空间自适应索引。
 */
import { buildQuadtree, type Point, type QuadNode } from './quadtree'

function strokeNode(ctx: CanvasRenderingContext2D, n: QuadNode, depth: number) {
  // 越深的划分线越浅, 形成层次感
  const alpha = Math.max(0.15, 0.7 - depth * 0.08)
  ctx.strokeStyle = `rgba(99,102,241,${alpha})`
  ctx.lineWidth = Math.max(0.5, 1.6 - depth * 0.15)
  ctx.strokeRect(n.x, n.y, n.w, n.h)
  if (n.children) {
    for (const c of n.children) strokeNode(ctx, c, depth + 1)
  }
}

/**
 * 绘制四叉树。
 * @param highlight 可选范围查询框 [x,y,w,h], 命中点会高亮
 */
export function drawQuadtree(
  canvas: HTMLCanvasElement,
  points: Point[],
  capacity: number,
  highlight?: [number, number, number, number] | null,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, W, H)

  const root = buildQuadtree(points, 0, 0, W, H, capacity)
  strokeNode(ctx, root, 0)

  // 高亮查询框
  let hits: Set<Point> | null = null
  if (highlight) {
    const [hx, hy, hw, hh] = highlight
    ctx.fillStyle = 'rgba(251,191,36,0.18)'
    ctx.fillRect(hx, hy, hw, hh)
    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = 2
    ctx.strokeRect(hx, hy, hw, hh)
    hits = new Set(points.filter((p) => p.x >= hx && p.x <= hx + hw && p.y >= hy && p.y <= hy + hh))
  }

  for (const p of points) {
    const on = hits?.has(p)
    ctx.beginPath()
    ctx.arc(p.x, p.y, on ? 3.6 : 2.4, 0, 2 * Math.PI)
    ctx.fillStyle = on ? '#f43f5e' : '#0f172a'
    ctx.fill()
  }
}
