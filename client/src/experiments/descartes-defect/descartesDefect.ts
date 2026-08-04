/**
 * Descartes 角亏定理（纯函数，便于测试）
 *
 * 在多面体的一个顶点处，把周围各面的面角加起来。平面上这些角能凑满 360°，
 * 但在凸多面体的顶点上**永远凑不满** —— 差的那部分叫**角亏**：
 *
 *   δ(v) = 2π − Σ(该顶点处的面角)
 *
 * Descartes 发现（1630 年代，比欧拉早一百多年）：**所有顶点的角亏之和恒为 4π**，
 * 与多面体的形状、顶点个数完全无关。
 *
 *   立方体：8 个顶点，每个 2π − 3×(π/2) = π/2，合计 8 × π/2 = 4π ✓
 *   正四面体：4 个顶点，每个 2π − 3×(π/3) = π，合计 4π ✓
 *   正十二面体：20 个顶点，每个 2π − 3×(3π/5) = π/5，合计 4π ✓
 *
 * **它与欧拉公式等价**：把 δ 总和 = 4π 展开，用「面角总和 = Σ(nᵢ−2)π」代入，
 * 立刻得到 V − E + F = 2。所以这是欧拉公式的"角度版本"。
 *
 * 更深的意义：4π 正是单位球的总曲率。角亏就是**离散化的高斯曲率**，
 * 而这个定理是**高斯–博内定理**在多面体上的形式 —— 与之前做的球面盈余、
 * 双曲角亏是同一件事的三种面孔。
 */

import type { Vec3 } from '../../lib/proj3d'
import {
  edgesOf, eulerCount, platonicOf, normalizeToSphere,
  type Polyhedron, type PlatonicId,
} from '../../lib/polyhedron'

export function sub(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
}

export function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}

export function norm(a: Vec3): number {
  return Math.hypot(a[0], a[1], a[2])
}

/** 面 face 在顶点 vi 处的内角（面角） */
export function faceAngleAt(
  p: Polyhedron, face: number[], vi: number,
): number {
  const k = face.indexOf(vi)
  if (k < 0) return 0
  const prev = p.vertices[face[(k - 1 + face.length) % face.length]]
  const next = p.vertices[face[(k + 1) % face.length]]
  const cur = p.vertices[vi]
  const a = sub(prev, cur)
  const b = sub(next, cur)
  const na = norm(a)
  const nb = norm(b)
  if (na < 1e-15 || nb < 1e-15) return 0
  return Math.acos(Math.max(-1, Math.min(1, dot(a, b) / (na * nb))))
}

/** 顶点 vi 周围所有面角之和 */
export function angleSumAt(p: Polyhedron, vi: number): number {
  let s = 0
  for (const f of p.faces) {
    if (f.includes(vi)) s += faceAngleAt(p, f, vi)
  }
  return s
}

/** 顶点 vi 处的角亏 δ = 2π − 面角和 */
export function defectAt(p: Polyhedron, vi: number): number {
  return 2 * Math.PI - angleSumAt(p, vi)
}

/** 所有顶点的角亏 */
export function allDefects(p: Polyhedron): number[] {
  return p.vertices.map((_, i) => defectAt(p, i))
}

/** 角亏总和（Descartes 定理：恒为 4π） */
export function totalDefect(p: Polyhedron): number {
  return allDefects(p).reduce((a, b) => a + b, 0)
}

/** 与 4π 的偏差 */
export function defectResidual(p: Polyhedron): number {
  return Math.abs(totalDefect(p) - 4 * Math.PI)
}

/**
 * 由角亏定理推出欧拉公式。
 *
 * 推导：Σδ = 2πV − Σ(所有面角) = 2πV − Σ_faces (nᵢ−2)π
 *          = 2πV − π·Σnᵢ + 2πF = 2πV − 2πE + 2πF   （Σnᵢ = 2E）
 * 令 Σδ = 4π 即得 V − E + F = 2。
 *
 * 返回由角亏反推的 χ，应与 eulerCount 一致。
 */
export function eulerFromDefect(p: Polyhedron): number {
  return totalDefect(p) / (2 * Math.PI)
}

/** 面角总和 Σ(nᵢ−2)π 的解析值 */
export function totalFaceAngleAnalytic(p: Polyhedron): number {
  return p.faces.reduce((s, f) => s + (f.length - 2) * Math.PI, 0)
}

/** 面角总和的数值累加（应与解析值一致） */
export function totalFaceAngleNumeric(p: Polyhedron): number {
  let s = 0
  for (const f of p.faces) {
    for (const vi of f) s += faceAngleAt(p, f, vi)
  }
  return s
}

/** 握手关系 Σ面的边数 = 2E */
export function faceSideSum(p: Polyhedron): number {
  return p.faces.reduce((s, f) => s + f.length, 0)
}

/** 角亏是否处处相等（正多面体的顶点传递性） */
export function defectSpread(p: Polyhedron): number {
  const d = allDefects(p)
  return Math.max(...d) - Math.min(...d)
}

/**
 * 角亏与球面覆盖的对应：把每个顶点的角亏看成球面上的一块面积，
 * 合起来恰好是整个单位球面 4π。返回各顶点占的比例。
 */
export function defectFractions(p: Polyhedron): number[] {
  const total = totalDefect(p)
  return allDefects(p).map((d) => d / total)
}

/** 五种柏拉图立体的角亏理论值（每顶点） */
export const PLATONIC_DEFECTS: Record<PlatonicId, { perVertex: number; count: number }> = {
  tetrahedron: { perVertex: Math.PI, count: 4 },
  cube: { perVertex: Math.PI / 2, count: 8 },
  octahedron: { perVertex: (2 * Math.PI) / 3, count: 6 },
  dodecahedron: { perVertex: Math.PI / 5, count: 20 },
  icosahedron: { perVertex: Math.PI / 3, count: 12 },
}

export const SOLID_IDS: PlatonicId[] = [
  'tetrahedron', 'cube', 'octahedron', 'dodecahedron', 'icosahedron',
]

/** 取归一化到单位外接球的柏拉图立体（便于统一显示） */
export function solidOf(id: PlatonicId): Polyhedron {
  return normalizeToSphere(platonicOf(id), 1)
}

/** 与球面/双曲三角形的对照：三种几何里的同一条定理 */
export const GAUSS_BONNET_FACES = [
  { where: '多面体顶点', quantity: '角亏 δ = 2π − 面角和', total: 'Σδ = 4π' },
  { where: '球面三角形', quantity: '盈余 = 内角和 − π', total: '= 面积' },
  { where: '双曲三角形', quantity: '角亏 = π − 内角和', total: '= 面积' },
] as const

export { edgesOf, eulerCount }
export type { Polyhedron, PlatonicId }
