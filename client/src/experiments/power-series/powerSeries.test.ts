import { describe, it, expect } from 'vitest'
import {
  factorial,
  partialSum,
  convergesAt,
  convergenceError,
  radiusOfConvergence,
  SERIES_OPTIONS,
} from './powerSeries'

const geometric = SERIES_OPTIONS.find((o) => o.id === 'geometric')!
const exp = SERIES_OPTIONS.find((o) => o.id === 'exp')!
const arctan = SERIES_OPTIONS.find((o) => o.id === 'arctan')!

describe('幂级数收敛', () => {
  it('factorial 基本值正确', () => {
    expect(factorial(0)).toBe(1)
    expect(factorial(1)).toBe(1)
    expect(factorial(5)).toBe(120)
  })

  it('partialSum: 0 项为 0，几何级数前几项符合等比求和', () => {
    expect(partialSum(geometric, 0.5, 0)).toBe(0)
    // 1 + 0.5 + 0.25 = 1.75
    expect(partialSum(geometric, 0.5, 3)).toBeCloseTo(1.75, 10)
  })

  it('几何级数在收敛域内逼近 1/(1-x)', () => {
    const x = 0.5
    const err = convergenceError(geometric, x, 30)
    expect(err).toBeLessThan(1e-6)
    expect(partialSum(geometric, x, 40)).toBeCloseTo(1 / (1 - x), 6)
  })

  it('指数级数在 x=1 逼近 e', () => {
    expect(partialSum(exp, 1, 20)).toBeCloseTo(Math.E, 8)
  })

  it('反正切级数在 x=1 收敛到 pi/4（莱布尼茨公式，收敛慢）', () => {
    // x - x^3/3 + x^5/5 - ... = arctan(1) = pi/4
    expect(partialSum(arctan, 1, 2000)).toBeCloseTo(Math.PI / 4, 3)
  })

  it('convergesAt: 严格小于收敛半径才算收敛', () => {
    expect(convergesAt(geometric, 0.9)).toBe(true)
    expect(convergesAt(geometric, 1)).toBe(false)
    expect(convergesAt(geometric, 1.5)).toBe(false)
    // 指数级数处处收敛
    expect(convergesAt(exp, 100)).toBe(true)
  })

  it('收敛域内误差随项数增加而单调下降', () => {
    const x = 0.6
    const e5 = convergenceError(geometric, x, 5)
    const e15 = convergenceError(geometric, x, 15)
    expect(e15).toBeLessThan(e5)
  })

  it('radiusOfConvergence 返回正确半径', () => {
    expect(radiusOfConvergence('geometric')).toBe(1)
    expect(radiusOfConvergence('exp')).toBe(Infinity)
    expect(radiusOfConvergence('arctan')).toBe(1)
    expect(radiusOfConvergence('unknown')).toBeNaN()
  })

  it('SERIES_OPTIONS 都能正常求和且逼近精确值', () => {
    expect(SERIES_OPTIONS.length).toBeGreaterThanOrEqual(4)
    for (const opt of SERIES_OPTIONS) {
      expect(opt.id).toBeTruthy()
      expect(opt.label).toBeTruthy()
      // 取一个稳妥的收敛点
      const x = Number.isFinite(opt.radius) ? opt.radius * 0.5 : 0.5
      const s = partialSum(opt, x, 50)
      expect(Number.isFinite(s)).toBe(true)
      expect(Math.abs(s - opt.exact(x))).toBeLessThan(1e-3)
    }
  })
})
