/**
 * 抛体运动 Canvas 绘制：叠加多条发射角的抛物线轨迹，45度射程最大高亮
 */
import { trajectory, range, type Point } from './projectileMotion'

const COLORS: Record<number, string> = {
  30: '#38bdf8',
  45: '#f97316',
  60: '#a78bfa',
}

/**
 * 绘制多条轨迹。v0 初速，angles 发射角列表，g 重力加速度。
 * 自动按最大射程/最大高度缩放到画布，45度用橙色加粗高亮。
 */
export function drawProjectileMotion(
  canvas: HTMLCanvasElement,
  v0: number,
  angles: number[],
  g = 9.8,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const pad = 40
  const paths = angles.map((a) => trajectory(v0, a, g, 60))
  const maxX = Math.max(1, ...paths.flat().map((p) => p.x))
  const maxY = Math.max(1, ...paths.flat().map((p) => p.y))
  const sx = (W - 2 * pad) / maxX
  const sy = (H - 2 * pad) / maxY
  const toPx = (p: Point) => ({ x: pad + p.x * sx, y: H - pad - p.y * sy })

  // 地面
  ctx.strokeStyle = '#94a3b8'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(pad, H - pad)
  ctx.lineTo(W - pad, H - pad)
  ctx.stroke()

  angles.forEach((a, i) => {
    const is45 = a === 45
    ctx.strokeStyle = COLORS[a] || '#64748b'
    ctx.lineWidth = is45 ? 4 : 2
    ctx.beginPath()
    paths[i].forEach((p, k) => {
      const q = toPx(p)
      if (k === 0) ctx.moveTo(q.x, q.y)
      else ctx.lineTo(q.x, q.y)
    })
    ctx.stroke()

    // 落点标记 + 角度标签
    const land = toPx(paths[i][paths[i].length - 1])
    ctx.fillStyle = COLORS[a] || '#64748b'
    ctx.beginPath()
    ctx.arc(land.x, land.y, is45 ? 5 : 3.5, 0, 2 * Math.PI)
    ctx.fill()
    ctx.font = is45 ? 'bold 14px sans-serif' : '12px sans-serif'
    const label = is45
      ? `${a}° 射程最远 ${range(v0, a, g).toFixed(1)}m`
      : `${a}°`
    ctx.fillText(label, land.x - 8, land.y - 8)
  })

  // 发射点
  ctx.fillStyle = '#0f172a'
  const origin = toPx({ x: 0, y: 0 })
  ctx.beginPath()
  ctx.arc(origin.x, origin.y, 4, 0, 2 * Math.PI)
  ctx.fill()
}
