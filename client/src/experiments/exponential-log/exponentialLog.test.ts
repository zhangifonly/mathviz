import { describe, it, expect } from 'vitest'
import {
  expValue,
  logValue,
  sampleExp,
  sampleLog,
  changeBase,
  inverseCheck,
  BASE_OPTIONS,
  E,
} from './exponentialLog'

describe('指数与对数内核', () => {
  it('expValue 基本取值正确', () => {
    expect(expValue(2, 0)).toBe(1)
    expect(expValue(2, 3)).toBe(8)
    expect(expValue(10, 2)).toBe(100)
    expect(expValue(0.5, 1)).toBe(0.5)
  })

  it('logValue 基本取值正确', () => {
    expect(logValue(2, 8)).toBeCloseTo(3, 10)
    expect(logValue(10, 1000)).toBeCloseTo(3, 10)
    expect(logValue(E, E)).toBeCloseTo(1, 10)
    expect(logValue(2, 1)).toBeCloseTo(0, 10)
  })

  it('logValue 定义域外返回 NaN', () => {
    expect(Number.isNaN(logValue(2, 0))).toBe(true)
    expect(Number.isNaN(logValue(2, -5))).toBe(true)
    expect(Number.isNaN(logValue(1, 10))).toBe(true)
  })

  it('指数与对数互为反函数：log_a(a^x) = x', () => {
    for (const x of [-2, -0.5, 0, 1, 2.5, 4]) {
      expect(inverseCheck(2, x)).toBeCloseTo(x, 10)
      expect(inverseCheck(10, x)).toBeCloseTo(x, 10)
      expect(inverseCheck(E, x)).toBeCloseTo(x, 10)
    }
  })

  it('换底公式：log_a(x) 与 ln 换底一致', () => {
    expect(changeBase(2, 8, E)).toBeCloseTo(3, 10)
    expect(changeBase(10, 100, 2)).toBeCloseTo(2, 10)
    expect(changeBase(2, 16, 10)).toBeCloseTo(logValue(2, 16), 10)
  })

  it('对数运算律：log(x*y) = log(x) + log(y)', () => {
    const a = 2
    expect(logValue(a, 3 * 5)).toBeCloseTo(logValue(a, 3) + logValue(a, 5), 10)
  })

  it('sampleExp 采样点数与端点正确', () => {
    const pts = sampleExp(2, -2, 4, 60)
    expect(pts.length).toBe(61)
    expect(pts[0].x).toBeCloseTo(-2, 10)
    expect(pts[pts.length - 1].x).toBeCloseTo(4, 10)
    expect(pts[pts.length - 1].y).toBeCloseTo(16, 10)
  })

  it('sampleLog 采样点均在定义域内且 x 递增', () => {
    const pts = sampleLog(E, 10, 50)
    expect(pts.length).toBe(50)
    for (const p of pts) {
      expect(p.x).toBeGreaterThan(0)
      expect(Number.isNaN(p.y)).toBe(false)
    }
    for (let i = 1; i < pts.length; i++) expect(pts[i].x).toBeGreaterThan(pts[i - 1].x)
  })

  it('BASE_OPTIONS 都能正常采样', () => {
    for (const opt of BASE_OPTIONS) {
      const pts = sampleExp(opt.base, -1, 2, 20)
      expect(pts.length).toBe(21)
      for (const p of pts) expect(Number.isFinite(p.y)).toBe(true)
    }
  })

  it('底数 0.5 时指数曲线递减', () => {
    const pts = sampleExp(0.5, 0, 4, 40)
    for (let i = 1; i < pts.length; i++) expect(pts[i].y).toBeLessThan(pts[i - 1].y)
  })
})
