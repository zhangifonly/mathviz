import { describe, it, expect } from 'vitest'
import {
  eigenSym2x2,
  reconstruct,
  applyMatrix,
  dot2,
  normalize,
  SAMPLE_MATRICES,
  type SymMatrix2,
} from './spectralTheorem'

describe('谱分解', () => {
  it('对角矩阵特征值就是对角元，降序排列', () => {
    const e = eigenSym2x2({ a: 3, b: 0, c: 1 })
    expect(e.values[0]).toBeCloseTo(3, 10)
    expect(e.values[1]).toBeCloseTo(1, 10)
    expect(e.values[0]).toBeGreaterThanOrEqual(e.values[1])
  })

  it('特征向量是单位向量且互相正交', () => {
    for (const { matrix } of SAMPLE_MATRICES) {
      const e = eigenSym2x2(matrix)
      const [v1, v2] = e.vectors
      expect(Math.hypot(v1[0], v1[1])).toBeCloseTo(1, 10)
      expect(Math.hypot(v2[0], v2[1])).toBeCloseTo(1, 10)
      expect(dot2(v1, v2)).toBeCloseTo(0, 10)
    }
  })

  it('满足特征方程 M v = λ v', () => {
    const m: SymMatrix2 = { a: 2, b: 1, c: 2 }
    const e = eigenSym2x2(m)
    for (let i = 0; i < 2; i++) {
      const v = e.vectors[i]
      const lv = e.values[i]
      const mv = applyMatrix(m, v)
      expect(mv[0]).toBeCloseTo(lv * v[0], 8)
      expect(mv[1]).toBeCloseTo(lv * v[1], 8)
    }
  })

  it('谱分解重构还原原矩阵 M = Σ λ v vᵀ', () => {
    for (const { matrix } of SAMPLE_MATRICES) {
      const e = eigenSym2x2(matrix)
      const r = reconstruct(e)
      expect(r.a).toBeCloseTo(matrix.a, 8)
      expect(r.b).toBeCloseTo(matrix.b, 8)
      expect(r.c).toBeCloseTo(matrix.c, 8)
    }
  })

  it('特征值之和等于迹，之积等于行列式', () => {
    const m: SymMatrix2 = { a: 4, b: 2, c: 1 }
    const e = eigenSym2x2(m)
    const sum = e.values[0] + e.values[1]
    const prod = e.values[0] * e.values[1]
    expect(sum).toBeCloseTo(m.a + m.c, 10)
    expect(prod).toBeCloseTo(m.a * m.c - m.b * m.b, 8)
  })

  it('normalize 零向量安全回退，非零向量长度为1', () => {
    expect(normalize(0, 0)).toEqual([1, 0])
    const [x, y] = normalize(3, 4)
    expect(Math.hypot(x, y)).toBeCloseTo(1, 12)
  })
})
