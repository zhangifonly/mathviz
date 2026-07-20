/**
 * 决策树 Canvas 绘制
 *
 * 先用降采样像素扫描画出决策树产生的轴对齐分类区域（矩形块染类别色），
 * 再叠加原始两类数据点。坐标域 0..1，映射到画布像素。
 */
import { buildTree, classify, type Point, type TreeNode } from './decisionTree'

const CLASS_FILL = ['rgba(99,102,241,0.16)', 'rgba(236,72,153,0.16)'] // 0 蓝紫 / 1 粉
const CLASS_DOT = ['#4f46e5', '#db2777']

export function drawDecisionTree(
  canvas: HTMLCanvasElement,
  points: Point[],
  maxDepth: number,
  step = 6,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx || points.length === 0) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const tree: TreeNode = buildTree(points, maxDepth)

  // 轴对齐区域：逐块判定类别染色
  for (let py = 0; py < H; py += step) {
    for (let px = 0; px < W; px += step) {
      const cx = (px + step / 2) / W
      const cy = (py + step / 2) / H
      const lab = classify(tree, cx, cy)
      ctx.fillStyle = CLASS_FILL[lab] ?? CLASS_FILL[0]
      ctx.fillRect(px, py, step, step)
    }
  }

  // 分裂边界线
  ctx.strokeStyle = 'rgba(30,41,59,0.35)'
  ctx.lineWidth = 1
  drawBoundaries(ctx, tree, 0, 1, 0, 1, W, H)

  // 原始数据点
  for (const p of points) {
    ctx.beginPath()
    ctx.fillStyle = CLASS_DOT[p.label] ?? CLASS_DOT[0]
    ctx.arc(p.x * W, p.y * H, 4, 0, 2 * Math.PI)
    ctx.fill()
    ctx.lineWidth = 1
    ctx.strokeStyle = '#ffffff'
    ctx.stroke()
  }
}

/** 递归画出每个内部节点的分裂线（限定在其子区域内） */
function drawBoundaries(
  ctx: CanvasRenderingContext2D,
  node: TreeNode,
  x0: number, x1: number, y0: number, y1: number,
  W: number, H: number,
) {
  if (node.leaf) return
  ctx.beginPath()
  if (node.axis === 0) {
    const px = node.threshold * W
    ctx.moveTo(px, y0 * H)
    ctx.lineTo(px, y1 * H)
    ctx.stroke()
    drawBoundaries(ctx, node.left, x0, node.threshold, y0, y1, W, H)
    drawBoundaries(ctx, node.right, node.threshold, x1, y0, y1, W, H)
  } else {
    const py = node.threshold * H
    ctx.moveTo(x0 * W, py)
    ctx.lineTo(x1 * W, py)
    ctx.stroke()
    drawBoundaries(ctx, node.left, x0, x1, y0, node.threshold, W, H)
    drawBoundaries(ctx, node.right, x0, x1, node.threshold, y1, W, H)
  }
}
