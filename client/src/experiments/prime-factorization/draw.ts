/**
 * 质因数分解树 Canvas 绘制
 * 叶子（质数）高亮为绿色，内部节点为蓝色，边连接父子。
 */
import { factorTree, type FactorNode } from './primeFactorization'

interface Placed {
  node: FactorNode
  x: number
  y: number
}

/** 统计叶子数量，用于水平布局 */
function countLeaves(node: FactorNode): number {
  if (!node.left && !node.right) return 1
  return (node.left ? countLeaves(node.left) : 0) + (node.right ? countLeaves(node.right) : 0)
}

export function drawPrimeFactorization(canvas: HTMLCanvasElement, n: number) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const root = factorTree(n)
  const totalLeaves = Math.max(1, countLeaves(root))
  const marginX = 50
  const marginY = 50
  const colW = totalLeaves > 1 ? (W - 2 * marginX) / (totalLeaves - 1) : 0
  const levelH = 90

  const placed: Placed[] = []
  const edges: [Placed, Placed][] = []
  let leafCursor = 0

  const layout = (node: FactorNode, depth: number): Placed => {
    let x: number
    if (!node.left && !node.right) {
      x = totalLeaves > 1 ? marginX + leafCursor * colW : W / 2
      leafCursor++
    } else {
      const kids = [node.left, node.right].filter(Boolean) as FactorNode[]
      const childPlaced = kids.map((k) => layout(k, depth + 1))
      x = childPlaced.reduce((s, p) => s + p.x, 0) / childPlaced.length
      for (const cp of childPlaced) edges.push([{ node, x, y: marginY + depth * levelH }, cp])
    }
    const p: Placed = { node, x, y: marginY + depth * levelH }
    placed.push(p)
    return p
  }
  layout(root, 0)

  // 先画边
  ctx.strokeStyle = '#94a3b8'
  ctx.lineWidth = 2
  for (const [a, b] of edges) {
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.stroke()
  }

  // 再画节点
  ctx.font = 'bold 16px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  for (const p of placed) {
    const r = 22
    ctx.beginPath()
    ctx.arc(p.x, p.y, r, 0, 2 * Math.PI)
    ctx.fillStyle = p.node.prime ? '#22c55e' : '#6366f1'
    ctx.fill()
    ctx.lineWidth = 2
    ctx.strokeStyle = p.node.prime ? '#15803d' : '#4338ca'
    ctx.stroke()
    ctx.fillStyle = '#ffffff'
    ctx.fillText(String(p.node.value), p.x, p.y)
  }
}
