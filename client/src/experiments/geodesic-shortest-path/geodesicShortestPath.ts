/**
 * 球面测地线（纯函数，便于测试）
 *
 * 球面上两点间的最短路径是**大圆弧**。这个断言可以直接用数值验证：
 * 拿任何一条别的连接路径（比如沿纬线走、或者绕道），算出它的长度，
 * 一定比大圆弧长。本实验把这个比较做成可读的数字。
 *
 * 三条可验证的核心事实：
 *
 * 1. **大圆弧最短**：与沿纬线的「等纬度航线」相比，大圆弧总更短。
 *    北京到纽约走大圆要经过北极附近，这就是为什么跨太平洋航班往北飞。
 *
 * 2. **测地线的曲率**：大圆弧在球面上是「直的」——它的测地曲率为零。
 *    纬线（除赤道）在球面上是弯的，虽然在三维空间里看都是圆。
 *
 * 3. **对径点的退化**：两个对径点之间有无穷多条等长的大圆弧（都是 π），
 *    所以「最短路径唯一」在球面上不总成立。这与欧氏几何不同。
 */

import type { Vec3 } from '../../lib/proj3d'
import {
  unit, dot, cross, norm, fromLatLon, sphericalDistance, slerp,
  greatCircleArc, toLatLon,
} from '../../lib/sphere3d'

/** 几个真实城市的经纬度（度），用来让「航线为什么往北飞」变得具体 */
export const CITIES = [
  { name: '北京', lat: 39.90, lon: 116.41 },
  { name: '纽约', lat: 40.71, lon: -74.01 },
  { name: '伦敦', lat: 51.51, lon: -0.13 },
  { name: '悉尼', lat: -33.87, lon: 151.21 },
  { name: '开罗', lat: 30.04, lon: 31.24 },
  { name: '里约', lat: -22.91, lon: -43.17 },
] as const

export type CityName = (typeof CITIES)[number]['name']

/** 地球平均半径（公里），用来把弧长换成实际距离 */
export const EARTH_RADIUS_KM = 6371

/** 由城市名取球面点 */
export function cityPoint(name: CityName): Vec3 {
  const c = CITIES.find((x) => x.name === name) ?? CITIES[0]
  return fromLatLon((c.lat * Math.PI) / 180, (c.lon * Math.PI) / 180)
}

/** 大圆距离（弧度） */
export function greatCircleAngle(a: Vec3, b: Vec3): number {
  return sphericalDistance(a, b)
}

/** 换算成公里 */
export function toKilometers(angle: number): number {
  return angle * EARTH_RADIUS_KM
}

/**
 * 沿纬线的「等纬度航线」路径长度。
 *
 * 若两点纬度不同，先按较高纬度走完经度差，再沿经线补上纬度差 ——
 * 这模拟「先东西向飞、再南北向飞」的朴素航线。
 * 单位球上：沿纬度 φ 的纬线走 Δλ 经度，弧长是 cos(φ)·Δλ。
 */
export function parallelRoutePathLength(a: Vec3, b: Vec3): number {
  const la = toLatLon(a)
  const lb = toLatLon(b)
  let dLon = Math.abs(lb.lon - la.lon)
  if (dLon > Math.PI) dLon = 2 * Math.PI - dLon
  // 在纬度较高（|lat| 较大）那一侧走东西向，路程更短
  const latForRun = Math.abs(la.lat) > Math.abs(lb.lat) ? la.lat : lb.lat
  const eastWest = Math.cos(latForRun) * dLon
  const northSouth = Math.abs(lb.lat - la.lat)
  return eastWest + northSouth
}

/**
 * 采样一条「沿纬线再沿经线」的折线路径，供绘制对比。
 */
export function parallelRoutePath(a: Vec3, b: Vec3, steps = 60): Vec3[] {
  const la = toLatLon(a)
  const lb = toLatLon(b)
  const latRun = Math.abs(la.lat) > Math.abs(lb.lat) ? la.lat : lb.lat
  const out: Vec3[] = []
  // 第一段：在 latRun 纬度上从 la.lon 走到 lb.lon
  const half = Math.floor(steps / 2)
  for (let i = 0; i <= half; i++) {
    const t = i / half
    const lon = la.lon + shortestLonDelta(la.lon, lb.lon) * t
    // 纬度从 la.lat 平滑过渡到 latRun
    const lat = la.lat + (latRun - la.lat) * t
    out.push(fromLatLon(lat, lon))
  }
  // 第二段：在 lb.lon 经线上从 latRun 走到 lb.lat
  for (let i = 1; i <= steps - half; i++) {
    const t = i / (steps - half)
    out.push(fromLatLon(latRun + (lb.lat - latRun) * t, lb.lon))
  }
  return out
}

/** 经度差取短的那一侧，带符号 */
function shortestLonDelta(from: number, to: number): number {
  let d = to - from
  while (d > Math.PI) d -= 2 * Math.PI
  while (d < -Math.PI) d += 2 * Math.PI
  return d
}

