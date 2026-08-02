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

/** 一块球面多边形：顶点（已在单位球上）+ 填充色 */
export interface SphericalPatch {
  vertices: Vec3[]
  fill: string
}

/** 球面上的一条路径 */
export interface SpherePath {
  points: Vec3[]
  color: string
  width?: number
  /** 图例标签 */
  label?: string
}

/** 球面上标注的一个点 */
export interface SphereMarker {
  point: Vec3
  label: string
  color?: string
}

export interface SphereDrawOptions {
  title?: string
  subtitle?: string
  yaw?: number
  pitch?: number
  /** 要画的球面三角形 */
  triangle?: SphericalTriangle
  /** 要画的球面多边形（镶嵌用，可多块） */
  patches?: SphericalPatch[]
  /** 额外的大圆（法向量列表） */
  greatCircles?: Vec3[]
  /** 要画的路径（已在单位球上的点列），用于比较不同航线 */
  paths?: SpherePath[]
  /** 标出的点（城市等） */
  markers?: SphereMarker[]
  /** 显示经纬网格 */
  showGrid?: boolean
  /** 三角形填充色 */
  fill?: string
  /** 右上角读数 */
  readout?: string
  /** 顶点标签 */
  labels?: [string, string, string]
  /** 标出顶点 */
  showVertices?: boolean
}

const R_SCREEN = 0.42

