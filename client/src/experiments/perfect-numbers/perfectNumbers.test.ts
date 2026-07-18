import { describe, it, expect } from 'vitest'
import {
  properDivisors,
  divisorSum,
  classify,
  isAmicable,
  perfectNumbers,
  SAMPLES,
} from './perfectNumbers'

describe('完全数与亲和数', () => {
  it('properDivisors 返回正确的真因数列表', () => {
    expect(properDivisors(6)).toEqual([1, 2, 3])
    expect(properDivisors(28)).toEqual([1, 2, 4, 7, 14])
    expect(properDivisors(12)).toEqual([1, 2, 3, 4, 6])
    expect(properDivisors(1)).toEqual([])
  })

  it('divisorSum 计算真因数之和', () => {
    expect(divisorSum(6)).toBe(6)
    expect(divisorSum(28)).toBe(28)
    expect(divisorSum(12)).toBe(16)
    expect(divisorSum(220)).toBe(284)
    expect(divisorSum(284)).toBe(220)
  })

  it('classify 正确区分完全数、盈数、亏数', () => {
    expect(classify(6)).toBe('perfect')
    expect(classify(28)).toBe('perfect')
    expect(classify(12)).toBe('abundant')
    expect(classify(8)).toBe('deficient')
    expect(classify(220)).toBe('abundant')
  })

  it('isAmicable 判断亲和数', () => {
    expect(isAmicable(220, 284)).toBe(true)
    expect(isAmicable(284, 220)).toBe(true)
    expect(isAmicable(6, 6)).toBe(false)
    expect(isAmicable(6, 28)).toBe(false)
  })

  it('perfectNumbers 生成前几个完全数', () => {
    expect(perfectNumbers(30)).toEqual([6, 28])
    expect(perfectNumbers(1000)).toEqual([6, 28, 496])
  })

  it('SAMPLES 中每个数都能被分类', () => {
    for (const n of SAMPLES) {
      expect(['perfect', 'abundant', 'deficient']).toContain(classify(n))
    }
  })
})
