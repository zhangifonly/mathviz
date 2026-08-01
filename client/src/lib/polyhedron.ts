/**
 * 多面体的共享内核（纯函数，便于测试）
 *
 * D3 批次的多面体实验共用这套数据结构与工具，各自只需给出顶点与面。
 *
 * 核心不变量：
 *   **欧拉公式** V − E + F = 2（对凸多面体，即球面拓扑）
 *   这是拓扑学的第一个定理，也是检验多面体数据是否自洽的最强判据 ——
 *   顶点、棱、面三个数字随便编一组，几乎肯定过不了这一关。
 *
 * 棱由面自动推出（相邻顶点对去重），不手工列举，避免抄错。
 */

import type { Vec3 } from './proj3d'

export interface Polyhedron {
  name: string
  vertices: Vec3[]
  /** 每个面是顶点下标的有序环（按右手法则逆时针，法向朝外） */
  faces: number[][]
}

/** 棱的规范化键：小下标在前，保证 (a,b) 与 (b,a) 视为同一条 */
function edgeKey(a: number, b: number): string {
  return a < b ? `${a}-${b}` : `${b}-${a}`
}

/** 从面表推出棱表（去重）。不手工列举棱，避免抄错 */
export function edgesOf(p: Polyhedron): Array<[number, number]> {
  const seen = new Set<string>()
  const out: Array<[number, number]> = []
  for (const face of p.faces) {
    for (let i = 0; i < face.length; i++) {
      const a = face[i]
      const b = face[(i + 1) % face.length]
      const k = edgeKey(a, b)
      if (!seen.has(k)) {
        seen.add(k)
        out.push(a < b ? [a, b] : [b, a])
      }
    }
  }
  return out
}

export interface EulerCount {
  V: number
  E: number
  F: number
  /** V − E + F，凸多面体应为 2 */
  chi: number
}

/** 计数并算欧拉特征数 */
export function eulerCount(p: Polyhedron): EulerCount {
  const V = p.vertices.length
  const E = edgesOf(p).length
  const F = p.faces.length
  return { V, E, F, chi: V - E + F }
}

/** 面心 */
export function faceCenter(p: Polyhedron, faceIndex: number): Vec3 {
  const f = p.faces[faceIndex]
  const c: Vec3 = [0, 0, 0]
  for (const i of f) {
    c[0] += p.vertices[i][0]
    c[1] += p.vertices[i][1]
    c[2] += p.vertices[i][2]
  }
  return [c[0] / f.length, c[1] / f.length, c[2] / f.length]
}

