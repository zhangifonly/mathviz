/**
 * 立体角的 Canvas 绘制
 *
 * 画三条射线从原点射出、它们在单位球面上截下的球面三角形（高亮）、
 * 以及用于对照的圆锥。核心是让"立体角就是球面上那片面积"看得见。
 */

import { makeCamera, project, bounds, type Camera, type Vec3 } from '../../lib/proj3d'
import { drawAxes3D } from '../../lib/draw3d'
import {
  unit, triangleSolidAngle, solidFraction, coneSolidAngle, dot,
} from './solidAngle'

export interface DrawOptions {
  a: Vec3
  b: Vec3
  c: Vec3
  yaw?: number
  /** 显示对照圆锥（半顶角由当前立体角反解） */
  showCone?: boolean
  title?: string
  subtitle?: string
}

const RAY_COLORS = ['rgba(248,113,113,1)', 'rgba(74,222,128,1)', 'rgba(96,165,250,1)']

export function drawSolidAngle(canvas: HTMLCanvasElement, opts: DrawOptions): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const { a, b, c, yaw = 0.6, showCone = false, title = '', subtitle = '' } = opts
  const { width: W, height: H } = canvas

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0a0f1e'
  ctx.fillRect(0, 0, W, H)

  const ua = unit(a)
  const ub = unit(b)
  const uc = unit(c)
  const { center, radius } = bounds([ua, ub, uc, [1, 1, 1], [-1, -1, -1]])
  const k = 1 / Math.max(1e-6, radius)
  const nz = (p: Vec3): Vec3 => [
    (p[0] - center[0]) * k, (p[1] - center[1]) * k, (p[2] - center[2]) * k,
  ]
  const cam = makeCamera({
    yaw, pitch: 0.3, scale: Math.min(W, H) * 0.32, cx: W / 2, cy: H / 2,
  })

  drawUnitSphere(ctx, cam, nz)
  drawAxes3D(ctx, cam, 1.25)
  if (showCone) drawConeOutline(ctx, cam, nz, ua, ub, uc)
  fillSphericalPatch(ctx, cam, nz, ua, ub, uc)
  drawRays(ctx, cam, nz, [ua, ub, uc])
  drawLabel(ctx, W, H, a, b, c, title, subtitle, showCone)
}

/** 单位球的经纬线框（半透明，给出"球面"的空间感） */
function drawUnitSphere(
  ctx: CanvasRenderingContext2D, cam: Camera, nz: (p: Vec3) => Vec3,
): void {
  ctx.save()
  ctx.strokeStyle = 'rgba(100,116,139,0.28)'
  ctx.lineWidth = 1
  // 纬线
  for (let k = -3; k <= 3; k++) {
    const lat = (k * Math.PI) / 8
    ctx.beginPath()
    for (let i = 0; i <= 60; i++) {
      const lon = (2 * Math.PI * i) / 60
      const p = nz([
        Math.cos(lat) * Math.cos(lon), Math.cos(lat) * Math.sin(lon), Math.sin(lat),
      ])
      const s = project(p, cam)
      if (i === 0) ctx.moveTo(s.x, s.y)
      else ctx.lineTo(s.x, s.y)
    }
    ctx.stroke()
  }
  // 经线
  for (let k = 0; k < 6; k++) {
    const lon = (Math.PI * k) / 6
    ctx.beginPath()
    for (let i = 0; i <= 40; i++) {
      const lat = -Math.PI / 2 + (Math.PI * i) / 40
      const p = nz([
        Math.cos(lat) * Math.cos(lon), Math.cos(lat) * Math.sin(lon), Math.sin(lat),
      ])
      const s = project(p, cam)
      if (i === 0) ctx.moveTo(s.x, s.y)
      else ctx.lineTo(s.x, s.y)
    }
    ctx.stroke()
  }
  ctx.restore()
}

/**
 * 高亮球面三角形（立体角截下的那片面积）。
 * 用重心坐标细分铺色，边界贴合大圆弧 —— 直接连三点会画成平面三角形。
 */
function fillSphericalPatch(
  ctx: CanvasRenderingContext2D, cam: Camera, nz: (p: Vec3) => Vec3,
  a: Vec3, b: Vec3, c: Vec3,
): void {
  const N = 18
  const P = (u: number, v: number): Vec3 => {
    const w = 1 - u - v
    return unit([
      w * a[0] + u * b[0] + v * c[0],
      w * a[1] + u * b[1] + v * c[1],
      w * a[2] + u * b[2] + v * c[2],
    ])
  }
  // 只画朝向观察者的小片, 否则背面会透过来
  const emit = (p1: Vec3, p2: Vec3, p3: Vec3) => {
    const mid = unit([
      (p1[0] + p2[0] + p3[0]) / 3, (p1[1] + p2[1] + p3[1]) / 3,
      (p1[2] + p2[2] + p3[2]) / 3,
    ])
    if (project(nz(mid), cam).depth >= 0) return
    const s1 = project(nz(p1), cam)
    const s2 = project(nz(p2), cam)
    const s3 = project(nz(p3), cam)
    ctx.beginPath()
    ctx.moveTo(s1.x, s1.y)
    ctx.lineTo(s2.x, s2.y)
    ctx.lineTo(s3.x, s3.y)
    ctx.closePath()
    ctx.fill()
  }
  ctx.save()
  ctx.fillStyle = 'rgba(251,191,36,0.5)'
  for (let i = 0; i < N; i++) {
    for (let j = 0; i + j < N; j++) {
      emit(P(i / N, j / N), P((i + 1) / N, j / N), P(i / N, (j + 1) / N))
      if (i + j + 2 <= N) {
        emit(P((i + 1) / N, j / N), P((i + 1) / N, (j + 1) / N), P(i / N, (j + 1) / N))
      }
    }
  }
  // 三条边（大圆弧）
  ctx.strokeStyle = 'rgba(251,191,36,1)'
  ctx.lineWidth = 2.2
  for (const [p, q] of [[a, b], [b, c], [c, a]] as Array<[Vec3, Vec3]>) {
    ctx.beginPath()
    for (let i = 0; i <= 40; i++) {
      const t = i / 40
      const m = unit([
        p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t,
      ])
      const s = project(nz(m), cam)
      if (i === 0) ctx.moveTo(s.x, s.y)
      else ctx.lineTo(s.x, s.y)
    }
    ctx.stroke()
  }
  ctx.restore()
}

