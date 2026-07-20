import { describe, it, expect } from 'vitest'
import {
  matVec, norm, normalize, rayleigh, powerIteration, SAMPLE_MATRICES,
  type Matrix2,
} from './powerIteration'

describe('幂迭代', () => {
  it('matVec 计算矩阵乘向量正确', () => {
    const m: Matrix2 = [2, 0, 0, 3]
    expect(matVec(m, [1, 1])).toEqual([2, 3])
    expect(matVec([1, 2, 3, 4], [1, 0])).toEqual([1, 3])
  })

  it('normalize 得到单位向量', () => {
    const v = normalize([3, 4])
    expect(norm(v)).toBeCloseTo(1, 10)
    expect(v[0]).toBeCloseTo(0.6, 10)
    expect(normalize([0, 0])).toEqual([0, 0])
  })

  it('rayleigh 对特征向量返回特征值', () => {
    // 对角阵 [4,0;0,1]，e1 是特征向量，特征值 4
    const m: Matrix2 = [4, 0, 0, 1]
    expect(rayleigh(m, [1, 0])).toBeCloseTo(4, 10)
    expect(rayleigh(m, [0, 1])).toBeCloseTo(1, 10)
  })

  it('powerIteration 步数正确且始终归一化', () => {
    const steps = powerIteration([2, 1, 1, 2], [1, 0], 10)
    expect(steps.length).toBe(11)
    for (const s of steps) {
      expect(norm(s.vector)).toBeCloseTo(1, 8)
    }
  })

  it('收敛到主特征向量：对称阵 [2,1;1,2] 主向量沿 (1,1)', () => {
    // 特征值 3 (向量 (1,1)) 与 1 (向量 (1,-1))，主向量为 (1,1)/√2
    const steps = powerIteration([2, 1, 1, 2], [1, 0], 40)
    const last = steps[steps.length - 1]
    expect(Math.abs(last.vector[0])).toBeCloseTo(Math.SQRT1_2, 4)
    expect(Math.abs(last.vector[1])).toBeCloseTo(Math.SQRT1_2, 4)
    expect(last.eigenvalue).toBeCloseTo(3, 4)
  })

  it('主特征值估计随迭代单调逼近', () => {
    // 对角阵主特征值 4，瑞利商应逐步升向 4
    const steps = powerIteration([4, 0, 0, 1], [1, 1], 20)
    const first = steps[0].eigenvalue
    const last = steps[steps.length - 1].eigenvalue
    expect(last).toBeGreaterThan(first)
    expect(last).toBeCloseTo(4, 4)
  })

  it('SAMPLE_MATRICES 每个都能跑出有限收敛结果', () => {
    for (const { matrix } of SAMPLE_MATRICES) {
      const steps = powerIteration(matrix, [0.3, 0.9], 30)
      const last = steps[steps.length - 1]
      expect(Number.isFinite(last.eigenvalue)).toBe(true)
      expect(norm(last.vector)).toBeCloseTo(1, 6)
    }
  })
})
