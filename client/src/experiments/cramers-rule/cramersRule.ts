/**
 * 克拉默法则核心算法（纯函数，便于测试）
 *
 * 对线性方程组 A x = b，若系数行列式 det(A) 不为零，则唯一解为
 *   x_i = det(A_i) / det(A)
 * 其中 A_i 是把 A 的第 i 列替换成常数向量 b 后得到的矩阵。
 * 这里实现 2 阶、3 阶行列式，以及 2/3 元方程组的克拉默求解。
 */

/** 2 阶行列式 |a b; c d| = ad - bc */
export function det2(m: number[][]): number {
  return m[0][0] * m[1][1] - m[0][1] * m[1][0]
}

/** 3 阶行列式（按第一行展开） */
export function det3(m: number[][]): number {
  const [a, b, c] = m[0]
  const s1 = m[1][1] * m[2][2] - m[1][2] * m[2][1]
  const s2 = m[1][0] * m[2][2] - m[1][2] * m[2][0]
  const s3 = m[1][0] * m[2][1] - m[1][1] * m[2][0]
  return a * s1 - b * s2 + c * s3
}

/** 通用 n 阶行列式（仅支持 n=2,3，够本实验用） */
export function det(m: number[][]): number {
  return m.length === 2 ? det2(m) : det3(m)
}

/** 把矩阵 A 的第 col 列替换成向量 b，返回新矩阵 A_col */
export function replaceColumn(A: number[][], b: number[], col: number): number[][] {
  return A.map((row, i) => row.map((v, j) => (j === col ? b[i] : v)))
}

/**
 * 克拉默法则求解 A x = b。
 * @returns 解向量；若系数行列式为 0（无唯一解）返回 null。
 */
export function cramerSolve(A: number[][], b: number[]): number[] | null {
  const D = det(A)
  if (Math.abs(D) < 1e-12) return null
  return A.map((_, i) => det(replaceColumn(A, b, i)) / D)
}

export interface SampleSystem {
  name: string
  A: number[][]
  b: number[]
}

/** 内置 2 元样例方程组（保证 det(A) != 0，有唯一交点） */
export const SAMPLE_SYSTEMS: SampleSystem[] = [
  { name: '相交直线', A: [[2, 1], [1, -1]], b: [5, 1] },
  { name: '缓陡对比', A: [[1, 2], [3, -1]], b: [4, 5] },
  { name: '负斜率组', A: [[3, 2], [-1, 2]], b: [7, 3] },
]