/** 折线路径的球面长度（相邻点弧长之和） */
export function pathLength(pts: Vec3[]): number {
  let s = 0
  for (let i = 1; i < pts.length; i++) s += sphericalDistance(pts[i - 1], pts[i])
  return s
}

/** 大圆弧路径 */
export function geodesicPath(a: Vec3, b: Vec3, steps = 80): Vec3[] {
  return greatCircleArc(a, b, steps)
}

/**
 * 绕道路径：在大圆弧中点处朝侧向偏移一个角度，再连过去。
 * 用来验证「任何偏离大圆的路径都更长」。
 */
export function detourPath(a: Vec3, b: Vec3, offset: number, steps = 80): Vec3[] {
  const mid = slerp(a, b, 0.5)
  // 侧向方向：垂直于 a-b 所在平面
  const n = cross(unit(a), unit(b))
  const nl = norm(n)
  if (nl < 1e-9) return geodesicPath(a, b, steps)
  const side = unit(n)
  // 把中点朝侧向推 offset 弧度
  const pushed = unit([
    mid[0] * Math.cos(offset) + side[0] * Math.sin(offset),
    mid[1] * Math.cos(offset) + side[1] * Math.sin(offset),
    mid[2] * Math.cos(offset) + side[2] * Math.sin(offset),
  ])
  // 经由 pushed 的两段大圆弧
  const half = Math.floor(steps / 2)
  return [
    ...greatCircleArc(a, pushed, half),
    ...greatCircleArc(pushed, b, steps - half).slice(1),
  ]
}

/** 绕道路径的长度 */
export function detourLength(a: Vec3, b: Vec3, offset: number): number {
  return pathLength(detourPath(a, b, offset))
}

/**
 * 测地曲率：路径在球面上「弯」的程度。
 * 大圆弧的测地曲率为零（球面上的直线），纬线（除赤道）不为零。
 *
 * 对纬度 φ 的纬线，测地曲率 = |tan(φ)|（单位球）。
 * 赤道 φ=0 给 0（是大圆），越靠近极点越弯。
 */
export function parallelGeodesicCurvature(lat: number): number {
  return Math.abs(Math.tan(lat))
}

/** 大圆的测地曲率恒为零 */
export const GREAT_CIRCLE_GEODESIC_CURVATURE = 0

/**
 * 数值估计一条球面路径的测地曲率（在给定下标处）。
 *
 * 做法：取相邻三点，把中间点的「加速度」投影到切平面上。
 * 若路径是测地线，加速度只有径向分量（指向球心），切向分量为零。
 */
export function numericGeodesicCurvature(pts: Vec3[], i: number): number {
  if (i <= 0 || i >= pts.length - 1) return 0
  const p = unit(pts[i])
  const a = unit(pts[i - 1])
  const b = unit(pts[i + 1])
  // 二阶差分作为加速度
  const acc: Vec3 = [
    a[0] - 2 * p[0] + b[0], a[1] - 2 * p[1] + b[1], a[2] - 2 * p[2] + b[2],
  ]
  // 去掉径向分量, 剩下的切向分量就是测地曲率的来源
  const radial = dot(acc, p)
  const tangential: Vec3 = [
    acc[0] - radial * p[0], acc[1] - radial * p[1], acc[2] - radial * p[2],
  ]
  // 用步长归一化
  const h = sphericalDistance(a, p)
  if (h < 1e-12) return 0
  return norm(tangential) / (h * h)
}

/** 纬线路径采样（用于对比它不是测地线） */
export function parallelPath(lat: number, lonFrom: number, lonTo: number, steps = 80): Vec3[] {
  const out: Vec3[] = []
  for (let i = 0; i <= steps; i++) {
    out.push(fromLatLon(lat, lonFrom + (lonTo - lonFrom) * (i / steps)))
  }
  return out
}

/** 两点是否对径（此时最短路径不唯一） */
export function isAntipodal(a: Vec3, b: Vec3, tol = 1e-9): boolean {
  return Math.abs(sphericalDistance(a, b) - Math.PI) < tol
}

/** 大圆弧的最高纬度（大圆的顶点纬度），解释「为什么航线往北偏」 */
export function maxLatitudeOnRoute(a: Vec3, b: Vec3, steps = 200): number {
  let best = -Infinity
  for (const p of greatCircleArc(a, b, steps)) {
    best = Math.max(best, toLatLon(p).lat)
  }
  return best
}

export const CITY_PAIRS = [
  { from: '北京' as CityName, to: '纽约' as CityName, note: '跨太平洋 · 大圆过北极附近' },
  { from: '伦敦' as CityName, to: '悉尼' as CityName, note: '几乎对径 · 路径接近半圆' },
  { from: '开罗' as CityName, to: '里约' as CityName, note: '跨大西洋' },
  { from: '北京' as CityName, to: '伦敦' as CityName, note: '欧亚大陆北线' },
]
