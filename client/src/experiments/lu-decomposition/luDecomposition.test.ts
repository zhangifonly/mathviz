import { describe, it, expect } from 'vitest'
import {
  luDecompose,
  luSolve,
  matMul,
  identity,
  SAMPLE_MATRICES,
} from './luDecomposition'

describe('LU 分解', () => {
  it('identity 生成单位矩阵', () => {
    expect(identity(3)).toEqual([
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ])
  })

  it('L 为单位下三角、U 为上三角', () => {
    const { L, U } = luDecompose(SAMPLE_MATRICES[0])
    const n = L.length
    for (let i = 0; i < n; i++) {
      expect(L[i][i]).toBeCloseTo(1)
      for (let j = i + 1; j < n; j++) {
        expect(L[i][j]).toBeCloseTo(0) // L 上三角部分为 0
        expect(U[j][i]).toBeCloseTo(0) // U 下三角部分为 0
      }
    }
  })

  it('L·U 复原原矩阵', () => {
    for (const A of SAMPLE_MATRICES) {
      const { L, U } = luDecompose(A)
      const prod = matMul(L, U)
      for (let i = 0; i < A.length; i++) {
        for (let j = 0; j < A.length; j++) {
          expect(prod[i][j]).toBeCloseTo(A[i][j])
        }
      }
    }
  })

  it('luSolve 解出正确的方程组解', () => {
    const A = SAMPLE_MATRICES[0]
    const { L, U } = luDecompose(A)
    const x = [1, 2, 3]
    const b = matMul(A, x.map((v) => [v])).map((r) => r[0])
    const solved = luSolve(L, U, b)
    for (let i = 0; i < 3; i++) expect(solved[i]).toBeCloseTo(x[i])
  })

  it('记录了非零的消元步数', () => {
    const { steps } = luDecompose(SAMPLE_MATRICES[0])
    // 3x3 不选主元共需 3 次消元（下三角 3 个位置）
    expect(steps.length).toBe(3)
    for (const s of steps) expect(s.pivot).toBeLessThan(s.target)
  })

  it('主元为零时抛出错误', () => {
    expect(() =>
      luDecompose([
        [0, 1],
        [1, 1],
      ]),
    ).toThrow()
  })
})
