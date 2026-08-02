/**
 * 球面镶嵌（纯函数，便于测试）
 *
 * 把多面体的顶点推到单位球上、棱换成大圆弧，就得到球面镶嵌。
 * 五种柏拉图立体给出五种**正规球面镶嵌**，记作 Schläfli 符号 {q, p}：
 * 每个面是球面正 q 边形，每个顶点聚集 p 个面。
 *
 * 与平面镶嵌的关键差异在那个不等式：
 *   平面镶嵌  (p−2)(q−2) = 4   角亏为零，恰好摊平
 *   球面镶嵌  (p−2)(q−2) < 4   角亏为正，围成闭曲面（5 种）
 *   双曲镶嵌  (p−2)(q−2) > 4   角亏为负，需要负曲率（无穷多种）
 *
 * 所以同一个不等式的三种情形，对应三种几何。这是本实验的主线。
 *
 * 另一条可验证的主线：**球面面积配平**。
 * 每个球面正 q 边形的面积由球面盈余给出，F 个面的面积之和必须精确等于 4π。
 * 这是检验镶嵌数据是否自洽的强判据 —— 面积算错一点就配不平。
 */

import type { Vec3 } from '../../lib/proj3d'
import { unit, sphericalDistance, sphericalExcess, triangleAngles } from '../../lib/sphere3d'
import type { SphericalTriangle } from '../../lib/sphere3d'
import { platonicOf, PLATONIC_INFO, type PlatonicKind } from '../platonic-solids/platonicSolids'
import { edgesOf, faceCenter } from '../../lib/polyhedron'

export const TILING_KINDS = PLATONIC_INFO.map((i) => i.kind)
export type TilingKind = PlatonicKind

export interface TilingInfo {
  kind: TilingKind
  label: string
  /** Schläfli 符号 {q, p}：q 边形，每顶点 p 个 */
  schlafli: string
  V: number
  E: number
  F: number
  note: string
}

export const TILING_INFO: TilingInfo[] = PLATONIC_INFO.map((i) => ({
  kind: i.kind,
  label: `${i.label}镶嵌`,
  schlafli: `{${i.faceSides}, ${i.vertexFaces}}`,
  V: i.V,
  E: i.E,
  F: i.F,
  note: `每面 ${i.faceSides} 边 · 每顶点 ${i.vertexFaces} 面`,
}))

/** 把多面体顶点推到单位球上 */
export function sphericalVertices(kind: TilingKind): Vec3[] {
  return platonicOf(kind).vertices.map((v) => unit(v))
}

/** 镶嵌的棱：顶点下标对，边是两点间的大圆弧 */
export function tilingEdges(kind: TilingKind): Array<[number, number]> {
  return edgesOf(platonicOf(kind))
}

/** 每个面的顶点下标环 */
export function tilingFaces(kind: TilingKind): number[][] {
  return platonicOf(kind).faces
}

/** 面心推到球面上 */
export function sphericalFaceCenters(kind: TilingKind): Vec3[] {
  const p = platonicOf(kind)
  return p.faces.map((_, i) => unit(faceCenter(p, i)))
}

/**
 * 一个球面正 q 边形的面积。
 *
 * 把它从面心切成 q 个球面三角形，每个三角形的面积由球面盈余给出，相加即得。
 * 这比直接套球面多边形公式更稳 —— 后者要先算所有内角，误差累积更多。
 */
export function faceArea(kind: TilingKind, faceIndex: number): number {
  const verts = sphericalVertices(kind)
  const faces = tilingFaces(kind)
  const center = sphericalFaceCenters(kind)[faceIndex]
  const ring = faces[faceIndex]
  let area = 0
  for (let i = 0; i < ring.length; i++) {
    const t: SphericalTriangle = {
      A: center,
      B: verts[ring[i]],
      C: verts[ring[(i + 1) % ring.length]],
    }
    area += sphericalExcess(t)
  }
  return area
}

