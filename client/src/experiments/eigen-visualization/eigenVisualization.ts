/**
 * 特征值与特征向量（纯函数数学内核，无 DOM）
 *
 * 对 2x2 实矩阵 A：
 *   - 特征值 λ 满足 det(A - λI) = 0，即 λ² - tr·λ + det = 0
 *   - 特征向量 v 满足 A·v = λ·v，即在变换下方向不变，仅按 λ 缩放
 */

export type Matrix2 = [[number, number], [number, number]]
export type Vec2 = [number, number]

/** 矩阵作用于向量：A·v */
export function applyMatrix(m: Matrix2, v: Vec2): Vec2 {
  return [m[0][0] * v[0] + m[0][1] * v[1], m[1][0] * v[0] + m[1][1] * v[1]]
}

/** 迹（主对角线之和） */
export function trace(m: Matrix2): number {
  return m[0][0] + m[1][1]
}

/** 行列式 */
export function determinant(m: Matrix2): number {
  return m[0][0] * m[1][1] - m[0][1] * m[1][0]
}

/** 单位化向量（零向量原样返回） */
export function normalize(v: Vec2): Vec2 {
  const len = Math.hypot(v[0], v[1])
  if (len < 1e-12) return [0, 0]
  return [v[0] / len, v[1] / len]
}

export interface EigenPair {
  value: number // 特征值 λ（实数）
  vector: Vec2 // 对应的单位特征向量
}

export interface EigenResult {
  real: boolean // 特征值是否为实数
  discriminant: number // 判别式 tr² - 4·det
  pairs: EigenPair[] // 实数情形下的特征对（可能重根）
}

/**
 * 求 2x2 矩阵的实特征值与特征向量。
 * 判别式 < 0 时特征值为复数，此处不返回实特征对。
 */
export function eigen2x2(m: Matrix2): EigenResult {
  const t = trace(m)
  const d = determinant(m)
  const disc = t * t - 4 * d
  if (disc < 0) return { real: false, discriminant: disc, pairs: [] }

  const s = Math.sqrt(disc)
  const lambdas = disc === 0 ? [t / 2] : [(t + s) / 2, (t - s) / 2]
  const [a, b] = m[0]
  const [c] = m[1]

  const pairs: EigenPair[] = lambdas.map((lambda) => {
    let vec: Vec2
    if (Math.abs(b) > 1e-12) vec = [b, lambda - a]
    else if (Math.abs(c) > 1e-12) vec = [lambda - m[1][1], c]
    else vec = Math.abs(lambda - a) < 1e-12 ? [1, 0] : [0, 1]
    return { value: lambda, vector: normalize(vec) }
  })
  return { real: true, discriminant: disc, pairs }
}

export interface MatrixOption {
  id: string
  label: string
  matrix: Matrix2
  note: string
}

export const MATRIX_OPTIONS: MatrixOption[] = [
  { id: 'stretch', label: '轴向拉伸', matrix: [[2, 0], [0, 1]], note: '沿坐标轴拉伸，两个实特征向量' },
  { id: 'shear', label: '剪切变换', matrix: [[1, 1], [0, 1]], note: '重根，仅一个方向不变' },
  { id: 'symmetric', label: '对称矩阵', matrix: [[2, 1], [1, 2]], note: '特征向量相互垂直' },
  { id: 'rotation', label: '旋转变换', matrix: [[0, -1], [1, 0]], note: '判别式为负，无实特征向量' },
]
