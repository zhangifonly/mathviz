/**
 * 柏拉图立体（纯函数，便于测试）
 *
 * 正多面体：所有面是同一种正多边形，且每个顶点连出相同数目的面。
 * 欧几里得《几何原本》第十三卷证明了**恰好只有五种** ——
 * 这是数学史上最早的分类定理之一。
 *
 * 为什么只有五种？在一个顶点上，若有 p 个正 q 边形相聚，
 * 那么 p·(内角) < 360° 才能围成立体角，即 p·(1 − 2/q)·180° < 360°，
 * 化简得 **(p−2)(q−2) < 4**。正整数解只有 5 组：
 *   (p,q) = (3,3) 正四面体, (3,4) 正六面体, (4,3) 正八面体,
 *           (3,5) 正十二面体, (5,3) 正二十面体
 *
 * 对偶关系：交换 (p,q) 得到对偶多面体。四面体自对偶，
 * 六面体↔八面体，十二面体↔二十面体。
 */

import type { Vec3 } from '../../lib/proj3d'
import type { Polyhedron } from '../../lib/polyhedron'

export const PLATONIC_KINDS = [
  'tetrahedron', 'cube', 'octahedron', 'dodecahedron', 'icosahedron',
] as const
export type PlatonicKind = (typeof PLATONIC_KINDS)[number]

export interface PlatonicInfo {
  kind: PlatonicKind
  label: string
  /** 每面的边数 q */
  faceSides: number
  /** 每顶点聚集的面数 p */
  vertexFaces: number
  V: number
  E: number
  F: number
  /** 对偶多面体 */
  dual: PlatonicKind
  note: string
}

export const PLATONIC_INFO: PlatonicInfo[] = [
  {
    kind: 'tetrahedron',
    label: '正四面体',
    faceSides: 3,
    vertexFaces: 3,
    V: 4, E: 6, F: 4,
    dual: 'tetrahedron',
    note: '自对偶 · 最简单的立体',
  },
  {
    kind: 'cube',
    label: '正六面体',
    faceSides: 4,
    vertexFaces: 3,
    V: 8, E: 12, F: 6,
    dual: 'octahedron',
    note: '与正八面体对偶',
  },
  {
    kind: 'octahedron',
    label: '正八面体',
    faceSides: 3,
    vertexFaces: 4,
    V: 6, E: 12, F: 8,
    dual: 'cube',
    note: '与正六面体对偶',
  },
  {
    kind: 'dodecahedron',
    label: '正十二面体',
    faceSides: 5,
    vertexFaces: 3,
    V: 20, E: 30, F: 12,
    dual: 'icosahedron',
    note: '五边形面 · 含黄金比',
  },
  {
    kind: 'icosahedron',
    label: '正二十面体',
    faceSides: 3,
    vertexFaces: 5,
    V: 12, E: 30, F: 20,
    dual: 'dodecahedron',
    note: '面数最多 · 含黄金比',
  },
]

/** 黄金比 φ = (1+√5)/2，十二面体与二十面体的坐标都要用它 */
export const PHI = (1 + Math.sqrt(5)) / 2

/** 正四面体：取立方体的四个交替顶点 */
function tetrahedron(): Polyhedron {
  return {
    name: '正四面体',
    vertices: [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]],
    // 面的顶点顺序按右手法则使法向朝外
    faces: [[0, 1, 2], [0, 3, 1], [0, 2, 3], [1, 3, 2]],
  }
}

