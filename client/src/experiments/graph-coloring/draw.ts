/**
 * 图着色 Canvas 绘制：画边、按色染节点、冲突边高亮。
 */
import { conflictEdges, type Graph } from './graphColoring'

const PALETTE = ['#6366f1', '#ec4899', '#22c55e', '#fbbf24', '#38bdf8', '#f97316']

/**
 * 绘制图与着色方案。
 * @param colors 每个节点的色号（-1 表示未着色，画灰）
 */
export function drawGraphColoring(
  canvas: HTMLCanvasElement,
  graph: Graph,
  colors: number[],
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const conflicts = new Set(conflictEdges(graph, colors))

  // 先画边
  graph.edges.forEach(([a, b], i) => {
    const na = graph.nodes[a]
    const nb = graph.nodes[b]
    const bad = conflicts.has(i)
    ctx.strokeStyle = bad ? '#ef4444' : '#cbd5e1'
    ctx.lineWidth = bad ? 4 : 2
    ctx.beginPath()
    ctx.moveTo(na.x, na.y)
    ctx.lineTo(nb.x, nb.y)
    ctx.stroke()
  })

  // 再画节点
  for (let v = 0; v < graph.nodes.length; v++) {
    const node = graph.nodes[v]
    const c = colors[v]
    ctx.fillStyle = c >= 0 ? PALETTE[c % PALETTE.length] : '#94a3b8'
    ctx.beginPath()
    ctx.arc(node.x, node.y, 18, 0, 2 * Math.PI)
    ctx.fill()
    ctx.lineWidth = 2.5
    ctx.strokeStyle = '#0f172a'
    ctx.stroke()

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 13px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(node.label, node.x, node.y)
  }
}

export { PALETTE as COLORING_PALETTE }
