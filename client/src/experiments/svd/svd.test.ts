import { describe, it, expect } from 'vitest'
import {
  svd2, reconstruct, rankOneApprox, frobeniusNorm, numericRank,
  conditionNumber, applyMat2, rotation, matMul,
  MATRIX_OPTIONS, type Mat2,
} from './svd'

/** 判断两个矩阵在容差内相等 */
function matClose(a: Mat2, b: Mat2, tol = 1e-9) {
  for (let i = 0; i < 4; i++) expect(Math.abs(a[i] - b[i])).toBeLessThan(tol)
}

describe('奇异值分解 SVD 内核', () => {
  it('对角拉伸矩阵的奇异值就是对角元（降序）', () => {
    const { S } = svd2([2, 0, 0, 1])
    expect(S[0]).toBeCloseTo(2, 9)
    expect(S[1]).toBeCloseTo(1, 9)
  })

  it('分解恒等式 A = U·Σ·Vᵀ 对多个矩阵成立', () => {
    const mats: Mat2[] = [
      [2, 0, 0, 1], [1, 0.8, 0, 1], [1.2, -0.9, 0.9, 1.2], [3, 1, 1, 3], [0, -2, 2, 0],
    ]
    for (const A of mats) {
      const res = svd2(A)
      matClose(reconstruct(res.U, res.S, res.V), A)
    }
  })

  it('奇异值非负且降序排列', () => {
    for (const opt of MATRIX_OPTIONS) {
      const { S } = svd2(opt.matrix)
      expect(S[0]).toBeGreaterThanOrEqual(S[1])
      expect(S[1]).toBeGreaterThanOrEqual(-1e-12)
    }
  })

  it('U、V 都是正交（旋转）矩阵：列向量单位且行列式为 ±1', () => {
    const { U, V } = svd2([1.2, -0.9, 0.9, 1.2])
    for (const m of [U, V]) {
      const col1Len = Math.hypot(m[0], m[2])
      const col2Len = Math.hypot(m[1], m[3])
      expect(col1Len).toBeCloseTo(1, 9)
      expect(col2Len).toBeCloseTo(1, 9)
      const det = m[0] * m[3] - m[1] * m[2]
      expect(Math.abs(det)).toBeCloseTo(1, 9)
    }
  })

  it('奇异矩阵（行成比例）第二个奇异值为零，秩为 1', () => {
    const res = svd2([2, 1, 4, 2])
    expect(res.S[1]).toBeCloseTo(0, 9)
    expect(numericRank(res.S)).toBe(1)
    expect(conditionNumber(res.S)).toBe(Infinity)
  })

  it('奇异值平方和等于 Frobenius 范数平方（能量守恒）', () => {
    const A: Mat2 = [1.2, -0.9, 0.9, 1.2]
    const { S } = svd2(A)
    const energy = S[0] * S[0] + S[1] * S[1]
    expect(energy).toBeCloseTo(frobeniusNorm(A) ** 2, 9)
  })

  it('秩一逼近误差等于第二奇异值（Eckart-Young）', () => {
    const A: Mat2 = [3, 1, 1, 3]
    const res = svd2(A)
    const a1 = rankOneApprox(res)
    const diff: Mat2 = [A[0] - a1[0], A[1] - a1[1], A[2] - a1[2], A[3] - a1[3]]
    expect(frobeniusNorm(diff)).toBeCloseTo(res.S[1], 9)
  })

  it('单位圆映射为椭圆，半轴长等于奇异值', () => {
    const A: Mat2 = [2, 0, 0, 1]
    let maxR = 0, minR = Infinity
    for (let i = 0; i < 360; i++) {
      const t = (i / 360) * 2 * Math.PI
      const p = applyMat2(A, [Math.cos(t), Math.sin(t)])
      const r = Math.hypot(p[0], p[1])
      maxR = Math.max(maxR, r)
      minR = Math.min(minR, r)
    }
    const { S } = svd2(A)
    expect(maxR).toBeCloseTo(S[0], 6)
    expect(minR).toBeCloseTo(S[1], 6)
  })

  it('rotation 与 matMul：R(a)·R(b) = R(a+b)', () => {
    const combined = matMul(rotation(0.3), rotation(0.5))
    matClose(combined, rotation(0.8), 1e-9)
  })

  it('MATRIX_OPTIONS 均可分解且 id 唯一', () => {
    const ids = new Set<string>()
    for (const opt of MATRIX_OPTIONS) {
      expect(opt.matrix.length).toBe(4)
      const res = svd2(opt.matrix)
      matClose(reconstruct(res.U, res.S, res.V), opt.matrix)
      ids.add(opt.id)
    }
    expect(ids.size).toBe(MATRIX_OPTIONS.length)
  })
})
