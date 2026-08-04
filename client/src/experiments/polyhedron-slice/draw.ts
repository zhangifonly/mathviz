/**
 * 多面体截面的 Canvas 绘制
 *
 * 立体本身交给 lib/drawPolyhedron（画成半透明外壳），
 * 这里叠加两样：切平面的方形轮廓、截面多边形（实色填充）。
 *
 * 与 descartes-defect 一样，叠加层必须与 drawPolyhedron 用相同的
 * 归一化（bounds）与相机参数，否则会错位。
 */

import {
  makeCamera, project, bounds, type Camera, type Vec3,
} from '../../lib/proj3d'
import { drawPolyhedron } from '../../lib/drawPolyhedron'
import {
  sliceOf, sliceArea, slicePerimeter, isRegularSlice, unit, cross, add, scale,
  type Plane, type Polyhedron,
} from './polyhedronSlice'

export interface DrawOptions {
  poly: Polyhedron
  plane: Plane
  yaw?: number
  /**
   * 俯仰角。默认 0.62 而非共享库的 0.32 ——
   * 截面才是本课的主角，视线若与截面平面接近共面，
   * 正六边形会被投影压成一条细带，完全看不出形状。
   */
  pitch?: number
  /** 画切平面的轮廓 */
  showPlane?: boolean
  title?: string
  subtitle?: string
}

const SLICE_FILL = 'rgba(251,191,36,0.55)'
const SLICE_EDGE = 'rgba(251,191,36,1)'
const PLANE_EDGE = 'rgba(148,163,184,0.5)'

export function drawSlice(canvas: HTMLCanvasElement, opts: DrawOptions): void {
  const {
    poly, plane, yaw = 0.6, pitch = 0.62, showPlane = true,
    title = '', subtitle = '',
  } = opts

  const ring = sliceOf(poly, plane)
  const sides = ring.length

  // 立体画成半透明外壳，好看到里面的截面
  drawPolyhedron(canvas, {
    poly,
    title: title || `${poly.name} 的截面`,
    subtitle: subtitle || (sides >= 3
      ? `${sides} 边形${isRegularSlice(ring) ? '（正）' : ''}`
      : '平面在立体之外'),
    yaw,
    pitch,
    faceAlpha: 0.18,
    edgeColor: 'rgba(148,163,184,0.75)',
    showVertices: false,
    showEuler: false,
    readout: sides >= 3
      ? `面积 ${sliceArea(ring).toFixed(4)} · 周长 ${slicePerimeter(ring).toFixed(4)}`
      : '',
  })

  overlaySlice(canvas, poly, plane, ring, yaw, pitch, showPlane)
}

function overlaySlice(
  canvas: HTMLCanvasElement, poly: Polyhedron, plane: Plane,
  ring: Vec3[], yaw: number, pitch: number, showPlane: boolean,
): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const { width: W, height: H } = canvas
  // 与 drawPolyhedron 完全一致的归一化与相机
  const { center, radius } = bounds(poly.vertices)
  const k = 1 / Math.max(1e-9, radius)
  const nz = (p: Vec3): Vec3 => [
    (p[0] - center[0]) * k, (p[1] - center[1]) * k, (p[2] - center[2]) * k,
  ]
  const cam: Camera = makeCamera({
    yaw, pitch, scale: Math.min(W, H) * 0.36, cx: W / 2, cy: H / 2,
  })

  if (showPlane) drawPlaneOutline(ctx, cam, plane, nz)

  if (ring.length >= 3) {
    ctx.save()
    ctx.beginPath()
    ring.forEach((v, i) => {
      const s = project(nz(v), cam)
      if (i === 0) ctx.moveTo(s.x, s.y)
      else ctx.lineTo(s.x, s.y)
    })
    ctx.closePath()
    ctx.fillStyle = SLICE_FILL
    ctx.fill()
    ctx.strokeStyle = SLICE_EDGE
    ctx.lineWidth = 2.6
    ctx.stroke()
    // 顶点
    ctx.fillStyle = SLICE_EDGE
    for (const v of ring) {
      const s = project(nz(v), cam)
      ctx.beginPath()
      ctx.arc(s.x, s.y, 3.2, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
  }

  ctx.save()
  ctx.font = '12px sans-serif'
  ctx.fillStyle = 'rgba(251,191,36,0.9)'
  ctx.fillText('黄色是截面多边形', 18, H - 34)
  ctx.fillStyle = 'rgba(148,163,184,0.8)'
  ctx.fillText('灰色方框是切平面', 18, H - 16)
  ctx.restore()
}

/** 切平面的方形轮廓（在平面内取一个正方形） */
function drawPlaneOutline(
  ctx: CanvasRenderingContext2D, cam: Camera, plane: Plane,
  nz: (p: Vec3) => Vec3,
): void {
  const n = unit(plane.n)
  // 平面上一点
  const origin = scale(n, plane.d)
  // 平面内的两个正交方向
  const ref: Vec3 = Math.abs(n[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0]
  const e1 = unit(cross(n, ref))
  const e2 = cross(n, e1)
  const R = 1.35
  const corners: Vec3[] = [
    add(origin, add(scale(e1, R), scale(e2, R))),
    add(origin, add(scale(e1, -R), scale(e2, R))),
    add(origin, add(scale(e1, -R), scale(e2, -R))),
    add(origin, add(scale(e1, R), scale(e2, -R))),
  ]
  ctx.save()
  ctx.strokeStyle = PLANE_EDGE
  ctx.lineWidth = 1.4
  ctx.setLineDash([5, 4])
  ctx.beginPath()
  corners.forEach((c, i) => {
    const s = project(nz(c), cam)
    if (i === 0) ctx.moveTo(s.x, s.y)
    else ctx.lineTo(s.x, s.y)
  })
  ctx.closePath()
  ctx.stroke()
  ctx.setLineDash([])
  ctx.restore()
}
