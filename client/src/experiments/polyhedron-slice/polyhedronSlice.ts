/**
 * 多面体截面（纯函数，便于测试）
 *
 * 用一个平面去切多面体，切口是什么形状？答案随平面的位置和方向剧烈变化，
 * 有几个结果相当反直觉：
 *
 * 1. **立方体能切出正六边形**。沿体对角线的垂直平面从中心切过去，
 *    截面是六条等长边的正六边形 —— 一个只有正方形面的立体，
 *    却能切出六边形，这是最经典的"意外"。
 *
 * 2. **切口边数可以超过面数**。立方体只有 6 个面，但截面最多是六边形，
 *    恰好等于面数 —— 因为切口的每条边都来自一个面。这给出上界 F。
 *
 * 3. **正四面体能切出正方形**。四个三角面的立体，切出四边形，
 *    而且在中间高度处恰好是正方形。
 *
 * 算法是标准的**平面-多面体求交**：
 *   对每个面，求平面与该面所在多边形的交线段；把所有线段首尾相接成环。
 * 关键是最后那步排序 —— 线段的产生顺序是任意的，不接成环就画不出多边形。
 */

import type { Vec3 } from '../../lib/proj3d'
import {
  edgesOf, platonicOf, normalizeToSphere,
  type Polyhedron, type PlatonicId,
} from '../../lib/polyhedron'

export function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}

export function sub(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
}

export function add(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
}

export function scale(a: Vec3, k: number): Vec3 {
  return [a[0] * k, a[1] * k, a[2] * k]
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
  return n < 1e-15 ? [0, 0, 1] : [a[0] / n, a[1] / n, a[2] / n]
}

/** 切平面：法向 n，到原点有向距离 d（平面方程 n·x = d） */
export interface Plane {
  n: Vec3
  d: number
}

/** 点到平面的有向距离 */
export function signedDistance(p: Vec3, plane: Plane): number {
  return dot(plane.n, p) - plane.d
}

/**
 * 一条棱与平面的交点。两端异号才有交点。
 * 返回 null 表示不相交（或整条棱在平面上，那种退化情形另算）。
 */
export function edgeIntersection(
  a: Vec3, b: Vec3, plane: Plane, tol = 1e-9,
): Vec3 | null {
  const da = signedDistance(a, plane)
  const db = signedDistance(b, plane)
  // 同号（都在一侧）则无交点
  if (da > tol && db > tol) return null
  if (da < -tol && db < -tol) return null
  const denom = da - db
  if (Math.abs(denom) < 1e-15) return null // 平行于平面
  const t = da / denom
  if (t < -tol || t > 1 + tol) return null
  return add(a, scale(sub(b, a), t))
}

/**
 * 平面与多面体的截面多边形。
 *
 * 做法：对每个面收集它与平面的交点（该面的棱产生的），
 * 每个面最多贡献一条线段；把所有线段接成环。
 *
 * ⚠️ 必须按环排序。线段来自各个面，顺序是任意的，
 * 直接连起来会画成一团乱线（这是这类算法最常见的坑）。
 */
export function sliceOf(p: Polyhedron, plane: Plane, tol = 1e-9): Vec3[] {
  const segments: Array<[Vec3, Vec3]> = []
  for (const face of p.faces) {
    const pts: Vec3[] = []
    for (let k = 0; k < face.length; k++) {
      const a = p.vertices[face[k]]
      const b = p.vertices[face[(k + 1) % face.length]]
      const ip = edgeIntersection(a, b, plane, tol)
      if (ip && !pts.some((q) => norm(sub(q, ip)) < 1e-7)) pts.push(ip)
    }
    if (pts.length >= 2) segments.push([pts[0], pts[1]])
  }
  if (segments.length < 3) return []
  return chainSegments(segments)
}

/** 把线段首尾相接成一个环 */
function chainSegments(segs: Array<[Vec3, Vec3]>, tol = 1e-6): Vec3[] {
  const used = new Array(segs.length).fill(false)
  const ring: Vec3[] = [segs[0][0], segs[0][1]]
  used[0] = true
  for (let guard = 0; guard < segs.length + 2; guard++) {
    const tail = ring[ring.length - 1]
    let found = false
    for (let i = 0; i < segs.length; i++) {
      if (used[i]) continue
      const [a, b] = segs[i]
      if (norm(sub(a, tail)) < tol) {
        ring.push(b)
        used[i] = true
        found = true
        break
      }
      if (norm(sub(b, tail)) < tol) {
        ring.push(a)
        used[i] = true
        found = true
        break
      }
    }
    if (!found) break
  }
  // 闭合：末点与首点重合则去掉末点
  if (ring.length > 2 && norm(sub(ring[ring.length - 1], ring[0])) < tol) {
    ring.pop()
  }
  return dedupeRing(ring, tol)
}

/**
 * 去掉环里重复的点。
 *
 * ⚠️ 切平面**恰好过某个顶点**时，该顶点会被相邻的两个面各算一次，
 * 于是环里出现重复点，边数虚高。四面体在 n=(1,1,0) 中点处就是这样：
 * 只有 4 条线段却接出 5 个点，超过了「边数 ≤ 面数」这个上界。
 */
