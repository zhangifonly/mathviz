/**
 * 立体角与球面度（纯函数，便于测试）
 *
 * 平面角量的是"张开多宽"，单位弧度：整圈 2π。
 * 立体角量的是"张开多大一片"，单位球面度（steradian）：整个空间 4π。
 *
 * 定义都一样：把角放在单位圆/单位球中心，量它截下的弧长/面积。
 *   平面角 θ = 弧长 / r        整圈 = 2πr/r = 2π
 *   立体角 Ω = 球面面积 / r²   全空间 = 4πr²/r² = 4π
 *
 * 三种可验证的算法：
 *
 * 1. **三角形立体角**（Van Oosterom–Strackee 公式）
 *    tan(Ω/2) = |a·(b×c)| / (|a||b||c| + (a·b)|c| + (a·c)|b| + (b·c)|a|)
 *    分子正是三重积 —— 与上一个实验直接相连。
 *
 * 2. **球面盈余**：单位球上三角形面积 = 内角和 − π，而面积就是立体角。
 *    两种算法必须给出同一个数，这是最强的交叉验证。
 *
 * 3. **锥体立体角**：半顶角 α 的圆锥截下 Ω = 2π(1 − cos α)。
 *    α = π/2 给 2π（半空间），α = π 给 4π（全空间）。
 *
 * 一个实用推论：**多面体所有顶点的立体角之和不是常数**（与角亏总和恒为 4π 不同）。
 * 立方体每顶点 π/2，八个顶点共 4π 恰好等于全空间；但四面体不然。
 * 这个区别容易搞混，本实验用数值分开。
 */

import type { Vec3 } from '../../lib/proj3d'

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

export function unit(a: Vec3): Vec3 {
  const n = norm(a)
  if (n < 1e-15) return [0, 0, 1]
  return [a[0] / n, a[1] / n, a[2] / n]
}

/** 全空间的立体角 4π 球面度 */
export const FULL_SPACE = 4 * Math.PI

/** 半空间 2π */
export const HALF_SPACE = 2 * Math.PI

/**
 * 三条射线张成的立体角（Van Oosterom–Strackee 公式）。
 *
 * 分子是三重积的绝对值 —— 与四面体体积用的是同一个量。
 * 用 atan2 而不是 atan：分母可能为负（大立体角），atan 会漏掉那一支。
 */
export function triangleSolidAngle(a: Vec3, b: Vec3, c: Vec3): number {
  const la = norm(a)
  const lb = norm(b)
  const lc = norm(c)
  if (la < 1e-15 || lb < 1e-15 || lc < 1e-15) return 0
  const num = Math.abs(dot(a, cross(b, c)))
  const den = la * lb * lc
    + dot(a, b) * lc
    + dot(a, c) * lb
    + dot(b, c) * la
  return 2 * Math.atan2(num, den)
}

/**
 * 用球面盈余算同一个立体角（独立算法）。
 *
 * 把三条射线投到单位球得到球面三角形，它的面积就是立体角。
 * 面积 = 内角和 − π，而球面角用切向量夹角量。
 */
export function solidAngleByExcess(a: Vec3, b: Vec3, c: Vec3): number {
  const ua = unit(a)
  const ub = unit(b)
  const uc = unit(c)
  const angA = sphericalAngleAt(ua, ub, uc)
  const angB = sphericalAngleAt(ub, uc, ua)
  const angC = sphericalAngleAt(uc, ua, ub)
  return angA + angB + angC - Math.PI
}

/** 球面三角形在顶点 p 处的内角（两条大圆的切向量夹角） */
function sphericalAngleAt(p: Vec3, q: Vec3, r: Vec3): number {
  const tq = tangentAt(p, q)
  const tr = tangentAt(p, r)
  return Math.acos(Math.max(-1, Math.min(1, dot(tq, tr))))
}

/** 从 p 指向 q 的大圆在 p 处的切向量 */
function tangentAt(p: Vec3, q: Vec3): Vec3 {
  const d = dot(p, q)
  return unit([q[0] - d * p[0], q[1] - d * p[1], q[2] - d * p[2]])
}

/** 两种算法的差，应为 0 */
export function solidAngleResidual(a: Vec3, b: Vec3, c: Vec3): number {
  return Math.abs(triangleSolidAngle(a, b, c) - solidAngleByExcess(a, b, c))
}

