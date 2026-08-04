/**
 * 截角变换（纯函数，便于测试）
 *
 * 把多面体的每个顶点"削掉"一刀，就得到一个新多面体。削的深浅由参数 t 控制：
 *
 *   t = 0     不削，还是原来的立体
 *   t = 1/3   **标准截角**，新面是正多边形 → 阿基米德立体
 *   t = 1/2   削到棱中点，得到**整流**（rectification），如立方八面体
 *   t = 1     削过头，退化成对偶
 *
 * 于是一根滑块就把「柏拉图立体 → 阿基米德立体 → 对偶」这条线串了起来：
 *
 *   立方体 →(1/3) 截角立方体 →(1/2) 立方八面体 →(1) 正八面体
 *   正四面体 →(1/3) 截角四面体 →(1/2) 正八面体 →(1) 正四面体
 *
 * 计数关系可以精确验证：截角后
 *   V' = 2E      （每条棱贡献一个新顶点）
 *   E' = 3E      （原棱剩一段 + 每个新面的边）
 *   F' = F + V   （原面各留一个 + 每个顶点削出一个新面）
 * 代入欧拉公式：V'−E'+F' = 2E−3E+F+V = V−E+F = 2 ✓ 拓扑不变。
 *
 * 实现上不做真正的平面切割（那要算半空间求交），而是**直接构造顶点**：
 * 每条棱 (a,b) 在靠近 a 处切一个点、靠近 b 处切一个点，
 * 新面由「绕原顶点一圈的那些切点」和「原面的边被截短后的部分」组成。
 */

import type { Vec3 } from '../../lib/proj3d'
import {
  edgesOf, eulerCount, platonicOf, normalizeToSphere,
  type Polyhedron, type PlatonicId,
} from '../../lib/polyhedron'

export function lerp(a: Vec3, b: Vec3, t: number): Vec3 {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ]
}

export function norm(a: Vec3): number {
  return Math.hypot(a[0], a[1], a[2])
}

export function sub(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
}

export function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}

/** 有向棱的键：截角后每条有向棱对应一个新顶点 */
function dirKey(from: number, to: number): string {
  return `${from}>${to}`
}

/**
 * 截角变换。t ∈ [0, 0.5]，t=1/3 是标准截角，t=1/2 是整流。
 *
 * 每条有向棱 (a→b) 生成一个新顶点，位于 a 到 b 的 t 处。
 * 新面有两类：
 *   1. 顶点面：绕每个原顶点的那些新点，按原面的环绕顺序连成一圈
 *   2. 原面的截短版：原面每条边贡献两个新点（t 处与 1−t 处）
 */
export function truncate(p: Polyhedron, t: number): Polyhedron {
  const tt = Math.max(0, Math.min(0.5, t))
  // t=0 时退化：所有新点重合到原顶点，直接返回原体
  if (tt < 1e-9) return { ...p, name: `${p.name}（t=0）` }

  const newIndex = new Map<string, number>()
  const vertices: Vec3[] = []
  // t = 1/2 时每条棱的两个切点重合于棱中点 —— 必须共用同一个顶点，
  // 否则拓扑坏掉（每条棱多出一个孤立点，χ 会变成负数）。
  const isRectify = Math.abs(tt - 0.5) < 1e-9
  const addPoint = (from: number, to: number): number => {
    // 整流时用无向键，两个方向映到同一点
    const key = isRectify
      ? (from < to ? `${from}-${to}` : `${to}-${from}`)
      : dirKey(from, to)
    const had = newIndex.get(key)
    if (had !== undefined) return had
    const idx = vertices.length
    vertices.push(lerp(p.vertices[from], p.vertices[to], tt))
    newIndex.set(key, idx)
    return idx
  }

  // 先把所有有向棱的切点建出来
  for (const f of p.faces) {
    for (let k = 0; k < f.length; k++) {
      const a = f[k]
      const b = f[(k + 1) % f.length]
      addPoint(a, b)
      addPoint(b, a)
    }
  }

  const faces: number[][] = []

  // 类型 1：原面截短。沿原面的环走，每条边取 (a→b) 与 (b→a) 两个点。
  // t=1/2 时两点重合，需去重，否则会出现零长边。
  for (const f of p.faces) {
    const ring: number[] = []
    for (let k = 0; k < f.length; k++) {
      const a = f[k]
      const b = f[(k + 1) % f.length]
      const p1 = addPoint(a, b)
      const p2 = addPoint(b, a)
      ring.push(p1)
      if (p1 !== p2 && !nearlySame(vertices[p1], vertices[p2])) ring.push(p2)
    }
    faces.push(dedupeRing(ring, vertices))
  }

  // 类型 2：顶点面。绕原顶点 v 的所有邻居，按面的连接关系排成一环。
  for (let v = 0; v < p.vertices.length; v++) {
    const ring = vertexRing(p, v)
    if (ring.length < 3) continue
    faces.push(dedupeRing(ring.map((nb) => addPoint(v, nb)), vertices))
  }

  return {
    name: `${p.name} 截角 t=${tt.toFixed(3)}`,
    vertices,
    faces: faces.filter((f) => f.length >= 3),
  }
}

/** 两点是否几乎重合 */
function nearlySame(a: Vec3, b: Vec3, tol = 1e-9): boolean {
  return norm(sub(a, b)) < tol
}

