import { describe, it, expect } from 'vitest'
import {
  secantSlope,
  numericalDeriv,
  findMeanValuePoints,
  isRolleCase,
  FUNCTIONS,
  INTERVALS,
} from './meanValueTheorem'

describe('中值定理', () => {
  it('secantSlope 计算平均变化率正确', () => {
    const f = (x: number) => x * x
    // (f(2)-f(0))/(2-0) = 4/2 = 2
    expect(secantSlope(f, 0, 2)).toBeCloseTo(2, 10)
  })

  it('numericalDeriv 逼近解析导数', () => {
    const f = (x: number) => x * x * x
    // f'(x)=3x^2, 在 x=2 应为 12
    expect(numericalDeriv(f, 2)).toBeCloseTo(12, 4)
    // sin' = cos, 在 0 应为 1
    expect(numericalDeriv(Math.sin, 0)).toBeCloseTo(1, 6)
  })

  it('抛物线 x²在[0,2]: 中值点应为中点 c=1', () => {
    const f = (x: number) => x * x
    const cs = findMeanValuePoints(f, 0, 2)
    expect(cs.length).toBe(1)
    expect(cs[0]).toBeCloseTo(1, 4)
  })

  it('罗尔情形 x²在[-1,1]: 割线水平, c=0', () => {
    const f = (x: number) => x * x
    expect(isRolleCase(f, -1, 1)).toBe(true)
    const cs = findMeanValuePoints(f, -1, 1)
    expect(cs.length).toBe(1)
    expect(cs[0]).toBeCloseTo(0, 4)
  })

  it('中值点处导数确实等于割线斜率', () => {
    const f = (x: number) => x * x * x - 3 * x
    const a = -2
    const b = 2
    const slope = secantSlope(f, a, b)
    const cs = findMeanValuePoints(f, a, b)
    expect(cs.length).toBeGreaterThan(0)
    for (const c of cs) {
      expect(c).toBeGreaterThan(a)
      expect(c).toBeLessThan(b)
      expect(numericalDeriv(f, c)).toBeCloseTo(slope, 3)
    }
  })

  it('sin 非罗尔情形判定', () => {
    expect(isRolleCase(Math.sin, 0, 3)).toBe(false)
  })

  it('内置 FUNCTIONS 与 INTERVALS 都能找到至少一个中值点', () => {
    for (const fn of FUNCTIONS) {
      for (const iv of INTERVALS) {
        const cs = findMeanValuePoints(fn.f, iv.a, iv.b)
        expect(cs.length).toBeGreaterThan(0)
      }
    }
  })
})
