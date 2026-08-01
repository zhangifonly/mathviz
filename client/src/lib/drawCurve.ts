/**
 * 空间曲线的共享绘制层
 *
 * 四个曲线实验（Frenet 标架、维维亚尼、圆锥螺线、球面螺线）画面结构一致：
 * 曲线本体 + 可选的 Frenet 标架 + 可选的辅助曲面/投影 + 读数。抽到这里统一维护。
 *
 * 曲线用渐变着色（沿参数从冷到暖），这样在缠绕处能看出行进方向 ——
 * 单色曲线在自交与密绕处完全分不出先后。
 */

import { makeCamera, normalizePoints, project, bounds, type Camera, type Vec3 } from './proj3d'
import { drawCurve3D, drawAxes3D } from './draw3d'
import { sample, frenet, type Curve3D } from './curve3d'

export interface CurveDrawOptions {
  curve: Curve3D
  tRange: [number, number]
  title: string
  /** 副标题/参数说明 */
  subtitle?: string
  yaw?: number
  ramp?: string
  /** 采样点数 */
  steps?: number
  /** 生长动画进度 0~1 */
  progress?: number
  /** 在若干点上画 Frenet 标架（T 绿 N 红 B 蓝） */
  showFrames?: number
  /** 右上角额外读数 */
  readout?: string
  /** 把曲线投影到底面（灰线），用于展示投影关系 */
  showProjection?: boolean
}

export function drawSpaceCurve(canvas: HTMLCanvasElement, opts: CurveDrawOptions): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const {
    curve, tRange, title, subtitle = '', yaw = 0.6, ramp = 'plasma',
    steps = 700, progress = 1, showFrames = 0, readout = '',
    showProjection = false,
  } = opts
  const { width: W, height: H } = canvas

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0a0f1e'
  ctx.fillRect(0, 0, W, H)

  const raw = sample(curve, tRange[0], tRange[1], steps)
  // 归一化的中心与系数要拿出来复用: 标架与投影必须与曲线共用同一变换才对齐
  const { center, radius } = bounds(raw)
  const k = 1 / Math.max(1e-9, radius)
  const nz = (p: Vec3): Vec3 => [
    (p[0] - center[0]) * k, (p[1] - center[1]) * k, (p[2] - center[2]) * k,
  ]
  const pts = raw.map(nz)

  const cam = makeCamera({
    yaw, pitch: 0.3, scale: Math.min(W, H) * 0.34, cx: W / 2, cy: H / 2,
  })
  drawAxes3D(ctx, cam, 1.35)

  if (showProjection) {
    // 压到 z = 最低点的高度, 形成"影子"
    const zMin = Math.min(...pts.map((p) => p[2]))
    const shadow = pts.map((p) => [p[0], p[1], zMin] as Vec3)
    drawCurve3D(ctx, shadow, cam, { color: 'rgba(148,163,184,0.5)', width: 1, progress })
  }

  drawCurve3D(ctx, pts, cam, { width: 1.8, progress, ramp })

  if (showFrames > 0) drawFrames(ctx, cam, curve, tRange, showFrames, nz, k)
  drawLabel(ctx, W, title, subtitle, readout)
}

/** 在若干采样点上画 T(绿) N(红) B(蓝) 三根轴 */
function drawFrames(
  ctx: CanvasRenderingContext2D,
  cam: Camera,
  curve: Curve3D,
  tRange: [number, number],
  count: number,
  nz: (p: Vec3) => Vec3,
  k: number,
): void {
  const len = 0.3 / k
  ctx.save()
  ctx.lineWidth = 2
  for (let i = 1; i <= count; i++) {
    const t = tRange[0] + ((tRange[1] - tRange[0]) * i) / (count + 1)
    const c = curve(t)
    const { T, N, B } = frenet(curve, t)
    const axes: Array<[Vec3, string]> = [
      [T, 'rgba(74,222,128,0.95)'],
      [N, 'rgba(248,113,113,0.95)'],
      [B, 'rgba(96,165,250,0.95)'],
    ]
    const o = project(nz(c), cam)
    for (const [v, color] of axes) {
      const tip = project(nz([c[0] + v[0] * len, c[1] + v[1] * len, c[2] + v[2] * len]), cam)
      ctx.strokeStyle = color
      ctx.beginPath()
      ctx.moveTo(o.x, o.y)
      ctx.lineTo(tip.x, tip.y)
      ctx.stroke()
    }
  }
  ctx.restore()
}

function drawLabel(
  ctx: CanvasRenderingContext2D,
  W: number,
  title: string,
  subtitle: string,
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
  if (readout) {
    ctx.font = '13px sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.62)'
    ctx.textAlign = 'right'
    ctx.fillText(readout, W - 18, 30)
  }
  ctx.restore()
}

/** 归一化后的点集，供外部需要时复用 */
export function normalizedSamples(
  curve: Curve3D, tRange: [number, number], steps = 700,
): Vec3[] {
  return normalizePoints(sample(curve, tRange[0], tRange[1], steps))
}