/** 去掉环里相邻重复的点 */
function dedupeRing(ring: number[], verts: Vec3[]): number[] {
  const out: number[] = []
  for (const idx of ring) {
    if (out.length === 0 || (out[out.length - 1] !== idx
      && !nearlySame(verts[out[out.length - 1]], verts[idx]))) {
      out.push(idx)
    }
  }
  // 首尾也要查
  while (out.length > 1
    && (out[0] === out[out.length - 1]
      || nearlySame(verts[out[0]], verts[out[out.length - 1]]))) {
    out.pop()
  }
  return out
}

/**
 * 绕顶点 v 一圈的邻居顺序。
 *
 * 做法：从含 v 的某个面出发，取该面里 v 的下一个顶点作为邻居，
 * 再找共享这条棱的另一个面，如此接力走一圈。
 * 不排序的话顶点面会连成乱线 —— 这是必须做对的一步。
 */
export function vertexRing(p: Polyhedron, v: number): number[] {
  const facesAt = p.faces.filter((f) => f.includes(v))
  if (facesAt.length === 0) return []
  const ring: number[] = []
  let curFace = facesAt[0]
  const used = new Set<number[]>()
  for (let guard = 0; guard < facesAt.length + 2; guard++) {
    used.add(curFace)
    const k = curFace.indexOf(v)
    const next = curFace[(k + 1) % curFace.length]
    ring.push(next)
    // 找共享棱 (v,next) 的另一个面
    const other = facesAt.find(
      (f) => f !== curFace && f.includes(next) && !used.has(f),
    )
    if (!other) break
    curFace = other
  }
  return ring
}

/**
 * 标准截角参数：让截出的新边与剩余原边等长（于是所有面都是正多边形）。
 *
 * 推导：正 n 边形内角 θ = (n−2)π/n。在顶点处削掉一个等腰三角形，
 * 两腰长 t·L、顶角 θ，底边（新边）长 2t·L·sin(θ/2)。
 * 要它等于剩余边长 (1−2t)·L，解得 **t = 1/(2 + 2sin(θ/2))**。
 *
 * ⚠️ 只有三角面才恰好给 1/3。四边面给 0.2929、五边面给 0.2764 ——
 * 我一开始对所有立体都用 1/3，结果立方体与十二面体的截角体棱长
 * 极差高达 0.29 / 0.38，一眼就不是阿基米德立体。
 */
export function standardT(faceSides: number): number {
  const theta = ((faceSides - 2) * Math.PI) / faceSides
  return 1 / (2 + 2 * Math.sin(theta / 2))
}

/** 多面体的标准截角参数（取其面型；正多面体各面同型） */
export function standardTOf(p: Polyhedron): number {
  const sides = p.faces[0]?.length ?? 3
  return standardT(sides)
}

/** 三角面的标准截角参数 1/3（最常被引用的那个值） */
export const STANDARD_T = 1 / 3

/** 整流参数（削到棱中点） */
export const RECTIFY_T = 0.5

/** 截角后的 (V, E, F) 理论值 */
export function predictedCounts(
  p: Polyhedron, t: number,
): { V: number; E: number; F: number } {
  const { V, E, F } = eulerCount(p)
  if (t < 1e-9) return { V, E, F }
  if (Math.abs(t - 0.5) < 1e-9) {
    // 整流：每条棱缩成一个点
    return { V: E, E: 2 * E, F: F + V }
  }
  return { V: 2 * E, E: 3 * E, F: F + V }
}

/** 各柏拉图立体在标准截角下得到的阿基米德立体名 */
export const TRUNCATION_NAMES: Record<PlatonicId, { std: string; rect: string }> = {
  tetrahedron: { std: '截角四面体', rect: '正八面体' },
  cube: { std: '截角立方体', rect: '立方八面体' },
  octahedron: { std: '截角八面体', rect: '立方八面体' },
  dodecahedron: { std: '截角十二面体', rect: '二十·十二面体' },
  icosahedron: { std: '截角二十面体', rect: '二十·十二面体' },
}

export const SOLID_IDS: PlatonicId[] = [
  'tetrahedron', 'cube', 'octahedron', 'dodecahedron', 'icosahedron',
]

/** 取归一化的柏拉图立体 */
export function baseSolid(id: PlatonicId): Polyhedron {
  return normalizeToSphere(platonicOf(id), 1)
}

/** 面的边数分布（用来识别得到了什么立体） */
export function faceProfile(p: Polyhedron): Record<number, number> {
  const h: Record<number, number> = {}
  for (const f of p.faces) h[f.length] = (h[f.length] ?? 0) + 1
  return h
}

/** 所有棱长（用于检验标准截角下是否等长） */
export function edgeLengthsOf(p: Polyhedron): number[] {
  return edgesOf(p).map(([a, b]) => norm(sub(p.vertices[a], p.vertices[b])))
}

/** 棱长的相对极差（标准截角下应接近 0） */
export function edgeUniformity(p: Polyhedron): number {
  const ls = edgeLengthsOf(p)
  if (ls.length === 0) return 0
  const mx = Math.max(...ls)
  const mn = Math.min(...ls)
  return mx < 1e-12 ? 0 : (mx - mn) / mx
}

/** 截角立方体的经典事实：足球是截角二十面体（12 个五边形 + 20 个六边形） */
export const SOCCER_BALL = {
  base: 'icosahedron' as PlatonicId,
  pentagons: 12,
  hexagons: 20,
  note: '足球就是截角二十面体',
}

export { eulerCount, edgesOf }
export type { Polyhedron, PlatonicId }
