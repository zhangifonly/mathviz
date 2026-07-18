import { describe, it, expect } from 'vitest'
import {
  windowFn,
  makeSignal,
  applyWindow,
  dftMagnitude,
  WINDOWS,
} from './windowing'

describe('加窗函数', () => {
  it('WINDOWS 常量含四种窗', () => {
    expect(WINDOWS).toEqual(['rect', 'hann', 'hamming', 'blackman'])
  })

  it('矩形窗全为 1', () => {
    const w = windowFn('rect', 16)
    expect(w.length).toBe(16)
    for (const v of w) expect(v).toBe(1)
  })

  it('汉宁窗两端为 0、中间接近 1', () => {
    const N = 32
    const w = windowFn('hann', N)
    expect(w[0]).toBeCloseTo(0, 6)
    expect(w[N - 1]).toBeCloseTo(0, 6)
    expect(Math.max(...w)).toBeGreaterThan(0.99)
  })

  it('各窗取值都落在 [0,1] 且长度正确', () => {
    for (const kind of WINDOWS) {
      const w = windowFn(kind, 24)
      expect(w.length).toBe(24)
      for (const v of w) {
        expect(v).toBeGreaterThanOrEqual(-1e-9)
        expect(v).toBeLessThanOrEqual(1 + 1e-9)
      }
    }
  })

  it('applyWindow 逐点相乘', () => {
    const sig = [1, 2, 3, 4]
    const win = [0, 0.5, 0.5, 1]
    expect(applyWindow(sig, win)).toEqual([0, 1, 1.5, 4])
  })

  it('整数频率正弦的 DFT 能量集中在对应频点', () => {
    const N = 64
    const freq = 8
    const mag = dftMagnitude(makeSignal(N, freq))
    let peak = 0
    for (let k = 1; k < mag.length; k++) if (mag[k] > mag[peak]) peak = k
    expect(peak).toBe(freq)
  })

  it('非整数频率下汉宁窗旁瓣泄漏低于矩形窗', () => {
    const N = 64
    const freq = 8.5
    const sig = makeSignal(N, freq)
    const rectMag = dftMagnitude(sig)
    const hannMag = dftMagnitude(applyWindow(sig, windowFn('hann', N)))
    // 远离主瓣的高频区(k>=20)能量：汉宁窗应更小
    const tail = (m: number[]) => m.slice(20).reduce((a, b) => a + b, 0)
    expect(tail(hannMag)).toBeLessThan(tail(rectMag))
  })
})
