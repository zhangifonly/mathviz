/**
 * 球面几何的共享内核（纯函数，便于测试）
 *
 * 球面上的「直线」是大圆（过球心的平面与球面的交线），因为它给出两点间
 * 最短路径。把欧氏几何的直线换成大圆，就得到球面几何 ——
 * 一种平行公理不成立的非欧几何：过给定大圆外一点，**没有**任何大圆与它不相交。
 *
 * 与欧氏几何的三处根本差异，都有可验证的定量表述：
 *   1. 三角形内角和 > π，超出量等于面积（球面盈余）
 *   2. 不存在相似三角形 —— 角决定形状也决定大小
 *   3. 勾股定理换成 cos c = cos a·cos b
 *
 * 本内核提供：单位球上的点运算、大圆弧、球面距离、球面三角公式、球面盈余。
 */

import type { Vec3 } from './proj3d'

export function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}

export function cross(a: Vec3, b: Vec3): Vec3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ]
}

export function norm(a: Vec3): number {
  return Math.hypot(a[0], a[1], a[2])
}

/** 归一化到单位球。零向量返回北极作兜底 */
export function unit(a: Vec3): Vec3 {
  const n = norm(a)
  if (n < 1e-12) return [0, 0, 1]
  return [a[0] / n, a[1] / n, a[2] / n]
}

/** 由经纬度（弧度）给出单位球上的点。lat ∈ [−π/2, π/2] */
export function fromLatLon(lat: number, lon: number): Vec3 {
  const c = Math.cos(lat)
  return [c * Math.cos(lon), c * Math.sin(lon), Math.sin(lat)]
}

/** 反解经纬度 */
export function toLatLon(p: Vec3): { lat: number; lon: number } {
  const u = unit(p)
  return { lat: Math.asin(Math.max(-1, Math.min(1, u[2]))), lon: Math.atan2(u[1], u[0]) }
}

/**
 * 球面距离（大圆弧长，单位球上等于圆心角）。
 * 用 atan2(|a×b|, a·b) 而不是 acos(a·b) —— 后者在两点接近时精度差得多。
 */
export function sphericalDistance(a: Vec3, b: Vec3): number {
  const ua = unit(a)
  const ub = unit(b)
  return Math.atan2(norm(cross(ua, ub)), dot(ua, ub))
}

/**
 * 大圆弧上的插值点（球面线性插值 slerp）。
 * t=0 给 a，t=1 给 b，中间沿最短大圆弧走。
 */
export function slerp(a: Vec3, b: Vec3, t: number): Vec3 {
  const ua = unit(a)
  const ub = unit(b)
  const omega = sphericalDistance(ua, ub)
  if (omega < 1e-9) return ua
  const s = Math.sin(omega)
  const k1 = Math.sin((1 - t) * omega) / s
  const k2 = Math.sin(t * omega) / s
  return [
    ua[0] * k1 + ub[0] * k2,
    ua[1] * k1 + ub[1] * k2,
    ua[2] * k1 + ub[2] * k2,
  ]
}

/** 采样一段大圆弧 */
export function greatCircleArc(a: Vec3, b: Vec3, steps = 60): Vec3[] {
  const out: Vec3[] = []
  for (let i = 0; i <= steps; i++) out.push(slerp(a, b, i / steps))
  return out
}

