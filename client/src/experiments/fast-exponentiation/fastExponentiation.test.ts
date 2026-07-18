import { describe, it, expect } from 'vitest'
import { fastPow, toBits, SAMPLES } from './fastExponentiation'

describe('快速幂', () => {
  it('toBits 低位在前，且能还原原值', () => {
    expect(toBits(13)).toEqual([1, 0, 1, 1]) // 1101
    expect(toBits(1)).toEqual([1])
    expect(toBits(0)).toEqual([0])
    const back = toBits(45).reduce((s, b, i) => s + b * 2 ** i, 0)
    expect(back).toBe(45)
  })

  it('结果与朴素幂一致（小数不取模）', () => {
    for (let e = 0; e <= 12; e++) {
      const naive = 3 ** e
      expect(fastPow(3, e, 0).result).toBe(String(naive))
    }
  })

  it('取模结果正确：2^10 mod 1000 = 24', () => {
    expect(fastPow(2, 10, 1000).result).toBe('24')
    expect(fastPow(7, 45, 1000).result).toBe((7n ** 45n % 1000n).toString())
  })

  it('大指数用 BigInt 取模：2^100 mod 1e9+7', () => {
    const t = fastPow(2, 100, 1000000007)
    const expected = (2n ** 100n % 1000000007n).toString()
    expect(t.result).toBe(expected)
  })

  it('乘法次数远少于朴素法', () => {
    const t = fastPow(2, 100, 1000000007)
    expect(t.naiveMults).toBe(99)
    expect(t.fastMults).toBeLessThan(20)
    // 每个乘进结果的步都对应一个为 1 的位
    const ones = t.bits.filter((b) => b === 1).length
    expect(t.steps.filter((s) => s.multiplied).length).toBe(ones)
  })

  it('步数等于二进制位数，指数 0 时结果为 1', () => {
    expect(fastPow(5, 0, 0).result).toBe('1')
    const t = fastPow(3, 13, 0)
    expect(t.steps.length).toBe(t.bits.length)
  })

  it('SAMPLES 都能跑出有效结果', () => {
    for (const s of SAMPLES) {
      const t = fastPow(s.base, s.exp, s.mod)
      expect(t.steps.length).toBeGreaterThan(0)
      expect(t.result.length).toBeGreaterThan(0)
    }
  })
})