function dedupeRing(ring: Vec3[], tol: number): Vec3[] {
  const out: Vec3[] = []
  for (const p of ring) {
    if (!out.some((q) => norm(sub(q, p)) < tol)) out.push(p)
  }
  return out
}

/** 截面多边形的边长表 */
export function sliceEdgeLengths(ring: Vec3[]): number[] {
  const out: number[] = []
  for (let i = 0; i < ring.length; i++) {
    out.push(norm(sub(ring[(i + 1) % ring.length], ring[i])))
  }
  return out
}

/** 边长的相对极差（正多边形应为 0） */
export function sliceRegularity(ring: Vec3[]): number {
  const ls = sliceEdgeLengths(ring)
  if (ls.length === 0) return 0
  const mx = Math.max(...ls)
  const mn = Math.min(...ls)
  return mx < 1e-12 ? 0 : (mx - mn) / mx
}

/** 截面面积（用形心扇形法，平面多边形） */
export function sliceArea(ring: Vec3[]): number {
  if (ring.length < 3) return 0
  const c = scale(
    ring.reduce((s, v) => add(s, v), [0, 0, 0] as Vec3), 1 / ring.length,
  )
  let area = 0
  for (let i = 0; i < ring.length; i++) {
    const a = sub(ring[i], c)
    const b = sub(ring[(i + 1) % ring.length], c)
    area += norm(cross(a, b)) / 2
  }
  return area
}

/** 截面周长 */
export function slicePerimeter(ring: Vec3[]): number {
  return sliceEdgeLengths(ring).reduce((a, b) => a + b, 0)
}

/** 截面的内角（用于判断是否正多边形） */
export function sliceAngles(ring: Vec3[]): number[] {
  const n = ring.length
  const out: number[] = []
  for (let i = 0; i < n; i++) {
    const prev = ring[(i - 1 + n) % n]
    const cur = ring[i]
    const next = ring[(i + 1) % n]
    const a = sub(prev, cur)
    const b = sub(next, cur)
    const na = norm(a)
    const nb = norm(b)
    if (na < 1e-12 || nb < 1e-12) {
      out.push(0)
      continue
    }
    out.push(Math.acos(Math.max(-1, Math.min(1, dot(a, b) / (na * nb)))))
  }
  return out
}

/** 是否正多边形（边等长且角相等） */
export function isRegularSlice(ring: Vec3[], tol = 1e-6): boolean {
  if (ring.length < 3) return false
  if (sliceRegularity(ring) > tol) return false
  const angs = sliceAngles(ring)
  return Math.max(...angs) - Math.min(...angs) < tol * 10
}

/** 预设切法 */
export interface SlicePreset {
  id: string
  label: string
  solid: PlatonicId
  /** 法向（未归一化亦可） */
  n: Vec3
  /** 到原点距离 */
  d: number
  note: string
  expect: string
}

export const PRESETS: SlicePreset[] = [
  {
    id: 'cube-hex',
    label: '立方体切正六边形',
    solid: 'cube',
    n: [1, 1, 1],
    d: 0,
    note: '沿体对角线垂直切，过中心',
    expect: '正六边形',
  },
  {
    id: 'cube-square',
    label: '立方体切正方形',
    solid: 'cube',
    n: [0, 0, 1],
    d: 0,
    note: '平行于面切',
    expect: '正方形',
  },
  {
    id: 'cube-tri',
    label: '立方体切三角形',
    solid: 'cube',
    n: [1, 1, 1],
    d: 0.75,
    note: '沿体对角线切一角',
    expect: '正三角形',
  },
  {
    id: 'tetra-square',
    label: '正四面体切正方形',
    solid: 'tetrahedron',
    n: [0, 0, 1],
    d: 0,
    note: '中间高度处水平切',
    expect: '正方形',
  },
  {
    id: 'octa-hex',
    label: '正八面体切正六边形',
    solid: 'octahedron',
    n: [1, 1, 1],
    d: 0,
    note: '沿三重轴切',
    expect: '正六边形',
  },
] as const

export function presetOf(id: string): SlicePreset {
  return PRESETS.find((x) => x.id === id) ?? PRESETS[0]
}

/** 取归一化的柏拉图立体 */
export function baseSolid(id: PlatonicId): Polyhedron {
  return normalizeToSphere(platonicOf(id), 1)
}

/** 截面边数的上界：面数（每条边来自一个面） */
export function maxSliceSides(p: Polyhedron): number {
  return p.faces.length
}

/** 立体在给定法向上的跨度 [min, max] */
export function extentAlong(p: Polyhedron, n: Vec3): [number, number] {
  const u = unit(n)
  const ds = p.vertices.map((v) => dot(v, u))
  return [Math.min(...ds), Math.max(...ds)]
}

export { edgesOf }
export type { Polyhedron, PlatonicId }