/** 采样完整大圆：由法向量决定的那个大圆 */
export function greatCircle(normalVec: Vec3, steps = 120): Vec3[] {
  const n = unit(normalVec)
  // 取一组与 n 正交的基
  const ref: Vec3 = Math.abs(n[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0]
  const e1 = unit(cross(n, ref))
  const e2 = cross(n, e1)
  const out: Vec3[] = []
  for (let i = 0; i <= steps; i++) {
    const a = (2 * Math.PI * i) / steps
    out.push([
      e1[0] * Math.cos(a) + e2[0] * Math.sin(a),
      e1[1] * Math.cos(a) + e2[1] * Math.sin(a),
      e1[2] * Math.cos(a) + e2[2] * Math.sin(a),
    ])
  }
  return out
}

/**
 * 球面三角形在顶点 A 处的内角。
 *
 * 用两条边在 A 点的切向量夹角算。切向量 = 从 A 指向 B 的大圆在 A 的切向，
 * 等于 B 减去它在 A 方向的投影，再归一化。
 */
export function sphericalAngle(A: Vec3, B: Vec3, C: Vec3): number {
  const a = unit(A)
  const tb = tangentAt(a, unit(B))
  const tc = tangentAt(a, unit(C))
  return Math.acos(Math.max(-1, Math.min(1, dot(tb, tc))))
}

/** 从 a 出发指向 b 的大圆切向量（在 a 的切平面内） */
export function tangentAt(a: Vec3, b: Vec3): Vec3 {
  const d = dot(a, b)
  return unit([b[0] - d * a[0], b[1] - d * a[1], b[2] - d * a[2]])
}

export interface SphericalTriangle {
  A: Vec3
  B: Vec3
  C: Vec3
}

/** 三个内角（弧度） */
export function triangleAngles(t: SphericalTriangle): [number, number, number] {
  return [
    sphericalAngle(t.A, t.B, t.C),
    sphericalAngle(t.B, t.C, t.A),
    sphericalAngle(t.C, t.A, t.B),
  ]
}

/** 三条边长（对边弧长，单位球上即圆心角） */
export function triangleSides(t: SphericalTriangle): [number, number, number] {
  return [
    sphericalDistance(t.B, t.C),
    sphericalDistance(t.C, t.A),
    sphericalDistance(t.A, t.B),
  ]
}

/**
 * 球面盈余 E = (α + β + γ) − π。
 *
 * **吉拉尔定理**：单位球上三角形面积恰好等于球面盈余。
 * 这是球面几何最漂亮的结论 —— 面积由角度唯一决定，
 * 因此不存在相似而不全等的球面三角形。
 */
export function sphericalExcess(t: SphericalTriangle): number {
  const [a, b, c] = triangleAngles(t)
  return a + b + c - Math.PI
}

/** 面积（单位球）。由吉拉尔定理等于球面盈余 */
export function triangleArea(t: SphericalTriangle): number {
  return sphericalExcess(t)
}

/**
 * 球面余弦定理：cos c = cos a·cos b + sin a·sin b·cos C。
 * 返回等式两端之差，应为 0。这是球面三角学的基本恒等式。
 */
export function cosineRuleResidual(t: SphericalTriangle): number {
  const [a, b, c] = triangleSides(t)
  const C = triangleAngles(t)[2]
  return Math.cos(c) - (Math.cos(a) * Math.cos(b) + Math.sin(a) * Math.sin(b) * Math.cos(C))
}

/**
 * 球面正弦定理：sin a / sin A = sin b / sin B = sin c / sin C。
 * 返回三个比值的最大偏差。
 */
export function sineRuleSpread(t: SphericalTriangle): number {
  const [a, b, c] = triangleSides(t)
  const [A, B, C] = triangleAngles(t)
  const rs = [
    Math.sin(a) / Math.sin(A),
    Math.sin(b) / Math.sin(B),
    Math.sin(c) / Math.sin(C),
  ].filter(Number.isFinite)
  if (rs.length === 0) return 0
  return Math.max(...rs) - Math.min(...rs)
}

/**
 * 球面勾股定理：直角三角形（C = π/2）满足 cos c = cos a·cos b。
 * 返回残差。注意这里**没有平方项** —— 欧氏勾股定理是它在小三角形下的极限。
 */
export function pythagoreanResidual(a: number, b: number, c: number): number {
  return Math.cos(c) - Math.cos(a) * Math.cos(b)
}

/** 球面三角形的形心（三顶点平均后归一化） */
export function triangleCentroid(t: SphericalTriangle): Vec3 {
  return unit([
    t.A[0] + t.B[0] + t.C[0],
    t.A[1] + t.B[1] + t.C[1],
    t.A[2] + t.B[2] + t.C[2],
  ])
}

/** 采样三角形的三条边，供绘制 */
export function triangleEdges(t: SphericalTriangle, steps = 60): Vec3[][] {
  return [
    greatCircleArc(t.A, t.B, steps),
    greatCircleArc(t.B, t.C, steps),
    greatCircleArc(t.C, t.A, steps),
  ]
}
