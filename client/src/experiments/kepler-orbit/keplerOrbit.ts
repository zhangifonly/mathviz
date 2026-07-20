/**
 * 开普勒轨道核心算法（纯函数，便于测试）
 *
 * 行星绕太阳沿椭圆轨道运行，太阳位于椭圆的一个焦点。
 * 给定半长轴 a 与离心率 e，用开普勒方程 M = E - e*sinE
 * （牛顿迭代求偏近点角 E）确定任意时刻行星的位置。
 * 由此可验证开普勒第二定律：相等时间扫过相等面积。
 */

export interface Vec2 {
  x: number
  y: number
}

/**
 * 牛顿迭代解开普勒方程 M = E - e*sinE，返回偏近点角 E。
 * 迭代式：E <- E - (E - e*sinE - M) / (1 - e*cosE)。
 */
export function solveKepler(M: number, e: number, iterations = 12): number {
  let E = e < 0.8 ? M : Math.PI
  for (let i = 0; i < iterations; i++) {
    const f = E - e * Math.sin(E) - M
    const fp = 1 - e * Math.cos(E)
    E -= f / fp
  }
  return E
}

/** 焦点（太阳）在中心坐标系下的 x 偏移，c = a*e。 */
export function focusX(a: number, e: number): number {
  return a * e
}

/** 由偏近点角 E 得到行星在椭圆（中心为原点）上的坐标。 */
export function orbitPosition(a: number, e: number, E: number): Vec2 {
  const b = a * Math.sqrt(1 - e * e)
  return { x: a * Math.cos(E), y: b * Math.sin(E) }
}

/** 行星到焦点（太阳）的距离，r = a*(1 - e*cosE)。 */
export function focalRadius(a: number, e: number, E: number): number {
  return a * (1 - e * Math.cos(E))
}

/** 给定时间比例 t∈[0,1]（占一个周期），返回行星位置（中心坐标系）。 */
export function positionAtTime(a: number, e: number, t: number): Vec2 {
  const M = 2 * Math.PI * t
  const E = solveKepler(M, e)
  return orbitPosition(a, e, E)
}

/** 生成整条椭圆轨道的采样点（按角度均匀，用于描线）。 */
export function orbitPoints(a: number, e: number, n = 128): Vec2[] {
  const pts: Vec2[] = []
  for (let i = 0; i <= n; i++) {
    const E = (2 * Math.PI * i) / n
    pts.push(orbitPosition(a, e, E))
  }
  return pts
}

/** 三角形（焦点—p1—p2）的面积，用于度量扫过的扇形面积。 */
export function sectorArea(focus: Vec2, p1: Vec2, p2: Vec2): number {
  const ax = p1.x - focus.x
  const ay = p1.y - focus.y
  const bx = p2.x - focus.x
  const by = p2.y - focus.y
  return Math.abs(ax * by - ay * bx) / 2
}

/**
 * 把一个周期按相等时间分成 n 段，返回每段扫过的扇形面积。
 * 开普勒第二定律预言这些面积应彼此近似相等。
 */
export function sweptAreas(a: number, e: number, n = 12): number[] {
  const focus = { x: focusX(a, e), y: 0 }
  const areas: number[] = []
  for (let i = 0; i < n; i++) {
    const p1 = positionAtTime(a, e, i / n)
    const p2 = positionAtTime(a, e, (i + 1) / n)
    areas.push(sectorArea(focus, p1, p2))
  }
  return areas
}

/** 可选的离心率档位（0=圆，越大越扁）。 */
export const ECCENTRICITIES = [0.1, 0.4, 0.6, 0.8]
