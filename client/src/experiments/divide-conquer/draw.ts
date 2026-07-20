/**
 * 分治递归树 Canvas 绘制
 * 画归并排序的二分递归树：每个节点是一个子数组盒子，
 * 深度越大盒子越小，叶子为单元素；highlightDepth 高亮当前处理层。
 */
import { mergeSortTree, treeDepth, levels, type MergeTreeNode } from './divideConquer'

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']

function drawNode(
  ctx: CanvasRenderingContext2D,
  node: MergeTreeNode,
  x: number, y: number, w: number,
  active: boolean, showMerged: boolean,
) {
  const vals = showMerged ? node.sorted : node.values
  const label = vals.join(' ')
  ctx.font = '12px monospace'
  const boxW = Math.max(ctx.measureText(label).width + 14, 24)
  const bx = x + w / 2 - boxW / 2
  ctx.fillStyle = active ? COLORS[node.depth % COLORS.length] : '#e2e8f0'
  ctx.strokeStyle = active ? '#0f172a' : '#94a3b8'
  ctx.lineWidth = active ? 2 : 1
  const r = 6
  ctx.beginPath()
  ctx.roundRect(bx, y, boxW, 24, r)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = active ? '#ffffff' : '#334155'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, x + w / 2, y + 12)
  return { cx: x + w / 2, cy: y, boxW }
}

/**
 * 绘制分治递归树。
 * @param highlightDepth 高亮的层（-1 表示全部普通显示）
 * @param mergePhase 为 true 时该层及以下显示合并后的有序结果
 */
export function drawDivideConquer(
  canvas: HTMLCanvasElement,
  arr: number[],
  highlightDepth = -1,
  mergePhase = false,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, W, H)

  const tree = mergeSortTree(arr)
  const maxD = treeDepth(tree)
  const rows = levels(tree)
  const rowH = (H - 40) / (maxD + 1)

  // 先画连线：父节点中心连到子节点中心
  const centers = new Map<MergeTreeNode, number>()
  for (let d = 0; d <= maxD; d++) {
    const row = rows[d] || []
    const slot = W / row.length
    row.forEach((n, i) => centers.set(n, i * slot + slot / 2))
  }
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1
  const linkChildren = (n: MergeTreeNode) => {
    const px = centers.get(n)!
    const py = 20 + n.depth * rowH + 12
    for (const c of [n.left, n.right]) {
      if (!c) continue
      const cx = centers.get(c)!
      const cy = 20 + c.depth * rowH
      ctx.beginPath()
      ctx.moveTo(px, py + 12)
      ctx.lineTo(cx, cy)
      ctx.stroke()
      linkChildren(c)
    }
  }
  linkChildren(tree)

  // 再画节点盒子
  for (let d = 0; d <= maxD; d++) {
    const row = rows[d] || []
    const slot = W / row.length
    const active = highlightDepth < 0 || d === highlightDepth
    const merged = mergePhase && d >= highlightDepth && highlightDepth >= 0
    row.forEach((n, i) => {
      drawNode(ctx, n, i * slot, 20 + d * rowH, slot, active, merged)
    })
  }
}
