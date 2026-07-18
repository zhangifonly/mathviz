/**
 * 最小生成树 Canvas 绘制
 * 画出所有节点、全部候选边（灰），并把已加入 MST 的前 step 条边高亮。
 */
import type { Graph, Edge } from './minimumSpanningTree'

const PAD = 40

function toPixel(canvas: HTMLCanvasElement, nx: number, ny: number): [number, number] {
  const w = canvas.width - PAD * 2
  const h = canvas.height - PAD * 2
  return [PAD + nx * w, PAD + ny * h]
}

/**
 * 绘制图与 MST。
 * @param mstEdges MST 边（按加入顺序）
 * @param step 展示前 step 条 MST 边（逐帧加边）
 */
export function drawMinimumSpanningTree(
  canvas: HTMLCanvasElement,
  graph: Graph,
  mstEdges: Edge[],
  step: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // 所有候选边（灰色细线）
  ctx.lineWidth = 1.5
  ctx.strokeStyle = '#cbd5e1'
  for (const e of graph.edges) {
    const [ax, ay] = toPixel(canvas, graph.nodes[e.u].x, graph.nodes[e.u].y)
    const [bx, by] = toPixel(canvas, graph.nodes[e.v].x, graph.nodes[e.v].y)
    ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke()
    ctx.fillStyle = '#94a3b8'
    ctx.font = '11px sans-serif'
    ctx.fillText(String(e.w), (ax + bx) / 2 + 4, (ay + by) / 2 - 2)
  }

  // 已加入 MST 的边（高亮）
  const shown = Math.max(0, Math.min(step, mstEdges.length))
  ctx.lineWidth = 4
  ctx.strokeStyle = '#6366f1'
  for (let i = 0; i < shown; i++) {
    const e = mstEdges[i]
    const [ax, ay] = toPixel(canvas, graph.nodes[e.u].x, graph.nodes[e.u].y)
    const [bx, by] = toPixel(canvas, graph.nodes[e.v].x, graph.nodes[e.v].y)
    ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke()
  }

  // 节点
  for (const node of graph.nodes) {
    const [px, py] = toPixel(canvas, node.x, node.y)
    ctx.beginPath(); ctx.arc(px, py, 13, 0, 2 * Math.PI)
    ctx.fillStyle = '#0f172a'; ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 13px sans-serif'
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText(node.label, px, py)
    ctx.textAlign = 'start'; ctx.textBaseline = 'alphabetic'
  }
}
