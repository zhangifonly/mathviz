import { describe, it, expect } from 'vitest'
import {
  qrDecompose,
  multiply,
  transpose,
  matClose,
  isOrthonormal,
  dot,
  norm,
  SAMPLE_MATRICES,
} from './qrDecomposition'

describe('QR 分解', () => {
  it('QR = A 对所有样例成立', () => {
    for (const { matrix } of SAMPLE_MATRICES) {
      const { Q, R } = qrDecompose(matrix)
      expect(matClose(multiply(Q, R), matrix)).toBe(true)
    }
  })

  it('Q 的列正交单位化，Q^T Q = I', () => {
    for (const { matrix } of SAMPLE_MATRICES) {
      const { Q } = qrDecompose(matrix)
      expect(isOrthonormal(Q)).toBe(true)
    }
  })

  it('R 是上三角矩阵（下三角元素为 0）', () => {
    const { R } = qrDecompose([[2, -1, 0], [1, 2, 1], [0, 1, 2]])
    for (let i = 0; i < R.length; i++)
      for (let j = 0; j < i; j++) expect(Math.abs(R[i][j])).toBeLessThan(1e-12)
  })

  it('单位矩阵分解出 Q=I 且 R=I', () => {
    const I = [[1, 0], [0, 1]]
    const { Q, R } = qrDecompose(I)
    expect(matClose(Q, I)).toBe(true)
    expect(matClose(R, I)).toBe(true)
  })

  it('R 对角线非负（列长度）', () => {
    for (const { matrix } of SAMPLE_MATRICES) {
      const { R } = qrDecompose(matrix)
      for (let i = 0; i < R.length; i++) expect(R[i][i]).toBeGreaterThanOrEqual(0)
    }
  })

  it('dot 与 norm 计算正确', () => {
    expect(dot([1, 2, 2], [1, 0, 0])).toBe(1)
    expect(norm([3, 4])).toBe(5)
  })

  it('transpose 正确', () => {
    expect(transpose([[1, 2, 3], [4, 5, 6]])).toEqual([[1, 4], [2, 5], [3, 6]])
  })
})