/** 所有面的面积之和，应精确等于 4π */
export function totalArea(kind: TilingKind): number {
  const n = tilingFaces(kind).length
  let s = 0
  for (let i = 0; i < n; i++) s += faceArea(kind, i)
  return s
}

/** 面积配平的相对误差 */
export function areaBalanceError(kind: TilingKind): number {
  return Math.abs(totalArea(kind) - 4 * Math.PI) / (4 * Math.PI)
}

/** 每个面占球面的比例，正规镶嵌下应恒为 1/F */
export function faceFraction(kind: TilingKind, faceIndex: number): number {
  return faceArea(kind, faceIndex) / (4 * Math.PI)
}

/** 棱的球面长度（弧长）。正规镶嵌下所有棱等长 */
export function edgeArcLengths(kind: TilingKind): number[] {
  const verts = sphericalVertices(kind)
  return tilingEdges(kind).map(([a, b]) => sphericalDistance(verts[a], verts[b]))
}

/** 所有棱是否等长 */
export function edgesEquilateral(kind: TilingKind, tol = 1e-9): boolean {
  const ls = edgeArcLengths(kind)
  return Math.max(...ls) - Math.min(...ls) < tol
}

/**
 * 球面正 q 边形的单个内角。
 * 平面正 q 边形的内角是 π(1−2/q)，球面上更大 —— 这正是角亏为正的来源。
 */
export function faceInteriorAngle(kind: TilingKind, faceIndex: number): number {
  const verts = sphericalVertices(kind)
  const ring = tilingFaces(kind)[faceIndex]
  const q = ring.length
  // 取环上连续三点算中间那点的球面角
  const t: SphericalTriangle = {
    A: verts[ring[1 % q]],
    B: verts[ring[0]],
    C: verts[ring[2 % q]],
  }
  return triangleAngles(t)[0]
}

/** 平面正 q 边形的内角，用作对照 */
export function planarInteriorAngle(q: number): number {
  return Math.PI * (1 - 2 / q)
}

/** 顶点角亏：2π 减去该顶点处聚集的所有面角之和 */
export function vertexAngularDefect(kind: TilingKind): number {
  const info = TILING_INFO.find((t) => t.kind === kind)!
  const p = PLATONIC_INFO.find((i) => i.kind === kind)!
  // 球面镶嵌下顶点处的面角之和恰好是 2π（球面上顶点周围是完整的）
  // 真正有意义的是**平面展开时**的角亏，即 2π − p·(平面正 q 边形内角)
  void info
  return 2 * Math.PI - p.vertexFaces * planarInteriorAngle(p.faceSides)
}

/** Schläfli 判别式 (p−2)(q−2)：<4 球面, =4 平面, >4 双曲 */
export function schlafliDiscriminant(p: number, q: number): number {
  return (p - 2) * (q - 2)
}

export type GeometryType = '球面' | '平面' | '双曲'

/** 由 (p,q) 判定几何类型 */
export function geometryOf(p: number, q: number): GeometryType {
  const d = schlafliDiscriminant(p, q)
  if (d < 4) return '球面'
  if (d === 4) return '平面'
  return '双曲'
}

/** 三类几何的代表 (p,q)，供讲解对照 */
export const GEOMETRY_EXAMPLES = [
  { p: 3, q: 3, label: '{3,3} 正四面体', type: '球面' as GeometryType },
  { p: 5, q: 3, label: '{3,5} 正二十面体', type: '球面' as GeometryType },
  { p: 3, q: 6, label: '{6,3} 正六边形镶嵌', type: '平面' as GeometryType },
  { p: 4, q: 4, label: '{4,4} 正方形镶嵌', type: '平面' as GeometryType },
  { p: 3, q: 7, label: '{7,3} 双曲镶嵌', type: '双曲' as GeometryType },
  { p: 5, q: 4, label: '{4,5} 双曲镶嵌', type: '双曲' as GeometryType },
] as const

export function infoOf(kind: TilingKind): TilingInfo {
  return TILING_INFO.find((t) => t.kind === kind) ?? TILING_INFO[0]
}
