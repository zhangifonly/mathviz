/**
 * 猴鞍面的 Canvas 绘制
 *
 * 除曲面本身, 还要能标出各个上坡与下坡的方向(「猴鞍」得名的由来, 也是
 * 三重对称的直观体现), 并显示原点处 Hesse 行列式说明判别法是否失效。
 */

import { makeCamera, sampleSurface, project, bounds } from '../../lib/proj3d'
import type { Camera, Vec3 } from '../../lib/proj3d'
import { drawSurface, drawAxes3D } from '../../lib/draw3d'
import { monkeySaddle, polarForm, hessianDet, U_RANGE, V_RANGE } from './monkeySaddle'

export interface DrawOptions {
  order: number
  yaw?: number
  ramp?: string
  /** 标出上坡(红)与下坡(蓝)方向 */
  showSlopes?: boolean
  /** 显示原点处 Hesse 行列式, 说明二阶判别法是否失效 */
  showHessian?: boolean
}

export function drawMonkeySaddle(canvas: HTMLCanvasElement, opts: DrawOptions): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const {
    order, yaw = 0.6, ramp = 'coolwarm', showSlopes = false, showHessian = false,
  } = opts
  const { width: W, height: H } = canvas

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const cam = makeCamera({
    yaw, pitch: 0.34, scale: Math.min(W, H) * 0.34, cx: W / 2, cy: H / 2,
  })

  const raw = sampleSurface((x, y) => monkeySaddle(x, y, order), U_RANGE, V_RANGE, 56, 56)
  // 归一化的中心与系数要拿出来复用: 坡向标记必须与曲面共用同一套变换才对齐
  const { center, radius } = bounds(raw.flat())
  const k = 1 / radius
  const nz = (p: Vec3): Vec3 => [
    (p[0] - center[0]) * k, (p[1] - center[1]) * k, (p[2] - center[2]) * k,
  ]

  drawAxes3D(ctx, cam, 1.35)
  drawSurface(ctx, raw.map((r) => r.map(nz)), cam, {
    ramp, colorBy: 'z', stroke: 'rgba(255,255,255,0.1)',
  })

  if (showSlopes) drawSlopeMarks(ctx, cam, order, nz)
  drawLabel(ctx, opts, W, showHessian)
}

/** order 重鞍面有 order 个上坡与 order 个下坡, 相邻方向相差 π/order */
function drawSlopeMarks(
  ctx: CanvasRenderingContext2D,
  cam: Camera,
  order: number,
  nz: (p: Vec3) => Vec3,
): void {
  ctx.save()
  ctx.lineWidth = 2.5
  ctx.font = 'bold 12px sans-serif'
  const origin = project(nz([0, 0, 0]), cam)
  for (let i = 0; i < 2 * order; i++) {
    const th = (Math.PI * i) / order
    const r = 1.1
    const up = polarForm(1, th, order) > 0
    const q = project(nz([r * Math.cos(th), r * Math.sin(th), polarForm(r, th, order)]), cam)
    ctx.strokeStyle = up ? 'rgba(248,113,113,0.9)' : 'rgba(96,165,250,0.9)'
    ctx.fillStyle = ctx.strokeStyle
    ctx.beginPath()
    ctx.moveTo(origin.x, origin.y)
    ctx.lineTo(q.x, q.y)
    ctx.stroke()
    ctx.fillText(up ? '上' : '下', q.x + 3, q.y - 3)
  }
  ctx.restore()
}

function drawLabel(
  ctx: CanvasRenderingContext2D, o: DrawOptions, W: number, showHessian: boolean,
): void {
  const names: Record<number, string> = { 2: '普通鞍面', 3: '猴鞍面', 4: '四重鞍面' }
  ctx.save()
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.font = 'bold 17px sans-serif'
  ctx.fillText(names[o.order] ?? `${o.order} 重鞍面`, 18, 30)
  ctx.font = '13px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.62)'
  ctx.fillText(`z = Re((x+iy)^${o.order}) = r^${o.order}·cos ${o.order}θ`, 18, 52)
  ctx.textAlign = 'right'
  ctx.fillText(`${o.order} 个上坡 · ${o.order} 个下坡`, W - 18, 30)
  if (showHessian) {
    const det = hessianDet(0, 0, o.order)
    const tag = Math.abs(det) < 1e-6 ? '二阶判别法失效' : '二阶判别法有效'
    ctx.fillText(`原点 Hesse 行列式 ${det.toFixed(3)} · ${tag}`, W - 18, 52)
  }
  ctx.restore()
}
