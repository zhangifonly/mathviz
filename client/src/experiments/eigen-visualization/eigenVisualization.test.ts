import { describe, it, expect } from 'vitest'
import {
  applyMatrix,
  trace,
  determinant,
  normalize,
  eigen2x2,
  MATRIX_OPTIONS,
  type Matrix2,
} from './eigenVisualization'

describe('特征值与特征向量内核', () => {
  it('applyMatrix 正确计算 A·v', () => {
    const m: Matrix2 = [[2, 0], [0, 3]]
    expect(applyMatrix(m, [1, 1])).toEqual([2, 3])
  })

  it('trace 与 determinant 正确', () => {
    const m: Matrix2 = [[2, 1], [1, 2]]
    expect(trace(m)).toBe(4)
    expect(determinant(m)).toBe(3)
  })

  it('normalize 得到单位向量, 零向量返回零', () => {
    const [x, y] = normalize([3, 4])
    expect(Math.hypot(x, y)).toBeCloseTo(1)
    expect(normalize([0, 0])).toEqual([0, 0])
  })

  it('对角矩阵的特征值即对角元, 特征向量沿坐标轴', () => {
    const r = eigen2x2([[2, 0], [0, 1]])
    expect(r.real).toBe(true)
    const values = r.pairs.map((p) => p.value).sort((a, b) => a - b)
    expect(values).toEqual([1, 2])
  })

  it('对称矩阵特征向量相互垂直', () => {
    const r = eigen2x2([[2, 1], [1, 2]])
    expect(r.pairs).toHaveLength(2)
    const [v1, v2] = r.pairs.map((p) => p.vector)
    const dot = v1[0] * v2[0] + v1[1] * v2[1]
    expect(dot).toBeCloseTo(0)
    expect(r.pairs.map((p) => p.value).sort((a, b) => a - b)).toEqual([1, 3])
  })

  it('特征向量满足 A·v = λ·v', () => {
    const m: Matrix2 = [[2, 1], [1, 2]]
    const r = eigen2x2(m)
    for (const { value, vector } of r.pairs) {
      const av = applyMatrix(m, vector)
      expect(av[0]).toBeCloseTo(value * vector[0])
      expect(av[1]).toBeCloseTo(value * vector[1])
    }
  })

  it('剪切矩阵为重根, 判别式为零', () => {
    const r = eigen2x2([[1, 1], [0, 1]])
    expect(r.discriminant).toBe(0)
    expect(r.pairs).toHaveLength(1)
    expect(r.pairs[0].value).toBeCloseTo(1)
  })

  it('旋转矩阵判别式为负, 无实特征值', () => {
    const r = eigen2x2([[0, -1], [1, 0]])
    expect(r.real).toBe(false)
    expect(r.discriminant).toBeLessThan(0)
    expect(r.pairs).toHaveLength(0)
  })

  it('MATRIX_OPTIONS 都可解析且 id 唯一', () => {
    const ids = new Set<string>()
    for (const opt of MATRIX_OPTIONS) {
      expect(opt.matrix.length).toBe(2)
      ids.add(opt.id)
      expect(() => eigen2x2(opt.matrix)).not.toThrow()
    }
    expect(ids.size).toBe(MATRIX_OPTIONS.length)
  })
})
