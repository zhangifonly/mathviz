/**
 * 纽结理论 Canvas 绘制
 *
 * 将三维纽结曲线旋转投影到二维平面，用管状描边呈现，
 * 并按 z 深度先画远处、后画近处，形成上下穿越（over/under）的立体错觉。
 */

import type { Vec3 } from './knotTheory'

/** 绕 Y 轴与 X 轴旋转一个点 */
function rotate(p: Vec3, ay: number, ax: number): Vec3 {
  const cy = Math.cos(ay)
  const sy = Math.sin(ay)
  const x = p.x * cy - p.z * sy
  let z = p.x * sy + p.z * cy
  const cx = Math.cos(ax)
  const sx = Math.sin(ax)
  const y = p.y * cx - z * sx
  z = p.y * sx + z * cx
  return { x, y, z }
}

const PALETTE = ['#22d3ee', '#a78bfa', '#f472b6', '#fbbf24']

/**
 * 绘制纽结。
 * @param pts 纽结的三维采样点（首尾相接的闭合曲线）
 * @param progress 0→1，用于旋转角度动画与逐段揭示
 */
export function drawKnotTheory(
  canvas: HTMLCanvasElement,
  pts: Vec3[],
  progress: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx || pts.length === 0) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const ay = progress * Math.PI * 2
  const ax = 0.5 + progress * 0.6
  const scale = Math.min(W, H) / 7
  const cx = W / 2
  const cy = H / 2

  // 投影 + 计算旋转后 z（用于深度排序）
  const proj = pts.map((p) => {
    const r = rotate(p, ay, ax)
    return { sx: cx + r.x * scale, sy: cy - r.y * scale, z: r.z }
  })

  const n = proj.length
  const upto = Math.max(2, Math.floor(n * progress))

  // 按线段中点 z 排序：远（z 小）先画，近（z 大）后画覆盖
  const segs: { i: number; z: number }[] = []
  for (let i = 0; i < upto; i++) {
    const a = proj[i]
    const b = proj[(i + 1) % n]
    segs.push({ i, z: (a.z + b.z) / 2 })
  }
  segs.sort((s1, s2) => s1.z - s2.z)

  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  for (const s of segs) {
    const a = proj[s.i]
    const b = proj[(s.i + 1) % n]
    const depth = (s.z + 1.5) / 3 // 归一化到 0..1 附近
    const width = 6 + depth * 8
    const colorIdx = Math.floor(((s.i / n) * PALETTE.length)) % PALETTE.length
    // 深色描边勾勒管状边缘，突出上下穿越
    ctx.strokeStyle = '#0f172a'
    ctx.lineWidth = width + 4
    ctx.beginPath()
    ctx.moveTo(a.sx, a.sy)
    ctx.lineTo(b.sx, b.sy)
    ctx.stroke()

    ctx.strokeStyle = PALETTE[colorIdx]
    ctx.globalAlpha = 0.55 + depth * 0.45
    ctx.lineWidth = width
    ctx.beginPath()
    ctx.moveTo(a.sx, a.sy)
    ctx.lineTo(b.sx, b.sy)
    ctx.stroke()
    ctx.globalAlpha = 1
  }
}
