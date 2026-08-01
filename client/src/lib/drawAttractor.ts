/**
 * 三维吸引子的共享绘制层
 *
 * 六个吸引子实验的画面结构完全一致: 轨道曲线 + 坐标轴 + 诊断读数,
 * 差别只在方程与参数标签。抽到这里统一维护。
 *
 * 轨道用渐变着色(沿时间从冷到暖), 这样能看出轨道的行进方向 ——
 * 单色曲线在缠绕处完全看不出先后。
 */

import { makeCamera, normalizePoints, type Vec3 } from './proj3d'
import { drawCurve3D, drawAxes3D } from './draw3d'
import { orbit, lyapunovExponent, divergence, type Field3D } from './attractor3d'

export interface AttractorDrawOptions {
  /** 标题(吸引子名) */
  title: string
  /** 参数说明, 如 "α=15.6 β=28" */
  paramLabel: string
  yaw?: number
  ramp?: string
  /** 轨道生长动画的进度 0~1 */
  progress?: number
  /**
   * 传入 field 与 start 时额外显示 λ₁ 与散度 —— 判断混沌的严格判据。
   * 不传则只画轨道(λ₁ 计算要跑上万步 RK4, 不宜每帧都算)。
   */
  field?: Field3D
  start?: Vec3
  showDiagnostics?: boolean
}

/**
 * 画一个吸引子: 先积分出轨道再画。
 *
 * ⚠️ 轨道每帧重算代价高(RK4 数万步), 逐帧动画应改用 drawOrbit 并把轨道
 * 缓存在调用方, 只在参数变化时重算。
 */
export function drawAttractorField(
  canvas: HTMLCanvasElement,
  field: Field3D,
  start: Vec3,
  opts: AttractorDrawOptions,
  integ: { dt?: number; steps?: number; skip?: number } = {},
): void {
  const { dt = 0.005, steps = 12000, skip = 2000 } = integ
  drawOrbit(canvas, orbit(field, { start, dt, steps, skip }), { ...opts, field, start })
}

/** 已有轨道点集时直接画, 避免每帧重新积分 */
export function drawOrbit(
  canvas: HTMLCanvasElement,
  pts: Vec3[],
  opts: AttractorDrawOptions,
): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const {
    title, paramLabel, yaw = 0.6, ramp = 'plasma',
    showDiagnostics = false, progress = 1, field, start,
  } = opts
  const { width: W, height: H } = canvas

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0a0f1e'
  ctx.fillRect(0, 0, W, H)

  const cam = makeCamera({
    yaw, pitch: 0.28, scale: Math.min(W, H) * 0.34, cx: W / 2, cy: H / 2,
  })
  drawAxes3D(ctx, cam, 1.35)

  if (pts.length > 1) {
    // 归一化后同一套相机参数对所有吸引子通用(它们的坐标量级差异很大)
    drawCurve3D(ctx, normalizePoints(pts), cam, { width: 1.1, progress, ramp })
  }

  drawLabel(ctx, W, title, paramLabel, showDiagnostics, field, start, pts.length)
}

function drawLabel(
  ctx: CanvasRenderingContext2D,
  W: number,
  title: string,
  paramLabel: string,
  showDiag: boolean,
  field: Field3D | undefined,
  start: Vec3 | undefined,
  pointCount: number,
): void {
  ctx.save()
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.font = 'bold 17px sans-serif'
  ctx.fillText(title, 18, 30)
  ctx.font = '13px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.62)'
  ctx.fillText(paramLabel, 18, 52)
  ctx.textAlign = 'right'
  ctx.fillText(`轨道点数 ${pointCount}`, W - 18, 30)
  if (showDiag && field && start) {
    // λ₁ > 0 才是混沌的严格判据, 不能靠画面看着乱就下结论
    const l = lyapunovExponent(field, start, 0.005, 8000)
    const d = divergence(field, start)
    const tag = l > 0.005 ? '混沌' : l < -0.005 ? '收敛' : '临界'
    ctx.fillText(`λ₁ = ${l.toFixed(4)} (${tag})   ∇·f = ${d.toFixed(3)}`, W - 18, 52)
  }
  ctx.restore()
}
