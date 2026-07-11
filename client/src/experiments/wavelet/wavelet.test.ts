import { describe, it, expect } from 'vitest'
import {
  generateSignal,
  haarDWT,
  haarIDWT,
  isPowerOfTwo,
  motherWavelet,
  cwt,
  makeScales,
  energy,
  SIGNAL_OPTIONS,
  WAVELET_OPTIONS,
} from './wavelet'

describe('小波变换内核', () => {
  it('isPowerOfTwo 判断正确', () => {
    expect(isPowerOfTwo(1)).toBe(true)
    expect(isPowerOfTwo(2)).toBe(true)
    expect(isPowerOfTwo(256)).toBe(true)
    expect(isPowerOfTwo(3)).toBe(false)
    expect(isPowerOfTwo(0)).toBe(false)
    expect(isPowerOfTwo(-4)).toBe(false)
  })

  it('generateSignal 长度正确且数值有限', () => {
    for (const opt of SIGNAL_OPTIONS) {
      const s = generateSignal(opt.id, 128)
      expect(s.length).toBe(128)
      for (const v of s) expect(Number.isFinite(v)).toBe(true)
    }
  })

  it('Haar DWT 单个常数信号：细节全为零，近似集中', () => {
    // 常数信号只有低频，所有细节系数应为 0
    const s = new Array<number>(8).fill(3)
    const c = haarDWT(s)
    // c[0] 为总近似，其余细节应接近 0
    for (let i = 1; i < c.length; i++) expect(Math.abs(c[i])).toBeLessThan(1e-9)
    expect(c[0]).toBeCloseTo(3 * Math.sqrt(8), 9)
  })

  it('Haar DWT/IDWT 完美重构（正交变换）', () => {
    const s = generateSignal('chirp', 256)
    const rec = haarIDWT(haarDWT(s))
    for (let i = 0; i < s.length; i++) expect(rec[i]).toBeCloseTo(s[i], 9)
  })

  it('Haar 变换保持能量守恒（Parseval 定理）', () => {
    const s = generateSignal('transient', 128)
    const c = haarDWT(s)
    expect(energy(c)).toBeCloseTo(energy(s), 6)
  })

  it('haarDWT 对非 2 的幂长度抛错', () => {
    expect(() => haarDWT([1, 2, 3])).toThrow()
    expect(() => haarIDWT([1, 2, 3, 4, 5])).toThrow()
  })

  it('母小波零均值（积分近似为 0）', () => {
    for (const opt of WAVELET_OPTIONS) {
      let sum = 0
      const dx = 0.01
      for (let x = -8; x <= 8; x += dx) sum += motherWavelet(opt.id, x) * dx
      expect(Math.abs(sum)).toBeLessThan(0.05)
    }
  })

  it('墨西哥帽在原点取峰值 1、在 x=1 处为 0', () => {
    expect(motherWavelet('mexican', 0)).toBeCloseTo(1, 9)
    expect(motherWavelet('mexican', 1)).toBeCloseTo(0, 9)
  })

  it('makeScales 单调递增且首尾正确', () => {
    const scales = makeScales(1, 32, 6)
    expect(scales.length).toBe(6)
    expect(scales[0]).toBeCloseTo(1, 9)
    expect(scales[5]).toBeCloseTo(32, 9)
    for (let i = 1; i < scales.length; i++) expect(scales[i]).toBeGreaterThan(scales[i - 1])
  })

  it('cwt 输出维度为 尺度数 × 信号长度', () => {
    const s = generateSignal('twoTone', 128)
    const scales = makeScales(1, 24, 10)
    const m = cwt(s, scales, 'mexican')
    expect(m.length).toBe(10)
    for (const row of m) expect(row.length).toBe(128)
  })

  it('cwt 定位瞬变：脉冲位置(中点)的小尺度系数幅度大于两端', () => {
    const s = generateSignal('transient', 256)
    const scales = makeScales(1, 4, 3)
    const m = cwt(s, scales, 'mexican')
    const row = m[0] // 最小尺度对尖峰最敏感
    const mid = Math.abs(row[128])
    const left = Math.abs(row[20])
    expect(mid).toBeGreaterThan(left)
  })

  it('选项数组非空且 id 唯一', () => {
    expect(SIGNAL_OPTIONS.length).toBeGreaterThan(0)
    expect(WAVELET_OPTIONS.length).toBeGreaterThan(0)
    expect(new Set(SIGNAL_OPTIONS.map((o) => o.id)).size).toBe(SIGNAL_OPTIONS.length)
    expect(new Set(WAVELET_OPTIONS.map((o) => o.id)).size).toBe(WAVELET_OPTIONS.length)
  })
})
