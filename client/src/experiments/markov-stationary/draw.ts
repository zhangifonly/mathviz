/**
 * 马氏链稳态 Canvas 绘制
 * 上半：3 状态转移图（节点 + 带权有向边）
 * 下半：某一步分布的柱状图，虚线标出稳态分布
 */
import { iterate, stationary, STATE_NAMES, type Matrix, type Vector } from './markovStationary'

const COLORS = ['#fbbf24', '#94a3b8', '#38bdf8'] // 晴/阴/雨

function drawGraph(ctx: CanvasRenderingContext2D, W: number, dist: Vector) {
  const cx = W / 2
  const cy = 120
  const R = 78
  const nodes = dist.map((_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 3
    return { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) }
  })
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1.5
  for (let i = 0; i < nodes.length; i++) {
    for (let j = 0; j < nodes.length; j++) {
      if (i === j) continue
      ctx.beginPath()
      ctx.moveTo(nodes[i].x, nodes[i].y)
      ctx.lineTo(nodes[j].x, nodes[j].y)
      ctx.stroke()
    }
  }
  for (let i = 0; i < nodes.length; i++) {
    const r = 20 + dist[i] * 26
    ctx.fillStyle = COLORS[i]
    ctx.beginPath()
    ctx.arc(nodes[i].x, nodes[i].y, r, 0, 2 * Math.PI)
    ctx.fill()
    ctx.fillStyle = '#0f172a'
    ctx.font = 'bold 16px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(STATE_NAMES[i], nodes[i].x, nodes[i].y)
  }
}

function drawBars(ctx: CanvasRenderingContext2D, W: number, H: number, dist: Vector, pi: Vector) {
  const baseY = H - 40
  const maxH = H - 260
  const bw = 70
  const gap = (W - bw * 3) / 4
  for (let i = 0; i < dist.length; i++) {
    const x = gap + i * (bw + gap)
    // 稳态虚线
    const py = baseY - pi[i] * maxH
    ctx.strokeStyle = '#ef4444'
    ctx.setLineDash([5, 4])
    ctx.beginPath()
    ctx.moveTo(x - 6, py)
    ctx.lineTo(x + bw + 6, py)
    ctx.stroke()
    ctx.setLineDash([])
    // 当前分布柱
    const h = dist[i] * maxH
    ctx.fillStyle = COLORS[i]
    ctx.fillRect(x, baseY - h, bw, h)
    ctx.fillStyle = '#0f172a'
    ctx.font = 'bold 14px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`${(dist[i] * 100).toFixed(1)}%`, x + bw / 2, baseY - h - 8)
    ctx.fillText(STATE_NAMES[i], x + bw / 2, baseY + 20)
  }
}

/** 绘制第 stepIdx 步（0 起）的状态；P 行随机，init 初始分布 */
export function drawMarkovStationary(
  canvas: HTMLCanvasElement,
  P: Matrix,
  init: Vector,
  stepIdx: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  const history = iterate(P, init, Math.max(stepIdx, 0))
  const dist = history[Math.min(stepIdx, history.length - 1)]
  const pi = stationary(P)
  drawGraph(ctx, W, dist)
  drawBars(ctx, W, H, dist, pi)
}
