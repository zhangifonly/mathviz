/**
 * 接吻数的 Canvas 绘制
 *
 * 中心一个球，周围贴一圈邻球。画三样东西：
 *   1. 球体本身（按深度排序，远的先画）
 *   2. 每个邻球在中心球面上占的**球冠**（30° 半角）—— 覆盖率一眼看得出
 *   3. 最大空位方向的探针 —— 说明为什么塞不下第 13 个
 */

import { makeCamera, project, type Camera, type Vec3 } from '../../lib/proj3d'
import {
  unit, angularDistance, findExtraSphere, minPairAngle, capCoverage,
  CAP_HALF_ANGLE, MIN_ANGLE,
} from './kissingNumber'

export interface DrawOptions {
  dirs: Vec3[]
  yaw?: number
  /** 画球冠（在中心球面上的覆盖区） */
  showCaps?: boolean
  /** 画最大空位探针 */
  showGap?: boolean
  title?: string
  subtitle?: string
}

const DEG = 180 / Math.PI
const CENTER_COLOR = 'rgba(96,165,250,'
const NEIGHBOR_COLOR = 'rgba(251,146,60,'
const CAP_COLOR = 'rgba(74,222,128,0.30)'
const GAP_COLOR = 'rgba(248,113,113,1)'

export function drawKissing(canvas: HTMLCanvasElement, opts: DrawOptions): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const {
    dirs, yaw = 0.6, showCaps = true, showGap = false,
    title = '', subtitle = '',
  } = opts
  const { width: W, height: H } = canvas

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0a0f1e'
  ctx.fillRect(0, 0, W, H)

  // 邻球中心在半径 2 处（两个单位球相切），球半径 1，故整体跨度 3
  const cam = makeCamera({
    yaw, pitch: 0.28, scale: (Math.min(W, H) * 0.44) / 3,
    cx: W / 2, cy: H / 2,
  })

  // 收集所有要画的球，按深度排序（远的先画，近的覆盖在上）
  type Ball = { center: Vec3; r: number; color: string; isCenter: boolean }
  const balls: Ball[] = [
    { center: [0, 0, 0], r: 1, color: CENTER_COLOR, isCenter: true },
    ...dirs.map((d) => {
      const u = unit(d)
      return {
        center: [u[0] * 2, u[1] * 2, u[2] * 2] as Vec3,
        r: 1,
        color: NEIGHBOR_COLOR,
        isCenter: false,
      }
    }),
  ]
  balls.sort((a, b) => project(b.center, cam).depth - project(a.center, cam).depth)

  // 先画中心球面上的球冠，再叠球体。
  // 球冠贴在半径 1.02 的壳上（略大于中心球）才不会被自身填充盖掉。
  if (showCaps) drawCaps(ctx, cam, dirs)

  for (const b of balls) {
    // 中心球半透明，好看到里面的球冠；邻球也留一点透明度以免糊成一片
    drawBall(ctx, cam, b.center, b.r, b.color, b.isCenter ? 0.30 : 0.62)
  }

  if (showGap) drawGapProbe(ctx, cam, dirs)
  drawLabel(ctx, W, H, dirs, title, subtitle, showGap)
}

/** 画一个球：投影成圆，用径向渐变做出体积感 */
function drawBall(
  ctx: CanvasRenderingContext2D, cam: Camera, center: Vec3, r: number,
  colorPrefix: string, alpha: number,
): void {
  const c = project(center, cam)
  // 视半径 = 真实半径 × 相机缩放 × 该点的透视系数。
  // ⚠️ 不能拿 project([x+r,y,z]) 与球心的屏幕距离来估 ——
  // 那个方向被 yaw/pitch 旋转后不一定垂直于视线，
  // 球会忽大忽小、中心球缩成一个小圈（截图里就是这个毛病）。
  const rad = Math.max(2, r * cam.scale * c.f)
  const g = ctx.createRadialGradient(
    c.x - rad * 0.3, c.y - rad * 0.35, rad * 0.1, c.x, c.y, rad,
  )
  g.addColorStop(0, `${colorPrefix}${(alpha * 1.0).toFixed(3)})`)
  g.addColorStop(1, `${colorPrefix}${(alpha * 0.35).toFixed(3)})`)
  ctx.save()
  ctx.beginPath()
  ctx.arc(c.x, c.y, rad, 0, Math.PI * 2)
  ctx.fillStyle = g
  ctx.fill()
  ctx.strokeStyle = `${colorPrefix}0.9)`
  ctx.lineWidth = 1.2
  ctx.stroke()
  ctx.restore()
}

/**
 * 球冠：每个邻球方向在中心球面上占半角 30° 的一片。
 * 用同心圆环采样填充，只画朝向观察者的部分。
 */
