/**
 * 哈夫曼树 Canvas 绘制：叶子标字符+频率，边标 0/1。
 */
import type { HuffNode } from './huffmanCoding'

interface Pos {
  node: HuffNode
  x: number
  y: number
  code: string
}

/** 递归布局：按子树叶子数分配水平空间，返回带坐标的节点列表 */
function layout(node: HuffNode | null, x0: number, x1: number, depth: number, code: string, out: Pos[]): number {
  if (!node) return (x0 + x1) / 2
  const y = 40 + depth * 78
  if (node.char !== null) {
    const x = (x0 + x1) / 2
    out.push({ node, x, y, code })
    return x
  }
  const mid = (x0 + x1) / 2
  const lx = layout(node.left, x0, mid, depth + 1, code + '0', out)
  const rx = layout(node.right, mid, x1, depth + 1, code + '1', out)
  const x = (lx + rx) / 2
  out.push({ node, x, y, code })
  return x
}

export function drawHuffmanCoding(canvas: HTMLCanvasElement, tree: HuffNode | null) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, W, H)
  if (!tree) return

  const nodes: Pos[] = []
  layout(tree, 20, W - 20, 0, '', nodes)
  const byCode = new Map(nodes.map((p) => [p.code, p]))

  // 先画边（带 0/1 标签）
  ctx.lineWidth = 2
  for (const p of nodes) {
    if (p.node.char !== null) continue
    for (const bit of ['0', '1']) {
      const child = byCode.get(p.code + bit)
      if (!child) continue
      ctx.strokeStyle = bit === '0' ? '#6366f1' : '#ec4899'
      ctx.beginPath()
      ctx.moveTo(p.x, p.y)
      ctx.lineTo(child.x, child.y)
      ctx.stroke()
      ctx.fillStyle = bit === '0' ? '#6366f1' : '#ec4899'
      ctx.font = 'bold 14px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(bit, (p.x + child.x) / 2 + (bit === '0' ? -10 : 10), (p.y + child.y) / 2)
    }
  }

  // 再画节点
  for (const p of nodes) {
    const leaf = p.node.char !== null
    ctx.beginPath()
    ctx.arc(p.x, p.y, leaf ? 20 : 15, 0, 2 * Math.PI)
    ctx.fillStyle = leaf ? '#fbbf24' : '#e0e7ff'
    ctx.fill()
    ctx.strokeStyle = '#334155'
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.fillStyle = '#0f172a'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    if (leaf) {
      const label = p.node.char === ' ' ? '␣' : p.node.char
      ctx.font = 'bold 15px sans-serif'
      ctx.fillText(String(label), p.x, p.y - 3)
      ctx.font = '11px sans-serif'
      ctx.fillText(String(p.node.freq), p.x, p.y + 11)
    } else {
      ctx.font = '12px sans-serif'
      ctx.fillText(String(p.node.freq), p.x, p.y)
    }
  }
  ctx.textBaseline = 'alphabetic'
}
