import { describe, it, expect } from 'vitest'
import {
  continuedFractionCoeffs,
  convergents,
  evaluateContinuedFraction,
  gcd,
  rationalCoeffs,
  NUMBER_OPTIONS,
} from './continuedFraction'

describe('连分数', () => {
  it('有理数 45/16 精确展开为有限连分数', () => {
    // 45/16 = 2 + 13/16 = [2; 1, 4, 3]
    const coeffs = rationalCoeffs(45, 16)
    expect(coeffs).toEqual([2, 1, 4, 3])
  })

  it('rationalCoeffs 还原后等于原有理数', () => {
    const coeffs = rationalCoeffs(45, 16)
    expect(evaluateContinuedFraction(coeffs)).toBeCloseTo(45 / 16, 12)
  })

  it('黄金比例的连分数系数全是 1', () => {
    const phi = (1 + Math.sqrt(5)) / 2
    const coeffs = continuedFractionCoeffs(phi, 10)
    for (const a of coeffs) expect(a).toBe(1)
  })

  it('π 的渐近分数包含著名的 22/7 与 355/113', () => {
    const coeffs = continuedFractionCoeffs(Math.PI, 12)
    const cs = convergents(coeffs)
    const fractions = cs.map((c) => `${c.p}/${c.q}`)
    expect(fractions).toContain('22/7')
    expect(fractions).toContain('355/113')
  })

  it('渐近分数递推：首项即整数部分', () => {
    const cs = convergents([3, 7, 15, 1])
    expect(cs[0]).toEqual({ a: 3, p: 3, q: 1 })
    // 第二项 3 + 1/7 = 22/7
    expect(cs[1].p).toBe(22)
    expect(cs[1].q).toBe(7)
  })

  it('渐近分数逐步逼近原数（误差递减）', () => {
    const coeffs = continuedFractionCoeffs(Math.PI, 8)
    const cs = convergents(coeffs)
    let prevErr = Infinity
    for (const c of cs) {
      const err = Math.abs(c.p / c.q - Math.PI)
      expect(err).toBeLessThanOrEqual(prevErr)
      prevErr = err
    }
    expect(prevErr).toBeLessThan(1e-6)
  })

  it('evaluateContinuedFraction 能还原根号 2', () => {
    const coeffs = continuedFractionCoeffs(Math.SQRT2, 20)
    expect(evaluateContinuedFraction(coeffs)).toBeCloseTo(Math.SQRT2, 8)
  })

  it('gcd 计算正确', () => {
    expect(gcd(45, 16)).toBe(1)
    expect(gcd(12, 18)).toBe(6)
    expect(gcd(0, 5)).toBe(5)
  })

  it('边界：整数的连分数只有一项', () => {
    expect(continuedFractionCoeffs(7, 10)).toEqual([7])
  })

  it('边界：空系数序列的还原值为 0', () => {
    expect(evaluateContinuedFraction([])).toBe(0)
  })

  it('NUMBER_OPTIONS 每个都能正常展开且渐近分数逼近原值', () => {
    for (const opt of NUMBER_OPTIONS) {
      const coeffs = continuedFractionCoeffs(opt.value, 12)
      expect(coeffs.length).toBeGreaterThan(0)
      const cs = convergents(coeffs)
      const last = cs[cs.length - 1]
      expect(Math.abs(last.p / last.q - opt.value)).toBeLessThan(1e-4)
    }
  })
})