function sub(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
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

/** 面的法向量（未归一化，按面上前三点的右手法则） */
export function faceNormalOf(p: Polyhedron, faceIndex: number): Vec3 {
  const f = p.faces[faceIndex]
  const a = p.vertices[f[0]]
  const b = p.vertices[f[1]]
  const c = p.vertices[f[2]]
  return cross(sub(b, a), sub(c, a))
}

/**
 * 面的法向是否朝外。判据：法向与「从形心指向面心」的向量同向。
 * 这检验面的顶点顺序是否正确 —— 顺序反了法向就朝内，渲染时光照会错。
 */
export function faceOutward(p: Polyhedron, faceIndex: number): boolean {
  const centroid = centroidOf(p)
  const fc = faceCenter(p, faceIndex)
  return dot(faceNormalOf(p, faceIndex), sub(fc, centroid)) > 0
}

/** 形心（顶点平均） */
export function centroidOf(p: Polyhedron): Vec3 {
  const c: Vec3 = [0, 0, 0]
  for (const v of p.vertices) {
    c[0] += v[0]
    c[1] += v[1]
    c[2] += v[2]
  }
  const n = p.vertices.length || 1
  return [c[0] / n, c[1] / n, c[2] / n]
}

/** 所有面是否共面（每个面的顶点是否落在同一平面上） */
export function facePlanarityError(p: Polyhedron, faceIndex: number): number {
  const f = p.faces[faceIndex]
  if (f.length <= 3) return 0
  const n = faceNormalOf(p, faceIndex)
  const len = norm(n)
  if (len < 1e-12) return Infinity
  const unit: Vec3 = [n[0] / len, n[1] / len, n[2] / len]
  const a = p.vertices[f[0]]
  let maxDev = 0
  for (const i of f) {
    maxDev = Math.max(maxDev, Math.abs(dot(sub(p.vertices[i], a), unit)))
  }
  return maxDev
}

/** 棱长表 */
export function edgeLengths(p: Polyhedron): number[] {
  return edgesOf(p).map(([a, b]) => norm(sub(p.vertices[a], p.vertices[b])))
}

/** 是否等棱（所有棱长相同，正多面体的必要条件） */
export function isEquilateral(p: Polyhedron, tol = 1e-9): boolean {
  const ls = edgeLengths(p)
  if (ls.length === 0) return false
  return ls.every((l) => Math.abs(l - ls[0]) < tol)
}

/**
 * 体积（散度定理：把每个面对形心张成的锥体体积相加）。
 * 依赖面法向朝外，故先用 faceOutward 检验数据正确性。
 */
export function volumeOf(p: Polyhedron): number {
  const c = centroidOf(p)
  let vol = 0
  for (let fi = 0; fi < p.faces.length; fi++) {
    const f = p.faces[fi]
    // 面扇形三角化
    for (let i = 1; i < f.length - 1; i++) {
      const a = sub(p.vertices[f[0]], c)
      const b = sub(p.vertices[f[i]], c)
      const d = sub(p.vertices[f[i + 1]], c)
      vol += dot(a, cross(b, d)) / 6
    }
  }
  return Math.abs(vol)
}

/** 表面积 */
export function surfaceAreaOf(p: Polyhedron): number {
  let area = 0
  for (const f of p.faces) {
    for (let i = 1; i < f.length - 1; i++) {
      const a = sub(p.vertices[f[i]], p.vertices[f[0]])
      const b = sub(p.vertices[f[i + 1]], p.vertices[f[0]])
      area += norm(cross(a, b)) / 2
    }
  }
  return area
}

/** 外接球半径（顶点到形心的最大距离） */
export function circumradius(p: Polyhedron): number {
  const c = centroidOf(p)
  return Math.max(...p.vertices.map((v) => norm(sub(v, c))))
}

/** 顶点是否都在同一球面上（正多面体的必要条件） */
export function isSpherical(p: Polyhedron, tol = 1e-9): boolean {
  const c = centroidOf(p)
  const rs = p.vertices.map((v) => norm(sub(v, c)))
  return rs.every((r) => Math.abs(r - rs[0]) < tol)
}

/**
 * 对偶多面体：取每个面的面心作新顶点，围绕原顶点的那些面心连成新面。
 *
 * 新面的顶点必须按绕原顶点的**环序**排列，否则多边形会自交、法向也乱。
 * 这里用「投影到切平面后按极角排序」来定序 —— 直接按面下标顺序是错的。
 */
export function dualOf(p: Polyhedron): Polyhedron {
  const centroid = centroidOf(p)
  const newVerts: Vec3[] = p.faces.map((_, i) => faceCenter(p, i))

  // 每个原顶点收集包含它的面下标
  const around: number[][] = p.vertices.map(() => [])
  p.faces.forEach((f, fi) => {
    for (const vi of f) around[vi].push(fi)
  })

  const faces = around.map((faceIdxs, vi) => {
    const axis = sub(p.vertices[vi], centroid)
    const len = norm(axis)
    const n: Vec3 = len < 1e-12 ? [0, 0, 1] : [axis[0] / len, axis[1] / len, axis[2] / len]
    // 在垂直于 axis 的平面里建一组基, 用极角排序
    const ref = Math.abs(n[0]) < 0.9 ? cross(n, [1, 0, 0]) : cross(n, [0, 1, 0])
    const rl = norm(ref)
    const e1: Vec3 = [ref[0] / rl, ref[1] / rl, ref[2] / rl]
    const e2 = cross(n, e1)
    return [...faceIdxs].sort((a, b) => {
      const va = sub(newVerts[a], p.vertices[vi])
      const vb = sub(newVerts[b], p.vertices[vi])
      return Math.atan2(dot(va, e2), dot(va, e1))
        - Math.atan2(dot(vb, e2), dot(vb, e1))
    })
  })

  return { name: `${p.name} 的对偶`, vertices: newVerts, faces }
}

/** 每个顶点的度数（连出的棱数） */
export function vertexDegrees(p: Polyhedron): number[] {
  const deg = new Array<number>(p.vertices.length).fill(0)
  for (const [a, b] of edgesOf(p)) {
    deg[a]++
    deg[b]++
  }
  return deg
}

/** 面的边数分布，如 {3: 8, 4: 6} 表示 8 个三角面 6 个四边面 */
export function faceSizeHistogram(p: Polyhedron): Record<number, number> {
  const h: Record<number, number> = {}
  for (const f of p.faces) h[f.length] = (h[f.length] ?? 0) + 1
  return h
}
