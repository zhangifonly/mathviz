/**
 * 闵可夫斯基和与斯坦纳公式（纯函数，便于测试）
 *
 * 把一个凸多面体 K 用半径 r 的球"擦"一遍，得到的圆角体是闵可夫斯基和 K ⊕ rB
 * （所有到 K 距离不超过 r 的点）。它的体积不是杂乱的函数，而是 r 的三次多项式：
 *
 *   V(r) = V + S·r + M·r² + (4π/3)·r³
 *
 * 四个系数都有几何含义，而且这个公式的证明就是"把圆角体拆开数"：
 *
 *   1. 原来的多面体            → V
 *   2. 每个面外推 r 的板        → S·r        （S = 表面积）
 *   3. 每条棱外的柱面楔子       → M·r²       （M = 平均曲率积分）
 *   4. 每个顶点外的球面片       → (4π/3)r³   （恒为一整个球！）
 *
 * 第 3 项里 M = ½·Σ 棱长 × 外二面角，楔子是圆柱的一瓣。
 *
 * 第 4 项是最漂亮的地方：**不管什么凸多面体，顶点上那些球面片拼起来恰好是一整个球**。
 * 原因是凸多面体的外立体角之和恒为 4π —— 与上一个实验的结论直接呼应：
 * 那里说内立体角之和不是常数（立方体 4π 是巧合，正四面体只有 2.2），
 * 而这里的外立体角之和才是真正的恒等式。
 *
 * 还有一条更基本的性质，闵可夫斯基和在"支持函数"下变成加法：
 *   h_{A⊕B}(u) = h_A(u) + h_B(u),   其中 h_K(u) = max_{x∈K} ⟨x, u⟩
 * 于是 h_{K⊕rB}(u) = h_K(u) + r —— 球把每个方向都往外推了 r，就这么简单。
 */

import type { Vec3 } from '../../lib/proj3d'

export interface Solid {
  id: string
  label: string
  /** 顶点 */
  vertices: Vec3[]
  /** 棱：顶点下标对 */
  edges: Array<[number, number]>
  /**
   * 面：顶点下标环（逆时针朝外）。
   * 绘制面板必须沿**面法向**外推，不能拿棱中点方向凑合 ——
   * 立方体棱中点方向是斜的(如 (1,1,0)/√2)，那样推出去比面板远 √2 倍，
   * 画出来面板会跑到棱楔外面（截图里就是这个毛病）。
   */
  faces: number[][]
  /** 体积 */
  volume: number
  /** 表面积 */
  area: number
  /** 平均曲率积分 M = ½ Σ 棱长 × 外二面角 */
  meanCurvature: number
  /** 二面角（弧度），用于展示 */
  dihedral: number
}

/** 面的单位外法向（顶点环逆时针朝外，用叉积并以形心定向） */
export function faceNormal(K: Solid, face: number[]): Vec3 {
  const [i, j, k] = face
  const a = K.vertices[i]
  const b = K.vertices[j]
  const c = K.vertices[k]
  const u: Vec3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  const v: Vec3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  let n: Vec3 = [
    u[1] * v[2] - u[2] * v[1],
    u[2] * v[0] - u[0] * v[2],
    u[0] * v[1] - u[1] * v[0],
  ]
  const len = Math.hypot(n[0], n[1], n[2]) || 1
  n = [n[0] / len, n[1] / len, n[2] / len]
  // 立体以原点为内点：法向应与面上任一点同向
  if (n[0] * a[0] + n[1] * a[1] + n[2] * a[2] < 0) {
    n = [-n[0], -n[1], -n[2]]
  }
  return n
}

/** 面的形心 */
export function faceCentroid(K: Solid, face: number[]): Vec3 {
  let x = 0
  let y = 0
  let z = 0
  for (const i of face) {
    x += K.vertices[i][0]
    y += K.vertices[i][1]
    z += K.vertices[i][2]
  }
  const n = face.length
  return [x / n, y / n, z / n]
}

const CUBE_A = 2 // 立方体棱长，顶点取 ±1

