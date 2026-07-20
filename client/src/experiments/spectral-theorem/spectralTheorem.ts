/**
 * 谱分解核心算法（纯函数，便于测试）
 *
 * 对 2x2 实对称矩阵 M = [[a, b], [b, c]]，谱定理保证：
 *   1. 两个特征值都是实数；
 *   2. 存在一组正交（可标准正交）的特征向量；
 *   3. M = Σ λᵢ vᵢ vᵢᵀ （谱分解 / 正交对角化）。
 * 这里对 2x2 情形给出闭式解，避免迭代误差。
 */

export interface SymMatrix2 {
  a: number // M[0][0]
  b: number // M[0][1] = M[1][0]
  c: number // M[1][1]
}

export interface Eigen2 {
  values: [number, number]        // λ1 >= λ2
  vectors: [[number, number], [number, number]] // 单位特征向量 v1, v2
}

/** 2x2 对称矩阵谱分解：返回两个实特征值与标准正交特征向量 */
export function eigenSym2x2(m: SymMatrix2): Eigen2 {
  const { a, b, c } = m
  const tr = a + c
  const diff = a - c
  // 判别式 >= 0 恒成立（对称矩阵），根号内非负
  const disc = Math.sqrt(diff * diff + 4 * b * b)
  const l1 = (tr + disc) / 2
  const l2 = (tr - disc) / 2

  const v1 = eigenvectorFor(m, l1)
  // 第二特征向量取 v1 的正交向量，保证严格正交
  const v2: [number, number] = [-v1[1], v1[0]]
  return { values: [l1, l2], vectors: [v1, v2] }
}

/** 求给定特征值对应的单位特征向量（解 (M - λI)v = 0） */
function eigenvectorFor(m: SymMatrix2, lambda: number): [number, number] {
  const { a, b, c } = m
  // (a-λ)x + b y = 0 ; b x + (c-λ)y = 0
  let vx: number
  let vy: number
  const r1x = a - lambda
  if (Math.abs(b) > 1e-12 || Math.abs(r1x) > 1e-12) {
    // 用第一行：方向 (b, -(a-λ)) 或 (-(c-λ), b)
    vx = b
    vy = -r1x
    if (Math.abs(vx) < 1e-12 && Math.abs(vy) < 1e-12) {
      vx = -(c - lambda)
      vy = b
    }
  } else {
    vx = 1
    vy = 0
  }
  return normalize(vx, vy)
}

/** 归一化二维向量 */
export function normalize(x: number, y: number): [number, number] {
  const n = Math.hypot(x, y)
  if (n < 1e-12) return [1, 0]
  return [x / n, y / n]
}

/** 两向量点积 */
export function dot2(u: [number, number], v: [number, number]): number {
  return u[0] * v[0] + u[1] * v[1]
}

/** 由谱分解重构矩阵 M = Σ λᵢ vᵢ vᵢᵀ */
export function reconstruct(e: Eigen2): SymMatrix2 {
  const [l1, l2] = e.values
  const [v1, v2] = e.vectors
  const a = l1 * v1[0] * v1[0] + l2 * v2[0] * v2[0]
  const b = l1 * v1[0] * v1[1] + l2 * v2[0] * v2[1]
  const c = l1 * v1[1] * v1[1] + l2 * v2[1] * v2[1]
  return { a, b, c }
}

/** 矩阵作用于向量 M·v */
export function applyMatrix(m: SymMatrix2, v: [number, number]): [number, number] {
  return [m.a * v[0] + m.b * v[1], m.b * v[0] + m.c * v[1]]
}

/** 示例对称矩阵（供 UI 切换） */
export const SAMPLE_MATRICES: { label: string; matrix: SymMatrix2 }[] = [
  { label: '拉伸型', matrix: { a: 3, b: 0, c: 1 } },
  { label: '斜切型', matrix: { a: 2, b: 1, c: 2 } },
  { label: '强各向异', matrix: { a: 4, b: 2, c: 1 } },
]
