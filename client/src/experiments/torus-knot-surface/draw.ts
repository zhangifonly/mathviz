/**
 * 环面纽结管的 Canvas 绘制
 *
 * 本实验的看点是「(p,q) 与四个不变量的对应」, 所以标签区要能同时显示
 * 分支数、交叉数、亏格、桥数 —— 让「在环面上怎么绕」直接映到纽结性质。
 * 管面生成复用 lib/tube3d(与 trefoil-surface 同一套 Frenet 标架方法)。
 */

import { makeCamera, bounds, type Vec3 } from '../../lib/proj3d'
import { drawSurface, drawAxes3D } from '../../lib/draw3d'
import { buildTubeGrid } from '../../lib/tube3d'
import {
  knotCurve, componentCount, isKnot, crossingNumber, seifertGenus,
  bridgeNumber, T_RANGE,
} from './torusKnotSurface'

export interface DrawOptions {
  p: number
  q: number
  radius?: number
  yaw?: number
  ramp?: string
  /** 显示四个不变量 */
  showInvariants?: boolean
}

export function drawTorusKnot(canvas: HTMLCanvasElement, opts: DrawOptions): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const { p, q, radius = 0.28, yaw = 0.6, ramp = 'viridis', showInvariants = false } = opts
  const { width: W, height: H } = canvas

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const cam = makeCamera({
    yaw, pitch: 0.32, scale: Math.min(W, H) * 0.32, cx: W / 2, cy: H / 2,
  })

  // 步数按 p·q 放大: 绕行圈数越多, 采样不足会让管面出现折角
  const steps = Math.min(520, 120 * Math.max(p, q))
  const grid = buildTubeGrid((t) => knotCurve(t, p, q), T_RANGE, radius, steps, 14)

  const { center, radius: rad } = bounds(grid.flat())
  const k = 1 / rad
  const norm = grid.map((row) => row.map((pt) => [
    (pt[0] - center[0]) * k, (pt[1] - center[1]) * k, (pt[2] - center[2]) * k,
  ] as Vec3))

  drawAxes3D(ctx, cam, 1.4)
  drawSurface(ctx, norm, cam, { ramp, colorBy: 'u', stroke: 'rgba(255,255,255,0.07)' })
  drawLabel(ctx, p, q, W, showInvariants)
}

function drawLabel(
  ctx: CanvasRenderingContext2D, p: number, q: number, W: number, showInv: boolean,
): void {
  const knot = isKnot(p, q)
  ctx.save()
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.font = 'bold 17px sans-serif'
  ctx.fillText(`(${p},${q}) 环面${knot ? '纽结' : '链环'}`, 18, 30)
  ctx.font = '13px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.62)'
  ctx.fillText(`绕 ${p} 圈经线 · ${q} 圈纬线`, 18, 52)
  ctx.textAlign = 'right'
  ctx.fillText(`分支数 gcd(${p},${q}) = ${componentCount(p, q)}`, W - 18, 30)
  if (showInv) {
    if (knot) {
      ctx.fillText(
        `交叉 ${crossingNumber(p, q)} · 亏格 ${seifertGenus(p, q)} · 桥 ${bridgeNumber(p, q)}`,
        W - 18, 52,
      )
    } else {
      // 链环时那三个公式不适用, 说清原因而不是显示 0
      ctx.fillText('非纽结, 交叉数/亏格/桥数公式不适用', W - 18, 52)
    }
  }
  ctx.restore()
}
