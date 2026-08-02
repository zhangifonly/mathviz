/**
 * 球面二角形与球面多边形面积（纯函数，便于测试）
 *
 * 平面上没有「二角形」——两条直线最多交于一点，围不出图形。
 * 球面上却有：两个大圆必定交于**对径的两点**，它们之间夹出的月牙形区域
 * 就是二角形（lune）。这是球面几何独有的图形。
 *
 * **二角形面积公式极其简洁**：夹角为 α 的二角形，面积恰好是 2α。
 * 推导只需一步比例：整个球面 4π 对应夹角 2π，故面积/4π = α/2π。
 * α = π/2 给面积 π，正是球面的四分之一。
 *
 * 由二角形能直接推出**吉拉尔定理**（球面三角形面积 = 内角和 − π）：
 * 三角形 ABC 的三条边所在大圆把球面切成 8 块。
 * 用三对二角形覆盖球面，每块三角形区域被数了 3 次而非 1 次，
 * 整理得 2(α+β+γ) = 2π + 2·Area，即 Area = α+β+γ−π。
 * 这个「用二角形拼出三角形面积」的论证，本实验用数值逐步验证。
 *
 * 球面多边形的一般公式：n 边形面积 = 内角和 − (n−2)π。
 * 平面上这个式子恒为 0（内角和恰是 (n−2)π），球面上正是超出量。
 */

import type { Vec3 } from '../../lib/proj3d'
import {
  unit, cross, dot, norm, fromLatLon, sphericalExcess, sphericalDistance,
  greatCircle, greatCircleArc, triangleAngles,
} from '../../lib/sphere3d'
import type { SphericalTriangle } from '../../lib/sphere3d'

/** 二角形面积公式：夹角 α 的二角形面积为 2α（单位球） */
export function luneArea(alpha: number): number {
  return 2 * alpha
}

/** 二角形占球面的比例 = α/(2π) */
export function luneFraction(alpha: number): number {
  return alpha / (2 * Math.PI)
}

/**
 * 二角形的两个顶点是对径点。约定取南北极，
 * 两条边是经度 0 与经度 α 的两条半经线。
 */
export const LUNE_APEX_NORTH: Vec3 = [0, 0, 1]
export const LUNE_APEX_SOUTH: Vec3 = [0, 0, -1]

/**
 * 二角形的边界采样：从北极沿经度 0 到南极，再沿经度 α 回北极。
 */
export function luneBoundary(alpha: number, steps = 60): Vec3[] {
  const out: Vec3[] = []
  for (let i = 0; i <= steps; i++) {
    const lat = Math.PI / 2 - (Math.PI * i) / steps
    out.push(fromLatLon(lat, 0))
  }
  for (let i = 1; i <= steps; i++) {
    const lat = -Math.PI / 2 + (Math.PI * i) / steps
    out.push(fromLatLon(lat, alpha))
  }
  return out
}

/**
 * 二角形的填充网格：把 [0,α]×[−π/2,π/2] 的经纬矩形切成四边形小片。
 *
 * ⚠️ 不能把边界折线丢给 drawPatch 的「面心扇形三角化」——
 * 二角形又细又长，顶点平均出的面心几乎落在边界上，扇形会退化成一条线
 * （截图里月牙只剩一条细边就是这么来的）。按经纬网格铺才可靠。
 */
export function luneQuadGrid(
  alpha: number, lonSteps = 12, latSteps = 24,
): Vec3[][] {
  const quads: Vec3[][] = []
  for (let i = 0; i < lonSteps; i++) {
    const lon0 = (alpha * i) / lonSteps
    const lon1 = (alpha * (i + 1)) / lonSteps
    for (let j = 0; j < latSteps; j++) {
      const lat0 = -Math.PI / 2 + (Math.PI * j) / latSteps
      const lat1 = -Math.PI / 2 + (Math.PI * (j + 1)) / latSteps
      quads.push([
        fromLatLon(lat0, lon0), fromLatLon(lat0, lon1),
        fromLatLon(lat1, lon1), fromLatLon(lat1, lon0),
      ])
    }
  }
  return quads
}

/**
 * 数值估算二角形面积：把它切成许多小球面三角形求和。
 * 用来独立验证解析式 2α 是对的。
 */
export function numericLuneArea(alpha: number, steps = 60): number {
  let area = 0
  // 以北极为顶点，沿南北方向切条带
  for (let i = 0; i < steps; i++) {
    const lat0 = Math.PI / 2 - (Math.PI * i) / steps
    const lat1 = Math.PI / 2 - (Math.PI * (i + 1)) / steps
    // 每条带切成两个球面三角形
    const a = fromLatLon(lat0, 0)
    const b = fromLatLon(lat0, alpha)
    const c = fromLatLon(lat1, 0)
    const d = fromLatLon(lat1, alpha)
    area += sphericalExcess({ A: a, B: b, C: c })
    area += sphericalExcess({ A: b, B: d, C: c })
  }
  return area
}

