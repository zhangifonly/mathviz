/**
 * 留数定理 Canvas 绘制
 *
 * 在复平面上画出：坐标轴、极点（标注留数）、围道圆，
 * 并用一个沿逆时针运动的点表示积分方向（progress 驱动）。
 */

import type { Complex, Pole } from './residueTheorem'
import { isEnclosed } from './residueTheorem'

export interface ResidueDrawData {
  poles: Pole[]
  center: Complex
  radius: number
}

const BG = '#0f172a'
const AXIS = '#334155'
const CIRCLE = '#38bdf8'
const POLE_IN = '#fbbf24'
const POLE_OUT = '#64748b'
const MOVER = '#f472b6'

/** 将复平面坐标映射到画布像素（scale 像素/单位，原点居中） */
function toPx(z: Complex, W: number, H: number, scale: number): [number, number] {
  return [W / 2 + z.re * scale, H / 2 - z.im * scale]
}

/**
 * 绘制留数定理复平面场景。
 * @param progress 0→1，围道上运动点的相位，同时用于淡入
 */
export function drawResidueTheorem(
  canvas: HTMLCanvasElement,
  data: ResidueDrawData,
  progress: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = BG
  ctx.fillRect(0, 0, W, H)

  const scale = Math.min(W, H) / 7

  // 坐标轴
  ctx.strokeStyle = AXIS
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, H / 2)
  ctx.lineTo(W, H / 2)
  ctx.moveTo(W / 2, 0)
  ctx.lineTo(W / 2, H)
  ctx.stroke()
  ctx.fillStyle = '#64748b'
  ctx.font = '13px sans-serif'
  ctx.fillText('Re', W - 24, H / 2 - 8)
  ctx.fillText('Im', W / 2 + 8, 16)

  // 围道圆
  const [cx, cy] = toPx(data.center, W, H, scale)
  const rPx = data.radius * scale
  ctx.strokeStyle = CIRCLE
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(cx, cy, rPx, 0, Math.PI * 2)
  ctx.stroke()

  // 围道内部淡填充
  ctx.fillStyle = 'rgba(56,189,248,0.08)'
  ctx.fill()
  ctx.fillStyle = CIRCLE
  ctx.fillText('围道 C', cx + rPx * 0.6, cy - rPx * 0.6)

  // 极点
  ctx.font = '12px sans-serif'
  for (const p of data.poles) {
    const [px, py] = toPx(p.z, W, H, scale)
    const inside = isEnclosed(p, data.center, data.radius)
    ctx.fillStyle = inside ? POLE_IN : POLE_OUT
    ctx.beginPath()
    ctx.arc(px, py, 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = inside ? '#fde68a' : '#94a3b8'
    ctx.fillText(p.label, px + 9, py - 8)
    const rr = p.residue
    const resTxt = Math.abs(rr.im) < 1e-9
      ? `Res=${rr.re}`
      : `Res=${rr.re}${rr.im >= 0 ? '+' : ''}${rr.im}i`
    ctx.fillText(resTxt, px + 9, py + 12)
  }

  // 逆时针运动点，表示积分方向
  const theta = progress * Math.PI * 2
  const mx = cx + rPx * Math.cos(theta)
  const my = cy - rPx * Math.sin(theta)
  ctx.fillStyle = MOVER
  ctx.beginPath()
  ctx.arc(mx, my, 7, 0, Math.PI * 2)
  ctx.fill()

  // 方向箭头（切线方向）
  const tx = -Math.sin(theta)
  const ty = -Math.cos(theta)
  ctx.strokeStyle = MOVER
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(mx, my)
  ctx.lineTo(mx + tx * 18, my + ty * 18)
  ctx.stroke()
}
