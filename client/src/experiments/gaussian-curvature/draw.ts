/**
 * 高斯曲率的 Canvas 绘制
 *
 * 本实验的核心是「把 K 的符号铺在曲面上」: 红为正(椭圆点)、蓝为负(双曲点)、
 * 白为零(抛物点)。通用 drawSurface 只按 z/radius 上色, 故自己实现面片绘制。
 */

import {
  makeCamera, buildQuads, project, shade, bounds, type Camera, type Vec3,
} from '../../lib/proj3d'
import { drawAxes3D } from '../../lib/draw3d'
import {
  surfacePoint, domainRange, gaussianCurvature, principalCurvatures,
  infoOf, type SurfaceKind,
} from './gaussianCurvature'

export interface DrawOptions {
  kind: SurfaceKind
  yaw?: number
  /** 显示主曲率与 K 的读数 */
  showReadout?: boolean
}

export function drawCurvature(canvas: HTMLCanvasElement, opts: DrawOptions): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const { kind, yaw = 0.6, showReadout = false } = opts
  const { width: W, height: H } = canvas

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const cam = makeCamera({
    yaw, pitch: 0.32, scale: Math.min(W, H) * 0.34, cx: W / 2, cy: H / 2,
  })

  const [a, b] = domainRange(kind)
  const n = 48
  const grid: Vec3[][] = []
  const ks: number[][] = []
  for (let i = 0; i <= n; i++) {
    const x = a + ((b - a) * i) / n
    const row: Vec3[] = []
    const krow: number[] = []
    for (let j = 0; j <= n; j++) {
      const y = a + ((b - a) * j) / n
      row.push(surfacePoint(kind, x, y))
      const k = gaussianCurvature(kind, x, y)
      krow.push(Number.isFinite(k) ? Math.max(-3, Math.min(3, k)) : 0)
    }
    grid.push(row)
    ks.push(krow)
  }

  const { center, radius } = bounds(grid.flat())
  const s = 1 / radius
  const norm = grid.map((row) => row.map((p) => [
    (p[0] - center[0]) * s, (p[1] - center[1]) * s, (p[2] - center[2]) * s,
  ] as Vec3))

  drawAxes3D(ctx, cam, 1.35)
  drawCurvatureColored(ctx, norm, ks, cam)
  drawLabel(ctx, kind, W, showReadout)
}

/** 按 K 的符号与大小上色: 红正蓝负白零 */
function drawCurvatureColored(
  ctx: CanvasRenderingContext2D,
  grid: Vec3[][],
  ks: number[][],
  cam: Camera,
): void {
  const cols = grid[0].length
  const tagged = buildQuads(grid).map((q, idx) => ({
    q,
    k: ks[Math.floor(idx / (cols - 1))][idx % (cols - 1)],
  }))
  // 用当前画面上 |K| 的最大值做归一, 保证配色始终有对比度
  const maxAbs = Math.max(0.05, ...tagged.map((t) => Math.abs(t.k)))
  const order = tagged
    .map((t) => ({ ...t, d: project(t.q.center, cam).depth }))
    .sort((m, n) => n.d - m.d)

  ctx.save()
  ctx.lineJoin = 'round'
  for (const { q, k } of order) {
    const br = shade(q.normal)
    const t = Math.max(-1, Math.min(1, k / maxAbs))
    ctx.beginPath()
    q.corners.forEach((c, i) => {
      const p = project(c, cam)
      if (i === 0) ctx.moveTo(p.x, p.y)
      else ctx.lineTo(p.x, p.y)
    })
    ctx.closePath()
    ctx.fillStyle = curvatureColor(t, br)
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.07)'
    ctx.lineWidth = 0.4
    ctx.stroke()
  }
  ctx.restore()
}

/** t∈[-1,1]: -1 蓝 → 0 白 → +1 红 */
function curvatureColor(t: number, brightness: number): string {
  const mix = (lo: number, hi: number, f: number) => lo + (hi - lo) * f
  let r: number
  let g: number
  let bl: number
  if (t >= 0) {
    r = mix(245, 220, t)
    g = mix(245, 60, t)
    bl = mix(245, 55, t)
  } else {
    const f = -t
    r = mix(245, 60, f)
    g = mix(245, 110, f)
    bl = mix(245, 225, f)
  }
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v * brightness)))
  return `rgb(${c(r)}, ${c(g)}, ${c(bl)})`
}

function drawLabel(
  ctx: CanvasRenderingContext2D, kind: SurfaceKind, W: number, showReadout: boolean,
): void {
  const info = infoOf(kind)
  ctx.save()
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.font = 'bold 17px sans-serif'
  ctx.fillText(info.label, 18, 30)
  ctx.font = '13px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.62)'
  ctx.fillText('红 K>0 椭圆点 · 白 K=0 抛物点 · 蓝 K<0 双曲点', 18, 52)
  ctx.textAlign = 'right'
  ctx.fillText(info.sign, W - 18, 30)
  if (showReadout) {
    const [a, b] = domainRange(kind)
    const cx = (a + b) / 2 + (b - a) * 0.18
    const K = gaussianCurvature(kind, cx, cx * 0.3)
    const [k1, k2] = principalCurvatures(kind, cx, cx * 0.3)
    ctx.fillText(
      `采样点 K=${K.toFixed(3)}  κ₁=${k1.toFixed(2)}  κ₂=${k2.toFixed(2)}`, W - 18, 52,
    )
  }
  ctx.restore()
}
