/**
 * Dandelin 双球的 Canvas 绘制
 *
 * 画圆锥（母线族）+ 两个内切球（用纬线圈示意）+ 切平面上的椭圆，
 * 再把证明用到的四条线段标出来：PF₁、PF₂、PT₁、PT₂。
 *
 * 关键取舍：球用一组水平圆环画，而不是实心球。实心球会把圆锥内部
 * 完全挡住，切点、母线、椭圆全看不见 —— 而这些恰恰是证明的全部内容。
 * 线框虽然朴素，但每个几何要素都露得出来。
 */

import { makeCamera, project, type Camera, type Vec3 } from '../../lib/proj3d'
import {
  dandelinSpheres, foci, cutPoint, cutCurve, generatrixDir,
  tangentCircle, tangentPointOnGeneratrix, focalSum, generatrixSegment,
  eccentricity, isEllipse, type ConeCut, type P3,
} from './dandelin'

export interface DrawOptions {
  cut: ConeCut
  /** 当前高亮的母线方位角 */
  phi: number
  yaw?: number
  /** 显示证明用的线段 */
  showProof?: boolean
  /** 显示两个球 */
  showSpheres?: boolean
  title?: string
  subtitle?: string
}

const CONE_COLOR = 'rgba(148,163,184,0.42)'
const SPHERE_UP = 'rgba(96,165,250,0.55)'
const SPHERE_LOW = 'rgba(74,222,128,0.55)'
const ELLIPSE_COLOR = 'rgba(251,191,36,1)'
const FOCUS_COLOR = 'rgba(248,113,113,1)'
const PROOF_UP = 'rgba(96,165,250,1)'
const PROOF_LOW = 'rgba(74,222,128,1)'

export function drawDandelin(canvas: HTMLCanvasElement, opts: DrawOptions): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const {
    cut, phi, yaw = 0.7, showProof = true, showSpheres = true,
    title = '', subtitle = '',
  } = opts
  const { width: W, height: H } = canvas

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0a0f1e'
  ctx.fillRect(0, 0, W, H)

  if (!isEllipse(cut)) {
    drawNotEllipse(ctx, W, H)
    return
  }

  const [up, low] = dandelinSpheres(cut)

  // 取景：以**椭圆**为中心，而不是以整个圆锥为中心。
  // ⚠️ 早先按上球顶端定 reach 再整体下移，结果椭圆(z∈[2.2,4.8])被推到
  // 顶点下方、缩成画面底部一条细线 —— 主角完全看不见。
  // 现在算出要显示的 z 区间与径向跨度，两者分别定 shift 与 scale。
  const curve = cutCurve(cut, 90)
  const zs = curve.map((p) => p[2])
  const zTop = Math.max(...zs, up.center[2] + up.radius * 0.4)
  const zBot = Math.min(...zs, low.center[2] - low.radius)
  const zMid = (zTop + zBot) / 2
  const radial = Math.max(
    ...curve.map((p) => Math.hypot(p[0], p[1])),
    up.radius,
  )
  // 竖直与水平两个方向都要装得下，取更紧的那个
  const span = Math.max((zTop - zBot) * 0.62, radial * 1.15, 1e-6)
  const cam = makeCamera({
    yaw, pitch: 0.3, scale: (Math.min(W, H) * 0.42) / span,
    cx: W / 2, cy: H / 2,
  })
  const shift = (p: P3): Vec3 => [p[0], p[1], p[2] - zMid]

  drawCone(ctx, cam, cut, shift, zTop * 1.04)
  if (showSpheres) {
    drawSphereRings(ctx, cam, up, shift, SPHERE_UP)
    drawSphereRings(ctx, cam, low, shift, SPHERE_LOW)
    drawTangentCircle(ctx, cam, cut, up, shift, SPHERE_UP)
    drawTangentCircle(ctx, cam, cut, low, shift, SPHERE_LOW)
  }
  drawEllipse(ctx, cam, cut, shift)
  drawFoci(ctx, cam, cut, shift)
  if (showProof) drawProofSegments(ctx, cam, cut, phi, shift)
  drawLabels(ctx, W, H, cut, phi, title, subtitle)
}

