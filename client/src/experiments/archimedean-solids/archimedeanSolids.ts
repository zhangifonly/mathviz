/**
 * 阿基米德立体（纯函数，便于测试）
 *
 * 半正多面体：面是**两种或以上**正多边形，但所有顶点等价
 * （每个顶点周围的面型序列相同）。共 13 种，外加两个无穷族
 * （棱柱与反棱柱）不计入。
 *
 * 本实验用**截角操作**从柏拉图立体生成其中几种 ——
 * 这比直接硬编码 13 组坐标可靠得多：截角是可验证的几何操作，
 * 而抄 13 组坐标几乎必然出错。
 *
 * 截角（truncation）：把每个顶点切掉，切口成为新面。
 *   正四面体 → 截角四面体（4 个六边形 + 4 个三角形）
 *   立方体   → 截角立方体（6 个八边形 + 8 个三角形）
 *   正八面体 → 截角八面体（8 个六边形 + 6 个四边形）
 *
 * 截角比例 t ∈ (0, 0.5)：t 是沿每条棱切掉的比例。
 * t = 1/3 给出正多边形面（真正的阿基米德立体），
 * t → 0.5 时相邻切口相接，退化成「截半」多面体（如立方八面体）。
 */

import type { Vec3 } from '../../lib/proj3d'
import type { Polyhedron } from '../../lib/polyhedron'
import { edgesOf } from '../../lib/polyhedron'
import { platonicOf, type PlatonicKind } from '../platonic-solids/platonicSolids'

export const TRUNC_BASES = ['tetrahedron', 'cube', 'octahedron'] as const
export type TruncBase = (typeof TRUNC_BASES)[number]

export interface ArchimedeanInfo {
  base: TruncBase
  label: string
  /** 截角后的面型分布，如 '4 个六边形 + 4 个三角形' */
  faceDesc: string
  V: number
  E: number
  F: number
  note: string
}

export const ARCHIMEDEAN_INFO: ArchimedeanInfo[] = [
  {
    base: 'tetrahedron',
    label: '截角四面体',
    faceDesc: '4 个六边形 + 4 个三角形',
    V: 12, E: 18, F: 8,
    note: '每顶点 6-6-3',
  },
  {
    base: 'cube',
    label: '截角立方体',
    faceDesc: '6 个八边形 + 8 个三角形',
    V: 24, E: 36, F: 14,
    note: '每顶点 8-8-3',
  },
  {
    base: 'octahedron',
    label: '截角八面体',
    faceDesc: '8 个六边形 + 6 个四边形',
    V: 24, E: 36, F: 14,
    note: '每顶点 6-6-4 · 可填充空间',
  },
]

/**
 * 理想截角比例：使所有面都成为正多边形。
 *
 * ⚠️ 它**不是常数 1/3**，而随基础立体的面型而异 ——
 * 切口边长取决于顶点处邻边的夹角，三角面与四边面的夹角不同：
 *   正四面体、正八面体（三角面）→ t = 1/3
 *   立方体（四边面）           → t = 1/(2+√2) ≈ 0.2929
 *
 * 我一开始统一用 1/3，结果截角立方体的八边形面边长不等（不是半正多面体），
 * 是数值检验暴露出来的。
 */
export function idealT(base: TruncBase): number {
  return base === 'cube' ? 1 / (2 + Math.SQRT2) : 1 / 3
}

/** 三角面基础立体的理想比例，保留给通用场合 */
export const IDEAL_T = 1 / 3

function sub(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
}

function add(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
}

function scale(a: Vec3, s: number): Vec3 {
  return [a[0] * s, a[1] * s, a[2] * s]
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
}

function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}

function norm(a: Vec3): number {
  return Math.hypot(a[0], a[1], a[2])
}

/**
 * 截角操作。
 *
 * 每条棱 (a,b) 产生两个新顶点：靠 a 端的 a+(b−a)·t 与靠 b 端的 a+(b−a)·(1−t)。
 * 新面有两类：
 *   1. 原面的截角版本（每个原顶点被两个新顶点替代）
 *   2. 每个原顶点处的切口面（该顶点所有邻边上靠它那侧的新顶点）
 */
export function truncate(base: Polyhedron, t = IDEAL_T): Polyhedron {
  const edges = edgesOf(base)
  // 新顶点：每条棱上两个。键为 "起点-终点"（有向）
  const newIndex = new Map<string, number>()
  const verts: Vec3[] = []
  const push = (from: number, to: number): number => {
    const key = `${from}>${to}`
    const hit = newIndex.get(key)
    if (hit !== undefined) return hit
    const p = add(base.vertices[from], scale(sub(base.vertices[to], base.vertices[from]), t))
    verts.push(p)
    const idx = verts.length - 1
    newIndex.set(key, idx)
    return idx
  }
  for (const [a, b] of edges) {
    push(a, b)
    push(b, a)
  }

  // 类型 1：原面截角。原面的每条有向边 (u→v) 贡献 push(u,v) 与 push(v,u)
  const faces: number[][] = base.faces.map((f) => {
    const ring: number[] = []
    for (let i = 0; i < f.length; i++) {
      const u = f[i]
      const v = f[(i + 1) % f.length]
      ring.push(push(u, v), push(v, u))
    }
    return ring
  })

  // 类型 2：顶点切口。收集该顶点所有邻居, 按绕顶点的环序排列
  const neighbors: number[][] = base.vertices.map(() => [])
  for (const [a, b] of edges) {
    neighbors[a].push(b)
    neighbors[b].push(a)
  }
  const centroid = scale(
    base.vertices.reduce((s, v) => add(s, v), [0, 0, 0] as Vec3),
    1 / base.vertices.length,
  )
  base.vertices.forEach((v, vi) => {
    const axis = sub(v, centroid)
    const al = norm(axis)
    const n: Vec3 = al < 1e-12 ? [0, 0, 1] : scale(axis, 1 / al)
    const refRaw = Math.abs(n[0]) < 0.9 ? cross(n, [1, 0, 0]) : cross(n, [0, 1, 0])
    const e1 = scale(refRaw, 1 / norm(refRaw))
    const e2 = cross(n, e1)
    // 按极角排序保证切口面不自交; 法向朝外需要逆时针(从外看)
    const sorted = [...neighbors[vi]].sort((p, q) => {
      const vp = sub(verts[push(vi, p)], v)
      const vq = sub(verts[push(vi, q)], v)
      return Math.atan2(dot(vp, e2), dot(vp, e1)) - Math.atan2(dot(vq, e2), dot(vq, e1))
    })
    faces.push(sorted.map((nb) => push(vi, nb)))
  })

  return { name: `截角${base.name}`, vertices: verts, faces }
}

