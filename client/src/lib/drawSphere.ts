/**
 * 球面几何的共享绘制层
 *
 * 球面实验的画面结构：半透明球体 + 经纬网格 + 大圆弧 + 三角形填充区。
 * 关键是**背面剔除**：球面上朝背面的元素要么不画要么淡化，
 * 否则前后重叠成一团糊，完全看不出立体感。
 */

import { makeCamera, project, type Camera, type Vec3 } from './proj3d'
import {
  fromLatLon, greatCircleArc, dot, unit, triangleCentroid,
  type SphericalTriangle,
} from './sphere3d'

export interface SphereDrawOptions {
  title?: string
  subtitle?: string
  yaw?: number
  pitch?: number
  /** 要画的球面三角形 */
  triangle?: SphericalTriangle
  /** 额外的大圆（法向量列表） */
  greatCircles?: Vec3[]
  /** 显示经纬网格 */
  showGrid?: boolean
  /** 三角形填充色 */
  fill?: string
  /** 右上角读数 */
  readout?: string
  /** 顶点标签 */
  labels?: [string, string, string]
}

const R_SCREEN = 0.42

export function drawSphereScene(
  canvas: HTMLCanvasElement, opts: SphereDrawOptions,
): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const {
    title = '', subtitle = '', yaw = 0.6, pitch = 0.3,
    triangle, greatCircles = [], showGrid = true,
    fill = 'rgba(251, 191, 36, 0.42)', readout = '', labels,
  } = opts
  const { width: W, height: H } = canvas

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0a0f1e'
  ctx.fillRect(0, 0, W, H)

  const scale = Math.min(W, H) * R_SCREEN
  const cam = makeCamera({ yaw, pitch, scale, cx: W / 2, cy: H / 2 })
  // 视线方向：判断某点在正面还是背面。相机朝原点看，
  // 点的深度越小越靠前，故用 project 的 depth 做判据。
  const isFront = (p: Vec3): boolean => project(unit(p), cam).depth < 0

  drawGlobe(ctx, W, H, scale)
  if (showGrid) drawGraticule(ctx, cam, isFront)
  for (const n of greatCircles) drawGreatCircleCurve(ctx, cam, n, isFront)
  if (triangle) drawTriangle(ctx, cam, triangle, fill, isFront, labels)
  drawLabel(ctx, W, title, subtitle, readout)
}

/** 球体本身画成一个带径向渐变的圆盘，给出体积感 */
function drawGlobe(
  ctx: CanvasRenderingContext2D, W: number, H: number, scale: number,
): void {
  const cx = W / 2
  const cy = H / 2
  const g = ctx.createRadialGradient(
    cx - scale * 0.3, cy - scale * 0.3, scale * 0.1, cx, cy, scale,
  )
  g.addColorStop(0, 'rgba(56, 89, 140, 0.55)')
  g.addColorStop(1, 'rgba(15, 23, 42, 0.9)')
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, scale, 0, Math.PI * 2)
  ctx.fillStyle = g
  ctx.fill()
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)'
  ctx.lineWidth = 1.2
  ctx.stroke()
  ctx.restore()
}

/** 经纬网格。背面的线淡化而不隐藏，保留「透过球体看见」的效果 */
function drawGraticule(
  ctx: CanvasRenderingContext2D, cam: Camera, isFront: (p: Vec3) => boolean,
): void {
  ctx.save()
  ctx.lineWidth = 0.8
  // 纬线
  for (let k = -4; k <= 4; k++) {
    const lat = (k * Math.PI) / 10
    drawPolyline(ctx, cam, sampleLat(lat), isFront,
      'rgba(148,163,184,0.4)', 'rgba(148,163,184,0.12)')
  }
  // 经线
  for (let k = 0; k < 8; k++) {
    const lon = (k * Math.PI) / 4
    drawPolyline(ctx, cam, sampleLon(lon), isFront,
      'rgba(148,163,184,0.35)', 'rgba(148,163,184,0.1)')
  }
  ctx.restore()
}

