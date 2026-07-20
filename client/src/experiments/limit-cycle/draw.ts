/**
 * 极限环相平面 Canvas 绘制
 * 画多条不同初值的轨线，它们都螺旋收敛到同一极限环。
 */
import { simulate, type Point } from './limitCycle'

const COLORS = ['#6366f1', '#ec4899', '#22d3ee', '#fbbf24', '#34d399']

// 相平面初值：既有环内(靠近原点)也有环外(远离原点)
const STARTS: Point[] = [
  { x: 0.15, y: 0.15 },
  { x: 0.05, y: -0.4 },
  { x: 3.6, y: 0 },
  { x: -3.2, y: 2.4 },
  { x: 2.8, y: -2.8 },
]

/**
 * 绘制范德波尔相平面。
 * @param mu 非线性阻尼参数
 * @param progress 0..1，控制每条轨线画出的比例（用于动画）
 */
export function drawLimitCycle(
  canvas: HTMLCanvasElement,
  mu: number,
  progress = 1,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const scale = W / 9 // 相平面范围约 [-4.5, 4.5]
  const toPx = (p: Point) => ({ px: W / 2 + p.x * scale, py: H / 2 - p.y * scale })

  // 坐标轴
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, H / 2)
  ctx.lineTo(W, H / 2)
  ctx.moveTo(W / 2, 0)
  ctx.lineTo(W / 2, H)
  ctx.stroke()

  const steps = 5000
  const dt = 0.012
  STARTS.forEach((s, i) => {
    const path = simulate(mu, s.x, s.y, steps, dt)
    const n = Math.max(2, Math.floor(path.length * progress))
    ctx.strokeStyle = COLORS[i % COLORS.length]
    ctx.lineWidth = 1.6
    ctx.globalAlpha = 0.85
    ctx.beginPath()
    for (let k = 0; k < n; k++) {
      const { px, py } = toPx(path[k])
      if (k === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()

    // 起点圆点
    const { px, py } = toPx(path[0])
    ctx.globalAlpha = 1
    ctx.fillStyle = COLORS[i % COLORS.length]
    ctx.beginPath()
    ctx.arc(px, py, 4, 0, 2 * Math.PI)
    ctx.fill()
  })
  ctx.globalAlpha = 1
}