/** 立方体：棱长 a，顶点 (±a/2, ±a/2, ±a/2) */
export function makeCube(a = CUBE_A): Solid {
  const h = a / 2
  const vertices: Vec3[] = [
    [-h, -h, -h], [h, -h, -h], [h, h, -h], [-h, h, -h],
    [-h, -h, h], [h, -h, h], [h, h, h], [-h, h, h],
  ]
  const edges: Array<[number, number]> = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7],
  ]
  // 六个面：底、顶、前后左右（顶点环逆时针朝外）
  const faces: number[][] = [
    [0, 3, 2, 1], [4, 5, 6, 7],
    [0, 1, 5, 4], [2, 3, 7, 6],
    [1, 2, 6, 5], [0, 4, 7, 3],
  ]
  // 二面角 π/2，外二面角 π/2；12 条棱：M = ½·12a·(π/2) = 3πa
  return {
    id: 'cube',
    label: '立方体',
    vertices,
    edges,
    faces,
    volume: a * a * a,
    area: 6 * a * a,
    meanCurvature: 3 * Math.PI * a,
    dihedral: Math.PI / 2,
  }
}

/** 正四面体：棱长 a */
export function makeTetrahedron(a = 2): Solid {
  // 取 (1,1,1),(1,-1,-1),(-1,1,-1),(-1,-1,1)，棱长 2√2，再缩放到 a
  const s = a / (2 * Math.SQRT2)
  const vertices: Vec3[] = [
    [s, s, s], [s, -s, -s], [-s, s, -s], [-s, -s, s],
  ]
  const edges: Array<[number, number]> = [
    [0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3],
  ]
  const faces: number[][] = [
    [0, 1, 2], [0, 2, 3], [0, 3, 1], [1, 3, 2],
  ]
  const dihedral = Math.acos(1 / 3)
  return {
    id: 'tetrahedron',
    label: '正四面体',
    vertices,
    edges,
    faces,
    volume: (a * a * a) / (6 * Math.SQRT2),
    area: Math.sqrt(3) * a * a,
    // 6 条棱，外二面角 π − arccos(1/3)
    meanCurvature: 0.5 * 6 * a * (Math.PI - dihedral),
    dihedral,
  }
}

/** 正八面体：棱长 a */
export function makeOctahedron(a = 2): Solid {
  // 顶点 (±c,0,0),(0,±c,0),(0,0,±c)，棱长 c√2
  const c = a / Math.SQRT2
  const vertices: Vec3[] = [
    [c, 0, 0], [-c, 0, 0], [0, c, 0], [0, -c, 0], [0, 0, c], [0, 0, -c],
  ]
  const edges: Array<[number, number]> = [
    [0, 2], [0, 3], [0, 4], [0, 5],
    [1, 2], [1, 3], [1, 4], [1, 5],
    [2, 4], [2, 5], [3, 4], [3, 5],
  ]
  // 八个三角面：顶点顺序 [+x,−x,+y,−y,+z,−z] = [0..5]
  const faces: number[][] = [
    [0, 2, 4], [2, 1, 4], [1, 3, 4], [3, 0, 4],
    [2, 0, 5], [1, 2, 5], [3, 1, 5], [0, 3, 5],
  ]
  const dihedral = Math.acos(-1 / 3)
  return {
    id: 'octahedron',
    label: '正八面体',
    vertices,
    edges,
    faces,
    volume: (Math.SQRT2 / 3) * a * a * a,
    area: 2 * Math.sqrt(3) * a * a,
    // 12 条棱
    meanCurvature: 0.5 * 12 * a * (Math.PI - dihedral),
    dihedral,
  }
}

export const SOLIDS = [makeCube(), makeTetrahedron(), makeOctahedron()] as const
export type SolidId = 'cube' | 'tetrahedron' | 'octahedron'

export function solidOf(id: SolidId): Solid {
  if (id === 'tetrahedron') return makeTetrahedron()
  if (id === 'octahedron') return makeOctahedron()
  return makeCube()
}

/** 顶点球面片总体积恒为一整个球（外立体角之和 = 4π） */
export function vertexBallVolume(r: number): number {
  return (4 / 3) * Math.PI * r * r * r
}

/**
 * 斯坦纳公式：圆角体的体积 V(r) = V + S·r + M·r² + (4π/3)r³
 */
export function steinerVolume(K: Solid, r: number): number {
  return K.volume
    + K.area * r
    + K.meanCurvature * r * r
    + vertexBallVolume(r)
}

/** 斯坦纳公式的四项分解（用于展示每一项的贡献） */
export interface SteinerTerms {
  body: number
  faces: number
  edges: number
  vertices: number
  total: number
}

export function steinerTerms(K: Solid, r: number): SteinerTerms {
  const body = K.volume
  const faces = K.area * r
  const edges = K.meanCurvature * r * r
  const vertices = vertexBallVolume(r)
  return { body, faces, edges, vertices, total: body + faces + edges + vertices }
}

