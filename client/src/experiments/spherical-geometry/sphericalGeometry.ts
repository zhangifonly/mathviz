/**
 * 球面几何核心算法（纯函数，便于测试）
 *
 * 球面上"直线"是大圆，两点最短路径是大圆劣弧（测地线）。
 * 球面三角形三内角和恒大于 180 度，超出量（球面盈余）等于面积除以 R^2。
 */

export interface Vec3 { x: number; y: number; z: number }
export interface GeoPoint { name: string; lat: number; lon: number }

const D2R = Math.PI / 180
export const EARTH_R = 6371 // 地球平均半径（千米）
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

/** 经纬度（度）-> 单位球面 3D 向量 */
export function toVec3(lat: number, lon: number): Vec3 {
  const la = lat * D2R, lo = lon * D2R
  return { x: Math.cos(la) * Math.cos(lo), y: Math.cos(la) * Math.sin(lo), z: Math.sin(la) }
}

export function dot(a: Vec3, b: Vec3): number { return a.x * b.x + a.y * b.y + a.z * b.z }
export function norm(a: Vec3): number { return Math.sqrt(dot(a, a)) }
export function normalize(a: Vec3): Vec3 {
  const n = norm(a) || 1
  return { x: a.x / n, y: a.y / n, z: a.z / n }
}

/** 两单位向量夹角（弧度），即单位球面上的大圆弧长 */
export function angleBetween(a: Vec3, b: Vec3): number {
  return Math.acos(clamp(dot(normalize(a), normalize(b)), -1, 1))
}

/** 球面线性插值：沿大圆从 a 到 b，t 属于 [0,1] */
export function slerp(a: Vec3, b: Vec3, t: number): Vec3 {
  const omega = angleBetween(a, b)
  if (omega < 1e-9) return { ...a }
  const s = Math.sin(omega)
  const k0 = Math.sin((1 - t) * omega) / s, k1 = Math.sin(t * omega) / s
  return normalize({ x: k0 * a.x + k1 * b.x, y: k0 * a.y + k1 * b.y, z: k0 * a.z + k1 * b.z })
}

/** 大圆弧采样点（球面最短路径），返回 n+1 个单位向量 */
export function greatCircleArc(a: Vec3, b: Vec3, n = 64): Vec3[] {
  const pts: Vec3[] = []
  for (let i = 0; i <= n; i++) pts.push(slerp(a, b, i / n))
  return pts
}

/** 顶点 a 处两条大圆弧 ab、ac 之间的内角（弧度）：切向量夹角 */
function vertexAngle(a: Vec3, b: Vec3, c: Vec3): number {
  const proj = (p: Vec3) => normalize({
    x: p.x - a.x * dot(a, p), y: p.y - a.y * dot(a, p), z: p.z - a.z * dot(a, p),
  })
  return Math.acos(clamp(dot(proj(b), proj(c)), -1, 1))
}

/** 球面三角形三内角和（度），恒大于 180 */
export function sphericalTriangleAngleSum(a: Vec3, b: Vec3, c: Vec3): number {
  return (vertexAngle(a, b, c) + vertexAngle(b, a, c) + vertexAngle(c, a, b)) / D2R
}

/** 球面盈余（度）= 内角和 - 180；乘 R^2（弧度制）得三角形面积 */
export function sphericalExcess(a: Vec3, b: Vec3, c: Vec3): number {
  return sphericalTriangleAngleSum(a, b, c) - 180
}

/** 半正矢公式：两经纬点球面距离（默认地球，千米） */
export function haversine(latA: number, lonA: number, latB: number, lonB: number, R = EARTH_R): number {
  const dLat = (latB - latA) * D2R, dLon = (lonB - lonA) * D2R
  const s = Math.sin(dLat / 2) ** 2 +
    Math.cos(latA * D2R) * Math.cos(latB * D2R) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s))
}

export const CITIES: GeoPoint[] = [
  { name: '北京', lat: 39.9, lon: 116.4 },
  { name: '纽约', lat: 40.7, lon: -74.0 },
  { name: '伦敦', lat: 51.5, lon: -0.13 },
  { name: '悉尼', lat: -33.87, lon: 151.2 },
]

/** 若干预设球面三角形（顶点经纬度） */
export const PRESET_POINTS: Record<string, GeoPoint[]> = {
  octant: [
    { name: 'A', lat: 0, lon: 0 }, { name: 'B', lat: 0, lon: 90 }, { name: 'C', lat: 90, lon: 0 },
  ],
  cities: [
    { name: '北京', lat: 39.9, lon: 116.4 },
    { name: '纽约', lat: 40.7, lon: -74.0 },
    { name: '开普敦', lat: -33.92, lon: 18.42 },
  ],
  wide: [
    { name: 'A', lat: 10, lon: -120 }, { name: 'B', lat: 10, lon: 120 }, { name: 'C', lat: 80, lon: 0 },
  ],
}

export const PRESET_KEYS = Object.keys(PRESET_POINTS)