/** 正六面体（立方体） */
function cube(): Polyhedron {
  const v: Vec3[] = [
    [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
    [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
  ]
  return {
    name: '正六面体',
    vertices: v,
    faces: [
      [0, 3, 2, 1], // 底 z=-1, 逆时针看向 -z
      [4, 5, 6, 7], // 顶 z=+1
      [0, 1, 5, 4], // y=-1
      [2, 3, 7, 6], // y=+1
      [1, 2, 6, 5], // x=+1
      [0, 4, 7, 3], // x=-1
    ],
  }
}

/** 正八面体：三个坐标轴上的六个点 */
function octahedron(): Polyhedron {
  return {
    name: '正八面体',
    vertices: [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]],
    faces: [
      [0, 2, 4], [2, 1, 4], [1, 3, 4], [3, 0, 4],
      [2, 0, 5], [1, 2, 5], [3, 1, 5], [0, 3, 5],
    ],
  }
}

/**
 * 正二十面体：三组黄金矩形的顶点。
 * (0, ±1, ±φ) 及其循环置换，共 12 个顶点。
 */
function icosahedron(): Polyhedron {
  const p = PHI
  const vertices: Vec3[] = [
    [0, 1, p], [0, -1, p], [0, 1, -p], [0, -1, -p],
    [1, p, 0], [-1, p, 0], [1, -p, 0], [-1, -p, 0],
    [p, 0, 1], [-p, 0, 1], [p, 0, -1], [-p, 0, -1],
  ]
  const faces = [
    [0, 1, 8], [0, 8, 4], [0, 4, 5], [0, 5, 9], [0, 9, 1],
    [1, 9, 7], [1, 7, 6], [1, 6, 8], [8, 6, 10], [8, 10, 4],
    [4, 10, 2], [4, 2, 5], [5, 2, 11], [5, 11, 9], [9, 11, 7],
    [3, 7, 11], [3, 11, 2], [3, 2, 10], [3, 10, 6], [3, 6, 7],
  ]
  return { name: '正二十面体', vertices, faces }
}

/**
 * 正十二面体：立方体的 8 个顶点 (±1,±1,±1)
 * 加上三组黄金矩形顶点 (0, ±1/φ, ±φ) 的循环置换，共 20 个顶点。
 */
function dodecahedron(): Polyhedron {
  const p = PHI
  const q = 1 / p
  const vertices: Vec3[] = [
    [1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1],
    [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1],
    [0, q, p], [0, q, -p], [0, -q, p], [0, -q, -p],
    [q, p, 0], [q, -p, 0], [-q, p, 0], [-q, -p, 0],
    [p, 0, q], [p, 0, -q], [-p, 0, q], [-p, 0, -q],
  ]
  const faces = [
    [0, 8, 10, 2, 16], [0, 16, 17, 1, 12], [0, 12, 14, 4, 8],
    [8, 4, 18, 6, 10], [10, 6, 15, 13, 2], [2, 13, 3, 17, 16],
    [17, 3, 11, 9, 1], [1, 9, 5, 14, 12], [14, 5, 19, 18, 4],
    [18, 19, 7, 15, 6], [15, 7, 11, 3, 13], [9, 11, 7, 19, 5],
  ]
  return { name: '正十二面体', vertices, faces }
}

/** 按类型取多面体 */
export function platonicOf(kind: PlatonicKind): Polyhedron {
  switch (kind) {
    case 'tetrahedron': return tetrahedron()
    case 'cube': return cube()
    case 'octahedron': return octahedron()
    case 'dodecahedron': return dodecahedron()
    case 'icosahedron': return icosahedron()
  }
}

/**
 * 顶点角条件 (p−2)(q−2) < 4 的左端值。
 * 这是「为什么只有五种」的判据：正整数解仅五组。
 */
export function angleCondition(p: number, q: number): number {
  return (p - 2) * (q - 2)
}

/** 枚举所有满足 (p−2)(q−2) < 4 且 p,q ≥ 3 的整数对 */
export function enumerateSolutions(maxPQ = 12): Array<[number, number]> {
  const out: Array<[number, number]> = []
  for (let p = 3; p <= maxPQ; p++) {
    for (let q = 3; q <= maxPQ; q++) {
      if (angleCondition(p, q) < 4) out.push([p, q])
    }
  }
  return out
}

/** 一个顶点处的角亏（360° 减去聚集的内角和），单位为度 */
export function angularDefect(p: number, q: number): number {
  const interior = 180 * (1 - 2 / q)
  return 360 - p * interior
}

export function infoOf(kind: PlatonicKind): PlatonicInfo {
  return PLATONIC_INFO.find((i) => i.kind === kind) ?? PLATONIC_INFO[0]
}
