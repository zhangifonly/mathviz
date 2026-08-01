/**
 * 多面体的共享绘制层
 *
 * D3 批次的多面体实验共用。面按画家算法排序后填充，棱单独描线 ——
 * 只填面看不清棱结构，只画线又看不出遮挡关系，两者叠加才清楚。
 */

import {
  makeCamera, project, shade, rampColor, bounds, faceNormal,
  type Camera, type Vec3,
} from './proj3d'
import { drawAxes3D } from './draw3d'
import {
  edgesOf, faceCenter, eulerCount, type Polyhedron,
} from './polyhedron'

export interface PolyhedronDrawOptions {
  poly: Polyhedron
  title?: string
  subtitle?: string
  yaw?: number
  pitch?: number
  ramp?: string
  /** 面的不透明度。调低可看见内部结构 */
  faceAlpha?: number
  /** 描棱的颜色，传 null 不描 */
  edgeColor?: string | null
  /** 标出顶点 */
  showVertices?: boolean
  /** 显示 V/E/F 与欧拉特征数 */
  showEuler?: boolean
  /** 额外读数 */
  readout?: string
  /** 叠加显示对偶多面体（半透明） */
  dual?: Polyhedron
}

export function drawPolyhedron(
  canvas: HTMLCanvasElement, opts: PolyhedronDrawOptions,
): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const {
    poly, title = poly.name, subtitle = '', yaw = 0.6, pitch = 0.32,
    ramp = 'viridis', faceAlpha = 1, edgeColor = 'rgba(255,255,255,0.35)',
    showVertices = false, showEuler = false, readout = '', dual,
  } = opts
  const { width: W, height: H } = canvas

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0a0f1e'
  ctx.fillRect(0, 0, W, H)

  // 主体与对偶一起归一化, 保证相对大小正确
  const allPts = dual ? [...poly.vertices, ...dual.vertices] : poly.vertices
  const { center, radius } = bounds(allPts)
  const k = 1 / Math.max(1e-9, radius)
  const nz = (p: Vec3): Vec3 => [
    (p[0] - center[0]) * k, (p[1] - center[1]) * k, (p[2] - center[2]) * k,
  ]

  const cam = makeCamera({
    yaw, pitch, scale: Math.min(W, H) * 0.36, cx: W / 2, cy: H / 2,
  })
  drawAxes3D(ctx, cam, 1.4)

  if (dual) {
    drawShell(ctx, cam, dual, nz, {
      ramp: 'coolwarm', faceAlpha: 0.28, edgeColor: 'rgba(147,197,253,0.55)',
      showVertices: false,
    })
  }
  drawShell(ctx, cam, poly, nz, { ramp, faceAlpha, edgeColor, showVertices })

  drawLabel(ctx, W, title, subtitle, showEuler ? poly : null, readout)
}

interface ShellStyle {
  ramp: string
  faceAlpha: number
  edgeColor: string | null
  showVertices: boolean
}

/** 画一个多面体的面与棱 */
function drawShell(
  ctx: CanvasRenderingContext2D,
  cam: Camera,
  poly: Polyhedron,
  nz: (p: Vec3) => Vec3,
  style: ShellStyle,
): void {
  // 画家算法: 按面心深度从远到近
  const order = poly.faces
    .map((_, i) => {
      const fc = nz(faceCenter(poly, i))
      return { i, depth: project(fc, cam).depth }
    })
    .sort((a, b) => b.depth - a.depth)

  ctx.save()
  ctx.globalAlpha = style.faceAlpha
  ctx.lineJoin = 'round'
  for (const { i } of order) {
    const f = poly.faces[i]
    const pts = f.map((vi) => project(nz(poly.vertices[vi]), cam))
    // 用面法向打光。法向由前三点定, 数据正确时朝外
    const a = nz(poly.vertices[f[0]])
    const b = nz(poly.vertices[f[1]])
    const c = nz(poly.vertices[f[2]])
    const n = faceNormal(a, b, c)
    const t = i / Math.max(1, poly.faces.length - 1)

    ctx.beginPath()
    pts.forEach((p, j) => (j === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)))
    ctx.closePath()
    ctx.fillStyle = rampColor(t, style.ramp, shade(n))
    ctx.fill()
    if (style.edgeColor) {
      ctx.strokeStyle = style.edgeColor
      ctx.lineWidth = 1.2
      ctx.stroke()
    }
  }
  ctx.restore()

  if (style.showVertices) {
    ctx.save()
    ctx.fillStyle = 'rgba(253,224,71,0.95)'
    for (const v of poly.vertices) {
      const p = project(nz(v), cam)
      ctx.beginPath()
      ctx.arc(p.x, p.y, 3.5 * p.f, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
  }
}

function drawLabel(
  ctx: CanvasRenderingContext2D,
  W: number,
  title: string,
  subtitle: string,
  eulerPoly: Polyhedron | null,
  readout: string,
): void {
  ctx.save()
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.font = 'bold 17px sans-serif'
  ctx.fillText(title, 18, 30)
  if (subtitle) {
    ctx.font = '13px sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.62)'
    ctx.fillText(subtitle, 18, 52)
  }
  ctx.font = '13px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.62)'
  ctx.textAlign = 'right'
  if (eulerPoly) {
    const { V, E, F, chi } = eulerCount(eulerPoly)
    ctx.fillText(`V=${V}  E=${E}  F=${F}`, W - 18, 30)
    ctx.fillText(`V − E + F = ${chi}`, W - 18, 52)
  }
  if (readout) ctx.fillText(readout, W - 18, eulerPoly ? 74 : 30)
  ctx.restore()
}

/** 棱数（供外壳显示，避免重复 import） */
export function edgeCountOf(p: Polyhedron): number {
  return edgesOf(p).length
}
