/**
 * 管状曲面的 Canvas 绘制
 *
 * 除管面本身, 还要能画出中心曲线与 Frenet 标架 —— 这是本实验的教学重点
 * (「截面必须垂直于曲线且不能突然扭转」), 通用脚手架画不出来。
 */

import { makeCamera, project, bounds, type Camera, type Vec3 } from '../../lib/proj3d'
import { drawSurface, drawCurve3D, drawAxes3D } from '../../lib/draw3d'
import {
  tubeSurface, centerCurve, curveRange, frenetFrame, infoOf,
  THETA_RANGE, type CurveKind,
} from './tubeSurface'

export interface DrawOptions {
  kind: CurveKind
  radius?: number
  yaw?: number
  ramp?: string
  /** 高亮中心曲线 */
  showCenter?: boolean
  /** 在若干点上画出 Frenet 标架的三根轴 */
  showFrame?: boolean
  surfaceAlpha?: number
}

export function drawTube(canvas: HTMLCanvasElement, opts: DrawOptions): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const {
    kind, radius = 0.25, yaw = 0.6, ramp = 'ocean',
    showCenter = false, showFrame = false, surfaceAlpha = 1,
  } = opts
  const { width: W, height: H } = canvas

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const [t0, t1] = curveRange(kind)
  // 管面网格。Frenet 标架每点都要重算, 采样密度不宜过高
  const grid: Vec3[][] = []
  for (let i = 0; i <= 90; i++) {
    const t = t0 + ((t1 - t0) * i) / 90
    const row: Vec3[] = []
    for (let j = 0; j <= 20; j++) {
      const th = THETA_RANGE[0] + ((THETA_RANGE[1] - THETA_RANGE[0]) * j) / 20
      row.push(tubeSurface(kind, t, th, radius))
    }
    grid.push(row)
  }

  // 用管面包围盒归一化, 中心曲线与标架共用同一变换才能对齐
  const { center, radius: rad } = bounds(grid.flat())
  const k = 1 / rad
  const nz = (p: Vec3): Vec3 => [
    (p[0] - center[0]) * k, (p[1] - center[1]) * k, (p[2] - center[2]) * k,
  ]

  const cam = makeCamera({
    yaw, pitch: 0.3, scale: Math.min(W, H) * 0.36, cx: W / 2, cy: H / 2,
  })
  drawAxes3D(ctx, cam, 1.4)
  drawSurface(ctx, grid.map((r) => r.map(nz)), cam, {
    ramp,
    colorBy: 'z',
    stroke: surfaceAlpha < 1 ? null : 'rgba(255,255,255,0.1)',
    alpha: surfaceAlpha,
  })

  if (showCenter) {
    const pts: Vec3[] = []
    for (let i = 0; i <= 300; i++) {
      pts.push(nz(centerCurve(kind, t0 + ((t1 - t0) * i) / 300)))
    }
    drawCurve3D(ctx, pts, cam, { color: 'rgba(248,113,113,0.95)', width: 2.5 })
  }
  if (showFrame) drawFrames(ctx, cam, kind, nz, k)
  drawLabel(ctx, kind, W, radius)
}

/** 在若干采样点上画出 T(绿) N(红) B(蓝) 三根轴 */
function drawFrames(
  ctx: CanvasRenderingContext2D,
  cam: Camera,
  kind: CurveKind,
  nz: (p: Vec3) => Vec3,
  k: number,
): void {
  const [t0, t1] = curveRange(kind)
  const len = 0.32 / k
  ctx.save()
  ctx.lineWidth = 2
  for (let i = 1; i < 9; i++) {
    const t = t0 + ((t1 - t0) * i) / 9
    const c = centerCurve(kind, t)
    const { T, N, B } = frenetFrame(kind, t)
    const axes: Array<[Vec3, string]> = [
      [T, 'rgba(74,222,128,0.9)'], [N, 'rgba(248,113,113,0.9)'], [B, 'rgba(96,165,250,0.9)'],
    ]
    for (const [v, color] of axes) {
      const a = project(nz(c), cam)
      const b = project(nz([c[0] + v[0] * len, c[1] + v[1] * len, c[2] + v[2] * len]), cam)
      ctx.strokeStyle = color
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.stroke()
    }
  }
  ctx.restore()
}

function drawLabel(
  ctx: CanvasRenderingContext2D, kind: CurveKind, W: number, radius: number,
): void {
  const info = infoOf(kind)
  ctx.save()
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.font = 'bold 17px sans-serif'
  ctx.fillText(`${info.label} 上的管面`, 18, 30)
  ctx.font = '13px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.62)'
  ctx.fillText(`中心线 ${info.equation}   管半径 ${radius.toFixed(2)}`, 18, 52)
  ctx.textAlign = 'right'
  ctx.fillText(info.note, W - 18, 30)
  ctx.fillText('T 绿 · N 红 · B 蓝', W - 18, 52)
  ctx.restore()
}
