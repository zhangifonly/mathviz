import { describe, it, expect } from 'vitest'
import {
  benfordProb,
  leadingDigit,
  generateDataset,
  digitDistribution,
  DATASETS,
} from './benfordsLaw'

describe('本福特定律', () => {
  it('benfordProb: 首位1约0.301，9约0.046，全部概率之和为1', () => {
    expect(benfordProb(1)).toBeCloseTo(0.30103, 4)
    expect(benfordProb(9)).toBeCloseTo(0.04576, 4)
    let sum = 0
    for (let d = 1; d <= 9; d++) sum += benfordProb(d)
    expect(sum).toBeCloseTo(1, 10)
    expect(benfordProb(0)).toBe(0)
    expect(benfordProb(10)).toBe(0)
  })

  it('benfordProb 单调递减', () => {
    for (let d = 1; d < 9; d++) {
      expect(benfordProb(d)).toBeGreaterThan(benfordProb(d + 1))
    }
  })

  it('leadingDigit 取首位有效数字', () => {
    expect(leadingDigit(1)).toBe(1)
    expect(leadingDigit(1024)).toBe(1)
    expect(leadingDigit(987)).toBe(9)
    expect(leadingDigit(0.00345)).toBe(3)
    expect(leadingDigit(-256)).toBe(2)
    expect(leadingDigit(0)).toBe(0)
  })

  it('generateDataset: 2的幂/斐波那契前几项正确', () => {
    expect(generateDataset('powers2', 5)).toEqual([1, 2, 4, 8, 16])
    expect(generateDataset('fibonacci', 6)).toEqual([1, 1, 2, 3, 5, 8])
    expect(generateDataset('random', 20).length).toBe(20)
  })

  it('digitDistribution: 分布归一化，2的幂首位1最多', () => {
    const dist = digitDistribution(generateDataset('powers2', 200))
    expect(dist.length).toBe(9)
    const sum = dist.reduce((a, b) => a + b, 0)
    expect(sum).toBeCloseTo(1, 10)
    // 2的幂首位分布近似本福特，1 应是占比最高的
    const maxIdx = dist.indexOf(Math.max(...dist))
    expect(maxIdx).toBe(0)
    // 首位1的实际占比接近理论 0.301
    expect(dist[0]).toBeGreaterThan(0.25)
  })

  it('DATASETS 三个数据集都能生成且分布合法', () => {
    for (const t of DATASETS) {
      const dist = digitDistribution(generateDataset(t, 100))
      for (const p of dist) {
        expect(p).toBeGreaterThanOrEqual(0)
        expect(p).toBeLessThanOrEqual(1)
      }
    }
  })
})
