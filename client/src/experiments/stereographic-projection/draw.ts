/**
 * 球极投影 Canvas 绘制：左侧正交投影看球面网格，右侧看投到平面的像
 */
import { parallel, meridian, project, rotateZ, type Vec3 } from './stereographicProjection'

const SPHERE_LINE = '#6366f1'
const PLANE_LINE = '#ec4899'

/** 左侧：单位球正交投影（看 x-z 视角），北极朝上 */
function drawSphere(ctx: CanvasRenderingContext2D, cx: number, cy: number, R: number, rot: number) {
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(cx, cy, R, 0, 2 * Math.PI)
  ctx.stroke()
  ctx.fillStyle = '#f59e0b'
  ctx.beginPath()
  ctx.arc(cx, cy - R, 3.5, 0, 2 * Math.PI)
  ctx.fill()
  const to = (p: Vec3) => ({ sx: cx + rotateZ(p, rot).x * R, sy: cy - p.z * R })
  ctx.strokeStyle = SPHERE_LINE
  ctx.lineWidth = 1.3
  const lines: Vec3[][] = []
  for (let k = 1; k <= 5; k++) lines.push(parallel(-Math.PI / 2 + (k / 6) * Math.PI))
  for (let m = 0; m < 8; m++) lines.push(meridian((m / 8) * 2 * Math.PI))
  for (const ln of lines) {
    ctx.beginPath()
    ln.forEach((p, i) => {
      const { sx, sy } = to(p)
      if (i === 0) ctx.moveTo(sx, sy)
      else ctx.lineTo(sx, sy)
    })
    ctx.stroke()
  }
}

/** 右侧：网格投影到平面，纬线->同心圆，经线->放射线 */
function drawPlane(ctx: CanvasRenderingContext2D, cx: number, cy: number, R: number, rot: number) {
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(cx, cy, R, 0, 2 * Math.PI)
  ctx.stroke()
  const scale = R
  const to = (p: Vec3) => {
    const q = project(rotateZ(p, rot))
    return { sx: cx + q.X * scale, sy: cy - q.Y * scale }
  }
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))
  ctx.strokeStyle = PLANE_LINE
  ctx.lineWidth = 1.3
  const lines: Vec3[][] = []
  for (let k = 1; k <= 5; k++) lines.push(parallel(-Math.PI / 2 + (k / 6) * Math.PI))
  for (let m = 0; m < 8; m++) lines.push(meridian((m / 8) * 2 * Math.PI))
  for (const ln of lines) {
    ctx.beginPath()
    let started = false
    for (const p of ln) {
      const { sx, sy } = to(p)
      const px = clamp(sx, cx - 2 * R, cx + 2 * R)
      const py = clamp(sy, cy - 2 * R, cy + 2 * R)
      if (!started) {
        ctx.moveTo(px, py)
        started = true
      } else ctx.lineTo(px, py)
    }
    ctx.stroke()
  }
}

export function drawStereographicProjection(canvas: HTMLCanvasElement, rot = 0) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  const R = Math.min(W / 4.6, H / 2.4)
  drawSphere(ctx, W * 0.26, H * 0.5, R, rot)
  drawPlane(ctx, W * 0.74, H * 0.5, R, rot)
}
