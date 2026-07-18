/**
 * PageRank 有向链接图 Canvas 绘制
 * 节点半径随 PageRank 值增大，展示某一帧的 rank 分布。
 */
import type { WebGraph } from './pagerank'

const PALETTE = ['#6366f1', '#ec4899', '#22d3ee', '#a3e635', '#fb923c', '#f87171']

function arrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
  const a = Math.atan2(y2 - y1, x2 - x1)
  const len = Math.hypot(x2 - x1, y2 - y1)
  // 起点/终点略微内缩，避免箭头压在节点上
  const sx = x1 + Math.cos(a) * 22
  const sy = y1 + Math.sin(a) * 22
  const ex = x2 - Math.cos(a) * 26
  const ey = y2 - Math.sin(a) * 26
  if (len < 50) return
  ctx.strokeStyle = 'rgba(100,116,139,0.55)'
  ctx.lineWidth = 1.6
  ctx.beginPath()
  ctx.moveTo(sx, sy)
  ctx.lineTo(ex, ey)
  ctx.stroke()
  // 箭头
  ctx.fillStyle = 'rgba(100,116,139,0.75)'
  ctx.beginPath()
  ctx.moveTo(ex, ey)
  ctx.lineTo(ex - Math.cos(a - 0.4) * 9, ey - Math.sin(a - 0.4) * 9)
  ctx.lineTo(ex - Math.cos(a + 0.4) * 9, ey - Math.sin(a + 0.4) * 9)
  ctx.closePath()
  ctx.fill()
}

/**
 * 绘制某一帧的 PageRank 图。
 * @param rank 当前 rank 向量（与 graph.nodes 对齐）
 */
export function drawPagerank(canvas: HTMLCanvasElement, graph: WebGraph, rank: number[]) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  const pad = 60
  ctx.clearRect(0, 0, W, H)
  const px = (n: { x: number }) => pad + n.x * (W - 2 * pad)
  const py = (n: { y: number }) => pad + n.y * (H - 2 * pad)

  for (const [from, to] of graph.edges) {
    arrow(ctx, px(graph.nodes[from]), py(graph.nodes[from]), px(graph.nodes[to]), py(graph.nodes[to]))
  }

  const maxR = Math.max(...rank, 1e-9)
  graph.nodes.forEach((n, i) => {
    const x = px(n)
    const y = py(n)
    const r = 14 + (rank[i] / maxR) * 30
    ctx.fillStyle = PALETTE[i % PALETTE.length]
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 2 * Math.PI)
    ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 15px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(n.label, x, y - 4)
    ctx.font = '10px sans-serif'
    ctx.fillText((rank[i] * 100).toFixed(1) + '%', x, y + 10)
  })
}
