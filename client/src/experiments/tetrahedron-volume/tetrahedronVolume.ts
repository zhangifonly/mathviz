/**
 * 四面体体积与三重积（纯函数，便于测试）
 *
 * 平面上二阶行列式给出平行四边形面积；空间里**三阶行列式给出平行六面体体积**。
 * 这个量叫标量三重积：
 *
 *   V_平行六面体 = |a · (b × c)| = |det[a b c]|
 *   V_四面体     = |a · (b × c)| / 6
 *
 * 那个 1/6 是这样来的：平行六面体切成 6 个等体积四面体（先对半切成两个
 * 三棱柱，每个再切成 3 个四面体）。本实验用数值验证这个 6 而不是背它。
 *
 * 三重积的三条性质都能直接验证：
 *   1. **循环对称**：a·(b×c) = b·(c×a) = c·(a×b)
 *   2. **交换变号**：交换任意两个向量，符号翻转（定向反了）
 *   3. **共面判据**：三重积为零 ⟺ 三向量共面 ⟺ 四面体退化成平面图形
 *
 * 推广到 n 维：n 维单纯形体积 = |det| / n!。三维的 3! = 6 只是特例。
 */

import type { Vec3 } from '../../lib/proj3d'

export function cross(a: Vec3, b: Vec3): Vec3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ]
}

export function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}

export function sub(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
}

export function norm(a: Vec3): number {
  return Math.hypot(a[0], a[1], a[2])
}

/** 标量三重积 a·(b×c)，等于三阶行列式 det[a b c]（带符号） */
export function tripleProduct(a: Vec3, b: Vec3, c: Vec3): number {
  return dot(a, cross(b, c))
}

/** 三阶行列式的直接展开，用来独立验证三重积 */
export function determinant3(a: Vec3, b: Vec3, c: Vec3): number {
  return (
    a[0] * (b[1] * c[2] - b[2] * c[1])
    - a[1] * (b[0] * c[2] - b[2] * c[0])
    + a[2] * (b[0] * c[1] - b[1] * c[0])
  )
}

/** 平行六面体体积（三重积的绝对值） */
export function parallelepipedVolume(a: Vec3, b: Vec3, c: Vec3): number {
  return Math.abs(tripleProduct(a, b, c))
}

/** 四面体体积 = 平行六面体的 1/6 */
export function tetrahedronVolume(a: Vec3, b: Vec3, c: Vec3): number {
  return parallelepipedVolume(a, b, c) / 6
}

/** 平行六面体切成几个等体积四面体 —— 这个 6 由几何决定，不是随手写的 */
export const TETRAHEDRA_PER_PARALLELEPIPED = 6

/** n 维单纯形的体积除数 n!（三维给 6） */
export function simplexDivisor(n: number): number {
  let f = 1
  for (let i = 2; i <= n; i++) f *= i
  return f
}

export interface Tetrahedron {
  /** 四个顶点，第一个作为公共原点 */
  P: Vec3
  A: Vec3
  B: Vec3
  C: Vec3
}

/** 由四个顶点算体积（先减去公共顶点得到三条棱向量） */
export function volumeOfTetrahedron(t: Tetrahedron): number {
  return tetrahedronVolume(sub(t.A, t.P), sub(t.B, t.P), sub(t.C, t.P))
}

/** 带符号的体积（反映定向） */
export function signedVolume(t: Tetrahedron): number {
  return tripleProduct(sub(t.A, t.P), sub(t.B, t.P), sub(t.C, t.P)) / 6
}

/** 三向量是否共面（三重积为零） */
export function areCoplanar(a: Vec3, b: Vec3, c: Vec3, tol = 1e-9): boolean {
  return Math.abs(tripleProduct(a, b, c)) < tol
}

/** 四个点是否共面 */
export function pointsCoplanar(t: Tetrahedron, tol = 1e-9): boolean {
  return areCoplanar(sub(t.A, t.P), sub(t.B, t.P), sub(t.C, t.P), tol)
}

/**
 * 循环对称误差：a·(b×c)、b·(c×a)、c·(a×b) 三者应完全相等。
 * 返回最大偏差。
 */
