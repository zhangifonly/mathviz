/**
 * 抛物线与光学 Canvas 绘制
 *
 * 画出抛物线、焦点、准线，以及一束平行于对称轴的入射光线，
 * 经抛物面反射后全部汇聚到焦点，直观展示反射（聚焦）性质。
 */

import {
  parabolaY,
  focus,
  directrixY,
  reflectVertical,
} from './parabolaOptics'

export interface ParabolaDrawData {
  /** 焦准距 p */
  p: number
  /** 入射光线条数 */
  rays: number
}

/**
 * @param canvas 目标画布
 * @param data 抛物线参数与光线数
 * @param progress 0→1 控制光线自上而下推进的动画进度
 */
export function drawParabolaOptics(
  canvas: HTMLCanvasElement,
  data: ParabolaDrawData,
  progress: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const { p, rays } = data
  // 数学坐标范围：x ∈ [-xMax, xMax]，y ∈ [yMin, yMax]
  const xMax = 4
  const yMin = -1.5
  const yMax = parabolaY(xMax, p) + 0.5
  // 坐标映射（数学 → 屏幕像素）
  const pad = 40
  const sx = (x: number) => pad + ((x + xMax) / (2 * xMax)) * (W - 2 * pad)
  const sy = (y: number) => H - pad - ((y - yMin) / (yMax - yMin)) * (H - 2 * pad)

  drawAxes(ctx, sx, sy, xMax, yMin, yMax)
  drawDirectrix(ctx, sx, sy, p, xMax)
  drawParabola(ctx, sx, sy, p, xMax)
  drawRays(ctx, sx, sy, p, rays, xMax, yMax, progress)
  drawFocus(ctx, sx, sy, p)
}

/** 坐标轴与顶点 */
function drawAxes(
  ctx: CanvasRenderingContext2D,
  sx: (x: number) => number,
  sy: (y: number) => number,
  xMax: number,
  yMin: number,
  yMax: number,
) {
  ctx.strokeStyle = 'rgba(148,163,184,0.35)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(sx(0), sy(yMin))
  ctx.lineTo(sx(0), sy(yMax))
  ctx.moveTo(sx(-xMax), sy(0))
  ctx.lineTo(sx(xMax), sy(0))
  ctx.stroke()
}

/** 准线（水平虚线 y=-p） */
function drawDirectrix(
  ctx: CanvasRenderingContext2D,
  sx: (x: number) => number,
  sy: (y: number) => number,
  p: number,
  xMax: number,
) {
  const dy = directrixY(p)
  ctx.save()
  ctx.strokeStyle = '#f87171'
  ctx.setLineDash([6, 5])
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(sx(-xMax), sy(dy))
  ctx.lineTo(sx(xMax), sy(dy))
  ctx.stroke()
  ctx.restore()
  ctx.fillStyle = '#f87171'
  ctx.font = '13px sans-serif'
  ctx.fillText('准线 y = -p', sx(-xMax) + 6, sy(dy) - 6)
}

/** 抛物线本体 */
function drawParabola(
  ctx: CanvasRenderingContext2D,
  sx: (x: number) => number,
  sy: (y: number) => number,
  p: number,
  xMax: number,
) {
  ctx.strokeStyle = '#38bdf8'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  const steps = 200
  for (let i = 0; i <= steps; i++) {
    const x = -xMax + (2 * xMax * i) / steps
    const y = parabolaY(x, p)
    if (i === 0) ctx.moveTo(sx(x), sy(y))
    else ctx.lineTo(sx(x), sy(y))
  }
  ctx.stroke()
}

/** 焦点标记 */
function drawFocus(
  ctx: CanvasRenderingContext2D,
  sx: (x: number) => number,
  sy: (y: number) => number,
  p: number,
) {
  const f = focus(p)
  ctx.fillStyle = '#fbbf24'
  ctx.beginPath()
  ctx.arc(sx(f.x), sy(f.y), 6, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#fde68a'
  ctx.font = 'bold 14px sans-serif'
  ctx.fillText('焦点 F', sx(f.x) + 10, sy(f.y) - 8)
}

/**
 * 竖直入射光线 + 反射线。progress 控制入射光从顶部下落的动画：
 * 光线先竖直向下走到抛物线，再沿反射方向射向焦点。
 */
function drawRays(
  ctx: CanvasRenderingContext2D,
  sx: (x: number) => number,
  sy: (y: number) => number,
  p: number,
  rays: number,
  xMax: number,
  yMax: number,
  progress: number,
) {
  const f = focus(p)
  for (let k = 0; k < rays; k++) {
    // 在 [-xMax*0.9, xMax*0.9] 均匀分布入射光的横坐标
    const t = rays === 1 ? 0.5 : k / (rays - 1)
    const x = -xMax * 0.9 + t * (2 * xMax * 0.9)
    const yHit = parabolaY(x, p)
    // 入射段：从顶部下落到命中点，长度随 progress 增长
    const yStart = yMax
    const yCur = yStart - (yStart - yHit) * Math.min(1, progress * 1.6)
    ctx.strokeStyle = 'rgba(250,204,21,0.55)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(sx(x), sy(yStart))
    ctx.lineTo(sx(x), sy(yCur))
    ctx.stroke()
    // 反射段：progress 后半程从命中点射向焦点
    if (progress > 0.62) {
      const rp = Math.min(1, (progress - 0.62) / 0.38)
      const r = reflectVertical(x, p)
      // 命中点到焦点的距离，作为反射线长度
      const dist = Math.hypot(f.x - x, f.y - yHit)
      const ex = x + r.x * dist * rp
      const ey = yHit + r.y * dist * rp
      ctx.strokeStyle = '#fbbf24'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(sx(x), sy(yHit))
      ctx.lineTo(sx(ex), sy(ey))
      ctx.stroke()
    }
  }
}
