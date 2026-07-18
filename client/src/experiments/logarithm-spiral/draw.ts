/**
 * 对数螺线 Canvas 绘制。
 * 画对数螺线 r=a*e^(b*theta)，可叠加阿基米德螺线做对比，
 * 并在若干点标出径向与切线，直观展示"等角"性质。
 */
import { spiralPoints, archimedeanPoints, type Pt } from './logarithmSpiral'

function fitScale(pts: Pt[], W: number, H: number): number {
  let m = 1
  for (const p of pts) m = Math.max(m, Math.abs(p.x), Math.abs(p.y))
  return (Math.min(W, H) * 0.42) / m
}

function stroke(ctx: CanvasRenderingContext2D, pts: Pt[], cx: number, cy: number, s: number) {
  ctx.beginPath()
  pts.forEach((p, i) => {
    const X = cx + p.x * s
    const Y = cy - p.y * s
    if (i === 0) ctx.moveTo(X, Y)
    else ctx.lineTo(X, Y)
  })
  ctx.stroke()
}

/**
 * @param b 松紧参数
 * @param compare 是否叠加阿基米德螺线对比
 */
export function drawLogarithmSpiral(
  canvas: HTMLCanvasElement,
  a: number,
  b: number,
  turns: number,
  compare = false,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  const cx = W / 2
  const cy = H / 2

  const log = spiralPoints(a, b, turns)
  const arc = archimedeanPoints(a, b * 6, turns)
  const s = fitScale(compare ? log.concat(arc) : log, W, H)

  // 极坐标网格
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  for (let k = 1; k <= 4; k++) {
    ctx.beginPath()
    ctx.arc(cx, cy, (Math.min(W, H) * 0.42 * k) / 4, 0, 2 * Math.PI)
    ctx.stroke()
  }

  if (compare) {
    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = 1.5
    stroke(ctx, arc, cx, cy, s)
  }

  // 对数螺线本体
  ctx.strokeStyle = '#6366f1'
  ctx.lineWidth = 2.5
  stroke(ctx, log, cx, cy, s)

  // 等角标记：在两处画径向 + 切线
  ctx.lineWidth = 1.5
  const marks = [Math.floor(log.length * 0.45), Math.floor(log.length * 0.8)]
  for (const idx of marks) {
    const p = log[idx]
    const q = log[Math.min(idx + 1, log.length - 1)]
    const X = cx + p.x * s
    const Y = cy - p.y * s
    ctx.strokeStyle = '#94a3b8'
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(X, Y)
    ctx.stroke()
    const tx = q.x - p.x
    const ty = q.y - p.y
    const len = Math.hypot(tx, ty) || 1
    ctx.strokeStyle = '#ec4899'
    ctx.beginPath()
    ctx.moveTo(X - (tx / len) * 34, Y + (ty / len) * 34)
    ctx.lineTo(X + (tx / len) * 34, Y - (ty / len) * 34)
    ctx.stroke()
    ctx.fillStyle = '#0f172a'
    ctx.beginPath()
    ctx.arc(X, Y, 3, 0, 2 * Math.PI)
    ctx.fill()
  }

  ctx.fillStyle = '#6366f1'
  ctx.beginPath()
  ctx.arc(cx, cy, 3.5, 0, 2 * Math.PI)
  ctx.fill()
}