export function cyclicSymmetryError(a: Vec3, b: Vec3, c: Vec3): number {
  const v1 = tripleProduct(a, b, c)
  const v2 = tripleProduct(b, c, a)
  const v3 = tripleProduct(c, a, b)
  return Math.max(Math.abs(v1 - v2), Math.abs(v2 - v3), Math.abs(v1 - v3))
}

/**
 * 交换变号误差：交换任意两个向量后三重积应恰好取反。
 * 返回 |交换后 + 原值| 的最大值（应为 0）。
 */
export function swapAntisymmetryError(a: Vec3, b: Vec3, c: Vec3): number {
  const v = tripleProduct(a, b, c)
  return Math.max(
    Math.abs(tripleProduct(b, a, c) + v),
    Math.abs(tripleProduct(a, c, b) + v),
    Math.abs(tripleProduct(c, b, a) + v),
  )
}

/**
 * 底面积 × 高 / 3 的独立算法，用来交叉验证三重积公式。
 * 底面取 A-B-C 三角形，高是 P 到该平面的距离。
 */
export function volumeByBaseHeight(t: Tetrahedron): number {
  const ab = sub(t.B, t.A)
  const ac = sub(t.C, t.A)
  const n = cross(ab, ac)
  const baseArea = norm(n) / 2
  const nl = norm(n)
  if (nl < 1e-15) return 0
  // P 到平面 ABC 的距离
  const height = Math.abs(dot(sub(t.P, t.A), n)) / nl
  return (baseArea * height) / 3
}

/** 两种算法的差，应为 0 */
export function volumeResidual(t: Tetrahedron): number {
  return Math.abs(volumeOfTetrahedron(t) - volumeByBaseHeight(t))
}

/** 四面体的四个面（顶点下标环，法向朝外） */
export function tetraFaces(): number[][] {
  // 顶点顺序 [P, A, B, C]
  return [[0, 2, 1], [0, 1, 3], [0, 3, 2], [1, 2, 3]]
}

/** 顶点数组形式 */
export function tetraVertices(t: Tetrahedron): Vec3[] {
  return [t.P, t.A, t.B, t.C]
}

/** 单位立方体的三条棱向量，体积应恰为 1 */
export const UNIT_CUBE_EDGES: [Vec3, Vec3, Vec3] = [
  [1, 0, 0], [0, 1, 0], [0, 0, 1],
]

export const PRESETS = [
  {
    id: 'unit',
    label: '单位正交',
    note: '三棱正交等长 · 六面体体积 1',
    a: [1, 0, 0] as Vec3, b: [0, 1, 0] as Vec3, c: [0, 0, 1] as Vec3,
  },
  {
    id: 'skew',
    label: '倾斜',
    note: '棱不正交 · 体积变小',
    a: [1, 0, 0] as Vec3, b: [0.6, 0.8, 0] as Vec3, c: [0.3, 0.3, 0.9] as Vec3,
  },
  {
    id: 'flat',
    label: '接近共面',
    note: '三重积趋于零 · 体积趋于零',
    a: [1, 0, 0] as Vec3, b: [0, 1, 0] as Vec3, c: [0.5, 0.5, 0.02] as Vec3,
  },
  {
    id: 'coplanar',
    label: '完全共面',
    note: '三重积为零 · 四面体退化',
    a: [1, 0, 0] as Vec3, b: [0, 1, 0] as Vec3, c: [0.5, 0.5, 0] as Vec3,
  },
  {
    id: 'negative',
    label: '反定向',
    note: '交换两棱 · 带符号体积变负',
    a: [0, 1, 0] as Vec3, b: [1, 0, 0] as Vec3, c: [0, 0, 1] as Vec3,
  },
] as const

export type PresetId = (typeof PRESETS)[number]['id']

export function presetOf(id: PresetId): { a: Vec3; b: Vec3; c: Vec3 } {
  const p = PRESETS.find((x) => x.id === id) ?? PRESETS[0]
  return { a: p.a, b: p.b, c: p.c }
}

/** 由三条棱向量构造四面体（公共顶点在原点） */
export function tetraFromEdges(a: Vec3, b: Vec3, c: Vec3): Tetrahedron {
  return { P: [0, 0, 0], A: a, B: b, C: c }
}
