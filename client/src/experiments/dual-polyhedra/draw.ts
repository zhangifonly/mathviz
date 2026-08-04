/**
 * 对偶多面体的 Canvas 绘制
 *
 * 同时画原多面体（蓝）与对偶（橙），加上中球（灰）。
 * 取 R = 中球半径时，两者的棱互相垂直穿插、交点落在中球上 ——
 * 这个"互相卡住"的画面就是极反演的几何含义。
 */

import { makeCamera, project, shade, type Camera, type Vec3 } from '../../lib/proj3d'
import {
  edgesOf, dualOf, midsphereRadius, faceNormal, faceCentroid, vef,
  add, scale, norm, type Polyhedron,
} from './dualPolyhedra'

export interface DrawOptions {
  solid: Polyhedron
  yaw?: number
  /** 画对偶 */
  showDual?: boolean
  /** 画中球 */
  showMidsphere?: boolean
  /** 面填充（关掉只看线框，穿插关系更清楚） */
  fillFaces?: boolean
  title?: string
  subtitle?: string
}

const PRIMAL = 'rgba(96,165,250,1)'
const DUAL = 'rgba(251,146,60,1)'
const MID = 'rgba(148,163,184,0.32)'

export function drawDual(canvas: HTMLCanvasElement, opts: DrawOptions): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const {
    solid, yaw = 0.6, showDual = true, showMidsphere = true,
    fillFaces = true, title = '', subtitle = '',
  } = opts
  const { width: W, height: H } = canvas

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0a0f1e'
  ctx.fillRect(0, 0, W, H)

  const R = midsphereRadius(solid)
  const D = dualOf(solid, R)
  // 视野要容纳两者的最远顶点
  let reach = 0
  for (const v of [...solid.vertices, ...(showDual ? D.vertices : [])]) {
    reach = Math.max(reach, norm(v))
  }
  const cam = makeCamera({
    yaw, pitch: 0.3, scale: (Math.min(W, H) * 0.40) / Math.max(1e-6, reach),
    cx: W / 2, cy: H / 2,
  })

  if (showMidsphere) drawSphere(ctx, cam, R)
  if (fillFaces) {
    drawFaces(ctx, cam, solid, 'rgba(96,165,250,', 0.3)
    if (showDual) drawFaces(ctx, cam, D, 'rgba(251,146,60,', 0.26)
  }
  drawEdges(ctx, cam, solid, PRIMAL, 2.4)
  if (showDual) drawEdges(ctx, cam, D, DUAL, 2.2)
  drawLabel(ctx, W, H, solid, D, R, showDual, title, subtitle)
}

/** 中球的经纬线框 */
function drawSphere(ctx: CanvasRenderingContext2D, cam: Camera, R: number): void {
  ctx.save()
  ctx.strokeStyle = MID
  ctx.lineWidth = 1
  for (let k = -2; k <= 2; k++) {
    const lat = (k * Math.PI) / 6
    ctx.beginPath()
    for (let i = 0; i <= 48; i++) {
      const lon = (2 * Math.PI * i) / 48
      const p: Vec3 = [
        R * Math.cos(lat) * Math.cos(lon),
        R * Math.cos(lat) * Math.sin(lon),
        R * Math.sin(lat),
      ]
      const s = project(p, cam)
      if (i === 0) ctx.moveTo(s.x, s.y)
      else ctx.lineTo(s.x, s.y)
    }
    ctx.stroke()
  }
  for (let k = 0; k < 6; k++) {
    const lon = (Math.PI * k) / 6
    ctx.beginPath()
    for (let i = 0; i <= 32; i++) {
      const lat = -Math.PI / 2 + (Math.PI * i) / 32
      const p: Vec3 = [
        R * Math.cos(lat) * Math.cos(lon),
        R * Math.cos(lat) * Math.sin(lon),
        R * Math.sin(lat),
      ]
      const s = project(p, cam)
      if (i === 0) ctx.moveTo(s.x, s.y)
      else ctx.lineTo(s.x, s.y)
    }
    ctx.stroke()
  }
  ctx.restore()
}

/** 面填充：按深度排序后画，正面亮背面暗 */
function drawFaces(
  ctx: CanvasRenderingContext2D, cam: Camera, P: Polyhedron,
  rgbPrefix: string, alpha: number,
): void {
  const order = P.faces
    .map((f) => ({ f, d: project(faceCentroid(P, f), cam).depth }))
    .sort((a, b) => b.d - a.d)
  ctx.save()
  for (const { f } of order) {
    const n = faceNormal(P, f)
    const br = shade(n)
    ctx.beginPath()
    f.forEach((vi, k) => {
      const s = project(P.vertices[vi], cam)
      if (k === 0) ctx.moveTo(s.x, s.y)
      else ctx.lineTo(s.x, s.y)
    })
    ctx.closePath()
    ctx.fillStyle = `${rgbPrefix}${(alpha * br).toFixed(3)})`
    ctx.fill()
  }
  ctx.restore()
}

/** 棱 */
function drawEdges(
  ctx: CanvasRenderingContext2D, cam: Camera, P: Polyhedron,
  color: string, width: number,
): void {
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = width
  for (const [i, j] of edgesOf(P)) {
    const a = project(P.vertices[i], cam)
    const b = project(P.vertices[j], cam)
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.stroke()
  }
  ctx.fillStyle = color
  for (const v of P.vertices) {
    const s = project(v, cam)
    ctx.beginPath()
    ctx.arc(s.x, s.y, 3, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

function drawLabel(
  ctx: CanvasRenderingContext2D, W: number, H: number,
  P: Polyhedron, D: Polyhedron, R: number, showDual: boolean,
  title: string, subtitle: string,
): void {
  const [V, E, F] = vef(P)
  const [dv, de, df] = vef(D)
  ctx.save()
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.font = 'bold 17px sans-serif'
  ctx.fillText(title || P.label, 18, 28)
  ctx.font = '13px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.62)'
  ctx.fillText(
    subtitle || `V=${V} E=${E} F=${F} · χ = V−E+F = ${V - E + F}`, 18, 48,
  )
  ctx.textAlign = 'right'
  // χ 常驻右上角：它是这一课的主角，不能被 subtitle 挤掉
  ctx.fillText(`χ = ${V}−${E}+${F} = ${V - E + F}`, W - 18, 28)
  if (showDual) {
    ctx.fillText(
      `对偶 (${dv},${de},${df}) χ=${dv - de + df} · 中球 ${R.toFixed(3)}`,
      W - 18, 48,
    )
  }
  ctx.textAlign = 'left'

  // 图例
  const items: Array<[string, string]> = showDual
    ? [[P.label, PRIMAL], [`对偶（${df} 面）`, DUAL], ['中球', 'rgba(148,163,184,0.8)']]
    : [[P.label, PRIMAL]]
  let y = H - 20 - (items.length - 1) * 20
  ctx.font = '12px sans-serif'
  for (const [name, color] of items) {
    ctx.fillStyle = color
    ctx.fillRect(18, y - 8, 11, 11)
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    ctx.fillText(name, 35, y + 1)
    y += 20
  }
  ctx.restore()
}

export { add, scale }
