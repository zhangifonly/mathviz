import { describe, it, expect } from 'vitest'
import {
  dct,
  idct,
  keepLowFreq,
  reconstruct,
  SIGNAL,
  KEEP_COUNTS,
} from './discreteCosineTransform'

const close = (a: number[], b: number[], eps = 1e-9) => {
  expect(a.length).toBe(b.length)
  for (let i = 0; i < a.length; i++) expect(Math.abs(a[i] - b[i])).toBeLessThan(eps)
}

describe('离散余弦变换', () => {
  it('dct 输出长度与输入一致', () => {
    expect(dct(SIGNAL).length).toBe(SIGNAL.length)
    expect(dct([1, 2, 3, 4]).length).toBe(4)
  })

  it('idct(dct(x)) 精确还原原信号', () => {
    close(idct(dct(SIGNAL)), SIGNAL)
    close(idct(dct([3, -1, 4, 1, 5, 9])), [3, -1, 4, 1, 5, 9])
  })

  it('常数信号只有直流分量（k=0），其余系数为零', () => {
    const c = dct([7, 7, 7, 7, 7, 7, 7, 7])
    expect(Math.abs(c[0])).toBeGreaterThan(0)
    for (let k = 1; k < c.length; k++) expect(Math.abs(c[k])).toBeLessThan(1e-9)
  })

  it('keepLowFreq 只保留前 k 个系数，其余置零', () => {
    const kept = keepLowFreq([1, 2, 3, 4, 5], 2)
    expect(kept).toEqual([1, 2, 0, 0, 0])
    expect(keepLowFreq([1, 2, 3], 0)).toEqual([0, 0, 0])
    expect(keepLowFreq([1, 2, 3], 99)).toEqual([1, 2, 3])
  })

  it('保留全部系数时重建=原信号', () => {
    close(reconstruct(SIGNAL, SIGNAL.length), SIGNAL, 1e-8)
  })

  it('保留系数越多，重建误差越小（能量集中在低频）', () => {
    const err = (keep: number) =>
      reconstruct(SIGNAL, keep).reduce((s, v, i) => s + (v - SIGNAL[i]) ** 2, 0)
    for (let i = 1; i < KEEP_COUNTS.length; i++) {
      expect(err(KEEP_COUNTS[i])).toBeLessThanOrEqual(err(KEEP_COUNTS[i - 1]) + 1e-6)
    }
  })
})