/**
 * 半顶角 α 的圆锥截下的立体角 Ω = 2π(1 − cos α)。
 * α=π/2 给 2π（半空间），α=π 给 4π（全空间）。
 */
export function coneSolidAngle(alpha: number): number {
  return 2 * Math.PI * (1 - Math.cos(alpha))
}

/** 由立体角反解圆锥半顶角 */
export function coneAngleFromSolid(omega: number): number {
  const c = 1 - omega / (2 * Math.PI)
  return Math.acos(Math.max(-1, Math.min(1, c)))
}

/** 立体角占全空间的比例 */
export function solidFraction(omega: number): number {
  return omega / FULL_SPACE
}

/** 数值积分校验锥体公式：在球面上采样统计落在锥内的比例 */
export function coneSolidAngleNumeric(alpha: number, steps = 400): number {
  // 球面均匀采样：cosθ 均匀分布
  let inside = 0
  let total = 0
  for (let i = 0; i < steps; i++) {
    const cosTheta = -1 + (2 * (i + 0.5)) / steps
    for (let j = 0; j < steps; j++) {
      total++
      if (cosTheta >= Math.cos(alpha)) inside++
    }
  }
  return (inside / total) * FULL_SPACE
}

/** 立方体顶点处的立体角：三条正交棱，恰为 π/2 */
export const CUBE_VERTEX_SOLID_ANGLE = Math.PI / 2

/** 立方体八个顶点的立体角之和恰为 4π（等于全空间，但这是巧合） */
export const CUBE_VERTEX_SUM = 8 * CUBE_VERTEX_SOLID_ANGLE

/**
 * 正四面体顶点处的立体角。
 * 三条棱夹角都是 arccos(1/3)，代入公式可算，约 0.5513 球面度。
 * 四个顶点之和约 2.205，**不等于 4π** —— 这与角亏总和恒为 4π 不同。
 */
export function tetrahedronVertexSolidAngle(): number {
  // 正四面体：从一个顶点出发的三条棱
  const a: Vec3 = [1, 1, 1]
  const b: Vec3 = [1, -1, -1]
  const c: Vec3 = [-1, 1, -1]
  // 以 a 为顶点时，三条棱是 b−a, c−a, d−a，其中 d 是第四个顶点
  const d: Vec3 = [-1, -1, 1]
  return triangleSolidAngle(
    [b[0] - a[0], b[1] - a[1], b[2] - a[2]],
    [c[0] - a[0], c[1] - a[1], c[2] - a[2]],
    [d[0] - a[0], d[1] - a[1], d[2] - a[2]],
  )
}

export const PRESETS = [
  {
    id: 'octant',
    label: '八分之一空间',
    note: '三条正交射线 · Ω = π/2',
    a: [1, 0, 0] as Vec3, b: [0, 1, 0] as Vec3, c: [0, 0, 1] as Vec3,
  },
  {
    id: 'narrow',
    label: '窄立体角',
    note: '三射线靠得很近 · Ω 很小',
    a: [1, 0, 0] as Vec3, b: [1, 0.2, 0] as Vec3, c: [1, 0.1, 0.2] as Vec3,
  },
  {
    id: 'wide',
    label: '宽立体角',
    note: '三射线张得很开',
    a: [1, 0, 0] as Vec3, b: [-0.5, 0.9, 0] as Vec3, c: [-0.4, -0.3, 0.9] as Vec3,
  },
  {
    id: 'flat',
    label: '接近共面',
    note: '三射线近共面 · Ω 趋于 0',
    a: [1, 0, 0] as Vec3, b: [0, 1, 0] as Vec3, c: [0.5, 0.5, 0.03] as Vec3,
  },
] as const

export type PresetId = (typeof PRESETS)[number]['id']

export function presetOf(id: PresetId): { a: Vec3; b: Vec3; c: Vec3 } {
  const p = PRESETS.find((x) => x.id === id) ?? PRESETS[0]
  return { a: p.a, b: p.b, c: p.c }
}

/** 平面角与立体角的类比表 */
export const ANALOGY = [
  { dim: '平面角', unit: '弧度', full: '2π', formula: '弧长 / r' },
  { dim: '立体角', unit: '球面度', full: '4π', formula: '球面面积 / r²' },
] as const
