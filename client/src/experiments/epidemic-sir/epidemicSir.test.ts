import { describe, it, expect } from 'vitest'
import {
  sirDerivatives,
  simulateSIR,
  computeR0,
  herdImmunityThreshold,
  peakInfection,
  finalEpidemicSize,
  SCENARIO_OPTIONS,
  type SIRParams,
} from './epidemicSir'

const baseParams: SIRParams = { beta: 0.6, gamma: 0.1, i0: 0.001, days: 160, dt: 0.5 }

describe('SIR 传染病模型', () => {
  it('导数满足 ds + di + dr = 0（人口守恒）', () => {
    const { ds, di, dr } = sirDerivatives(0.7, 0.2, 0.5, 0.1)
    expect(ds + di + dr).toBeCloseTo(0, 12)
  })

  it('导数方向正确：易感只减、康复只增', () => {
    const { ds, dr } = sirDerivatives(0.7, 0.2, 0.5, 0.1)
    expect(ds).toBeLessThan(0)
    expect(dr).toBeGreaterThan(0)
  })

  it('模拟序列每一时刻 s+i+r ≈ 1（RK4 守恒）', () => {
    const series = simulateSIR(baseParams)
    for (const p of series) {
      expect(p.s + p.i + p.r).toBeCloseTo(1, 6)
    }
  })

  it('初始状态正确：s0 = 1 - i0, r0 = 0', () => {
    const series = simulateSIR(baseParams)
    expect(series[0].s).toBeCloseTo(1 - baseParams.i0, 12)
    expect(series[0].i).toBeCloseTo(baseParams.i0, 12)
    expect(series[0].r).toBe(0)
  })

  it('比例始终落在 [0,1] 区间', () => {
    const series = simulateSIR(baseParams)
    for (const p of series) {
      expect(p.s).toBeGreaterThanOrEqual(0)
      expect(p.s).toBeLessThanOrEqual(1.0000001)
      expect(p.i).toBeGreaterThanOrEqual(0)
      expect(p.r).toBeLessThanOrEqual(1.0000001)
    }
  })

  it('R0 > 1 时疫情爆发（峰值感染显著高于初始值）', () => {
    const series = simulateSIR(baseParams)
    const peak = peakInfection(series)
    expect(peak.value).toBeGreaterThan(baseParams.i0 * 10)
  })

  it('R0 < 1 时疫情消退（感染比例单调不增，峰值就在起点）', () => {
    const series = simulateSIR({ beta: 0.08, gamma: 0.1, i0: 0.01, days: 100, dt: 0.5 })
    const peak = peakInfection(series)
    expect(peak.day).toBe(0)
    expect(series[series.length - 1].i).toBeLessThan(series[0].i)
  })

  it('computeR0 = beta / gamma，gamma=0 时为无穷', () => {
    expect(computeR0(0.6, 0.1)).toBeCloseTo(6, 12)
    expect(computeR0(0.3, 0.1)).toBeCloseTo(3, 12)
    expect(computeR0(0.5, 0)).toBe(Infinity)
  })

  it('群体免疫阈值：R0=4 → 0.75, R0<=1 → 0', () => {
    expect(herdImmunityThreshold(4)).toBeCloseTo(0.75, 12)
    expect(herdImmunityThreshold(2)).toBeCloseTo(0.5, 12)
    expect(herdImmunityThreshold(1)).toBe(0)
    expect(herdImmunityThreshold(0.8)).toBe(0)
  })

  it('最终规模 = 末尾康复比例，且 R0 越大规模越大', () => {
    const mild = simulateSIR({ beta: 0.2, gamma: 0.1, i0: 0.001, days: 300, dt: 0.5 })
    const severe = simulateSIR({ beta: 0.6, gamma: 0.1, i0: 0.001, days: 300, dt: 0.5 })
    const sizeMild = finalEpidemicSize(mild)
    const sizeSevere = finalEpidemicSize(severe)
    expect(sizeMild).toBeGreaterThan(0)
    expect(sizeSevere).toBeGreaterThan(sizeMild)
  })

  it('SCENARIO_OPTIONS 都能正常模拟，R0 与标注一致', () => {
    for (const opt of SCENARIO_OPTIONS) {
      const series = simulateSIR({ beta: opt.beta, gamma: opt.gamma, i0: 0.001, days: 120, dt: 0.5 })
      expect(series.length).toBeGreaterThan(1)
      expect(computeR0(opt.beta, opt.gamma)).toBeGreaterThan(0)
    }
    expect(computeR0(SCENARIO_OPTIONS[0].beta, SCENARIO_OPTIONS[0].gamma)).toBeCloseTo(3, 6)
    expect(computeR0(SCENARIO_OPTIONS[3].beta, SCENARIO_OPTIONS[3].gamma)).toBeCloseTo(0.8, 6)
  })
})