/**
 * 球面 n 边形的面积 = 内角和 − (n−2)π。
 * 这里通过「从形心切成 n 个球面三角形」计算，与公式对照。
 */
export function polygonArea(vertices: Vec3[]): number {
  if (vertices.length < 3) return 0
  const vs = vertices.map(unit)
  const center = unit([
    vs.reduce((s, v) => s + v[0], 0),
    vs.reduce((s, v) => s + v[1], 0),
    vs.reduce((s, v) => s + v[2], 0),
  ])
  let area = 0
  for (let i = 0; i < vs.length; i++) {
    area += sphericalExcess({
      A: center, B: vs[i], C: vs[(i + 1) % vs.length],
    })
  }
  return area
}

/** 球面多边形在顶点 i 处的内角 */
export function polygonInteriorAngle(vertices: Vec3[], i: number): number {
  const n = vertices.length
  const prev = vertices[(i - 1 + n) % n]
  const cur = vertices[i]
  const next = vertices[(i + 1) % n]
  return triangleAngles({ A: cur, B: prev, C: next })[0]
}

/** 内角和 */
export function polygonAngleSum(vertices: Vec3[]): number {
  let s = 0
  for (let i = 0; i < vertices.length; i++) s += polygonInteriorAngle(vertices, i)
  return s
}

/** 由内角和公式给出的面积：内角和 − (n−2)π */
export function polygonAreaByFormula(vertices: Vec3[]): number {
  return polygonAngleSum(vertices) - (vertices.length - 2) * Math.PI
}

/** 两种算法的差，应为 0 */
export function polygonAreaResidual(vertices: Vec3[]): number {
  return Math.abs(polygonArea(vertices) - polygonAreaByFormula(vertices))
}

/** 平面 n 边形的内角和 (n−2)π，用作对照 */
export function planarAngleSum(n: number): number {
  return (n - 2) * Math.PI
}

/**
 * 吉拉尔定理的二角形论证。
 *
 * 三角形三条边所在的三个大圆把球面切成 8 块。三对二角形（每对夹角为
 * 三角形的一个内角）的总面积是 4(α+β+γ)。这些二角形覆盖整个球面，
 * 但把三角形及其对径三角形各多数了 2 次。
 * 故 4(α+β+γ) = 4π + 4·Area，即 Area = α+β+γ−π。
 *
 * 返回这个恒等式两端的差（应为 0）。
 */
export function girardIdentityResidual(t: SphericalTriangle): number {
  const [a, b, c] = triangleAngles(t)
  const luneTotal = 2 * luneArea(a) + 2 * luneArea(b) + 2 * luneArea(c)
  const area = sphericalExcess(t)
  return Math.abs(luneTotal - (4 * Math.PI + 4 * area))
}

/** 三对二角形的总面积 */
export function totalLuneAreaFor(t: SphericalTriangle): number {
  const [a, b, c] = triangleAngles(t)
  return 2 * (luneArea(a) + luneArea(b) + luneArea(c))
}

/** 几个预设的二角形夹角 */
export const LUNE_PRESETS = [
  { alpha: Math.PI / 6, label: 'α = 30°', note: '面积 π/3 · 占 1/12' },
  { alpha: Math.PI / 4, label: 'α = 45°', note: '面积 π/2 · 占 1/8' },
  { alpha: Math.PI / 2, label: 'α = 90°', note: '面积 π · 占 1/4' },
  { alpha: Math.PI, label: 'α = 180°', note: '面积 2π · 半球' },
] as const

/** 球面正 n 边形（顶点在同一纬度上均匀分布） */
export function regularSphericalPolygon(n: number, lat: number): Vec3[] {
  const out: Vec3[] = []
  for (let i = 0; i < n; i++) {
    out.push(fromLatLon(lat, (2 * Math.PI * i) / n))
  }
  return out
}

/** 多边形边界采样（每条边是大圆弧） */
export function polygonBoundary(vertices: Vec3[], stepsPerEdge = 30): Vec3[] {
  const out: Vec3[] = []
  for (let i = 0; i < vertices.length; i++) {
    const arc = greatCircleArc(vertices[i], vertices[(i + 1) % vertices.length], stepsPerEdge)
    out.push(...(i === 0 ? arc : arc.slice(1)))
  }
  return out
}

/** 二角形两条边所在的大圆法向量（供绘制整圆） */
export function luneEdgeCircles(alpha: number): Vec3[] {
  // 经度 0 的半经线所在大圆：法向量沿 y 轴
  const n1: Vec3 = [0, 1, 0]
  // 经度 α 的大圆：绕 z 轴转 α
  const n2: Vec3 = unit([-Math.sin(alpha), Math.cos(alpha), 0])
  return [n1, n2]
}

export { greatCircle, sphericalDistance, cross, dot, norm }
