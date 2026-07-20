import { describe, it, expect } from 'vitest'
import {
  logisticStep,
  iterateSteady,
  bifurcationData,
  detectPeriod,
  R_RANGE,
  R_WINDOWS,
} from './logisticBifurcation'

describe('Logistic 分岔图', () => {
  it('logisticStep 计算正确', () => {
    expect(logisticStep(4, 0.5)).toBeCloseTo(1, 10)
    expect(logisticStep(2, 0.5)).toBeCloseTo(0.5, 10)
    expect(logisticStep(3.2, 0)).toBe(0)
  })

  it('iterateSteady 值都落在 [0,1]，长度为采样数', () => {
    const vals = iterateSteady(3.7, 0.5, 100, 50)
    expect(vals.length).toBe(50)
    for (const v of vals) {
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThanOrEqual(1)
    }
  })

  it('r<3 收敛到单一不动点 1-1/r', () => {
    const r = 2.5
    const vals = iterateSteady(r, 0.5, 500, 20)
    const fixed = 1 - 1 / r
    for (const v of vals) expect(v).toBeCloseTo(fixed, 4)
    expect(detectPeriod(r)).toBe(1)
  })

  it('detectPeriod 识别倍周期：r=3.2 为周期2', () => {
    expect(detectPeriod(3.2)).toBe(2)
    expect(detectPeriod(3.5)).toBe(4)
    expect(detectPeriod(3.9)).toBe(0) // 混沌
  })

  it('bifurcationData 生成指定列数，r 单调递增覆盖端点', () => {
    const cols = bifurcationData(3, 4, 10, 50, 20)
    expect(cols.length).toBe(10)
    expect(cols[0].r).toBeCloseTo(3, 10)
    expect(cols[9].r).toBeCloseTo(4, 10)
    for (let i = 1; i < cols.length; i++) {
      expect(cols[i].r).toBeGreaterThan(cols[i - 1].r)
    }
  })

  it('导出常量结构正确', () => {
    expect(R_RANGE).toEqual([3, 4])
    expect(R_WINDOWS.length).toBeGreaterThanOrEqual(3)
    for (const [a, b] of R_WINDOWS) expect(b).toBeGreaterThan(a)
  })
})