/** 圆锥：一族母线 + 几道纬线圈 */
function drawCone(
  ctx: CanvasRenderingContext2D, cam: Camera, cut: ConeCut,
  shift: (p: P3) => Vec3, zMax: number,
): void {
  ctx.save()
  ctx.strokeStyle = CONE_COLOR
  ctx.lineWidth = 1
  // 母线
  for (let k = 0; k < 24; k++) {
    const phi = (2 * Math.PI * k) / 24
    const dir = generatrixDir(cut.alpha, phi)
    const t = zMax / dir[2]
    const a = project(shift([0, 0, 0]), cam)
    const b = project(shift([dir[0] * t, dir[1] * t, dir[2] * t]), cam)
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.stroke()
  }
  // 纬线圈
  for (let k = 1; k <= 5; k++) {
    const z = (zMax * k) / 5
    const r = z * Math.tan(cut.alpha)
    ctx.beginPath()
    for (let i = 0; i <= 48; i++) {
      const a = (2 * Math.PI * i) / 48
      const s = project(shift([r * Math.cos(a), r * Math.sin(a), z]), cam)
      if (i === 0) ctx.moveTo(s.x, s.y)
      else ctx.lineTo(s.x, s.y)
    }
    ctx.stroke()
  }
  ctx.restore()
}

/** 球用一组水平圆环示意（实心球会挡住内部的一切） */
function drawSphereRings(
  ctx: CanvasRenderingContext2D, cam: Camera,
  s: { center: P3; radius: number }, shift: (p: P3) => Vec3, color: string,
): void {
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = 1.1
  const rings = 9
  for (let k = 1; k < rings; k++) {
    const t = -1 + (2 * k) / rings
    const z = s.center[2] + s.radius * t
    const r = s.radius * Math.sqrt(Math.max(0, 1 - t * t))
    if (r < 1e-6) continue
    ctx.beginPath()
    for (let i = 0; i <= 40; i++) {
      const a = (2 * Math.PI * i) / 40
      const p = project(shift([r * Math.cos(a), r * Math.sin(a), z]), cam)
      if (i === 0) ctx.moveTo(p.x, p.y)
      else ctx.lineTo(p.x, p.y)
    }
    ctx.stroke()
  }
  ctx.restore()
}

/** 球与锥面的切圆（加粗，这是证明里 T 点所在的圈） */
function drawTangentCircle(
  ctx: CanvasRenderingContext2D, cam: Camera, cut: ConeCut,
  s: { center: P3; radius: number }, shift: (p: P3) => Vec3, color: string,
): void {
  const tc = tangentCircle(s, cut.alpha)
  ctx.save()
  ctx.strokeStyle = color.replace(/0\.\d+\)$/, '1)')
  ctx.lineWidth = 2.4
  ctx.beginPath()
  for (let i = 0; i <= 60; i++) {
    const a = (2 * Math.PI * i) / 60
    const p = project(
      shift([tc.radius * Math.cos(a), tc.radius * Math.sin(a), tc.z]), cam,
    )
    if (i === 0) ctx.moveTo(p.x, p.y)
    else ctx.lineTo(p.x, p.y)
  }
  ctx.stroke()
  ctx.restore()
}

/** 切平面上的椭圆 */
function drawEllipse(
  ctx: CanvasRenderingContext2D, cam: Camera, cut: ConeCut,
  shift: (p: P3) => Vec3,
): void {
  const curve = cutCurve(cut, 160)
  if (curve.length < 3) return
  ctx.save()
  ctx.strokeStyle = ELLIPSE_COLOR
  ctx.lineWidth = 3
  ctx.beginPath()
  curve.forEach((p, i) => {
    const s = project(shift(p), cam)
    if (i === 0) ctx.moveTo(s.x, s.y)
    else ctx.lineTo(s.x, s.y)
  })
  ctx.closePath()
  ctx.stroke()
  ctx.fillStyle = 'rgba(251,191,36,0.13)'
  ctx.fill()
  ctx.restore()
}

/** 两个焦点 */
function drawFoci(
  ctx: CanvasRenderingContext2D, cam: Camera, cut: ConeCut,
  shift: (p: P3) => Vec3,
): void {
  const [f1, f2] = foci(cut)
  ctx.save()
  ;[f1, f2].forEach((f, i) => {
    const s = project(shift(f), cam)
    ctx.beginPath()
    ctx.arc(s.x, s.y, 5, 0, Math.PI * 2)
    ctx.fillStyle = FOCUS_COLOR
    ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,0.95)'
    ctx.font = 'bold 13px sans-serif'
    ctx.fillText(`F${i + 1}`, s.x + 8, s.y - 6)
  })
  ctx.restore()
}

/**
 * 证明用的线段：P 到两焦点、P 到两切点。
 * PF₁ = PT₁、PF₂ = PT₂，于是 PF₁+PF₂ = T₁T₂。
 */
