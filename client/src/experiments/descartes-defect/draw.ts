/**
 * Descartes 角亏的 Canvas 绘制
 *
 * 复用 lib/drawPolyhedron 画立体本身（面填充 + 描棱 + 欧拉数），
 * 这里只叠加"每个顶点的角亏"标注 —— 用扇形大小直观表示 δ 的多少。
 *
 * 这是共享绘制层第一次被薄封装复用：本课不写自己的立体渲染，
 * 只加自己关心的那一层标注。
 */

import { makeCamera, project, bounds, type Camera, type Vec3 } from '../../lib/proj3d'
import { drawPolyhedron } from '../../lib/drawPolyhedron'
import type { Polyhedron } from '../../lib/polyhedron'
import { allDefects, totalDefect } from './descartesDefect'

export interface DrawOptions {
  poly: Polyhedron
  yaw?: number
  /** 标出每个顶点的角亏 */
  showDefects?: boolean
  /** 面的不透明度 */
  faceAlpha?: number
  title?: string
  subtitle?: string
}

const DEG = 180 / Math.PI

export function drawDescartes(canvas: HTMLCanvasElement, opts: DrawOptions): void {
  const {
    poly, yaw = 0.6, showDefects = true, faceAlpha = 0.5,
    title = '', subtitle = '',
  } = opts

  const total = totalDefect(poly)
  // 立体本身交给共享绘制层
  drawPolyhedron(canvas, {
    poly,
    title: title || poly.name,
    subtitle: subtitle || `每顶点角亏 ${(allDefects(poly)[0] * DEG).toFixed(2)}°`,
    yaw,
    faceAlpha,
    edgeColor: 'rgba(226,232,240,0.85)',
    showVertices: false,
    showEuler: true,
    readout: `Σδ = ${total.toFixed(6)} = ${(total / Math.PI).toFixed(4)}π`,
  })

  if (showDefects) overlayDefects(canvas, poly, yaw)
}

/**
 * 在每个顶点画一个圆盘，半径正比于该点的角亏。
 *
 * ⚠️ 必须与 drawPolyhedron 内部用**完全相同**的归一化与相机参数，
 * 否则标注会与立体错位。那边用 bounds() 把点集缩到单位球、
 * pitch 取 makeCamera 默认值、scale = min(W,H) × 0.36，这里照抄。
 */
function overlayDefects(
  canvas: HTMLCanvasElement, poly: Polyhedron, yaw: number,
): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const { width: W, height: H } = canvas
  const { center, radius } = bounds(poly.vertices)
  const k = 1 / Math.max(1e-9, radius)
  const nz = (p: Vec3): Vec3 => [
    (p[0] - center[0]) * k, (p[1] - center[1]) * k, (p[2] - center[2]) * k,
  ]
  const cam: Camera = makeCamera({
    yaw, scale: Math.min(W, H) * 0.36, cx: W / 2, cy: H / 2,
  })
  const defects = allDefects(poly)
  const maxD = Math.max(...defects)

  // 按深度排序，近的后画
  const order = poly.vertices
    .map((v, i) => ({ v: nz(v), i, d: project(nz(v), cam).depth }))
    .sort((a, b) => b.d - a.d)

  ctx.save()
  for (const { v, i, d } of order) {
    const s = project(v as Vec3, cam)
    const frac = maxD > 1e-12 ? defects[i] / maxD : 0
    const r = 4 + 10 * frac
    const front = d < 0
    ctx.beginPath()
    ctx.arc(s.x, s.y, r, 0, Math.PI * 2)
    ctx.fillStyle = front
      ? `rgba(251,191,36,${(0.35 + 0.4 * frac).toFixed(2)})`
      : 'rgba(251,191,36,0.12)'
    ctx.fill()
    ctx.strokeStyle = front ? 'rgba(251,191,36,0.95)' : 'rgba(251,191,36,0.25)'
    ctx.lineWidth = 1.4
    ctx.stroke()
    if (front && defects.length <= 12) {
      ctx.fillStyle = 'rgba(255,255,255,0.92)'
      ctx.font = 'bold 11px sans-serif'
      ctx.fillText(`${(defects[i] * DEG).toFixed(0)}°`, s.x + r + 3, s.y + 4)
    }
  }
  ctx.restore()

  // 底部说明
  ctx.save()
  ctx.font = '12px sans-serif'
  ctx.fillStyle = 'rgba(251,191,36,0.9)'
  ctx.fillText('黄色圆盘：顶点角亏 δ = 2π − 面角和（大小正比于 δ）', 18, H - 34)
  ctx.fillStyle = 'rgba(148,163,184,0.8)'
  ctx.fillText('无论几个顶点，Σδ 恒为 4π —— 这就是 Descartes 定理', 18, H - 16)
  ctx.restore()
}