function sampleLat(lat: number, steps = 72): Vec3[] {
  const out: Vec3[] = []
  for (let i = 0; i <= steps; i++) out.push(fromLatLon(lat, (2 * Math.PI * i) / steps))
  return out
}

function sampleLon(lon: number, steps = 48): Vec3[] {
  const out: Vec3[] = []
  for (let i = 0; i <= steps; i++) {
    out.push(fromLatLon(-Math.PI / 2 + (Math.PI * i) / steps, lon))
  }
  return out
}

/** 分段画折线，正面与背面用不同颜色 */
function drawPolyline(
  ctx: CanvasRenderingContext2D,
  cam: Camera,
  pts: Vec3[],
  isFront: (p: Vec3) => boolean,
  frontColor: string,
  backColor: string,
  width = 0,
): void {
  let prevFront: boolean | null = null
  ctx.beginPath()
  for (let i = 0; i < pts.length; i++) {
    const f = isFront(pts[i])
    const s = project(unit(pts[i]), cam)
    if (prevFront === null || f !== prevFront) {
      // 换面时收笔重开, 避免正背面用同一颜色
      if (prevFront !== null) {
        ctx.strokeStyle = prevFront ? frontColor : backColor
        if (width) ctx.lineWidth = width
        ctx.stroke()
      }
      ctx.beginPath()
      ctx.moveTo(s.x, s.y)
      prevFront = f
    } else {
      ctx.lineTo(s.x, s.y)
    }
  }
  ctx.strokeStyle = prevFront ? frontColor : backColor
  if (width) ctx.lineWidth = width
  ctx.stroke()
}

function drawGreatCircleCurve(
  ctx: CanvasRenderingContext2D, cam: Camera, normalVec: Vec3,
  isFront: (p: Vec3) => boolean,
): void {
  const n = unit(normalVec)
  const ref: Vec3 = Math.abs(n[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0]
  const e1 = unit(crossOf(n, ref))
  const e2 = crossOf(n, e1)
  const pts: Vec3[] = []
  for (let i = 0; i <= 120; i++) {
    const a = (2 * Math.PI * i) / 120
    pts.push([
      e1[0] * Math.cos(a) + e2[0] * Math.sin(a),
      e1[1] * Math.cos(a) + e2[1] * Math.sin(a),
      e1[2] * Math.cos(a) + e2[2] * Math.sin(a),
    ])
  }
  drawPolyline(ctx, cam, pts, isFront,
    'rgba(96,165,250,0.95)', 'rgba(96,165,250,0.25)', 1.8)
}

function crossOf(a: Vec3, b: Vec3): Vec3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
}

/**
 * 画球面三角形：先用大圆弧网格填充内部（沿两条边插值），再描三条边。
 * 直接用多边形填充会把球面的弯曲吃掉，看起来像平面三角形。
 */
