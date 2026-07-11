/**
 * 施密特正交化（Gram-Schmidt）纯函数数学内核
 *
 * 给定一组线性无关向量 v1, v2, ..., 逐个减去它们在已得正交向量上的投影，
 * 得到一组两两正交的向量 u1, u2, ...；再单位化即得标准正交基 e1, e2, ...。
 *
 *   u_k = v_k - Σ_{i<k} proj_{u_i}(v_k)
 *   proj_{u}(v) = (v·u / u·u) * u
 *   e_k = u_k / |u_k|
 *
 * 全部为纯函数，不依赖任何 DOM。
 */

export type Vec = number[]

/** 向量点积 a·b */
export function dot(a: Vec, b: Vec): number {
  let s = 0
  for (let i = 0; i < a.length; i++) s += a[i] * b[i]
  return s
}

/** 向量模长 |a| */
export function norm(a: Vec): number {
  return Math.sqrt(dot(a, a))
}

/** 向量数乘 k*a */
export function scale(a: Vec, k: number): Vec {
  return a.map((x) => x * k)
}

/** 向量减法 a-b */
export function sub(a: Vec, b: Vec): Vec {
  return a.map((x, i) => x - b[i])
}

/** v 在 u 上的正交投影 (v·u / u·u) * u；u 为零向量时返回零向量 */
export function projection(v: Vec, u: Vec): Vec {
  const uu = dot(u, u)
  if (uu === 0) return u.map(() => 0)
  return scale(u, dot(v, u) / uu)
}

/** 单个正交化步骤的记录，便于逐步演示 */
export interface GSStep {
  v: Vec // 原始输入向量
  projections: Vec[] // 在此前每个 u_i 上的投影分量
  u: Vec // 正交化后的向量
  e: Vec // 单位化后的向量（u 为零向量时为零向量）
  length: number // |u|
}

export interface GSResult {
  steps: GSStep[]
  orthogonal: Vec[] // 正交基 u1..un
  orthonormal: Vec[] // 标准正交基 e1..en
}

/**
 * 对一组向量执行施密特正交化。
 * @param vectors 输入向量组（应线性无关，允许 2D/3D/任意维）
 */
export function gramSchmidt(vectors: Vec[]): GSResult {
  const steps: GSStep[] = []
  const us: Vec[] = []
  for (const v of vectors) {
    const projections: Vec[] = []
    let u = v.slice()
    for (const prev of us) {
      const p = projection(v, prev)
      projections.push(p)
      u = sub(u, p)
    }
    const length = norm(u)
    const e = length === 0 ? u.map(() => 0) : scale(u, 1 / length)
    us.push(u)
    steps.push({ v, projections, u, e, length })
  }
  return {
    steps,
    orthogonal: steps.map((s) => s.u),
    orthonormal: steps.map((s) => s.e),
  }
}

/** 两个向量是否近似正交（点积接近 0） */
export function isOrthogonal(a: Vec, b: Vec, eps = 1e-9): boolean {
  return Math.abs(dot(a, b)) < eps
}

export interface ExampleOption {
  id: string
  label: string
  note: string
  vectors: Vec[]
}

/** 预置的二维输入向量组，供页面切换演示 */
export const EXAMPLE_OPTIONS: ExampleOption[] = [
  {
    id: 'classic',
    label: '经典斜向量',
    note: '两个夹角较小的向量',
    vectors: [
      [3, 1],
      [2, 2],
    ],
  },
  {
    id: 'steep',
    label: '陡峭组合',
    note: '一横一斜，投影明显',
    vectors: [
      [4, 0],
      [1, 3],
    ],
  },
  {
    id: 'wide',
    label: '大夹角',
    note: '接近垂直，投影很小',
    vectors: [
      [2, 1],
      [-1, 3],
    ],
  },
]
