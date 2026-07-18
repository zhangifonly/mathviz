/**
 * 欧拉/哈密顿图 Canvas 绘制。
 * 画节点与边，并按 progress(0..1) 高亮一笔画路径已走过的部分。
 */
import { findEulerPath, classifyEuler, type Graph } from './eulerHamiltonPath'

function px(canvas: HTMLCanvasElement, g: Graph): { x: number; y: number }[] {
  const pad = 48
  const W = canvas.width - pad * 2
  const H = canvas.height - pad * 2
  return g.nodes.map((n) => ({ x: pad + n.x * W, y: pad + n.y * H }))
}

/** 计算重边偏移，让平行边分开显示 */
function edgeOffset(g: Graph, idx: number): number {
  const [a, b] = g.edges[idx]
  const group = g.edges.filter(
    (e, j) => j <= idx && ((e[0] === a && e[1] === b) || (e[0] === b && e[1] === a)),
  ).length
  return (group - 1) * 14 * (group % 2 === 0 ? 1 : -1)
}

export function drawEulerHamiltonPath(
  canvas: HTMLCanvasElement,
  graph: Graph,
  progress = 0,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  const pts = px(canvas, graph)
  const path = findEulerPath(graph)
  const kind = classifyEuler(graph)
  const litSteps = Math.floor(progress * (path.length - 1))
  const litEdges = new Set<string>()
  for (let i = 0; i < litSteps && i < path.length - 1; i++) {
    litEdges.add([path[i], path[i + 1]].sort((a, b) => a - b).join('-'))
  }

  // 边
  graph.edges.forEach(([a, b], idx) => {
    const off = edgeOffset(graph, idx)
    const mx = (pts[a].x + pts[b].x) / 2
    const my = (pts[a].y + pts[b].y) / 2
    const dx = pts[b].x - pts[a].x
    const dy = pts[b].y - pts[a].y
    const len = Math.hypot(dx, dy) || 1
    const cx = mx + (-dy / len) * off
    const cy = my + (dx / len) * off
    const key = [a, b].sort((x, y) => x - y).join('-')
    ctx.beginPath()
    ctx.moveTo(pts[a].x, pts[a].y)
    ctx.quadraticCurveTo(cx, cy, pts[b].x, pts[b].y)
    ctx.lineWidth = litEdges.has(key) ? 5 : 2.5
    ctx.strokeStyle = litEdges.has(key) ? '#ec4899' : '#94a3b8'
    ctx.stroke()
  })

  // 节点
  graph.nodes.forEach((n, i) => {
    ctx.beginPath()
    ctx.arc(pts[i].x, pts[i].y, 15, 0, 2 * Math.PI)
    ctx.fillStyle = kind === 'none' ? '#cbd5e1' : '#6366f1'
    ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 14px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(n.id, pts[i].x, pts[i].y)
  })
}
