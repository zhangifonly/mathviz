/**
 * Stern-Brocot 树 Canvas 绘制
 * 逐层布局二叉树：第 k 层有 2^k 个节点，均匀铺开在水平方向。
 */
import { buildTree, type TreeNode } from './sternBrocot'

const PALETTE = ['#6366f1', '#ec4899', '#22d3ee', '#a3e635', '#fbbf24', '#f87171']

interface Placed {
  node: TreeNode
  x: number
  y: number
  level: number
}

/** 把树按层收集成带坐标的节点列表 */
function layout(root: TreeNode | null, W: number, H: number, depth: number): Placed[] {
  const placed: Placed[] = []
  const topPad = 46
  const rowGap = depth > 1 ? (H - topPad - 30) / (depth - 1) : 0
  const walk = (node: TreeNode | null, level: number, lo: number, hi: number) => {
    if (!node) return
    const x = (lo + hi) / 2
    const y = topPad + level * rowGap
    placed.push({ node, x, y, level })
    const mid = (lo + hi) / 2
    walk(node.left, level + 1, lo, mid)
    walk(node.right, level + 1, mid, hi)
  }
  walk(root, 0, 20, W - 20)
  return placed
}

export function drawSternBrocot(canvas: HTMLCanvasElement, depth: number) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const root = buildTree(depth)
  const placed = layout(root, W, H, depth)
  const map = new Map<TreeNode, Placed>()
  for (const p of placed) map.set(p.node, p)

  // 先画连线
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1.5
  for (const p of placed) {
    for (const child of [p.node.left, p.node.right]) {
      const c = child && map.get(child)
      if (!c) continue
      ctx.beginPath()
      ctx.moveTo(p.x, p.y)
      ctx.lineTo(c.x, c.y)
      ctx.stroke()
    }
  }

  // 再画节点
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = 'bold 13px system-ui, sans-serif'
  for (const p of placed) {
    ctx.fillStyle = PALETTE[Math.min(p.level, PALETTE.length - 1)]
    ctx.beginPath()
    ctx.arc(p.x, p.y, 17, 0, 2 * Math.PI)
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.fillText(`${p.node.frac.n}/${p.node.frac.d}`, p.x, p.y)
  }
}