function drawCaps(
  ctx: CanvasRenderingContext2D, cam: Camera, dirs: Vec3[],
): void {
  ctx.save()
  ctx.fillStyle = CAP_COLOR
  for (const d of dirs) {
    const axis = unit(d)
    // 只画正面的球冠
    if (project(axis, cam).depth >= 0) continue
    // 在垂直于 axis 的平面建基
    const ref: Vec3 = Math.abs(axis[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0]
    let e1: Vec3 = [
      axis[1] * ref[2] - axis[2] * ref[1],
      axis[2] * ref[0] - axis[0] * ref[2],
      axis[0] * ref[1] - axis[1] * ref[0],
    ]
    const e1n = Math.hypot(e1[0], e1[1], e1[2]) || 1
    e1 = [e1[0] / e1n, e1[1] / e1n, e1[2] / e1n]
    const e2: Vec3 = [
      axis[1] * e1[2] - axis[2] * e1[1],
      axis[2] * e1[0] - axis[0] * e1[2],
      axis[0] * e1[1] - axis[1] * e1[0],
    ]
    // 球冠边界圆。贴在半径 1.02 的壳上，略大于中心球，否则会被球体填充盖住
    const SHELL = 1.02
    ctx.beginPath()
    for (let i = 0; i <= 40; i++) {
      const t = (2 * Math.PI * i) / 40
      const ca = Math.cos(CAP_HALF_ANGLE) * SHELL
      const sa = Math.sin(CAP_HALF_ANGLE) * SHELL
      const p: Vec3 = [
        axis[0] * ca + (e1[0] * Math.cos(t) + e2[0] * Math.sin(t)) * sa,
        axis[1] * ca + (e1[1] * Math.cos(t) + e2[1] * Math.sin(t)) * sa,
        axis[2] * ca + (e1[2] * Math.cos(t) + e2[2] * Math.sin(t)) * sa,
      ]
      const s = project(p, cam)
      if (i === 0) ctx.moveTo(s.x, s.y)
      else ctx.lineTo(s.x, s.y)
    }
    ctx.closePath()
    ctx.fill()
  }
  ctx.restore()
}

/**
 * 最大空位探针：画出那个方向与它到最近邻球的角距。
 *
 * findExtraSphere 找不到位置时 found 为 null，但 bestAngle 仍是有效的
 * 「最大空位角距」。方向由 bestDirection 用同样的采样再取一次。
 */
function drawGapProbe(
  ctx: CanvasRenderingContext2D, cam: Camera, dirs: Vec3[],
): void {
  const { bestAngle } = findExtraSphere(dirs, 4000)
  const dir = bestDirection(dirs)
  if (!dir) return
  const o = project([0, 0, 0], cam)
  const tip = project([dir[0] * 2.4, dir[1] * 2.4, dir[2] * 2.4], cam)
  ctx.save()
  ctx.strokeStyle = GAP_COLOR
  ctx.lineWidth = 2.4
  ctx.setLineDash([6, 4])
  ctx.beginPath()
  ctx.moveTo(o.x, o.y)
  ctx.lineTo(tip.x, tip.y)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = GAP_COLOR
  ctx.beginPath()
  ctx.arc(tip.x, tip.y, 5, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.95)'
  ctx.font = 'bold 13px sans-serif'
  ctx.fillText(`最大空位 ${(bestAngle * DEG).toFixed(2)}°`, tip.x + 10, tip.y - 8)
  ctx.restore()
}

/** 再算一次最佳方向（findExtraSphere 只回传角距时用） */
function bestDirection(dirs: Vec3[]): Vec3 | null {
  const ga = Math.PI * (3 - Math.sqrt(5))
  const N = 4000
  let best = -Infinity
  let bd: Vec3 | null = null
  for (let i = 0; i < N; i++) {
    const z = 1 - (2 * (i + 0.5)) / N
    const r = Math.sqrt(Math.max(0, 1 - z * z))
    const th = ga * i
    const p: Vec3 = [r * Math.cos(th), r * Math.sin(th), z]
    let m = Infinity
    for (const d of dirs) m = Math.min(m, angularDistance(p, d))
    if (m > best) {
      best = m
      bd = p
    }
  }
  return bd
}

function drawLabel(
  ctx: CanvasRenderingContext2D, W: number, H: number,
  dirs: Vec3[], title: string, subtitle: string, showGap: boolean,
): void {
  const m = minPairAngle(dirs)
  ctx.save()
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.font = 'bold 17px sans-serif'
  ctx.fillText(title || `${dirs.length} 个邻球`, 18, 28)
  ctx.font = '13px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.62)'
  if (subtitle) ctx.fillText(subtitle, 18, 48)
  ctx.textAlign = 'right'
  ctx.fillText(
    `最小角距 ${Number.isFinite(m) ? (m * DEG).toFixed(2) : '—'}° （需 ≥ ${(MIN_ANGLE * DEG).toFixed(0)}°）`,
    W - 18, 28,
  )
  ctx.fillText(`球冠覆盖 ${(capCoverage(dirs) * 100).toFixed(2)}%`, W - 18, 48)
  ctx.textAlign = 'left'
  ctx.fillStyle = 'rgba(148,163,184,0.75)'
  ctx.fillText(
    showGap
      ? '红色虚线是最大空位方向 —— 不足 60°，塞不下'
      : '绿色是每个邻球占的球冠（半角 30°）',
    18, H - 16,
  )
  ctx.restore()
}
