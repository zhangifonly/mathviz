/**
 * KD 树 Canvas 绘制：交替切分线 + 点 + 查询点到最近邻连线
 */
import {
  buildKdTree,
  nearestNeighbor,
  type Point,
  type KdNode,
} from './kdTree'

/** 递归画切分线：x 轴节点画竖线，y 轴节点画横线，并递归限定区域 */
function drawSplits(
  ctx: CanvasRenderingContext2D,
  node: KdNode | null,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
) {
  if (!node) return
  const p = node.point
  if (node.axis === 0) {
    ctx.strokeStyle = 'rgba(99,102,241,0.55)'
    ctx.beginPath()
    ctx.moveTo(p.x, y0)
    ctx.lineTo(p.x, y1)
    ctx.stroke()
    drawSplits(ctx, node.left, x0, y0, p.x, y1)
    drawSplits(ctx, node.right, p.x, y0, x1, y1)
  } else {
    ctx.strokeStyle = 'rgba(236,72,153,0.55)'
    ctx.beginPath()
    ctx.moveTo(x0, p.y)
    ctx.lineTo(x1, p.y)
    ctx.stroke()
    drawSplits(ctx, node.left, x0, y0, x1, p.y)
    drawSplits(ctx, node.right, x0, p.y, x1, y1)
  }
}

/**
 * 绘制 KD 树。传入 query 时高亮查询点与最近邻并连线。
 */
export function drawKdTree(
  canvas: HTMLCanvasElement,
  points: Point[],
  query: Point | null = null,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  if (points.length === 0) return

  const tree = buildKdTree(points)
  ctx.lineWidth = 1
  drawSplits(ctx, tree, 0, 0, W, H)

  // 数据点
  ctx.fillStyle = '#0f172a'
  for (const p of points) {
    ctx.beginPath()
    ctx.arc(p.x, p.y, 3.5, 0, 2 * Math.PI)
    ctx.fill()
  }

  if (query) {
    const { best } = nearestNeighbor(tree, query)
    if (best) {
      ctx.strokeStyle = '#f59e0b'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(query.x, query.y)
      ctx.lineTo(best.x, best.y)
      ctx.stroke()
      ctx.fillStyle = '#10b981'
      ctx.beginPath()
      ctx.arc(best.x, best.y, 6, 0, 2 * Math.PI)
      ctx.fill()
    }
    ctx.fillStyle = '#ef4444'
    ctx.beginPath()
    ctx.arc(query.x, query.y, 5, 0, 2 * Math.PI)
    ctx.fill()
  }
}
