/**
 * 对偶多面体（纯函数，便于测试）
 *
 * 把多面体的每个**面**换成一个**顶点**、每个顶点换成一个面，棱保持不变，
 * 就得到它的对偶。五种柏拉图立体两两配对：
 *
 *   立方体 ↔ 正八面体      (6面8顶 ↔ 8面6顶)
 *   正十二面体 ↔ 正二十面体 (12面20顶 ↔ 20面12顶)
 *   正四面体 ↔ 正四面体      (自对偶)
 *
 * 具体做法是**极反演**（polar reciprocation）：以半径 R 的球为镜，
 * 每个面变成一个顶点，位置在面法向上距原点 R²/d 处（d 是原点到面的距离）。
 *   面离得越近 → 对偶顶点越远
 *
 * 三条可数值验证的性质：
 *
 * 1. **对偶的对偶回到自己**（用同一个球做两次极反演）
 * 2. **F↔V 互换而 E 不变**，于是欧拉示性数 V−E+F=2 两边都成立
 * 3. **对偶的棱与原棱垂直**且相交于球面 —— 这是极反演的几何含义
 *
 * 还有个漂亮的量：对偶棱与原棱的交点恰好落在**中球**（midsphere）上，
 * 也就是与所有棱相切的那个球。取 R = 中球半径时，两个多面体互相"卡"在一起。
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

export function scale(a: Vec3, k: number): Vec3 {
  return [a[0] * k, a[1] * k, a[2] * k]
}

export function sub(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
}

export function add(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
}

export interface Polyhedron {
  id: string
  label: string
  vertices: Vec3[]
  /** 面：顶点下标环（逆时针朝外） */
  faces: number[][]
}

/** 由面表推出棱表（每条棱恰属两面，用无序对去重） */
export function edgesOf(P: Polyhedron): Array<[number, number]> {
  const seen = new Set<string>()
  const out: Array<[number, number]> = []
  for (const f of P.faces) {
    for (let k = 0; k < f.length; k++) {
      const a = f[k]
      const b = f[(k + 1) % f.length]
      const key = a < b ? `${a}-${b}` : `${b}-${a}`
      if (seen.has(key)) continue
      seen.add(key)
      out.push(a < b ? [a, b] : [b, a])
    }
  }
  return out
}

/** 面的形心 */
export function faceCentroid(P: Polyhedron, face: number[]): Vec3 {
  let s: Vec3 = [0, 0, 0]
  for (const i of face) s = add(s, P.vertices[i])
  return scale(s, 1 / face.length)
}

/** 面的单位外法向（以原点为内点定向） */
export function faceNormal(P: Polyhedron, face: number[]): Vec3 {
  const a = P.vertices[face[0]]
  const b = P.vertices[face[1]]
  const c = P.vertices[face[2]]
  let n = cross(sub(b, a), sub(c, a))
  const len = norm(n) || 1
  n = scale(n, 1 / len)
  return dot(n, a) < 0 ? scale(n, -1) : n
}

/** 原点到面所在平面的距离 */
export function faceDistance(P: Polyhedron, face: number[]): number {
  return Math.abs(dot(faceNormal(P, face), P.vertices[face[0]]))
}

/**
 * 极反演：面 → 对偶顶点。
 * 顶点位置 = 面法向 × (R²/d)，d 是原点到面的距离。
 */
export function polarVertex(P: Polyhedron, face: number[], R: number): Vec3 {
  const n = faceNormal(P, face)
  const d = faceDistance(P, face)
  if (d < 1e-12) return [0, 0, 0]
  return scale(n, (R * R) / d)
}

/**
 * 构造对偶多面体。
 *
 * 对偶的顶点 = 原多面体每个面的极点。
 * 对偶的面 = 原多面体每个顶点周围的面环（按绕该顶点的顺序）。
 */
export function dualOf(P: Polyhedron, R = 1): Polyhedron {
  const vertices = P.faces.map((f) => polarVertex(P, f, R))
  // 对每个原顶点，收集包含它的所有面，按绕顶点方向排序成一个环
  const faces: number[][] = []
  for (let vi = 0; vi < P.vertices.length; vi++) {
    const around = P.faces
      .map((f, fi) => ({ f, fi }))
      .filter(({ f }) => f.includes(vi))
    if (around.length < 3) continue
    faces.push(sortFaceRing(P, vi, around.map(({ fi }) => fi), vertices))
  }
  return { id: `${P.id}-dual`, label: `${P.label}的对偶`, vertices, faces }
}

/**
 * 把绕顶点 vi 的那些面按角度排成环。
 *
 * 做法：以顶点方向为轴建局部坐标系，把每个对偶顶点投到垂直平面上量方位角。
 * 不排序的话面环会乱序，画出来就是一团纠缠的线 —— 这是必须做的一步。
 */
