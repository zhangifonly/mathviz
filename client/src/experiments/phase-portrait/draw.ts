/**
 * 相图 Canvas 绘制：向量场箭头 + 若干轨线 + 平衡点类型标注
 */
import { apply, classify, trajectory, type Matrix2 } from './phasePortrait'

const RANGE = 4 // 坐标范围 [-4, 4]

function toPx(v: number, size: number): number {
  return ((v + RANGE) / (2 * RANGE)) * size
}

function arrow(ctx: CanvasRenderingContext2D, x: number, y: number, dx: number, dy: number) {
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x + dx, y + dy)
  const a = Math.atan2(dy, dx)
  const h = 4
  ctx.lineTo(x + dx - h * Math.cos(a - 0.4), y + dy - h * Math.sin(a - 0.4))
  ctx.moveTo(x + dx, y + dy)
  ctx.lineTo(x + dx - h * Math.cos(a + 0.4), y + dy - h * Math.sin(a + 0.4))
  ctx.stroke()
}

export function drawPhasePortrait(canvas: HTMLCanvasElement, A: Matrix2, showTraj = true) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  // 坐标轴
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H)
  ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2)
  ctx.stroke()

  // 向量场箭头（归一化方向，颜色随场强）
  ctx.strokeStyle = '#94a3b8'
  ctx.lineWidth = 1
  const N = 13
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const vx = -RANGE + (2 * RANGE * i) / (N - 1)
      const vy = -RANGE + (2 * RANGE * j) / (N - 1)
      const [fx, fy] = apply(A, [vx, vy])
      const mag = Math.hypot(fx, fy) || 1
      const px = toPx(vx, W)
      const py = H - toPx(vy, H)
      arrow(ctx, px, py, (fx / mag) * 11, -(fy / mag) * 11)
    }
  }

  // 轨线：从若干初值出发的 RK4 积分曲线
  if (showTraj) {
    const starts = [[3, 3], [-3, 3], [3, -3], [-3, -3], [3, 0.4], [-3, -0.4], [0.4, 3], [-0.4, -3]]
    const colors = ['#6366f1', '#ec4899', '#22d3ee', '#f59e0b', '#10b981', '#a78bfa', '#fb7185', '#38bdf8']
    ctx.lineWidth = 2
    starts.forEach((s, k) => {
      const pts = trajectory(A, [s[0], s[1]], 600, 0.02)
      ctx.strokeStyle = colors[k % colors.length]
      ctx.beginPath()
      pts.forEach((p, idx) => {
        const px = toPx(p[0], W)
        const py = H - toPx(p[1], H)
        if (idx === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      })
      ctx.stroke()
    })
  }

  // 平衡点（原点）+ 类型标注
  const c = classify(A)
  const labels: Record<string, string> = { node: '结点', saddle: '鞍点', focus: '焦点', center: '中心' }
  ctx.fillStyle = c.stable ? '#059669' : '#dc2626'
  ctx.beginPath()
  ctx.arc(W / 2, H / 2, 5, 0, 2 * Math.PI)
  ctx.fill()
  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 16px sans-serif'
  ctx.fillText(`平衡点：${labels[c.type]}${c.stable ? '(稳定)' : '(不稳定)'}`, 12, 24)
}
