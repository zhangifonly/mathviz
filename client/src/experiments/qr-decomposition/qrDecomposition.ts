/**
 * QR 分解核心算法（纯函数，便于测试）
 * 用 Gram-Schmidt 把矩阵 A 各列正交单位化得正交阵 Q，
 * 减掉的投影系数构成上三角阵 R，满足 A = Q R（小矩阵、列线性无关）。
 */

export type Matrix = number[][] // 按行存储 matrix[i][j]

export interface QRResult {
  Q: Matrix // m x n，列两两正交且为单位向量
  R: Matrix // n x n，上三角
}

/** 取第 j 列为向量 */
export function getColumn(A: Matrix, j: number): number[] {
  return A.map((row) => row[j])
}

/** 向量点积 */
export function dot(a: number[], b: number[]): number {
  let s = 0
  for (let i = 0; i < a.length; i++) s += a[i] * b[i]
  return s
}

/** 向量二范数 */
export function norm(a: number[]): number {
  return Math.sqrt(dot(a, a))
}

/** Gram-Schmidt QR：每列减去在已得正交基上的投影再单位化得 Q，系数填入 R */
export function qrDecompose(A: Matrix): QRResult {
  const m = A.length, n = A[0].length
  const Q: Matrix = Array.from({ length: m }, () => new Array(n).fill(0))
  const R: Matrix = Array.from({ length: n }, () => new Array(n).fill(0))

  for (let j = 0; j < n; j++) {
    const v = getColumn(A, j)
    for (let i = 0; i < j; i++) {
      const qi = getColumn(Q, i)
      const rij = dot(qi, v)
      R[i][j] = rij
      for (let k = 0; k < m; k++) v[k] -= rij * qi[k]
    }
    const rjj = norm(v)
    R[j][j] = rjj
    for (let k = 0; k < m; k++) Q[k][j] = rjj > 1e-12 ? v[k] / rjj : 0
  }
  return { Q, R }
}

/** 矩阵乘法 A(m x p) * B(p x n) */
export function multiply(A: Matrix, B: Matrix): Matrix {
  const m = A.length, p = B.length, n = B[0].length
  const C: Matrix = Array.from({ length: m }, () => new Array(n).fill(0))
  for (let i = 0; i < m; i++)
    for (let j = 0; j < n; j++) {
      let s = 0
      for (let k = 0; k < p; k++) s += A[i][k] * B[k][j]
      C[i][j] = s
    }
  return C
}

/** 转置 */
export function transpose(A: Matrix): Matrix {
  const m = A.length, n = A[0].length
  const T: Matrix = Array.from({ length: n }, () => new Array(m).fill(0))
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) T[j][i] = A[i][j]
  return T
}

/** 两矩阵逐元素接近 */
export function matClose(A: Matrix, B: Matrix, eps = 1e-9): boolean {
  if (A.length !== B.length || A[0].length !== B[0].length) return false
  for (let i = 0; i < A.length; i++)
    for (let j = 0; j < A[0].length; j++)
      if (Math.abs(A[i][j] - B[i][j]) > eps) return false
  return true
}

/** 验证 Q^T Q = I（列正交单位化） */
export function isOrthonormal(Q: Matrix, eps = 1e-9): boolean {
  const g = multiply(transpose(Q), Q)
  for (let i = 0; i < g.length; i++)
    for (let j = 0; j < g.length; j++)
      if (Math.abs(g[i][j] - (i === j ? 1 : 0)) > eps) return false
  return true
}

export interface SampleMatrix {
  label: string
  matrix: Matrix
}

export const SAMPLE_MATRICES: SampleMatrix[] = [
  { label: '2x2 简单', matrix: [[2, 1], [1, 3]] },
  { label: '3x2 平面基', matrix: [[1, 1], [1, 0], [0, 1]] },
  { label: '3x3 一般', matrix: [[2, -1, 0], [1, 2, 1], [0, 1, 2]] },
]
