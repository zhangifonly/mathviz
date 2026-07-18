/**
 * LU 分解核心算法（Doolittle 法，不选主元，纯函数便于测试）
 * 把方阵 A 分解成下三角 L（对角线全 1）与上三角 U，使 A = L·U。
 */

export type Matrix = number[][]

/** 一步消元帧：用第 pivot 行消去第 target 行，乘数为 factor */
export interface LuStep {
  pivot: number
  target: number
  factor: number
  matrix: Matrix // 该步消元后的工作矩阵快照
}

export interface LuResult { L: Matrix; U: Matrix; steps: LuStep[] }

function clone(m: Matrix): Matrix {
  return m.map((row) => row.slice())
}

/** 生成 n 阶单位矩阵 */
export function identity(n: number): Matrix {
  const I: Matrix = []
  for (let i = 0; i < n; i++) {
    I.push(Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)))
  }
  return I
}

/**
 * Doolittle LU 分解（不选主元）。要求各主元非零。
 * 返回 L、U 以及逐步消元帧序列。
 */
export function luDecompose(matrix: Matrix): LuResult {
  const n = matrix.length
  const U = clone(matrix)
  const L = identity(n)
  const steps: LuStep[] = []

  for (let k = 0; k < n; k++) {
    const pivotVal = U[k][k]
    if (Math.abs(pivotVal) < 1e-12) {
      throw new Error(`主元 U[${k}][${k}] 为零，需选主元`)
    }
    for (let i = k + 1; i < n; i++) {
      const factor = U[i][k] / pivotVal
      L[i][k] = factor
      for (let j = k; j < n; j++) {
        U[i][j] -= factor * U[k][j]
      }
      steps.push({ pivot: k, target: i, factor, matrix: clone(U) })
    }
  }
  return { L, U, steps }
}

/** 矩阵乘法 A·B */
export function matMul(a: Matrix, b: Matrix): Matrix {
  const n = a.length
  const p = b[0].length
  const m = b.length
  const out: Matrix = []
  for (let i = 0; i < n; i++) {
    const row: number[] = []
    for (let j = 0; j < p; j++) {
      let sum = 0
      for (let t = 0; t < m; t++) sum += a[i][t] * b[t][j]
      row.push(sum)
    }
    out.push(row)
  }
  return out
}

/** 用 LU 分解解线性方程组 A·x = b：先前代 L·y=b，再回代 U·x=y */
export function luSolve(L: Matrix, U: Matrix, b: number[]): number[] {
  const n = L.length
  const y = new Array(n).fill(0)
  for (let i = 0; i < n; i++) {
    let s = b[i]
    for (let j = 0; j < i; j++) s -= L[i][j] * y[j]
    y[i] = s / L[i][i]
  }
  const x = new Array(n).fill(0)
  for (let i = n - 1; i >= 0; i--) {
    let s = y[i]
    for (let j = i + 1; j < n; j++) s -= U[i][j] * x[j]
    x[i] = s / U[i][i]
  }
  return x
}

/** 内置示例 3x3 矩阵（主元均非零，可直接分解） */
export const SAMPLE_MATRICES: Matrix[] = [
  [[2, 1, 1], [4, 3, 3], [8, 7, 9]],
  [[1, 2, 4], [3, 8, 14], [2, 6, 13]],
  [[4, 3, 2], [2, 5, 3], [6, 4, 7]],
]
