/**
 * 棱柱与反棱柱（纯函数，便于测试）
 *
 * 除了 5 种柏拉图立体与 13 种阿基米德立体，还有**两个无穷族**也满足
 * 「面是正多边形、所有顶点等价」：
 *
 *   正 n 棱柱   两个正 n 边形底面 + n 个正方形侧面
 *   正 n 反棱柱 两个正 n 边形底面 + 2n 个正三角形侧面
 *
 * 它们通常不算进「13 种」，正因为是无穷族。这也解释了为什么
 * 阿基米德立体的分类要特别声明「不含棱柱与反棱柱」。
 *
 * 两个有意思的退化：
 *   n=3 的反棱柱 = 正八面体（三角形底 + 6 个三角侧面 = 8 个三角面）
 *   n=4 的棱柱   = 立方体
 *
 * 反棱柱的关键构造：上下底面**错开半个角** π/n，这样侧面才是三角形而非四边形。
 * 侧面高度也要相应调整，否则三角形不等边。
 */

import type { Vec3 } from '../../lib/proj3d'
import type { Polyhedron } from '../../lib/polyhedron'

export const SOLID_KINDS = ['prism', 'antiprism'] as const
export type SolidKind = (typeof SOLID_KINDS)[number]

export interface SolidInfo {
  kind: SolidKind
  label: string
  /** 侧面形状 */
  sideShape: string
  note: string
}

export const SOLID_INFO: SolidInfo[] = [
  {
    kind: 'prism',
    label: '正棱柱',
    sideShape: '正方形',
    note: 'n=4 时退化为立方体',
  },
  {
    kind: 'antiprism',
    label: '正反棱柱',
    sideShape: '正三角形',
    note: 'n=3 时退化为正八面体',
  },
]

/**
 * 正 n 棱柱的高度：侧面要是正方形，则高 = 底面边长。
 * 底面外接圆半径取 1 时，边长 = 2·sin(π/n)。
 */
export function prismHeight(n: number): number {
  return 2 * Math.sin(Math.PI / n)
}

/**
 * 正 n 反棱柱的高度。
 *
 * 侧面三角形的两条腰要等于底面边长 s = 2sin(π/n)。
 * 上下底错开 π/n 后，相邻上下顶点的水平距离是
 *   d = 2·sin(π/(2n))
 * 于是 h² + d² = s²，得 h = √(s² − d²)。
 */
export function antiprismHeight(n: number): number {
  const s = 2 * Math.sin(Math.PI / n)
  const d = 2 * Math.sin(Math.PI / (2 * n))
  const h2 = s * s - d * d
  return h2 <= 0 ? 0 : Math.sqrt(h2)
}

/** 正 n 棱柱 */
export function prism(n: number): Polyhedron {
  const h = prismHeight(n) / 2
  const vertices: Vec3[] = []
  for (let i = 0; i < n; i++) {
    const a = (2 * Math.PI * i) / n
    vertices.push([Math.cos(a), Math.sin(a), -h])
  }
  for (let i = 0; i < n; i++) {
    const a = (2 * Math.PI * i) / n
    vertices.push([Math.cos(a), Math.sin(a), h])
  }
  const faces: number[][] = []
  // 底面：从 -z 方向看逆时针 → 下标逆序
  faces.push(Array.from({ length: n }, (_, i) => n - 1 - i))
  // 顶面
  faces.push(Array.from({ length: n }, (_, i) => n + i))
  // 侧面四边形
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    faces.push([i, j, n + j, n + i])
  }
  return { name: `正${n}棱柱`, vertices, faces }
}

/** 正 n 反棱柱 */
export function antiprism(n: number): Polyhedron {
  const h = antiprismHeight(n) / 2
  const vertices: Vec3[] = []
  for (let i = 0; i < n; i++) {
    const a = (2 * Math.PI * i) / n
    vertices.push([Math.cos(a), Math.sin(a), -h])
  }
  // 顶面错开半个角 π/n —— 这是反棱柱的关键
  for (let i = 0; i < n; i++) {
    const a = (2 * Math.PI * i) / n + Math.PI / n
    vertices.push([Math.cos(a), Math.sin(a), h])
  }
  const faces: number[][] = []
  faces.push(Array.from({ length: n }, (_, i) => n - 1 - i))
  faces.push(Array.from({ length: n }, (_, i) => n + i))
  // 侧面三角形：每个下顶点与其上方两个顶点，每个上顶点与其下方两个顶点
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    faces.push([i, j, n + i])
    faces.push([j, n + j, n + i])
  }
  return { name: `正${n}反棱柱`, vertices, faces }
}

/** 按类型构造 */
export function solidOf(kind: SolidKind, n: number): Polyhedron {
  return kind === 'prism' ? prism(n) : antiprism(n)
}

/** V/E/F 的解析预测 */
export function predictCounts(kind: SolidKind, n: number): {
  V: number
  E: number
  F: number
  chi: number
} {
  if (kind === 'prism') {
    // 2n 顶点, 3n 棱(2n 底边 + n 竖棱), n+2 面
    return { V: 2 * n, E: 3 * n, F: n + 2, chi: 2 * n - 3 * n + (n + 2) }
  }
  // 反棱柱: 2n 顶点, 4n 棱(2n 底边 + 2n 侧棱), 2n+2 面
  return { V: 2 * n, E: 4 * n, F: 2 * n + 2, chi: 2 * n - 4 * n + (2 * n + 2) }
}

/** 侧面数 */
export function sideFaceCount(kind: SolidKind, n: number): number {
  return kind === 'prism' ? n : 2 * n
}

/** 底面边长（外接圆半径为 1 时） */
export function baseEdge(n: number): number {
  return 2 * Math.sin(Math.PI / n)
}

/** n=4 的棱柱是否为立方体（棱长全等且共球） */
export function isCubeCase(n: number): boolean {
  return n === 4
}

/** n=3 的反棱柱是否为正八面体 */
export function isOctahedronCase(n: number): boolean {
  return n === 3
}

export function infoOf(kind: SolidKind): SolidInfo {
  return SOLID_INFO.find((s) => s.kind === kind) ?? SOLID_INFO[0]
}