/** 对照圆锥：半顶角由当前立体角反解，与球面三角形同面积 */
function drawConeOutline(
  ctx: CanvasRenderingContext2D, cam: Camera, nz: (p: Vec3) => Vec3,
  a: Vec3, b: Vec3, c: Vec3,
): void {
  const omega = triangleSolidAngle(a, b, c)
  const alpha = Math.acos(Math.max(-1, Math.min(1, 1 - omega / (2 * Math.PI))))
  // 锥轴取三射线的平均方向
  const axis = unit([a[0] + b[0] + c[0], a[1] + b[1] + c[1], a[2] + b[2] + c[2]])
  // 在垂直于 axis 的平面内建基
  const ref: Vec3 = Math.abs(axis[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0]
  const e1 = unit([
    axis[1] * ref[2] - axis[2] * ref[1],
    axis[2] * ref[0] - axis[0] * ref[2],
    axis[0] * ref[1] - axis[1] * ref[0],
  ])
  const e2: Vec3 = [
    axis[1] * e1[2] - axis[2] * e1[1],
    axis[2] * e1[0] - axis[0] * e1[2],
    axis[0] * e1[1] - axis[1] * e1[0],
  ]
  ctx.save()
  ctx.strokeStyle = 'rgba(167,139,250,0.85)'
  ctx.lineWidth = 1.8
  ctx.setLineDash([5, 4])
  ctx.beginPath()
  for (let i = 0; i <= 72; i++) {
    const t = (2 * Math.PI * i) / 72
    const p: Vec3 = [
      axis[0] * Math.cos(alpha) + (e1[0] * Math.cos(t) + e2[0] * Math.sin(t)) * Math.sin(alpha),
      axis[1] * Math.cos(alpha) + (e1[1] * Math.cos(t) + e2[1] * Math.sin(t)) * Math.sin(alpha),
      axis[2] * Math.cos(alpha) + (e1[2] * Math.cos(t) + e2[2] * Math.sin(t)) * Math.sin(alpha),
    ]
    const s = project(nz(p), cam)
    if (i === 0) ctx.moveTo(s.x, s.y)
    else ctx.lineTo(s.x, s.y)
  }
  ctx.stroke()
  ctx.setLineDash([])
  ctx.restore()
  void dot
}

/** 三条射线 */
function drawRays(
  ctx: CanvasRenderingContext2D, cam: Camera, nz: (p: Vec3) => Vec3, rays: Vec3[],
): void {
  const names = ['a', 'b', 'c']
  const o = project(nz([0, 0, 0]), cam)
  ctx.save()
  rays.forEach((r, i) => {
    const s = project(nz(r), cam)
    ctx.strokeStyle = RAY_COLORS[i]
    ctx.lineWidth = 2.8
    ctx.beginPath()
    ctx.moveTo(o.x, o.y)
    ctx.lineTo(s.x, s.y)
    ctx.stroke()
    ctx.fillStyle = RAY_COLORS[i]
    ctx.beginPath()
    ctx.arc(s.x, s.y, 4.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,0.95)'
    ctx.font = 'bold 15px sans-serif'
    ctx.fillText(names[i], s.x + 9, s.y - 8)
  })
  ctx.restore()
}

function drawLabel(
  ctx: CanvasRenderingContext2D, W: number, H: number,
  a: Vec3, b: Vec3, c: Vec3, title: string, subtitle: string, showCone: boolean,
): void {
  const omega = triangleSolidAngle(a, b, c)
  ctx.save()
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.font = 'bold 17px sans-serif'
  ctx.fillText(title || '立体角与球面度', 18, 28)
  ctx.font = '13px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.62)'
  if (subtitle) ctx.fillText(subtitle, 18, 48)
  ctx.textAlign = 'right'
  ctx.fillText(`Ω = ${omega.toFixed(4)} sr`, W - 18, 28)
  ctx.fillText(`占全空间 ${(solidFraction(omega) * 100).toFixed(2)}%`, W - 18, 48)
  ctx.textAlign = 'left'
  ctx.fillStyle = 'rgba(148,163,184,0.7)'
  ctx.fillText(
    showCone
      ? `紫色虚线：同立体角的圆锥（Ω = 2π(1−cos α) = ${coneSolidAngle(Math.acos(1 - omega / (2 * Math.PI))).toFixed(4)}）`
      : '黄色区域就是立体角截下的球面面积',
    18, H - 16,
  )
  ctx.restore()
}