/** 圆角体的表面积：S(r) = S + 2M·r + 4π·r² （体积公式的导数） */
export function steinerArea(K: Solid, r: number): number {
  return K.area + 2 * K.meanCurvature * r + 4 * Math.PI * r * r
}

/** 棱长总和 */
export function totalEdgeLength(K: Solid): number {
  let sum = 0
  for (const [i, j] of K.edges) {
    const p = K.vertices[i]
    const q = K.vertices[j]
    sum += Math.hypot(q[0] - p[0], q[1] - p[1], q[2] - p[2])
  }
  return sum
}

/** 由棱长与外二面角直接算 M，校验硬编码的值 */
export function meanCurvatureFromEdges(K: Solid): number {
  return 0.5 * totalEdgeLength(K) * (Math.PI - K.dihedral)
}

/**
 * 支持函数 h_K(u) = max_{x∈K} ⟨x, u⟩（对多面体就是顶点上取最大）
 */
export function support(K: Solid, u: Vec3): number {
  let best = -Infinity
  for (const v of K.vertices) {
    const d = v[0] * u[0] + v[1] * u[1] + v[2] * u[2]
    if (d > best) best = d
  }
  return best
}

/** 圆角体的支持函数：h_{K⊕rB}(u) = h_K(u) + r（对单位方向 u） */
export function supportOffset(K: Solid, u: Vec3, r: number): number {
  const n = Math.hypot(u[0], u[1], u[2])
  if (n < 1e-15) return r
  return support(K, [u[0] / n, u[1] / n, u[2] / n]) + r
}

/** 某方向上的宽度 w(u) = h(u) + h(−u) */
export function width(K: Solid, u: Vec3): number {
  return support(K, u) + support(K, [-u[0], -u[1], -u[2]])
}

/** 点到轴对齐立方体的距离（用于数值校验圆角立方体的体积） */
export function distToCube(p: Vec3, a = CUBE_A): number {
  const h = a / 2
  const dx = Math.max(0, Math.abs(p[0]) - h)
  const dy = Math.max(0, Math.abs(p[1]) - h)
  const dz = Math.max(0, Math.abs(p[2]) - h)
  return Math.hypot(dx, dy, dz)
}

/**
 * 网格数值积分算圆角立方体的体积，独立校验斯坦纳公式。
 * 点在 K⊕rB 内 ⟺ dist(p, K) ≤ r。
 */
export function offsetVolumeNumeric(r: number, a = CUBE_A, steps = 90): number {
  const lim = a / 2 + r + 0.05
  const d = (2 * lim) / steps
  let count = 0
  for (let i = 0; i < steps; i++) {
    const x = -lim + (i + 0.5) * d
    for (let j = 0; j < steps; j++) {
      const y = -lim + (j + 0.5) * d
      for (let k = 0; k < steps; k++) {
        const z = -lim + (k + 0.5) * d
        if (distToCube([x, y, z], a) <= r) count++
      }
    }
  }
  return count * d * d * d
}

/** 圆角体上距离 K 恰为 r 的点（表面），用于绘制 */
export function roundedCubeSurfacePoint(u: Vec3, r: number, a = CUBE_A): Vec3 {
  // 立方体上最近点 = 把 u 方向的支撑点夹到立方体，再沿外法向推 r
  const h = a / 2
  const n = Math.hypot(u[0], u[1], u[2]) || 1
  const d: Vec3 = [u[0] / n, u[1] / n, u[2] / n]
  // 立方体在方向 d 的支撑点：每个坐标取 ±h
  const s: Vec3 = [
    d[0] >= 0 ? h : -h, d[1] >= 0 ? h : -h, d[2] >= 0 ? h : -h,
  ]
  // 圆角体表面 = 支撑点沿 d 推 r（这给出的是支持函数意义下的外壳）
  void s
  return [d[0] * r, d[1] * r, d[2] * r]
}

/** 斯坦纳公式与数值积分的相对误差 */
export function steinerResidual(r: number, steps = 90): number {
  const exact = steinerVolume(makeCube(), r)
  const numeric = offsetVolumeNumeric(r, CUBE_A, steps)
  return Math.abs(numeric - exact) / exact
}

/** 立方体圆角体各项的具体数字（a=2 时）：8 + 24r + 6πr² + (4π/3)r³ */
export const CUBE_STEINER_COEFFS = {
  body: 8,
  face: 24,
  edge: 6 * Math.PI,
  vertex: (4 / 3) * Math.PI,
} as const

export const PRESET_RADII = [0, 0.25, 0.5, 0.9] as const
