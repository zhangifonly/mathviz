import { describe, it, expect } from 'vitest'
import {
  boxMuller,
  sampleNormal,
  sampleMean,
  standardError,
  buildInterval,
  manyIntervals,
  zForLevel,
  CONF_LEVELS,
} from './confidenceInterval'

describe('置信区间', () => {
  it('CONF_LEVELS 与 z 临界值对应正确', () => {
    expect(CONF_LEVELS).toEqual([0.90, 0.95, 0.99])
    expect(zForLevel(0.95)).toBeCloseTo(1.96, 3)
    expect(zForLevel(0.90)).toBeCloseTo(1.645, 3)
    expect(zForLevel(0.99)).toBeCloseTo(2.576, 3)
  })

  it('sampleNormal 同种子可复现，数量正确', () => {
    const a = sampleNormal(10, 2, 50, 42)
    const b = sampleNormal(10, 2, 50, 42)
    const c = sampleNormal(10, 2, 50, 99)
    expect(a.length).toBe(50)
    expect(a).toEqual(b)
    expect(a).not.toEqual(c)
  })

  it('sampleMean 大样本接近真值，标准误随 n 增大而减小', () => {
    const data = sampleNormal(5, 3, 4000, 7)
    expect(sampleMean(data)).toBeGreaterThan(4.7)
    expect(sampleMean(data)).toBeLessThan(5.3)
    expect(standardError(3, 100)).toBeGreaterThan(standardError(3, 400))
  })

  it('buildInterval 均值即真值时必然覆盖，且区间对称', () => {
    const iv = buildInterval(10, 2, 100, 0.95, 10)
    expect(iv.covers).toBe(true)
    expect(iv.mean - iv.lower).toBeCloseTo(iv.upper - iv.mean, 6)
    const far = buildInterval(100, 2, 100, 0.95, 10)
    expect(far.covers).toBe(false)
  })

  it('boxMuller 在确定输入下产出确定值', () => {
    expect(boxMuller(0.5, 0)).toBeCloseTo(Math.sqrt(-2 * Math.log(0.5)), 6)
    expect(Number.isFinite(boxMuller(0, 0))).toBe(true)
  })

  it('manyIntervals 95% 覆盖率接近 0.95', () => {
    const { intervals, coverage } = manyIntervals(10, 4, 30, 500, 0.95, 1)
    expect(intervals.length).toBe(500)
    expect(coverage).toBeGreaterThan(0.90)
    expect(coverage).toBeLessThan(0.99)
  })

  it('置信水平越高覆盖率越高', () => {
    const c90 = manyIntervals(0, 5, 25, 400, 0.90, 3).coverage
    const c99 = manyIntervals(0, 5, 25, 400, 0.99, 3).coverage
    expect(c99).toBeGreaterThanOrEqual(c90)
  })
})
