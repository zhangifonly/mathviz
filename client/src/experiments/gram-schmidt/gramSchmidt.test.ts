import { describe, it, expect } from 'vitest'
import {
  dot,
  norm,
  projection,
  gramSchmidt,
  isOrthogonal,
  EXAMPLE_OPTIONS,
} from './gramSchmidt'

describe('施密特正交化', () => {
  it('dot 与 norm 基础运算正确', () => {
    expect(dot([1, 2, 3], [4, 5, 6])).toBe(32)
    expect(norm([3, 4])).toBe(5)
  })

  it('projection 投影公式正确', () => {
    // v=[2,2] 在 u=[1,0] 上的投影 = [2,0]
    expect(projection([2, 2], [1, 0])).toEqual([2, 0])
    // 零向量作为 u 时返回零向量
    expect(projection([1, 1], [0, 0])).toEqual([0, 0])
  })

  it('正交化结果两两正交', () => {
    const { orthogonal } = gramSchmidt([
      [3, 1],
      [2, 2],
    ])
    expect(isOrthogonal(orthogonal[0], orthogonal[1])).toBe(true)
  })

  it('第一个向量方向保持不变（仅原样保留）', () => {
    const v0 = [3, 1]
    const { orthogonal } = gramSchmidt([v0, [2, 2]])
    expect(orthogonal[0]).toEqual(v0)
  })

  it('标准正交基单位化：每个向量模长为 1', () => {
    const { orthonormal } = gramSchmidt([
      [1, 0, 0],
      [1, 1, 0],
      [1, 1, 1],
    ])
    for (const e of orthonormal) expect(norm(e)).toBeCloseTo(1, 9)
  })

  it('标准正交基两两正交（三维）', () => {
    const { orthonormal } = gramSchmidt([
      [1, 0, 0],
      [1, 1, 0],
      [1, 1, 1],
    ])
    for (let i = 0; i < orthonormal.length; i++)
      for (let j = i + 1; j < orthonormal.length; j++)
        expect(dot(orthonormal[i], orthonormal[j])).toBeCloseTo(0, 9)
  })

  it('已正交的输入保持不变', () => {
    const { orthonormal } = gramSchmidt([
      [2, 0],
      [0, 3],
    ])
    expect(orthonormal[0]).toEqual([1, 0])
    expect(orthonormal[1]).toEqual([0, 1])
  })

  it('steps 记录了投影分量数量正确', () => {
    const { steps } = gramSchmidt([
      [1, 0],
      [1, 1],
    ])
    // 第一步无投影，第二步有 1 个投影
    expect(steps[0].projections.length).toBe(0)
    expect(steps[1].projections.length).toBe(1)
  })

  it('EXAMPLE_OPTIONS 每组都能正交化且两两正交', () => {
    for (const opt of EXAMPLE_OPTIONS) {
      const { orthogonal } = gramSchmidt(opt.vectors)
      expect(orthogonal.length).toBe(opt.vectors.length)
      expect(isOrthogonal(orthogonal[0], orthogonal[1])).toBe(true)
    }
  })
})
