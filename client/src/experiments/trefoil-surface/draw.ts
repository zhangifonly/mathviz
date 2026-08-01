/**
 * 三叶结的 Canvas 绘制
 *
 * 纽结必须画成管面才看得清穿插关系 —— 细线在交叉处分不出前后。
 * 管面沿曲线用 Frenet 标架生成, 与 tube-surface 同一套方法。
 */

import { makeCamera, bounds, type Vec3 } from '../../lib/proj3d'
import { drawSurface, drawAxes3D } from '../../lib/draw3d'
import { buildTubeGrid } from '../../lib/tube3d'
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

  const grid = buildTubeGrid(
    (t) => torusKnot(t, p, q), [0, 2 * Math.PI], radius, 260, 16,
  )
  const { center, radius: rad } = bounds(grid.flat())
  const k = 1 / rad
  const norm = grid.map((row) => row.map((pt) => [
    (pt[0] - center[0]) * k, (pt[1] - center[1]) * k, (pt[2] - center[2]) * k,
  ] as Vec3))

  drawAxes3D(ctx, cam, 1.4)
  drawSurface(ctx, norm, cam, { ramp, colorBy: 'u', stroke: 'rgba(255,255,255,0.08)' })
  drawLabel(ctx, p, q, W, showInfo)
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
