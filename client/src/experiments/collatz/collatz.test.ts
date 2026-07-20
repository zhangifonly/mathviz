import { describe, it, expect } from 'vitest'
import { collatzSequence, stoppingTime, maxValue, START_VALUES } from './collatz'

describe('考拉兹猜想', () => {
  it('collatzSequence(1) 只含 1 本身', () => {
    expect(collatzSequence(1)).toEqual([1])
  })

  it('collatzSequence 遵循奇偶两条规则且以 1 结尾', () => {
    const seq = collatzSequence(6)
    expect(seq).toEqual([6, 3, 10, 5, 16, 8, 4, 2, 1])
    expect(seq[seq.length - 1]).toBe(1)
  })

  it('序列每一步都符合 3n+1 / n/2 规则', () => {
    const seq = collatzSequence(27)
    for (let i = 1; i < seq.length; i++) {
      const prev = seq[i - 1]
      const expected = prev % 2 === 0 ? prev / 2 : 3 * prev + 1
      expect(seq[i]).toBe(expected)
    }
  })

  it('stoppingTime 是序列长度减一', () => {
    expect(stoppingTime(1)).toBe(0)
    expect(stoppingTime(6)).toBe(8)
    expect(stoppingTime(27)).toBe(111)
  })

  it('maxValue 返回序列峰值', () => {
    expect(maxValue(1)).toBe(1)
    expect(maxValue(6)).toBe(16)
    expect(maxValue(27)).toBe(9232)
  })

  it('非法输入返回空序列，停止时间为 0', () => {
    expect(collatzSequence(0)).toEqual([])
    expect(collatzSequence(-5)).toEqual([])
    expect(stoppingTime(0)).toBe(0)
  })

  it('START_VALUES 都能收敛到 1', () => {
    for (const n of START_VALUES) {
      const seq = collatzSequence(n)
      expect(seq[seq.length - 1]).toBe(1)
      expect(seq.length).toBeGreaterThan(1)
    }
  })
})
