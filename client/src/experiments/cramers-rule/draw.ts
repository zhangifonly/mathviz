/**
 * 克拉默法则 Canvas 绘制
 * 把 2 元方程组的两条直线画在坐标系里，交点即方程组的解。
 */
import { cramerSolve } from './cramersRule'

const LINE_COLORS = ['#6366f1', '#ec4899']

/**
 * 绘制方程组 A x = b（2x2）的两条直线与交点（解）。
 * @param scale 每个数学单位对应的像素数
 */
export function drawCramersRule(
  canvas: HTMLCanvasElement,
  A: number[][],
  b: number[],
  scale = 34,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  const cx = W / 2
  const cy = H / 2
  ctx.clearRect(0, 0, W, H)

  // 网格
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  for (let x = cx % scale; x < W; x += scale) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
  }
  for (let y = cy % scale; y < H; y += scale) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
  }

  // 坐标轴
  ctx.strokeStyle = '#94a3b8'
  ctx.lineWidth = 1.5
  ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke()

  const toPx = (mx: number, my: number): [number, number] => [cx + mx * scale, cy - my * scale]

  // 画每条直线 a x + b y = c
  const xMin = -cx / scale
  const xMax = (W - cx) / scale
  for (let i = 0; i < 2; i++) {
    const [a, bb] = A[i]
    const c = b[i]
    ctx.strokeStyle = LINE_COLORS[i]
    ctx.lineWidth = 2.5
    ctx.beginPath()
    if (Math.abs(bb) > 1e-9) {
      const y1 = (c - a * xMin) / bb
      const y2 = (c - a * xMax) / bb
      const p1 = toPx(xMin, y1)
      const p2 = toPx(xMax, y2)
      ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1])
    } else if (Math.abs(a) > 1e-9) {
      const x0 = c / a
      const p1 = toPx(x0, -cy / scale)
      const p2 = toPx(x0, (H - cy) / scale)
      ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1])
    }
    ctx.stroke()
  }

  // 交点 = 解
  const sol = cramerSolve(A, b)
  if (sol) {
    const [px, py] = toPx(sol[0], sol[1])
    ctx.fillStyle = '#f59e0b'
    ctx.beginPath(); ctx.arc(px, py, 6, 0, 2 * Math.PI); ctx.fill()
    ctx.strokeStyle = '#0f172a'
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.fillStyle = '#0f172a'
    ctx.font = '13px sans-serif'
    ctx.fillText(`解 (${sol[0].toFixed(2)}, ${sol[1].toFixed(2)})`, px + 10, py - 8)
  }
}