function sortFaceRing(
  P: Polyhedron, vi: number, faceIdx: number[], dualVerts: Vec3[],
): number[] {
  const axisRaw = P.vertices[vi]
  const alen = norm(axisRaw) || 1
  const axis = scale(axisRaw, 1 / alen)
  // 垂直于 axis 的两个基
  const ref: Vec3 = Math.abs(axis[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0]
  let e1 = cross(axis, ref)
  e1 = scale(e1, 1 / (norm(e1) || 1))
  const e2 = cross(axis, e1)
  const withAngle = faceIdx.map((fi) => {
    const p = dualVerts[fi]
    return { fi, ang: Math.atan2(dot(p, e2), dot(p, e1)) }
  })
  withAngle.sort((a, b) => a.ang - b.ang)
  return withAngle.map((x) => x.fi)
}

/** 欧拉示性数 V − E + F */
export function eulerCharacteristic(P: Polyhedron): number {
  return P.vertices.length - edgesOf(P).length + P.faces.length
}

/** 中球半径：原点到棱中点的距离（正多面体下所有棱一致） */
export function midsphereRadius(P: Polyhedron): number {
  const es = edgesOf(P)
  if (es.length === 0) return 0
  const [i, j] = es[0]
  const mid = scale(add(P.vertices[i], P.vertices[j]), 0.5)
  return norm(mid)
}

/** 所有棱中点到原点距离的极差（正多面体应为 0，说明中球存在） */
export function midsphereSpread(P: Polyhedron): number {
  const ds = edgesOf(P).map(([i, j]) => norm(
    scale(add(P.vertices[i], P.vertices[j]), 0.5),
  ))
  return Math.max(...ds) - Math.min(...ds)
}

/**
 * 对偶棱与原棱是否垂直。
 * 原棱 (i,j) 对应对偶棱 = 共享这条棱的两个面的极点连线。
 * 返回所有棱上 |cos夹角| 的最大值（应为 0）。
 */
export function edgePerpendicularity(P: Polyhedron, R = 1): number {
  const D = dualOf(P, R)
  let worst = 0
  for (const [i, j] of edgesOf(P)) {
    // 找共享这条棱的两个面
    const shared = P.faces
      .map((f, fi) => ({ f, fi }))
      .filter(({ f }) => f.includes(i) && f.includes(j))
    if (shared.length !== 2) continue
    const primal = sub(P.vertices[j], P.vertices[i])
    const dualEdge = sub(D.vertices[shared[1].fi], D.vertices[shared[0].fi])
    const pn = norm(primal)
    const dn = norm(dualEdge)
    if (pn < 1e-12 || dn < 1e-12) continue
    worst = Math.max(worst, Math.abs(dot(primal, dualEdge) / (pn * dn)))
  }
  return worst
}

// ============ 五种柏拉图立体 ============

const PHI = (1 + Math.sqrt(5)) / 2

export function makeTetrahedron(): Polyhedron {
  return {
    id: 'tetrahedron',
    label: '正四面体',
    vertices: [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]],
    faces: [[0, 1, 2], [0, 2, 3], [0, 3, 1], [1, 3, 2]],
  }
}

export function makeCube(): Polyhedron {
  return {
    id: 'cube',
    label: '立方体',
    vertices: [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
    ],
    faces: [
      [0, 3, 2, 1], [4, 5, 6, 7], [0, 1, 5, 4],
      [2, 3, 7, 6], [1, 2, 6, 5], [0, 4, 7, 3],
    ],
  }
}

export function makeOctahedron(): Polyhedron {
  return {
    id: 'octahedron',
    label: '正八面体',
    vertices: [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]],
    faces: [
      [0, 2, 4], [2, 1, 4], [1, 3, 4], [3, 0, 4],
      [2, 0, 5], [1, 2, 5], [3, 1, 5], [0, 3, 5],
    ],
  }
}

export function makeIcosahedron(): Polyhedron {
  const vertices: Vec3[] = [
    [0, 1, PHI], [0, -1, PHI], [0, 1, -PHI], [0, -1, -PHI],
    [1, PHI, 0], [-1, PHI, 0], [1, -PHI, 0], [-1, -PHI, 0],
    [PHI, 0, 1], [PHI, 0, -1], [-PHI, 0, 1], [-PHI, 0, -1],
  ]
  // 20 个三角面（按相邻关系手工列出，已验证每条棱恰属两面）
  const faces = [
    [0, 1, 8], [0, 8, 4], [0, 4, 5], [0, 5, 10], [0, 10, 1],
    [1, 10, 7], [1, 7, 6], [1, 6, 8], [8, 6, 9], [8, 9, 4],
    [4, 9, 2], [4, 2, 5], [5, 2, 11], [5, 11, 10], [10, 11, 7],
    [3, 7, 11], [3, 11, 2], [3, 2, 9], [3, 9, 6], [3, 6, 7],
  ]
  return { id: 'icosahedron', label: '正二十面体', vertices, faces }
}

/** 正十二面体：由正二十面体取对偶得到（面心即顶点） */
export function makeDodecahedron(): Polyhedron {
  const ico = makeIcosahedron()
  const R = Math.sqrt(midsphereRadius(ico) ** 2)
  const d = dualOf(ico, R)
  return { ...d, id: 'dodecahedron', label: '正十二面体' }
}

export const PLATONIC = [
  makeTetrahedron(), makeCube(), makeOctahedron(),
  makeDodecahedron(), makeIcosahedron(),
] as const

export type SolidId =
  | 'tetrahedron' | 'cube' | 'octahedron' | 'dodecahedron' | 'icosahedron'

export function solidOf(id: SolidId): Polyhedron {
  switch (id) {
    case 'cube': return makeCube()
    case 'octahedron': return makeOctahedron()
    case 'dodecahedron': return makeDodecahedron()
    case 'icosahedron': return makeIcosahedron()
    default: return makeTetrahedron()
  }
}

/** 对偶配对表 */
export const DUAL_PAIRS: Array<[SolidId, SolidId]> = [
  ['cube', 'octahedron'],
  ['dodecahedron', 'icosahedron'],
  ['tetrahedron', 'tetrahedron'],
]

/** 查某立体的对偶名 */
export function dualName(id: SolidId): SolidId {
  for (const [a, b] of DUAL_PAIRS) {
    if (a === id) return b
    if (b === id) return a
  }
  return id
}

/** (V, E, F) 三元组 */
export function vef(P: Polyhedron): [number, number, number] {
  return [P.vertices.length, edgesOf(P).length, P.faces.length]
}
