import { describe, it, expect } from 'vitest'
import {
  multiply,
  power,
  diceSumDistribution,
  fibonacciCoeffs,
  coeffSum,
  DIE,
  EXAMPLES,
} from './generatingFunctions'

describe('生成函数', () => {
  it('multiply 是系数卷积：(1+x)(1+x)=1+2x+x^2', () => {
    expect(multiply([1, 1], [1, 1])).toEqual([1, 2, 1])
  })

  it('multiply 空多项式返回空', () => {
    expect(multiply([], [1, 2])).toEqual([])
    expect(multiply([1, 2], [])).toEqual([])
  })

  it('power: DIE^1 等于自身，DIE^0 等于 [1]', () => {
    expect(power(DIE, 0)).toEqual([1])
    expect(power(DIE, 1)).toEqual(DIE)
  })

  it('两骰子之和分布正确：和为7的方案数是6，总方案数36', () => {
    const d = diceSumDistribution(2)
    expect(d[7]).toBe(6)
    expect(d[2]).toBe(1)
    expect(d[12]).toBe(1)
    expect(coeffSum(d)).toBe(36)
  })

  it('三骰子之和：总方案数 6^3=216，最高次为 x^18', () => {
    const d = diceSumDistribution(3)
    expect(coeffSum(d)).toBe(216)
    expect(d.length - 1).toBe(18)
    expect(d[3]).toBe(1)
    expect(d[18]).toBe(1)
  })

  it('fibonacciCoeffs 满足递推关系', () => {
    const f = fibonacciCoeffs(10)
    expect(f[0]).toBe(0)
    expect(f[1]).toBe(1)
    for (let i = 2; i < f.length; i++) {
      expect(f[i]).toBe(f[i - 1] + f[i - 2])
    }
    expect(f[10]).toBe(55)
  })

  it('EXAMPLES 均为非空系数序列且系数非负', () => {
    expect(EXAMPLES.length).toBeGreaterThanOrEqual(3)
    for (const e of EXAMPLES) {
      expect(e.coeffs.length).toBeGreaterThan(0)
      expect(e.coeffs.every((c) => c >= 0)).toBe(true)
    }
  })
})
