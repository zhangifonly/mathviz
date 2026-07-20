import { describe, it, expect } from 'vitest'
import {
  zStatistic,
  normalCdf,
  erf,
  pValue,
  zCritical,
  runTest,
  ALPHAS,
  SCENARIOS,
} from './hypothesisTesting'

describe('假设检验', () => {
  it('zStatistic 计算正确', () => {
    // (106-100)/(15/sqrt(30)) = 6 / 2.7386 = 2.1909
    expect(zStatistic(106, 100, 15, 30)).toBeCloseTo(2.1909, 3)
    expect(zStatistic(100, 100, 15, 30)).toBe(0)
  })

  it('normalCdf 关键值近似标准正态', () => {
    expect(normalCdf(0)).toBeCloseTo(0.5, 4)
    expect(normalCdf(1.959964)).toBeCloseTo(0.975, 3)
    expect(normalCdf(-1.959964)).toBeCloseTo(0.025, 3)
    expect(erf(0)).toBeCloseTo(0, 6)
  })

  it('pValue 双侧对称且在 [0,1]', () => {
    const p = pValue(1.96)
    expect(p).toBeCloseTo(0.05, 2)
    expect(pValue(2)).toEqual(pValue(-2))
    expect(pValue(0)).toBeCloseTo(1, 4)
  })

  it('zCritical 常用水平正确', () => {
    expect(zCritical(0.05)).toBeCloseTo(1.96, 2)
    expect(zCritical(0.01)).toBeCloseTo(2.576, 2)
    expect(zCritical(0.1)).toBeCloseTo(1.645, 2)
  })

  it('runTest 在 alpha=0.05 下正确判定拒绝/不拒绝', () => {
    const r1 = runTest(106, 100, 15, 30, 0.05)
    expect(r1.reject).toBe(true) // z≈2.19 > 1.96
    const r2 = runTest(103, 100, 15, 30, 0.05)
    expect(r2.reject).toBe(false) // z≈1.10 < 1.96
  })

  it('提高 alpha 严格度更难拒绝', () => {
    const loose = runTest(106, 100, 15, 30, 0.05)
    const strict = runTest(106, 100, 15, 30, 0.01)
    expect(loose.reject).toBe(true)
    expect(strict.reject).toBe(false) // 2.19 < 2.576
  })

  it('ALPHAS 与 SCENARIOS 常量可用', () => {
    expect(ALPHAS).toEqual([0.05, 0.01])
    expect(SCENARIOS.length).toBeGreaterThanOrEqual(3)
    for (const s of SCENARIOS) {
      expect(s.sigma).toBeGreaterThan(0)
      expect(s.n).toBeGreaterThan(0)
      expect(Number.isFinite(runTest(s.mean, s.mu0, s.sigma, s.n, 0.05).p)).toBe(true)
    }
  })
})
