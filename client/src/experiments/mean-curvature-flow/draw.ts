/**
 * 平均曲率流的 Canvas 绘制
 *
 * 这个实验的核心是**时间演化**, 所以绘制函数接收「已演化到某时刻的母线」
 * 而不是自己算 —— 演化状态由调用方持有, 才能逐帧推进而不每帧从头重算。
 */

import { makeCamera, sampleSurface, normalizeGrid, type Vec3 } from '../../lib/proj3d'
import { drawSurface, drawAxes3D } from '../../lib/draw3d'
import { profileVolume, profileArea, infoOf, type ShapeKind } from './meanCurvatureFlow'

export interface DrawOptions {
  /** 当前时刻的母线半径数组 */
  profile: number[]
  kind: ShapeKind
  /** 已演化的时间, 仅用于显示 */
  time?: number
  yaw?: number
  ramp?: string
  /** 显示体积与面积读数(应单调减少) */
  showMeasure?: boolean
}

export function drawFlow(canvas: HTMLCanvasElement, opts: DrawOptions): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const {
    profile, kind, time = 0, yaw = 0.6, ramp = 'coolwarm', showMeasure = false,
  } = opts
  const { width: W, height: H } = canvas

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const cam = makeCamera({
    yaw, pitch: 0.3, scale: Math.min(W, H) * 0.36, cx: W / 2, cy: H / 2,
  })

  const n = profile.length
  // 母线绕 z 轴旋转成面。u 为绕轴角, i 为母线下标
  const grid = normalizeGrid(
    sampleSurface(
      (u, s) => {
        // s∈[0,1] 映到母线下标, 线性插值避免锯齿
        const x = s * (n - 1)
        const i = Math.min(n - 2, Math.floor(x))
        const f = x - i
        const r = profile[i] * (1 - f) + profile[i + 1] * f
        const z = -1 + 2 * s
        return [r * Math.cos(u), r * Math.sin(u), z] as Vec3
      },
      [0, 2 * Math.PI], [0, 1], 72, Math.min(80, n),
    ),
  )

  drawAxes3D(ctx, cam, 1.35)
  drawSurface(ctx, grid, cam, { ramp, colorBy: 'radius', stroke: 'rgba(255,255,255,0.1)' })
  drawLabel(ctx, W, showMeasure, time, kind, profile)
}

function drawLabel(
  ctx: CanvasRenderingContext2D,
  W: number,
  showMeasure: boolean,
  time: number,
  kind: ShapeKind,
  profile: number[],
): void {
  const info = infoOf(kind)
  const dz = 2 / (profile.length - 1)
  ctx.save()
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.font = 'bold 17px sans-serif'
  ctx.fillText(`${info.label} · 平均曲率流`, 18, 30)
  ctx.font = '13px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.62)'
  ctx.fillText(`t = ${time.toFixed(4)}   ∂X/∂t = −H·N`, 18, 52)
  ctx.textAlign = 'right'
  ctx.fillText(info.note, W - 18, 30)
  if (showMeasure) {
    const v = profileVolume(profile, dz)
    const a = profileArea(profile, dz)
    ctx.fillText(`体积 ${v.toFixed(4)}   面积 ${a.toFixed(4)}`, W - 18, 52)
  }
  ctx.restore()
}