function drawProofSegments(
  ctx: CanvasRenderingContext2D, cam: Camera, cut: ConeCut,
  phi: number, shift: (p: P3) => Vec3,
): void {
  const p = cutPoint(cut, phi)
  if (!p) return
  const [up, low] = dandelinSpheres(cut)
  const [f1, f2] = foci(cut)
  const t1 = tangentPointOnGeneratrix(up, cut.alpha, phi)
  const t2 = tangentPointOnGeneratrix(low, cut.alpha, phi)
  const sp = project(shift(p), cam)

  ctx.save()
  // 高亮这条母线（T₁T₂ 就在它上面）
  ctx.strokeStyle = 'rgba(226,232,240,0.9)'
  ctx.lineWidth = 2
  const st1 = project(shift(t1), cam)
  const st2 = project(shift(t2), cam)
  ctx.beginPath()
  ctx.moveTo(st1.x, st1.y)
  ctx.lineTo(st2.x, st2.y)
  ctx.stroke()

  // P → F 与 P → T
  const pairs: Array<[P3, string, string]> = [
    [f1, PROOF_UP, 'PF₁'],
    [t1, PROOF_UP, 'PT₁'],
    [f2, PROOF_LOW, 'PF₂'],
    [t2, PROOF_LOW, 'PT₂'],
  ]
  for (const [q, color, label] of pairs) {
    const sq = project(shift(q), cam)
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.setLineDash(label.startsWith('PT') ? [5, 4] : [])
    ctx.beginPath()
    ctx.moveTo(sp.x, sp.y)
    ctx.lineTo(sq.x, sq.y)
    ctx.stroke()
    ctx.setLineDash([])
  }

  // T 点与 P 点
  for (const [q, color] of [[t1, PROOF_UP], [t2, PROOF_LOW]] as Array<[P3, string]>) {
    const sq = project(shift(q), cam)
    ctx.beginPath()
    ctx.arc(sq.x, sq.y, 4, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
  }
  ctx.beginPath()
  ctx.arc(sp.x, sp.y, 6, 0, Math.PI * 2)
  ctx.fillStyle = ELLIPSE_COLOR
  ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.98)'
  ctx.font = 'bold 14px sans-serif'
  ctx.fillText('P', sp.x + 9, sp.y - 7)
  ctx.restore()
}

function drawNotEllipse(
  ctx: CanvasRenderingContext2D, W: number, H: number,
): void {
  ctx.save()
  ctx.fillStyle = 'rgba(248,113,113,0.95)'
  ctx.font = 'bold 16px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('倾角过大：切口不再是椭圆（抛物线 / 双曲线）', W / 2, H / 2 - 10)
  ctx.font = '13px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.fillText('Dandelin 双球的构造要求 θ < π/2 − α', W / 2, H / 2 + 16)
  ctx.restore()
}

function drawLabels(
  ctx: CanvasRenderingContext2D, W: number, H: number,
  cut: ConeCut, phi: number, title: string, subtitle: string,
): void {
  const sum = focalSum(cut, phi)
  const seg = generatrixSegment(cut)
  ctx.save()
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.font = 'bold 17px sans-serif'
  ctx.fillText(title || 'Dandelin 双球', 18, 26)
  ctx.font = '13px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.62)'
  ctx.fillText(
    subtitle || `α=${(cut.alpha * 180 / Math.PI).toFixed(0)}° θ=${(cut.theta * 180 / Math.PI).toFixed(0)}° e=${eccentricity(cut).toFixed(4)}`,
    18, 46,
  )

  ctx.textAlign = 'right'
  ctx.font = 'bold 13px sans-serif'
  ctx.fillStyle = PROOF_UP
  ctx.fillText(`PF₁ + PF₂ = ${sum.toFixed(6)}`, W - 18, 26)
  ctx.fillStyle = 'rgba(226,232,240,0.9)'
  ctx.fillText(`T₁T₂ = ${seg.toFixed(6)}`, W - 18, 46)
  ctx.fillStyle = Math.abs(sum - seg) < 1e-9
    ? 'rgba(74,222,128,1)'
    : 'rgba(248,113,113,1)'
  ctx.fillText(
    Math.abs(sum - seg) < 1e-9 ? '两者相等 ✓' : '不等 ✗', W - 18, 66,
  )
  ctx.textAlign = 'left'

  ctx.font = '12px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.75)'
  ctx.fillText('实线 = 到焦点 PF，虚线 = 到锥面切点 PT（同色两条等长）', 18, H - 34)
  ctx.fillStyle = 'rgba(148,163,184,0.85)'
  ctx.fillText('拖动方位角，PF₁+PF₂ 始终等于 T₁T₂ —— 所以切口是椭圆', 18, H - 14)
  ctx.restore()
}
