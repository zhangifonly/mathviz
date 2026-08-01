/**
 * 星形多面体（纯函数，便于测试）
 *
 * **星化（stellation）**：把多面体的每个面向外拉出一个锥体，得到带尖刺的形状。
 * 最著名的是小星形十二面体与大星形十二面体，属于**开普勒-普安索立体** ——
 * 四种正星形多面体，是柏拉图立体之外唯一的「正多面体」。
 *
 * 本实验用**面锥星化**：每个面向外拉出高度 h 的锥尖。
 * 这是可验证的几何操作，比硬编码星形坐标可靠。
 *
 * 关键性质：**星化后欧拉公式仍然成立**（χ = 2），因为
 *   每个 n 边面 → 消失，换成 n 个三角面（+n−1）
 *   每个面新增 1 个顶点（+1）
 *   每个面新增 n 条棱（+n）
 * 代入：ΔV − ΔE + ΔF = F − nF + (n−1)F = 0，故 χ 不变。
 * 这是本实验最漂亮的可验证结论 —— 星化改变形状但不改变拓扑。
 *
 * ⚠️ 注意区分：真正的开普勒-普安索立体的面是**相互穿插的五角星**，
 * 是自相交曲面，欧拉公式对它们不成立（小星形十二面体 χ = −6）。
 * 本实验的面锥星化给出的是**非自交**的星形，仍是球面拓扑。
 * 这一点在讲解稿里明确交代，不含糊。
 */

import type { Vec3 } from '../../lib/proj3d'
import type { Polyhedron } from '../../lib/polyhedron'
import { faceCenter, centroidOf } from '../../lib/polyhedron'
import { platonicOf, type PlatonicKind } from '../platonic-solids/platonicSolids'

export const STELLATE_BASES = [
  'tetrahedron', 'cube', 'octahedron', 'dodecahedron', 'icosahedron',
] as const
export type StellateBase = (typeof STELLATE_BASES)[number]

export interface StellateInfo {
  base: StellateBase
  label: string
  /** 星化后的经典名称（若有） */
  classicName: string
  note: string
}

export const STELLATE_INFO: StellateInfo[] = [
  {
    base: 'tetrahedron',
    label: '星形四面体',
    classicName: '——',
    note: '4 个尖刺 · 12 个三角面',
  },
  {
    base: 'cube',
    label: '星形立方体',
    classicName: '——',
    note: '6 个尖刺 · 24 个三角面',
  },
  {
    base: 'octahedron',
    label: '星形八面体',
    classicName: '八面星（近似）',
    note: '8 个尖刺 · 24 个三角面',
  },
  {
    base: 'dodecahedron',
    label: '星形十二面体',
    classicName: '小星形十二面体（近似）',
    note: '12 个尖刺 · 60 个三角面',
  },
  {
    base: 'icosahedron',
    label: '星形二十面体',
    classicName: '——',
    note: '20 个尖刺 · 60 个三角面',
  },
]

function sub(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
}

function add(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
}

function scale(a: Vec3, s: number): Vec3 {
  return [a[0] * s, a[1] * s, a[2] * s]
}

function norm(a: Vec3): number {
  return Math.hypot(a[0], a[1], a[2])
}

/**
 * 面锥星化。
 *
 * 每个面的面心沿「形心→面心」方向外推，推出的顶点与原面的每条边
 * 组成一个三角面。高度参数 h 是外推距离与面心到形心距离的比例：
 *   h = 0   退化回原多面体（尖高为零）
 *   h = 0.5 中等尖刺
 *   h > 1   非常尖锐
 */
export function stellate(base: Polyhedron, h = 0.6): Polyhedron {
  const centroid = centroidOf(base)
  const verts: Vec3[] = [...base.vertices]
  const faces: number[][] = []

  base.faces.forEach((f, fi) => {
    const fc = faceCenter(base, fi)
    // 沿形心→面心方向外推
    const outward = sub(fc, centroid)
    const apex = add(fc, scale(outward, h))
    verts.push(apex)
    const apexIdx = verts.length - 1
    // 原面的每条边与尖顶组成一个三角面。保持原面的绕向, 法向自动朝外
    for (let i = 0; i < f.length; i++) {
      faces.push([f[i], f[(i + 1) % f.length], apexIdx])
    }
  })

  return { name: `星形${base.name}`, vertices: verts, faces }
}

/** 按基础立体取星化结果 */
export function stellatedOf(base: StellateBase, h = 0.6): Polyhedron {
  return stellate(platonicOf(base as PlatonicKind), h)
}

/**
 * 星化后的 V/E/F 预测值。
 *   V' = V + F        （每个面新增一个尖顶）
 *   E' = E + Σn = E + 2E = 3E   （每个面的每条边连一条到尖顶；Σn = 2E）
 *   F' = Σn = 2E      （每条原棱被两个面共享，各贡献一个三角面）
 * 验证：V' − E' + F' = (V+F) − 3E + 2E = V − E + F = 2 ✓
 */
export function predictCounts(V: number, E: number, F: number): {
  V: number
  E: number
  F: number
  chi: number
} {
  const nv = V + F
  const ne = 3 * E
  const nf = 2 * E
  return { V: nv, E: ne, F: nf, chi: nv - ne + nf }
}

/** 尖刺个数等于原面数 */
export function spikeCount(base: StellateBase): number {
  return platonicOf(base as PlatonicKind).faces.length
}

/** 尖顶到形心的距离 */
export function spikeRadius(base: StellateBase, h: number): number {
  const p = platonicOf(base as PlatonicKind)
  const c = centroidOf(p)
  const fc = faceCenter(p, 0)
  return norm(sub(fc, c)) * (1 + h)
}

/** h = 0 时是否退化回原多面体的外形（尖顶落在面心上） */
export function isDegenerate(h: number): boolean {
  return Math.abs(h) < 1e-12
}

/**
 * 真正的开普勒-普安索立体的欧拉特征数（供对照）。
 * 它们的面是相互穿插的五角星，是自相交曲面，χ ≠ 2。
 */
export const KEPLER_POINSOT = [
  { name: '小星形十二面体', V: 12, E: 30, F: 12, chi: -6 },
  { name: '大十二面体', V: 12, E: 30, F: 12, chi: -6 },
  { name: '大星形十二面体', V: 20, E: 30, F: 12, chi: 2 },
  { name: '大二十面体', V: 12, E: 30, F: 20, chi: 2 },
] as const

export function infoOf(base: StellateBase): StellateInfo {
  return STELLATE_INFO.find((i) => i.base === base) ?? STELLATE_INFO[0]
}
