/**
 * 盒维数 Canvas 绘制：左侧画分形点集 + 某尺度覆盖网格，
 * 右侧画 log(1/ε) - log N 的散点与拟合直线。
 */
import { countBoxes, boxCountData, linearFit, type Pt } from './boxCountingDimension'

const SIZE = 512

/** 画分形点集，并高亮被边长 epsilon 网格覆盖的非空格子 */
export function drawFractal(canvas: HTMLCanvasElement, points: Pt[], epsilon: number) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  const s = Math.min(W, H) / SIZE
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, W, H)

  if (epsilon > 0) {
    const cols = Math.ceil(SIZE / epsilon) + 1
    const filled = new Set<number>()
    for (const p of points) filled.add(Math.floor(p.y / epsilon) * cols + Math.floor(p.x / epsilon))
    ctx.fillStyle = 'rgba(99,102,241,0.16)' // 非空格子浅色底块
    for (const key of filled) {
      ctx.fillRect((key % cols) * epsilon * s, Math.floor(key / cols) * epsilon * s, epsilon * s, epsilon * s)
    }
    ctx.strokeStyle = 'rgba(148,163,184,0.5)' // 网格线
    ctx.lineWidth = 0.5
    ctx.beginPath()
    for (let g = 0; g <= SIZE; g += epsilon) {
      ctx.moveTo(g * s, 0)
      ctx.lineTo(g * s, SIZE * s)
      ctx.moveTo(0, g * s)
      ctx.lineTo(SIZE * s, g * s)
    }
    ctx.stroke()
  }

  // 分形点
  ctx.fillStyle = '#4338ca'
  for (const p of points) {
    ctx.fillRect(p.x * s, p.y * s, 1, 1)
  }
  const n = countBoxes(points, epsilon, SIZE)
  ctx.fillStyle = '#0f172a'
  ctx.font = '13px sans-serif'
  ctx.fillText(`ε = ${epsilon}   N(ε) = ${n}`, 8, H - 10)
}

/** 画 log-log 图与拟合直线，返回估计斜率（维数） */
export function drawLogLog(canvas: HTMLCanvasElement, points: Pt[], epsilons: number[]): number {
  const ctx = canvas.getContext('2d')
  if (!ctx) return 0
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, W, H)
  const data = boxCountData(points, epsilons, SIZE)
  const xs = data.map((d) => d.logInvEps)
  const ys = data.map((d) => d.logN)
  const { slope, intercept } = linearFit(xs, ys)

  const pad = 40
  const xmin = Math.min(...xs)
  const xmax = Math.max(...xs)
  const ymin = Math.min(...ys)
  const ymax = Math.max(...ys)
  const sx = (x: number) => pad + ((x - xmin) / (xmax - xmin || 1)) * (W - 2 * pad)
  const sy = (y: number) => H - pad - ((y - ymin) / (ymax - ymin || 1)) * (H - 2 * pad)

  ctx.strokeStyle = '#94a3b8' // 坐标轴
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(pad, pad)
  ctx.lineTo(pad, H - pad)
  ctx.lineTo(W - pad, H - pad)
  ctx.stroke()

  ctx.strokeStyle = '#ec4899' // 拟合直线
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(sx(xmin), sy(slope * xmin + intercept))
  ctx.lineTo(sx(xmax), sy(slope * xmax + intercept))
  ctx.stroke()

  ctx.fillStyle = '#4338ca' // 散点
  for (let i = 0; i < xs.length; i++) {
    ctx.beginPath()
    ctx.arc(sx(xs[i]), sy(ys[i]), 4, 0, 2 * Math.PI)
    ctx.fill()
  }

  ctx.fillStyle = '#0f172a'
  ctx.font = '13px sans-serif'
  ctx.fillText(`斜率 D ≈ ${slope.toFixed(3)}`, pad + 6, pad + 16)
  ctx.fillText('log(1/ε) → , ↑ log N', pad + 6, pad + 34)
  return slope
}
