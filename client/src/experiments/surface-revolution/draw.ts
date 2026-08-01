/**
 * 旋转曲面的 Canvas 绘制
 *
 * 除曲面本身, 还要能单独高亮母线 —— 这是本实验的教学重点
 * (「换母线即换曲面」), 通用脚手架画不出来。
 */

import {
  makeCamera, sampleSurface, project, bounds, type Vec3,
} from '../../lib/proj3d'
import { drawSurface, drawAxes3D } from '../../lib/draw3d'
import {
  revolve, profile, profileRange, infoOf, lateralArea, revolvedVolume,
  U_RANGE, type ProfileKind,
} from './surfaceRevolution'

export interface DrawOptions {
  kind: ProfileKind
  yaw?: number
  ramp?: string
  /** 高亮母线(红色粗线) */
  showProfile?: boolean
  /** 在左下角显示面积/体积读数 */
  showMeasure?: boolean
  /** 只画部分角度, 用于演示「转出来」的过程。1 = 整圈 */
  sweep?: number
}

export function drawRevolution(canvas: HTMLCanvasElement, opts: DrawOptions): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const {
    kind, yaw = 0.6, ramp = 'viridis',
    showProfile = false, showMeasure = false, sweep = 1,
  } = opts
  const { width: W, height: H } = canvas

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const tRange = profileRange(kind)
  const uMax = U_RANGE[0] + (U_RANGE[1] - U_RANGE[0]) * Math.min(1, Math.max(0.02, sweep))
  const raw = sampleSurface((u, t) => revolve(kind, u, t), [U_RANGE[0], uMax], tRange, 72, 36)

  // 归一化用整圈的包围盒, 免得 sweep 变化时曲面忽大忽小
  const full = sampleSurface((u, t) => revolve(kind, u, t), U_RANGE, tRange, 24, 24)
  const { center, radius } = bounds(full.flat())
  const k = 1 / radius
  const grid: Vec3[][] = raw.map((row) =>
    row.map((p) => [(p[0] - center[0]) * k, (p[1] - center[1]) * k, (p[2] - center[2]) * k] as Vec3),
  )

  const cam = makeCamera({
    yaw, pitch: 0.3, scale: Math.min(W, H) * 0.36, cx: W / 2, cy: H / 2,
  })
  drawAxes3D(ctx, cam, 1.4)
  drawSurface(ctx, grid, cam, { ramp, colorBy: 'z', stroke: 'rgba(255,255,255,0.12)' })

  if (showProfile) drawProfileCurve(ctx, cam, kind, center, k)
  drawLabel(ctx, kind, W, showMeasure)
}

/** 把母线(u=0 那条参数线)单独描红 */
function drawProfileCurve(
  ctx: CanvasRenderingContext2D,
  cam: ReturnType<typeof makeCamera>,
  kind: ProfileKind,
  center: Vec3,
  k: number,
): void {
  const [t0, t1] = profileRange(kind)
  ctx.save()
  ctx.strokeStyle = 'rgba(248, 113, 113, 0.95)'
  ctx.lineWidth = 3
  ctx.beginPath()
  for (let i = 0; i <= 120; i++) {
    const t = t0 + ((t1 - t0) * i) / 120
    const { r, z } = profile(kind, t)
    const p: Vec3 = [(r - center[0]) * k, -center[1] * k, (z - center[2]) * k]
    const q = project(p, cam)
    if (i === 0) ctx.moveTo(q.x, q.y)
    else ctx.lineTo(q.x, q.y)
  }
  ctx.stroke()
  ctx.restore()
}

function drawLabel(
  ctx: CanvasRenderingContext2D, kind: ProfileKind, W: number, showMeasure: boolean,
): void {
  const info = infoOf(kind)
  ctx.save()
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.font = 'bold 17px sans-serif'
  ctx.fillText(info.label, 18, 30)
  ctx.font = '13px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.62)'
  ctx.fillText(`母线 ${info.curve}`, 18, 52)
  ctx.textAlign = 'right'
  ctx.fillText(info.note, W - 18, 30)
  if (showMeasure) {
    ctx.textAlign = 'left'
    const a = lateralArea(kind, 600)
    const v = revolvedVolume(kind, 600)
    ctx.fillText(`侧面积 ${a.toFixed(3)}   体积 ${v.toFixed(3)}`, 18, 74)
  }
  ctx.restore()
}
