/**
 * N 体引力仿真 Canvas 绘制
 *
 * 输入为「已经积分好的轨迹帧序列」：data.trail[i] 是第 i 个天体的历史位置数组，
 * progress 控制显示到轨迹的哪一帧（0→1 逐步揭示运动过程）。
 * 内核只负责算数（step / accelerations），这里只负责画。
 */

import type { Body } from './nbodySimulation'

export interface NbodyDrawData {
  /** 每个天体的历史轨迹点（世界坐标） */
  trails: { x: number; y: number }[][]
  /** 每个天体当前帧的完整状态（用于取质量画大小） */
  bodies: Body[]
  /** 世界坐标可视半径（用于缩放到画布） */
  viewRadius: number
}

const COLORS = ['#fbbf24', '#22d3ee', '#f87171', '#a3e635', '#c084fc', '#f472b6']

export function drawNbodySimulation(
  canvas: HTMLCanvasElement,
  data: NbodyDrawData,
  progress: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0b1020'
  ctx.fillRect(0, 0, W, H)

  const { trails, bodies, viewRadius } = data
  if (!trails.length) return

  const scale = Math.min(W, H) / (2 * Math.max(viewRadius, 0.001))
  const cx = W / 2
  const cy = H / 2
  const toScreen = (p: { x: number; y: number }) => ({
    sx: cx + p.x * scale,
    sy: cy - p.y * scale,
  })

  // 画每个天体的运动轨迹（渐隐尾迹）
  for (let i = 0; i < trails.length; i++) {
    const trail = trails[i]
    if (trail.length < 2) continue
    const upto = Math.max(2, Math.floor(trail.length * Math.min(1, Math.max(0, progress))))
    const color = COLORS[i % COLORS.length]
    ctx.lineWidth = 1.5
    for (let k = 1; k < upto; k++) {
      const a = toScreen(trail[k - 1])
      const b = toScreen(trail[k])
      ctx.strokeStyle = color
      ctx.globalAlpha = 0.15 + 0.85 * (k / upto)
      ctx.beginPath()
      ctx.moveTo(a.sx, a.sy)
      ctx.lineTo(b.sx, b.sy)
      ctx.stroke()
    }
    ctx.globalAlpha = 1

    // 当前位置画天体
    const head = trail[Math.min(upto - 1, trail.length - 1)]
    const { sx, sy } = toScreen(head)
    const radius = Math.max(3, Math.cbrt(bodies[i]?.mass ?? 1) * 4)
    const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, radius * 2.5)
    grad.addColorStop(0, color)
    grad.addColorStop(1, 'rgba(11,16,32,0)')
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(sx, sy, radius * 2.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(sx, sy, radius, 0, Math.PI * 2)
    ctx.fill()
  }
}
