/**
 * Dijkstra 最短路 Canvas 绘制
 * 画节点+带权边，高亮已确定最短路的节点与最终最短路径树。
 */
import { dijkstra, shortestPath, type Graph } from './dijkstra'

function px(v: number, size: number, pad: number) {
  return pad + v * (size - 2 * pad)
}

/**
 * @param source 源点索引
 * @param target 目标点索引（高亮该条最短路径）
 */
export function drawDijkstra(
  canvas: HTMLCanvasElement,
  graph: Graph,
  source: number,
  target: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  const pad = 40
  ctx.clearRect(0, 0, W, H)

  const { dist, prev } = dijkstra(graph, source)
  const pos = graph.nodes.map((n) => ({ x: px(n.x, W, pad), y: px(n.y, H, pad) }))
  const treeEdge = new Set(
    prev.map((p, v) => (p === -1 ? '' : `${Math.min(p, v)}-${Math.max(p, v)}`)),
  )
  const path = shortestPath(prev, target)
  const pathEdge = new Set<string>()
  for (let i = 0; i + 1 < path.length; i++) {
    pathEdge.add(`${Math.min(path[i], path[i + 1])}-${Math.max(path[i], path[i + 1])}`)
  }

  // 边
  for (const e of graph.edges) {
    const key = `${Math.min(e.u, e.v)}-${Math.max(e.u, e.v)}`
    const a = pos[e.u]
    const b = pos[e.v]
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    if (pathEdge.has(key)) {
      ctx.strokeStyle = '#ec4899'
      ctx.lineWidth = 5
    } else if (treeEdge.has(key)) {
      ctx.strokeStyle = '#6366f1'
      ctx.lineWidth = 3
    } else {
      ctx.strokeStyle = '#cbd5e1'
      ctx.lineWidth = 1.5
    }
    ctx.stroke()
    // 权重标签
    ctx.fillStyle = '#475569'
    ctx.font = '13px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(String(e.w), (a.x + b.x) / 2, (a.y + b.y) / 2 - 8)
  }

  // 节点
  for (let i = 0; i < graph.nodes.length; i++) {
    const p = pos[i]
    const onPath = path.includes(i)
    ctx.beginPath()
    ctx.arc(p.x, p.y, 16, 0, 2 * Math.PI)
    if (i === source) ctx.fillStyle = '#22c55e'
    else if (onPath) ctx.fillStyle = '#ec4899'
    else ctx.fillStyle = '#6366f1'
    ctx.fill()
    ctx.lineWidth = 2
    ctx.strokeStyle = '#ffffff'
    ctx.stroke()
    // 标签
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 14px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(graph.nodes[i].label, p.x, p.y)
    // 距离
    const d = dist[i]
    ctx.fillStyle = '#0f172a'
    ctx.font = '12px sans-serif'
    ctx.fillText(Number.isFinite(d) ? String(d) : '∞', p.x, p.y + 28)
  }
}