/** 按基础立体取截角结果。t 省略时用该立体的理想比例 */
export function archimedeanOf(base: TruncBase, t?: number): Polyhedron {
  return truncate(platonicOf(base as PlatonicKind), t ?? idealT(base))
}

/**
 * 截半（rectification）：新顶点取每条棱的**中点**，
 * 新面为「原面的中点环」加「原顶点处的中点环」。
 *
 * ⚠️ 不能简单地对 truncate 传 t=0.5：那样每条棱仍产生两个新顶点，
 * 它们虽然坐标重合但下标不同，V/E/F 会算成 24/36/14 而非正确的
 * 立方八面体 12/24/14。必须让每条棱只出一个顶点。
 *
 * 立方体截半得立方八面体（8 三角形 + 6 四边形），
 * 正八面体截半也得立方八面体 —— 对偶的截半同构。
 */
export function rectify(base: Polyhedron): Polyhedron {
  const edges = edgesOf(base)
  const midIndex = new Map<string, number>()
  const verts: Vec3[] = []
  edges.forEach(([a, b]) => {
    verts.push(scale(add(base.vertices[a], base.vertices[b]), 0.5))
    midIndex.set(`${a}-${b}`, verts.length - 1)
  })
  const midOf = (a: number, b: number): number => {
    const k = a < b ? `${a}-${b}` : `${b}-${a}`
    const hit = midIndex.get(k)
    if (hit === undefined) throw new Error(`棱 ${a}-${b} 不存在`)
    return hit
  }

  // 类型 1：原面的中点环（按原面顶点顺序取相邻棱中点）
  const faces: number[][] = base.faces.map((f) =>
    f.map((_, i) => midOf(f[i], f[(i + 1) % f.length])))

  // 类型 2：原顶点处的中点环（该顶点所有邻边的中点，按环序）
  const neighbors: number[][] = base.vertices.map(() => [])
  for (const [a, b] of edges) {
    neighbors[a].push(b)
    neighbors[b].push(a)
  }
  const centroid = scale(
    base.vertices.reduce((s, v) => add(s, v), [0, 0, 0] as Vec3),
    1 / base.vertices.length,
  )
  base.vertices.forEach((v, vi) => {
    const axis = sub(v, centroid)
    const al = norm(axis)
    const n: Vec3 = al < 1e-12 ? [0, 0, 1] : scale(axis, 1 / al)
    const refRaw = Math.abs(n[0]) < 0.9 ? cross(n, [1, 0, 0]) : cross(n, [0, 1, 0])
    const e1 = scale(refRaw, 1 / norm(refRaw))
    const e2 = cross(n, e1)
    const sorted = [...neighbors[vi]].sort((p, q) => {
      const vp = sub(verts[midOf(vi, p)], v)
      const vq = sub(verts[midOf(vi, q)], v)
      return Math.atan2(dot(vp, e2), dot(vp, e1)) - Math.atan2(dot(vq, e2), dot(vq, e1))
    })
    faces.push(sorted.map((nb) => midOf(vi, nb)))
  })

  return { name: `截半${base.name}`, vertices: verts, faces }
}

/** 截角后各面的边数直方图，用于验证面型分布 */
export function faceTypeOf(base: TruncBase, t?: number): Record<number, number> {
  const p = archimedeanOf(base, t)
  const h: Record<number, number> = {}
  for (const f of p.faces) h[f.length] = (h[f.length] ?? 0) + 1
  return h
}

/** 截角后是否所有面都是正多边形（取该立体的理想比例时应成立） */
export function isSemiRegular(base: TruncBase, t?: number, tol = 1e-6): boolean {
  const p = archimedeanOf(base, t)
  // 每个面内的棱长应相等
  for (const f of p.faces) {
    const ls: number[] = []
    for (let i = 0; i < f.length; i++) {
      const a = p.vertices[f[i]]
      const b = p.vertices[f[(i + 1) % f.length]]
      ls.push(norm(sub(a, b)))
    }
    if (Math.max(...ls) - Math.min(...ls) > tol) return false
  }
  return true
}

export function infoOf(base: TruncBase): ArchimedeanInfo {
  return ARCHIMEDEAN_INFO.find((i) => i.base === base) ?? ARCHIMEDEAN_INFO[0]
}
