import { describe, it, expect } from 'vitest'
import { det2, det3, det, replaceColumn, cramerSolve, SAMPLE_SYSTEMS } from './cramersRule'

describe('克拉默法则', () => {
  it('det2 计算 2 阶行列式', () => {
    expect(det2([[1, 2], [3, 4]])).toBe(-2)
    expect(det2([[2, 0], [0, 3]])).toBe(6)
  })

  it('det3 计算 3 阶行列式', () => {
    expect(det3([[1, 0, 0], [0, 1, 0], [0, 0, 1]])).toBe(1)
    expect(det3([[2, -3, 1], [2, 0, -1], [1, 4, 5]])).toBe(49)
  })

  it('replaceColumn 只替换指定列', () => {
    const A = [[1, 2], [3, 4]]
    expect(replaceColumn(A, [9, 8], 0)).toEqual([[9, 2], [8, 4]])
    expect(replaceColumn(A, [9, 8], 1)).toEqual([[1, 9], [3, 8]])
    expect(A).toEqual([[1, 2], [3, 4]]) // 原矩阵不被改动
  })

  it('cramerSolve 解出的向量满足原方程组', () => {
    const A = [[2, 1], [1, -1]]
    const b = [5, 1]
    const x = cramerSolve(A, b)!
    expect(x).not.toBeNull()
    for (let i = 0; i < A.length; i++) {
      const lhs = A[i].reduce((acc, a, j) => acc + a * x[j], 0)
      expect(lhs).toBeCloseTo(b[i], 9)
    }
  })

  it('cramerSolve 对 3 元方程组也成立', () => {
    const A = [[1, 1, 1], [0, 2, 5], [2, 5, -1]]
    const b = [6, -4, 27]
    const x = cramerSolve(A, b)!
    expect(x[0]).toBeCloseTo(5, 6)
    expect(x[1]).toBeCloseTo(3, 6)
    expect(x[2]).toBeCloseTo(-2, 6)
  })

  it('cramerSolve 系数行列式为 0 时返回 null', () => {
    expect(cramerSolve([[1, 2], [2, 4]], [3, 6])).toBeNull()
  })

  it('SAMPLE_SYSTEMS 每组都有唯一解', () => {
    for (const s of SAMPLE_SYSTEMS) {
      expect(det(s.A)).not.toBe(0)
      expect(cramerSolve(s.A, s.b)).not.toBeNull()
    }
  })
})