function drawTriangle(
  ctx: CanvasRenderingContext2D,
  cam: Camera,
  t: SphericalTriangle,
  fill: string,
  isFront: (p: Vec3) => boolean,
  labels?: [string, string, string],
): void {
  const N = 26
  ctx.save()
  ctx.fillStyle = fill
  // 把重心坐标网格铺满内部。
  // ⚠️ 每个格子要画**两个**小三角片(上三角 + 下三角), 只画一个会留下
  // 网格状缝隙 —— 截图里看得很明显, 是视觉检查才发现的。
  const P = (u: number, v: number) => baryPoint(t, u, v)
  const emit = (a: Vec3, b: Vec3, c: Vec3) => {
    // 按小片**中心**判正背面。
    // ⚠️ 不能用「三点全在背面才跳过」: 那样跨越轮廓线的片会被放行,
    // 背面的三角形就透到正面来了 —— 截图里左侧那片黄色就是这么来的。
    const mid = unit([
      (a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3, (a[2] + b[2] + c[2]) / 3,
    ])
    if (!isFront(mid)) return
    const s1 = project(a, cam)
    const s2 = project(b, cam)
    const s3 = project(c, cam)
    ctx.beginPath()
    ctx.moveTo(s1.x, s1.y)
    ctx.lineTo(s2.x, s2.y)
    ctx.lineTo(s3.x, s3.y)
    ctx.closePath()
    ctx.fill()
  }
  for (let i = 0; i < N; i++) {
    for (let j = 0; i + j < N; j++) {
      const u0 = i / N
      const u1 = (i + 1) / N
      const v0 = j / N
      const v1 = (j + 1) / N
      // 上三角: 总在域内
      emit(P(u0, v0), P(u1, v0), P(u0, v1))
      // 下三角: 仅当 (u1,v1) 仍在 u+v≤1 内
      if (i + j + 2 <= N) emit(P(u1, v0), P(u1, v1), P(u0, v1))
    }
  }
  // 三条边
  const edges: Array<[Vec3, Vec3]> = [[t.A, t.B], [t.B, t.C], [t.C, t.A]]
  for (const [p, q] of edges) {
    drawPolyline(ctx, cam, greatCircleArc(p, q, 60), isFront,
      'rgba(251,191,36,1)', 'rgba(251,191,36,0.3)', 2.6)
  }
  // 顶点
  const verts: Vec3[] = [t.A, t.B, t.C]
  verts.forEach((v, idx) => {
    const s = project(unit(v), cam)
    const front = isFront(v)
    ctx.beginPath()
    ctx.arc(s.x, s.y, front ? 5 : 3, 0, Math.PI * 2)
    ctx.fillStyle = front ? 'rgba(253,224,71,1)' : 'rgba(253,224,71,0.35)'
    ctx.fill()
    if (labels && front) {
      ctx.fillStyle = 'rgba(255,255,255,0.95)'
      ctx.font = 'bold 15px sans-serif'
      ctx.fillText(labels[idx], s.x + 9, s.y - 7)
    }
  })
  ctx.restore()
}

/**
 * 三角形内部的重心坐标点：unit(αA + βB + γC)，其中 α=1−u−v。
 *
 * ⚠️ 不要用「先沿 A→B 走 u，再朝 C 走 v/(1−u)」那种两步 slerp：
 * 它在 u=1 处会把 v/(1−u) 算成 v/0，退化到 C 而不是 B。
 * 我第一版就是这么写的，(1,0) 给出 C 而非 B，是数值检验抓出来的。
 *
 * 归一化重心坐标虽然不是等距参数化（内部点分布略不均匀），
 * 但三个角点精确对应 A/B/C，且填充无缝，用来铺色足够。
 */
function baryPoint(t: SphericalTriangle, u: number, v: number): Vec3 {
  const a = 1 - u - v
  return unit([
    a * t.A[0] + u * t.B[0] + v * t.C[0],
    a * t.A[1] + u * t.B[1] + v * t.C[1],
    a * t.A[2] + u * t.B[2] + v * t.C[2],
  ])
}

function drawLabel(
  ctx: CanvasRenderingContext2D, W: number,
  title: string, subtitle: string, readout: string,
): void {
  ctx.save()
  if (title) {
    ctx.fillStyle = 'rgba(255,255,255,0.92)'
    ctx.font = 'bold 17px sans-serif'
    ctx.fillText(title, 18, 30)
  }
  ctx.font = '13px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.62)'
  if (subtitle) ctx.fillText(subtitle, 18, 52)
  if (readout) {
    ctx.textAlign = 'right'
    ctx.fillText(readout, W - 18, 30)
  }
  ctx.restore()
}

/** 供单测使用: 暴露重心坐标映射, 守住那三个曾在截图里暴露的 bug */
export function baryPointForTest(t: SphericalTriangle, u: number, v: number): Vec3 {
  return baryPoint(t, u, v)
}

/** 判断点是否朝向观察者（供外部复用） */
export function frontFacing(p: Vec3, cam: Camera): boolean {
  return project(unit(p), cam).depth < 0
}

/** 三角形形心（供外壳标注用） */
export { triangleCentroid, dot }
