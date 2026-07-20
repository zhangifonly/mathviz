import { describe, it, expect } from 'vitest'
import {
  integrate,
  improperIntegral,
  makeUpperLimits,
  isConverging,
  FUNCTIONS,
  START_A,
} from './improperIntegral'

describe('反常积分', () => {
  it('integrate: ∫ 从 0 到 1 的 x² = 1/3', () => {
    const v = integrate((x) => x * x, 0, 1)
    expect(v).toBeCloseTo(1 / 3, 4)
  })

  it('integrate: 上限不大于下限返回 0', () => {
    expect(integrate((x) => x, 2, 2)).toBe(0)
    expect(integrate((x) => x, 3, 1)).toBe(0)
  })

  it('improperIntegral(1/x²): 上限越大越趋近 1', () => {
    const fn = (x: number) => 1 / (x * x)
    const vals = improperIntegral(fn, 1, [10, 100, 1000])
    expect(vals[0]).toBeLessThan(vals[1])
    // 真值 1-1/T→1；数值积分在大区间上有微小误差，用近似判定
    expect(vals[2]).toBeCloseTo(1, 1)
  })

  it('improperIntegral(1/x): 发散，随上限单调增大不封顶', () => {
    const fn = (x: number) => 1 / x
    const vals = improperIntegral(fn, 1, [10, 100, 1000])
    // ln(1000) ≈ 6.9，明显大于收敛示例
    expect(vals[2]).toBeGreaterThan(6)
    expect(vals[2]).toBeGreaterThan(vals[1])
  })

  it('makeUpperLimits: 递增且末项等于 maxT', () => {
    const lims = makeUpperLimits(1, 40, 8)
    expect(lims.length).toBe(8)
    expect(lims[7]).toBeCloseTo(40, 6)
    for (let i = 1; i < lims.length; i++) {
      expect(lims[i]).toBeGreaterThan(lims[i - 1])
    }
  })

  it('isConverging: 收敛序列判 true，发散判 false', () => {
    expect(isConverging([0.9, 0.99, 0.999, 0.9999])).toBe(true)
    expect(isConverging([1, 2, 4, 8])).toBe(false)
    expect(isConverging([1])).toBe(false)
  })

  it('FUNCTIONS: 收敛项数值序列贴近其理论值', () => {
    for (const f of FUNCTIONS) {
      const vals = improperIntegral(f.fn, START_A, makeUpperLimits(START_A, 60, 20))
      if (f.converges && f.value != null) {
        expect(vals[vals.length - 1]).toBeCloseTo(f.value, 1)
      } else {
        expect(vals[vals.length - 1]).toBeGreaterThan(3)
      }
    }
  })
})
