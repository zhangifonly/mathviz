import { describe, it, expect } from 'vitest'
import { makeSignal, autocorr, detectPeriod, SIGNAL_PRESETS } from './autocorrelation'

describe('自相关', () => {
  it('makeSignal 生成指定长度，同种子可复现', () => {
    const a = makeSignal(128, 20, 0.3, 7)
    const b = makeSignal(128, 20, 0.3, 7)
    const c = makeSignal(128, 20, 0.3, 9)
    expect(a.length).toBe(128)
    expect(a).toEqual(b)
    expect(a).not.toEqual(c)
  })

  it('无噪声时数值有界（正弦幅度约为1）', () => {
    const sig = makeSignal(200, 25, 0, 1)
    for (const v of sig) {
      expect(v).toBeGreaterThanOrEqual(-1.0001)
      expect(v).toBeLessThanOrEqual(1.0001)
    }
  })

  it('autocorr 在 lag=0 归一化为 1', () => {
    const sig = makeSignal(256, 20, 0.2, 3)
    const ac = autocorr(sig)
    expect(ac[0]).toBeCloseTo(1, 6)
  })

  it('自相关值域约在 [-1, 1]', () => {
    const ac = autocorr(makeSignal(256, 16, 0.3, 5))
    for (const v of ac) {
      expect(v).toBeLessThanOrEqual(1.0001)
      expect(v).toBeGreaterThanOrEqual(-1.0001)
    }
  })

  it('周期信号在周期处出现明显峰值', () => {
    const period = 20
    const ac = autocorr(makeSignal(400, period, 0, 1))
    // 周期处应显著高于半周期处（半周期为负相关谷）
    expect(ac[period]).toBeGreaterThan(ac[period / 2])
    expect(ac[period]).toBeGreaterThan(0.5)
  })

  it('detectPeriod 能恢复出接近真实的周期', () => {
    const period = 20
    const ac = autocorr(makeSignal(400, period, 0.2, 2))
    const found = detectPeriod(ac)
    expect(Math.abs(found - period)).toBeLessThanOrEqual(2)
  })

  it('SIGNAL_PRESETS 都能生成并算出自相关', () => {
    for (const p of SIGNAL_PRESETS) {
      const ac = autocorr(makeSignal(256, p.period, p.noise, 1))
      expect(ac.length).toBeGreaterThan(0)
      expect(ac[0]).toBeCloseTo(1, 6)
    }
  })
})
