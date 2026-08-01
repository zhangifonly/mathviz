/**
 * 三叶结的 Canvas 绘制
 *
 * 纽结必须画成管面才看得清穿插关系 —— 细线在交叉处分不出前后。
 * 管面沿曲线用 Frenet 标架生成, 与 tube-surface 同一套方法。
 */

import { makeCamera, bounds, type Vec3 } from '../../lib/proj3d'
import { drawSurface, drawAxes3D } from '../../lib/draw3d'
import { torusKnot, isKnot, gcd, CROSSING_NUMBER } from './trefoilSurface'

export interface DrawOptions {
  p: number
  q: number
  radius?: number
  yaw?: number
  ramp?: string
  /** 显示交叉数与 gcd 判据 */
  showInfo?: boolean
}

export function drawTrefoil(canvas: HTMLCanvasElement, opts: DrawOptions): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const { p, q, radius = 0.3, yaw = 0.6, ramp = 'plasma', showInfo = false } = opts
  const { width: W, height: H } = canvas

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const cam = makeCamera({
    yaw, pitch: 0.32, scale: Math.min(W, H) * 0.34, cx: W / 2, cy: H / 2,
  })

  const grid = buildTube(p, q, radius)
  const { center, radius: rad } = bounds(grid.flat())
  const k = 1 / rad
  const norm = grid.map((row) => row.map((pt) => [
    (pt[0] - center[0]) * k, (pt[1] - center[1]) * k, (pt[2] - center[2]) * k,
  ] as Vec3))

  drawAxes3D(ctx, cam, 1.4)
  drawSurface(ctx, norm, cam, { ramp, colorBy: 'u', stroke: 'rgba(255,255,255,0.08)' })
  drawLabel(ctx, p, q, W, showInfo)
}

/**
 * 沿环面纽结生成管面。用 Frenet 标架保证截面垂直于曲线,
 * 否则交叉处的穿插关系会被扭曲。
 */
function buildTube(p: number, q: number, r: number): Vec3[][] {
  const nT = 260
  const nTheta = 16
  const grid: Vec3[][] = []
  for (let i = 0; i <= nT; i++) {
    const t = (2 * Math.PI * i) / nT
    const c = torusKnot(t, p, q)
    const { N, B } = frame(t, p, q)
    const row: Vec3[] = []
    for (let j = 0; j <= nTheta; j++) {
      const th = (2 * Math.PI * j) / nTheta
      row.push([
        c[0] + r * (Math.cos(th) * N[0] + Math.sin(th) * B[0]),
        c[1] + r * (Math.cos(th) * N[1] + Math.sin(th) * B[1]),
        c[2] + r * (Math.cos(th) * N[2] + Math.sin(th) * B[2]),
      ])
    }
    grid.push(row)
  }
  return grid
}

function frame(t: number, p: number, q: number): { N: Vec3; B: Vec3 } {
  const h = 1e-4
  const g = (s: number) => torusKnot(s, p, q)
  const T = unit(diff(g, t, h))
  const dT = diff((s) => unit(diff(g, s, h)), t, h)
  const N = unit(dT)
  return { N, B: cross(T, N) }
}

function diff(fn: (t: number) => Vec3, at: number, h: number): Vec3 {
  const a = fn(at - h)
  const b = fn(at + h)
  return [(b[0] - a[0]) / (2 * h), (b[1] - a[1]) / (2 * h), (b[2] - a[2]) / (2 * h)]
}

function unit(v: Vec3): Vec3 {
  const n = Math.hypot(v[0], v[1], v[2])
  if (n < 1e-12) return [0, 0, 1]
  return [v[0] / n, v[1] / n, v[2] / n]
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
}

function drawLabel(
  ctx: CanvasRenderingContext2D, p: number, q: number, W: number, showInfo: boolean,
): void {
  ctx.save()
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.font = 'bold 17px sans-serif'
  const name = p === 2 && q === 3 ? '三叶结' : `(${p},${q}) 环面${isKnot(p, q) ? '纽结' : '链环'}`
  ctx.fillText(name, 18, 30)
  ctx.font = '13px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.62)'
  ctx.fillText(`绕 ${p} 圈经线 · ${q} 圈纬线`, 18, 52)
  ctx.textAlign = 'right'
  if (showInfo) {
    ctx.fillText(`gcd(${p},${q}) = ${gcd(p, q)} → ${isKnot(p, q) ? '纽结' : '链环'}`, W - 18, 30)
    if (p === 2 && q === 3) {
      ctx.fillText(`交叉数 ${CROSSING_NUMBER} · Δ(t) = t² − t + 1`, W - 18, 52)
    }
  } else {
    ctx.fillText(isKnot(p, q) ? '单一闭曲线' : '多个分支', W - 18, 30)
  }
  ctx.restore()
}
