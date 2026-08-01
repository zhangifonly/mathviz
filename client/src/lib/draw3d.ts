/**
 * Canvas 2D 上的 3D 绘制工具
 *
 * 讲解层(SceneRenderer)不能用 react-plotly.js: 每个 Plot 都要占一个 WebGL
 * 上下文, 浏览器上限约 16 个, 且 rAF 逐帧驱动旋转时 Plotly 重绘开销过大。
 * 这里用纯 Canvas 2D + 画家算法实现曲面/曲线/点云/坐标轴, 零依赖、可逐帧转。
 *
 * 配套纯数学部分见 proj3d.ts, 本文件只负责往 canvas 上落笔。
 */

import {
  type Camera, type Vec3, type Quad, project, rotate, buildQuads, depthSortQuads,
  shade, rampColor,
} from './proj3d'

export interface SurfaceStyle {
  /** 配色带名, 见 proj3d.RAMPS */
  ramp?: string
  /** 着色依据: z 高度 / 到原点距离 / 网格 u 向 */
  colorBy?: 'z' | 'radius' | 'u'
  /** 网格线颜色, 传 null 不画线 */
  stroke?: string | null
  /** 不透明度 */
  alpha?: number
}

/** 画一张参数曲面。grid 为 (rows × cols) 的三维点阵 */
export function drawSurface(
  ctx: CanvasRenderingContext2D,
  grid: Vec3[][],
  cam: Camera,
  style: SurfaceStyle = {},
): void {
  const { ramp = 'viridis', colorBy = 'z', stroke = 'rgba(0,0,0,0.12)', alpha = 1 } = style
  const quads = depthSortQuads(buildQuads(grid), cam)
  if (quads.length === 0) return

  // 着色标量的取值范围, 用于把 value 映射到配色带 [0,1]
  const vals = quads.map(q => scalarOf(q, colorBy))
  const lo = Math.min(...vals)
  const hi = Math.max(...vals)
  const span = hi - lo || 1

  ctx.save()
  ctx.globalAlpha = alpha
  ctx.lineJoin = 'round'
  quads.forEach((q, i) => {
    const t = (vals[i] - lo) / span
    ctx.beginPath()
    q.corners.forEach((c, k) => {
      const p = project(c, cam)
      if (k === 0) ctx.moveTo(p.x, p.y)
      else ctx.lineTo(p.x, p.y)
    })
    ctx.closePath()
    ctx.fillStyle = rampColor(t, ramp, shade(q.normal))
    ctx.fill()
    if (stroke) {
      ctx.strokeStyle = stroke
      ctx.lineWidth = 0.5
      ctx.stroke()
    }
  })
  ctx.restore()
}

function scalarOf(q: Quad, colorBy: 'z' | 'radius' | 'u'): number {
  const c = q.center
  if (colorBy === 'radius') return Math.hypot(c[0], c[1], c[2])
  if (colorBy === 'u') return q.u
  return c[2]
}

/** 画一条空间曲线。可传 progress∈[0,1] 只画前一段(用于生长动画) */
export function drawCurve3D(
  ctx: CanvasRenderingContext2D,
  pts: Vec3[],
  cam: Camera,
  opts: { color?: string; width?: number; progress?: number; ramp?: string } = {},
): void {
  const { color = '#4f46e5', width = 2, progress = 1, ramp } = opts
  const n = Math.max(2, Math.floor(pts.length * Math.min(1, Math.max(0, progress))))
  if (n < 2) return
  ctx.save()
  ctx.lineWidth = width
  ctx.lineCap = 'round'
  if (!ramp) {
    ctx.strokeStyle = color
    ctx.beginPath()
    for (let i = 0; i < n; i++) {
      const p = project(pts[i], cam)
      if (i === 0) ctx.moveTo(p.x, p.y)
      else ctx.lineTo(p.x, p.y)
    }
    ctx.stroke()
  } else {
    // 渐变着色需逐段画, 每段单独设色
    for (let i = 1; i < n; i++) {
      const a = project(pts[i - 1], cam)
      const b = project(pts[i], cam)
      ctx.strokeStyle = rampColor(i / (pts.length - 1), ramp)
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.stroke()
    }
  }
  ctx.restore()
}

/** 画点云。远处的点先画、半径略小, 靠透视自然分出前后 */
export function drawPoints3D(
  ctx: CanvasRenderingContext2D,
  pts: Vec3[],
  cam: Camera,
  opts: { color?: string | ((i: number) => string); radius?: number } = {},
): void {
  const { color = '#ef4444', radius = 3 } = opts
  // 按相机深度从远到近排序, 近处的点覆盖远处的点
  const order = pts
    .map((p, i) => ({ i, d: rotate(p, cam.yaw, cam.pitch)[1] }))
    .sort((a, b) => b.d - a.d)
  ctx.save()
  for (const { i } of order) {
    const p = project(pts[i], cam)
    ctx.fillStyle = typeof color === 'function' ? color(i) : color
    ctx.beginPath()
    // f 是透视系数, 近大远小
    ctx.arc(p.x, p.y, Math.max(0.5, radius * p.f), 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

/** 画三根带箭头与标签的坐标轴 */
export function drawAxes3D(
  ctx: CanvasRenderingContext2D,
  cam: Camera,
  len = 1.2,
  labels: [string, string, string] = ['x', 'y', 'z'],
): void {
  const axes: Array<{ v: Vec3; c: string; t: string }> = [
    { v: [len, 0, 0], c: '#dc2626', t: labels[0] },
    { v: [0, len, 0], c: '#16a34a', t: labels[1] },
    { v: [0, 0, len], c: '#2563eb', t: labels[2] },
  ]
  const o = project([0, 0, 0], cam)
  ctx.save()
  ctx.lineWidth = 1.5
  ctx.font = '13px sans-serif'
  for (const { v, c, t } of axes) {
    const p = project(v, cam)
    ctx.strokeStyle = c
    ctx.fillStyle = c
    ctx.beginPath()
    ctx.moveTo(o.x, o.y)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
    ctx.fillText(t, p.x + 4, p.y - 4)
  }
  ctx.restore()
}

/** 画线框(只描边不填充), 适合展示网格结构本身 */
export function drawWireframe(
  ctx: CanvasRenderingContext2D,
  grid: Vec3[][],
  cam: Camera,
  color = '#4f46e5',
): void {
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = 0.8
  const rows = grid.length
  const cols = grid[0]?.length ?? 0
  // 先画 u 向的线, 再画 v 向的线
  for (let i = 0; i < rows; i++) {
    ctx.beginPath()
    for (let j = 0; j < cols; j++) {
      const p = project(grid[i][j], cam)
      if (j === 0) ctx.moveTo(p.x, p.y)
      else ctx.lineTo(p.x, p.y)
    }
    ctx.stroke()
  }
  for (let j = 0; j < cols; j++) {
    ctx.beginPath()
    for (let i = 0; i < rows; i++) {
      const p = project(grid[i][j], cam)
      if (i === 0) ctx.moveTo(p.x, p.y)
      else ctx.lineTo(p.x, p.y)
    }
    ctx.stroke()
  }
  ctx.restore()
}
