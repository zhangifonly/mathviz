import { describe, it, expect } from 'vitest'
import {
  evalPoly,
  degree,
  evalRational,
  polyDivide,
  verticalAsymptotes,
  horizontalOrOblique,
  RATIONAL_EXAMPLES,
} from './rationalAsymptotes'

describe('有理函数与渐近线', () => {
  it('evalPoly 与 degree 正确', () => {
    // 1 + 2x + 3x^2 在 x=2 处 = 1 + 4 + 12 = 17
    expect(evalPoly([1, 2, 3], 2)).toBe(17)
    expect(degree([1, 2, 3])).toBe(2)
    expect(degree([5, 0, 0])).toBe(0)
    expect(degree([0, 0, 0])).toBe(-1)
  })

  it('evalRational 求值正确', () => {
    // 1/(x-1) 在 x=3 处 = 1/2
    expect(evalRational([1], [-1, 1], 3)).toBeCloseTo(0.5)
  })

  it('polyDivide: (x^2+1)/(x-1) = x+1 余 2', () => {
    const { quotient, remainder } = polyDivide([1, 0, 1], [-1, 1])
    expect(quotient[1]).toBeCloseTo(1)
    expect(quotient[0]).toBeCloseTo(1)
    expect(remainder[0]).toBeCloseTo(2)
  })

  it('verticalAsymptotes: 分母根即竖直渐近线', () => {
    expect(verticalAsymptotes([-1, 1])).toEqual([1])
    expect(verticalAsymptotes([-4, 0, 1])).toEqual([-2, 2])
    // 无实根
    expect(verticalAsymptotes([1, 0, 1])).toEqual([])
  })

  it('horizontalOrOblique: 次数比较三种情形', () => {
    // deg P < deg Q -> y = 0
    const a = horizontalOrOblique([1], [-1, 1])
    expect(a.kind).toBe('horizontal')
    expect(a.intercept).toBe(0)
    // deg P = deg Q -> 系数比 2/1 = 2
    const b = horizontalOrOblique([1, 0, 2], [-4, 0, 1])
    expect(b.kind).toBe('horizontal')
    expect(b.intercept).toBeCloseTo(2)
    // deg P = deg Q + 1 -> 斜渐近线 y = x + 1
    const c = horizontalOrOblique([1, 0, 1], [-1, 1])
    expect(c.kind).toBe('oblique')
    expect(c.slope).toBeCloseTo(1)
    expect(c.intercept).toBeCloseTo(1)
  })

  it('斜渐近线在远处逼近函数值', () => {
    const { num, den } = RATIONAL_EXAMPLES[2]
    const asy = horizontalOrOblique(num, den)
    const x = 1000
    const fx = evalRational(num, den, x)
    const line = asy.slope * x + asy.intercept
    expect(Math.abs(fx - line)).toBeLessThan(0.01)
  })

  it('RATIONAL_EXAMPLES 均可求值且分母非退化', () => {
    for (const ex of RATIONAL_EXAMPLES) {
      expect(degree(ex.den)).toBeGreaterThan(0)
      expect(Number.isFinite(evalRational(ex.num, ex.den, 5))).toBe(true)
    }
  })
})
