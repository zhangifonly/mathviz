import { describe, it, expect } from 'vitest'
import {
  cholesky,
  choleskySteps,
  reconstruct,
  transpose,
  isPositiveDefinite,
  SAMPLE_MATRICES,
} from './cholesky'

describe('Cholesky 分解', () => {
  it('经典例子分解出正确的 L', () => {
    const L = cholesky(SAMPLE_MATRICES[0])
    expect(L).not.toBeNull()
    // 已知答案：[[2,0,0],[6,1,0],[-8,5,3]]
    expect(L![0]).toEqual([2, 0, 0])
    expect(L![1]).toEqual([6, 1, 0])
    expect(L![2]).toEqual([-8, 5, 3])
  })

  it('L 是下三角（上三角元素为 0）', () => {
    for (const A of SAMPLE_MATRICES) {
      const L = cholesky(A)!
      for (let i = 0; i < L.length; i++)
        for (let j = i + 1; j < L.length; j++) expect(L[i][j]).toBe(0)
    }
  })

  it('L L^T 能重构原矩阵', () => {
    for (const A of SAMPLE_MATRICES) {
      const L = cholesky(A)!
      const R = reconstruct(L)
      for (let i = 0; i < A.length; i++)
        for (let j = 0; j < A.length; j++)
          expect(R[i][j]).toBeCloseTo(A[i][j], 8)
    }
  })

  it('非正定矩阵返回 null', () => {
    // 对角为负，显然非正定
    expect(cholesky([[-1, 0], [0, 1]])).toBeNull()
    // 行列式为 0 的半正定也判非正定
    expect(cholesky([[1, 1], [1, 1]])).toBeNull()
    expect(isPositiveDefinite([[1, 2], [2, 1]])).toBe(false)
  })

  it('对角元均为正', () => {
    for (const A of SAMPLE_MATRICES) {
      const L = cholesky(A)!
      for (let i = 0; i < L.length; i++) expect(L[i][i]).toBeGreaterThan(0)
    }
  })

  it('transpose 正确，且 SAMPLE 都正定', () => {
    expect(transpose([[1, 2], [3, 4]])).toEqual([[1, 3], [2, 4]])
    for (const A of SAMPLE_MATRICES) expect(isPositiveDefinite(A)).toBe(true)
  })

  it('choleskySteps 数量为 n(n+1)/2，含全部对角', () => {
    const steps = choleskySteps(SAMPLE_MATRICES[1])
    expect(steps.length).toBe(6)
    expect(steps.filter((s) => s.diagonal).length).toBe(3)
  })
})
