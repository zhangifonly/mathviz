import { describe, it, expect } from 'vitest'
import { signal, aliasFrequency, isAliased, sampleSignal, PRESETS } from './aliasing'

describe('混叠现象', () => {
  it('signal 在关键相位取值正确', () => {
    expect(signal(1, 0)).toBeCloseTo(0)
    expect(signal(1, 0.25)).toBeCloseTo(1)
    expect(signal(1, 0.5)).toBeCloseTo(0)
    expect(signal(1, 0.75)).toBeCloseTo(-1)
  })

  it('aliasFrequency: 充分采样时表观频率等于真实频率', () => {
    // fs >= 2f 时 round(f/fs)=0，表观频率 = f
    expect(aliasFrequency(9, 20)).toBeCloseTo(9)
    expect(aliasFrequency(3, 100)).toBeCloseTo(3)
  })

  it('aliasFrequency: 欠采样折叠出更低的表观频率', () => {
    expect(aliasFrequency(9, 10)).toBeCloseTo(1)
    expect(aliasFrequency(9, 8)).toBeCloseTo(1)
    // 表观频率始终不超过 fs/2
    for (let f = 1; f <= 50; f++) {
      expect(aliasFrequency(f, 8)).toBeLessThanOrEqual(4 + 1e-9)
    }
  })

  it('aliasFrequency: fs 非正数时退化为原频率', () => {
    expect(aliasFrequency(7, 0)).toBe(7)
    expect(aliasFrequency(7, -3)).toBe(7)
  })

  it('isAliased: 以奈奎斯特频率 2f 为界', () => {
    expect(isAliased(9, 20)).toBe(false)
    expect(isAliased(9, 18)).toBe(false)
    expect(isAliased(9, 10)).toBe(true)
    expect(isAliased(9, 8)).toBe(true)
  })

  it('sampleSignal: 点数与采样率、时长匹配且幅值在[-1,1]', () => {
    const s = sampleSignal(9, 10, 1)
    expect(s.length).toBe(11) // i=0..10
    for (const p of s) {
      expect(p.v).toBeGreaterThanOrEqual(-1 - 1e-9)
      expect(p.v).toBeLessThanOrEqual(1 + 1e-9)
    }
    expect(sampleSignal(9, 0, 1).length).toBe(0)
  })

  it('PRESETS 的混叠判定与预期一致', () => {
    expect(PRESETS.length).toBe(3)
    expect(isAliased(PRESETS[0].f, PRESETS[0].fs)).toBe(false)
    expect(isAliased(PRESETS[1].f, PRESETS[1].fs)).toBe(true)
    expect(isAliased(PRESETS[2].f, PRESETS[2].fs)).toBe(true)
  })
})
