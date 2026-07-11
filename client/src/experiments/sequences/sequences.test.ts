import { describe, it, expect } from 'vitest'
import {
  arithmeticTerm,
  arithmeticSequence,
  arithmeticSum,
  geometricTerm,
  geometricSequence,
  geometricSum,
  geometricInfiniteSum,
  SEQUENCE_OPTIONS,
} from './sequences'

describe('等差数列', () => {
  it('通项 a_n = a1 + (n-1)*d', () => {
    expect(arithmeticTerm(1, 2, 1)).toBe(1)
    expect(arithmeticTerm(1, 2, 5)).toBe(9)
    expect(arithmeticTerm(3, -1, 4)).toBe(0)
  })

  it('前 n 项列表正确', () => {
    expect(arithmeticSequence(1, 2, 5)).toEqual([1, 3, 5, 7, 9])
  })

  it('前 n 项和 S_n = n*(a1+a_n)/2，等于逐项累加', () => {
    // 1+3+5+7+9 = 25
    expect(arithmeticSum(1, 2, 5)).toBe(25)
    const seq = arithmeticSequence(2, 3, 20)
    const brute = seq.reduce((a, b) => a + b, 0)
    expect(arithmeticSum(2, 3, 20)).toBe(brute)
  })

  it('n<=0 时和为 0', () => {
    expect(arithmeticSum(1, 2, 0)).toBe(0)
    expect(arithmeticSum(1, 2, -3)).toBe(0)
  })
})

describe('等比数列', () => {
  it('通项 a_n = a1 * r^(n-1)', () => {
    expect(geometricTerm(1, 2, 1)).toBe(1)
    expect(geometricTerm(1, 2, 5)).toBe(16)
    expect(geometricTerm(8, 0.5, 4)).toBe(1)
  })

  it('前 n 项列表正确', () => {
    expect(geometricSequence(1, 2, 5)).toEqual([1, 2, 4, 8, 16])
  })

  it('前 n 项和公式，等于逐项累加', () => {
    // 1+2+4+8+16 = 31
    expect(geometricSum(1, 2, 5)).toBe(31)
    const seq = geometricSequence(3, 2, 10)
    const brute = seq.reduce((a, b) => a + b, 0)
    expect(geometricSum(3, 2, 10)).toBeCloseTo(brute, 6)
  })

  it('公比为 1 时退化为 a1*n', () => {
    expect(geometricSum(5, 1, 4)).toBe(20)
  })

  it('无穷和：|r|<1 收敛到 a1/(1-r)，否则为 null', () => {
    expect(geometricInfiniteSum(8, 0.5)).toBeCloseTo(16, 6)
    expect(geometricInfiniteSum(1, 2)).toBeNull()
    expect(geometricInfiniteSum(1, -1)).toBeNull()
  })
})

describe('SEQUENCE_OPTIONS', () => {
  it('每个选项都能生成有限的前若干项', () => {
    for (const opt of SEQUENCE_OPTIONS) {
      const seq =
        opt.kind === 'arithmetic'
          ? arithmeticSequence(opt.a1, opt.step, 6)
          : geometricSequence(opt.a1, opt.step, 6)
      expect(seq.length).toBe(6)
      for (const v of seq) expect(Number.isFinite(v)).toBe(true)
    }
  })

  it('选项 kind 合法且首项匹配', () => {
    for (const opt of SEQUENCE_OPTIONS) {
      expect(['arithmetic', 'geometric']).toContain(opt.kind)
      const first =
        opt.kind === 'arithmetic'
          ? arithmeticTerm(opt.a1, opt.step, 1)
          : geometricTerm(opt.a1, opt.step, 1)
      expect(first).toBe(opt.a1)
    }
  })
})
