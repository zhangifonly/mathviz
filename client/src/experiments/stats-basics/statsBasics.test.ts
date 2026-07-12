import { describe, it, expect } from 'vitest'
import {
  mean,
  median,
  mode,
  range,
  variance,
  stdDev,
  summarize,
  DATASET_OPTIONS,
} from './statsBasics'

describe('统计初步', () => {
  it('mean 计算平均数', () => {
    expect(mean([1, 2, 3, 4, 5])).toBe(3)
    expect(mean([2, 4, 6])).toBe(4)
  })

  it('median 奇数个取中间', () => {
    expect(median([3, 1, 2])).toBe(2)
    expect(median([5])).toBe(5)
  })

  it('median 偶数个取中间两数平均', () => {
    expect(median([1, 2, 3, 4])).toBe(2.5)
    expect(median([10, 20])).toBe(15)
  })

  it('mode 返回出现最多的数(升序)', () => {
    expect(mode([1, 2, 2, 3])).toEqual([2])
    expect(mode([1, 1, 2, 2, 3])).toEqual([1, 2])
  })

  it('range 极差 = 最大减最小', () => {
    expect(range([3, 7, 1, 9])).toBe(8)
  })

  it('variance/stdDev 已知数据集', () => {
    // [2,4,4,4,5,5,7,9] 平均=5, 方差=4, 标准差=2 (经典教科书例子)
    const d = [2, 4, 4, 4, 5, 5, 7, 9]
    expect(mean(d)).toBe(5)
    expect(variance(d)).toBe(4)
    expect(stdDev(d)).toBe(2)
  })

  it('恒等式: 相同数据方差为 0', () => {
    expect(variance([7, 7, 7, 7])).toBe(0)
    expect(stdDev([7, 7, 7, 7])).toBe(0)
  })

  it('恒等式: 每个数加常数, 平均随之增加而方差不变', () => {
    const base = [1, 2, 3, 4, 5]
    const shift = base.map((v) => v + 10)
    expect(mean(shift)).toBe(mean(base) + 10)
    expect(variance(shift)).toBeCloseTo(variance(base), 10)
  })

  it('空数组边界安全', () => {
    expect(mean([])).toBe(0)
    expect(median([])).toBe(0)
    expect(mode([])).toEqual([])
    expect(range([])).toBe(0)
    expect(variance([])).toBe(0)
  })

  it('summarize 汇总一致', () => {
    const d = [70, 75, 80, 80, 85]
    const s = summarize(d)
    expect(s.mean).toBe(mean(d))
    expect(s.median).toBe(median(d))
    expect(s.mode).toEqual(mode(d))
    expect(s.stdDev).toBeCloseTo(Math.sqrt(s.variance), 10)
  })

  it('DATASET_OPTIONS 都有非空数据且能汇总', () => {
    for (const opt of DATASET_OPTIONS) {
      expect(opt.data.length).toBeGreaterThan(0)
      const s = summarize(opt.data)
      expect(Number.isFinite(s.mean)).toBe(true)
      expect(s.stdDev).toBeGreaterThanOrEqual(0)
    }
  })
})
