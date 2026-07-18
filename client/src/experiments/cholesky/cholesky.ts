/**
 * Cholesky 分解核心算法（纯函数，便于测试）
 *
 * 对称正定矩阵 A 可唯一分解为 A = L L^T，
 * 其中 L 是对角元为正的下三角矩阵。它相当于 LU 分解在
 * 对称正定情形下的特化，计算量约为一半。
 */

export type Matrix = number[][]

/** 逐元素计算的中间步骤，用于可视化 */
export interface CholStep {
  i: number
  j: number
  value: number
  diagonal: boolean
}

/**
 * 对对称正定矩阵做 Cholesky 分解，返回下三角 L 使 L L^T = A。
 * 若矩阵非正定（出现非正的对角平方项）返回 null。
 */
export function cholesky(A: Matrix): Matrix | null {
  const n = A.length
  const L: Matrix = Array.from({ length: n }, () => new Array(n).fill(0))
  for (let j = 0; j < n; j++) {
    let diag = A[j][j]
    for (let k = 0; k < j; k++) diag -= L[j][k] * L[j][k]
    if (diag <= 1e-12) return null // 非正定
    L[j][j] = Math.sqrt(diag)
    for (let i = j + 1; i < n; i++) {
      let s = A[i][j]
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k]
      L[i][j] = s / L[j][j]
    }
  }
  return L
}

/** 记录每个 L 元素的计算顺序（按列优先），用于表格逐格展示 */
export function choleskySteps(A: Matrix): CholStep[] {
  const L = cholesky(A)
  if (!L) return []
  const n = A.length
  const steps: CholStep[] = []
  for (let j = 0; j < n; j++) {
    steps.push({ i: j, j, value: L[j][j], diagonal: true })
    for (let i = j + 1; i < n; i++) {
      steps.push({ i, j, value: L[i][j], diagonal: false })
    }
  }
  return steps
}

/** 矩阵乘法 A*B */
export function matMul(A: Matrix, B: Matrix): Matrix {
  const n = A.length
  const m = B[0].length
  const p = B.length
  const C: Matrix = Array.from({ length: n }, () => new Array(m).fill(0))
  for (let i = 0; i < n; i++)
    for (let j = 0; j < m; j++) {
      let s = 0
      for (let k = 0; k < p; k++) s += A[i][k] * B[k][j]
      C[i][j] = s
    }
  return C
}

/** 转置 */
export function transpose(A: Matrix): Matrix {
  const n = A.length
  const m = A[0].length
  const T: Matrix = Array.from({ length: m }, () => new Array(n).fill(0))
  for (let i = 0; i < n; i++)
    for (let j = 0; j < m; j++) T[j][i] = A[i][j]
  return T
}

/** 由 L 重构 A（= L L^T），用于验证分解正确性 */
export function reconstruct(L: Matrix): Matrix {
  return matMul(L, transpose(L))
}

/** 判断对称正定：能成功分解即为正定 */
export function isPositiveDefinite(A: Matrix): boolean {
  return cholesky(A) !== null
}

/** 示例：三个 3x3 对称正定矩阵 */
export const SAMPLE_MATRICES: Matrix[] = [
  [
    [4, 12, -16],
    [12, 37, -43],
    [-16, -43, 98],
  ],
  [
    [2, -1, 0],
    [-1, 2, -1],
    [0, -1, 2],
  ],
  [
    [25, 15, -5],
    [15, 18, 0],
    [-5, 0, 11],
  ],
]
