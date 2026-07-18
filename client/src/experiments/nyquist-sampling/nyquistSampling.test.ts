import { describe, it, expect } from 'vitest'
import {
  sinc,
  signal,
  sampleSignal,
  reconstruct,
  isSufficient,
  nyquistFreq,
  PRESETS,
} from './nyquistSampling'

describe('奈奎斯特采样', () => {
  it('sinc(0)=1，整数处为 0', () => {
    expect(sinc(0)).toBe(1)
    expect(Math.abs(sinc(1))).toBeLessThan(1e-12)
    expect(Math.abs(sinc(3))).toBeLessThan(1e-12)
  })

  it('signal 为单频正弦，起点为 0', () => {
    expect(signal(2, 0)).toBeCloseTo(0, 10)
    expect(signal(1, 0.25)).toBeCloseTo(1, 10)
  })

  it('sampleSignal 数量与采样点取值正确', () => {
    const s = sampleSignal(2, 10, 1)
    expect(s.length).toBe(10)
    expect(s[0].t).toBe(0)
    expect(s[0].v).toBeCloseTo(signal(2, 0), 10)
    expect(s[1].t).toBeCloseTo(0.1, 10)
  })

  it('充分采样时 sinc 重建能高精度还原原信号', () => {
    const freq = 2
    const fs = 20
    const dur = 3
    const samples = sampleSignal(freq, fs, dur)
    // 在信号中段（远离边界，避免截断误差）检查重建
    for (const t of [1.0, 1.13, 1.37, 1.62]) {
      expect(reconstruct(samples, fs, t)).toBeCloseTo(signal(freq, t), 1)
    }
  })

  it('重建在采样点处恰好等于样本值', () => {
    const fs = 8
    const samples = sampleSignal(3, fs, 2)
    for (const k of [3, 5, 8]) {
      expect(reconstruct(samples, fs, k / fs)).toBeCloseTo(samples[k].v, 6)
    }
  })

  it('isSufficient 判据与 nyquistFreq 正确', () => {
    expect(isSufficient(2, 10)).toBe(true)
    expect(isSufficient(2, 4)).toBe(false)
    expect(isSufficient(2, 3)).toBe(false)
    expect(nyquistFreq(10)).toBe(5)
  })

  it('PRESETS 覆盖充分与不足两种情形', () => {
    expect(PRESETS.length).toBeGreaterThanOrEqual(3)
    expect(isSufficient(PRESETS[0].freq, PRESETS[0].fs)).toBe(true)
    expect(isSufficient(PRESETS[2].freq, PRESETS[2].fs)).toBe(false)
  })
})
