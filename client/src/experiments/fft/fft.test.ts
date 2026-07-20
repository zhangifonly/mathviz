import { describe, it, expect } from 'vitest'
import {
  fft,
  dft,
  makeSignal,
  magnitude,
  isPowerOfTwo,
  naiveOps,
  fftOps,
  SIGNAL_PRESETS,
  FFT_SIZES,
  type Complex,
} from './fft'

function close(a: Complex[], b: Complex[], eps = 1e-9) {
  expect(a.length).toBe(b.length)
  for (let i = 0; i < a.length; i++) {
    expect(Math.abs(a[i].re - b[i].re)).toBeLessThan(eps)
    expect(Math.abs(a[i].im - b[i].im)).toBeLessThan(eps)
  }
}

describe('快速傅里叶变换', () => {
  it('isPowerOfTwo 判定正确', () => {
    expect(isPowerOfTwo(1)).toBe(true)
    expect(isPowerOfTwo(16)).toBe(true)
    expect(isPowerOfTwo(64)).toBe(true)
    expect(isPowerOfTwo(0)).toBe(false)
    expect(isPowerOfTwo(6)).toBe(false)
  })

  it('FFT 与朴素 DFT 结果一致（各预设各尺寸）', () => {
    for (const preset of SIGNAL_PRESETS) {
      for (const n of FFT_SIZES) {
        const sig = makeSignal(preset, n)
        close(fft(sig), dft(sig))
      }
    }
  })

  it('非 2 的幂长度会抛错', () => {
    const sig = makeSignal(SIGNAL_PRESETS[0], 16).slice(0, 6)
    expect(() => fft(sig)).toThrow()
  })

  it('单频正弦的幅度谱峰落在对应频率 bin', () => {
    const n = 32
    const sig = makeSignal({ name: 't', components: [{ freq: 3, amp: 1 }] }, n)
    const mag = magnitude(fft(sig))
    let peak = 0
    for (let k = 1; k < n / 2; k++) if (mag[k] > mag[peak]) peak = k
    expect(peak).toBe(3)
  })

  it('双频信号在两个频率处都有显著峰', () => {
    const n = 64
    const sig = makeSignal({ name: 't', components: [{ freq: 2, amp: 1 }, { freq: 5, amp: 1 }] }, n)
    const mag = magnitude(fft(sig))
    const half = mag.slice(0, n / 2)
    const avg = half.reduce((a, b) => a + b, 0) / half.length
    expect(mag[2]).toBeGreaterThan(avg * 3)
    expect(mag[5]).toBeGreaterThan(avg * 3)
  })

  it('运算次数：FFT 远小于朴素 DFT', () => {
    for (const n of FFT_SIZES) {
      expect(naiveOps(n)).toBe(n * n)
      expect(fftOps(n)).toBeLessThan(naiveOps(n))
    }
    expect(fftOps(64)).toBe(64 * 6)
  })
})