export function drawSphereScene(
  canvas: HTMLCanvasElement, opts: SphereDrawOptions,
): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const {
    title = '', subtitle = '', yaw = 0.6, pitch = 0.3,
    triangle, patches = [], greatCircles = [], showGrid = true,
    fill = 'rgba(251, 191, 36, 0.42)', readout = '', labels,
    showVertices = false, paths = [], markers = [],
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
  for (const patch of patches) drawPatch(ctx, cam, patch, isFront, showVertices)
  if (triangle) drawTriangle(ctx, cam, triangle, fill, isFront, labels)
  for (const path of paths) {
    drawPolyline(ctx, cam, path.points.map(unit), isFront,
      path.color, fadeColor(path.color), path.width ?? 2.4)
  }
  for (const m of markers) drawMarker(ctx, cam, m, isFront)
  if (paths.some((p) => p.label)) drawLegend(ctx, H, paths)
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

/**
 * 分段画折线，正面与背面用不同颜色。
 *
 * ⚠️ 换面时新段必须**从上一个点起笔**，不能直接 moveTo 当前点 ——
 * 否则每次跨越轮廓线就丢掉一小段，路径看着是断的。
 * 这个 bug 在绕道路径上很明显（红线断在半空），是截图发现的。
 */
function drawPolyline(
  ctx: CanvasRenderingContext2D,
  cam: Camera,
  pts: Vec3[],
  isFront: (p: Vec3) => boolean,
  frontColor: string,
  backColor: string,
  width = 0,
): void {
  if (pts.length < 2) return
  const stroke = (front: boolean) => {
    ctx.strokeStyle = front ? frontColor : backColor
    if (width) ctx.lineWidth = width
    ctx.stroke()
  }

  let segFront = isFront(pts[0])
  const first = project(unit(pts[0]), cam)
  ctx.beginPath()
  ctx.moveTo(first.x, first.y)
  for (let i = 1; i < pts.length; i++) {
    const f = isFront(pts[i])
    const s = project(unit(pts[i]), cam)
    // 这一小段仍属当前段: 直接连过去
    ctx.lineTo(s.x, s.y)
    if (f !== segFront) {
      // 到此为止的段用当前颜色收笔, 新段从**这个点**继续, 不留缺口
      stroke(segFront)
      segFront = f
      ctx.beginPath()
      ctx.moveTo(s.x, s.y)
    }
  }
  stroke(segFront)
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
  ctx.save()
  ctx.fillStyle = fill
  // 填充逻辑抽到 fillSphericalTriangle, 与 drawPatch 共用。
  // 那里注明了两个曾在截图里暴露的坑: 必须画上下两类小片(否则有网格缝),
  // 且按小片中心判正背面(否则背面透到正面)。
  fillSphericalTriangle(ctx, cam, t, isFront, 26)
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
 * 画一块球面多边形（镶嵌的一个面）。
 *
 * 从面心把多边形切成 n 个球面三角形，各自用重心坐标铺色 ——
 * 直接把顶点连成屏幕多边形会把球面的弯曲吃掉，边界成直线段就不像球面了。
 */
function drawPatch(
  ctx: CanvasRenderingContext2D,
  cam: Camera,
  patch: SphericalPatch,
  isFront: (p: Vec3) => boolean,
  showVerts: boolean,
): void {
  const vs = patch.vertices.map(unit)
  if (vs.length < 3) return
  // 面心：顶点平均后归一化
  const center = unit([
    vs.reduce((s, v) => s + v[0], 0),
    vs.reduce((s, v) => s + v[1], 0),
    vs.reduce((s, v) => s + v[2], 0),
  ])
  ctx.save()
  ctx.fillStyle = patch.fill
  for (let i = 0; i < vs.length; i++) {
    const t: SphericalTriangle = {
      A: center, B: vs[i], C: vs[(i + 1) % vs.length],
    }
    fillSphericalTriangle(ctx, cam, t, isFront, 10)
  }
  // 描边：每条边是大圆弧
  for (let i = 0; i < vs.length; i++) {
    drawPolyline(ctx, cam, greatCircleArc(vs[i], vs[(i + 1) % vs.length], 40), isFront,
      'rgba(255,255,255,0.75)', 'rgba(255,255,255,0.12)', 1.6)
  }
  if (showVerts) {
    for (const v of vs) {
      if (!isFront(v)) continue
      const s = project(v, cam)
      ctx.beginPath()
      ctx.arc(s.x, s.y, 3, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(253,224,71,0.95)'
      ctx.fill()
    }
  }
  ctx.restore()
}

/** 用重心坐标网格铺满一个球面三角形（供 drawTriangle 与 drawPatch 共用） */
function fillSphericalTriangle(
  ctx: CanvasRenderingContext2D,
  cam: Camera,
  t: SphericalTriangle,
  isFront: (p: Vec3) => boolean,
  N: number,
): void {
  const P = (u: number, v: number) => baryPoint(t, u, v)
  const emit = (a: Vec3, b: Vec3, c: Vec3) => {
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
      emit(P(u0, v0), P(u1, v0), P(u0, v1))
      if (i + j + 2 <= N) emit(P(u1, v0), P(u1, v1), P(u0, v1))
    }
  }
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

/** 把颜色调淡，用于背面的线段 */
function fadeColor(color: string): string {
  // rgba(...) 形式把 alpha 压到 0.22; 其余形式直接返回一个灰调
  const m = color.match(/^rgba?\(([^)]+)\)$/)
  if (!m) return 'rgba(148,163,184,0.22)'
  const parts = m[1].split(',').map((s) => s.trim())
  return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, 0.22)`
}

/** 标一个点并写标签 */
function drawMarker(
  ctx: CanvasRenderingContext2D, cam: Camera, m: SphereMarker,
  isFront: (p: Vec3) => boolean,
): void {
  const p = unit(m.point)
  const front = isFront(p)
  const s = project(p, cam)
  ctx.save()
  ctx.beginPath()
  ctx.arc(s.x, s.y, front ? 5.5 : 3, 0, Math.PI * 2)
  ctx.fillStyle = front
    ? (m.color ?? 'rgba(253,224,71,1)')
    : 'rgba(253,224,71,0.28)'
  ctx.fill()
  if (front) {
    ctx.fillStyle = 'rgba(255,255,255,0.95)'
    ctx.font = 'bold 14px sans-serif'
    ctx.fillText(m.label, s.x + 9, s.y - 8)
  }
  ctx.restore()
}

/** 路径图例 */
function drawLegend(
  ctx: CanvasRenderingContext2D, H: number, paths: SpherePath[],
): void {
  const labelled = paths.filter((p) => p.label)
  ctx.save()
  ctx.font = '13px sans-serif'
  labelled.forEach((p, i) => {
    const y = H - 20 - (labelled.length - 1 - i) * 22
    ctx.strokeStyle = p.color
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(18, y - 4)
    ctx.lineTo(48, y - 4)
    ctx.stroke()
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    ctx.fillText(p.label as string, 56, y)
  })
  ctx.restore()
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

/**
 * 供单测使用: 用固定相机跑一遍 drawPolyline，
 * 守住「换面时不丢线段」这条（红线断裂那个 bug）。
 */
export function drawPolylineForTest(
  ctx: CanvasRenderingContext2D, pts: Vec3[],
): void {
  const cam = makeCamera({ yaw: 0.6, pitch: 0.3, scale: 100, cx: 0, cy: 0 })
  drawPolyline(ctx, cam, pts, (p) => project(unit(p), cam).depth < 0,
    'rgba(255,0,0,1)', 'rgba(0,0,255,1)', 2)
}

/** 判断点是否朝向观察者（供外部复用） */
export function frontFacing(p: Vec3, cam: Camera): boolean {
  return project(unit(p), cam).depth < 0
}

/** 三角形形心（供外壳标注用） */
export { triangleCentroid, dot }
