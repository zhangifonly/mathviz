import { describe, it, expect } from 'vitest'
import {
  lucas,
  lucasSequence,
  fibonacci,
  fibonacciSequence,
  ratios,
  lucasFromFib,
  PHI,
  TERMS,
} from './lucasNumbers'

describe('卢卡斯数', () => {
  it('lucasSequence 给出正确的前几项 2,1,3,4,7,11,18,29', () => {
    expect(lucasSequence(8)).toEqual([2, 1, 3, 4, 7, 11, 18, 29])
    expect(lucasSequence(0)).toEqual([])
    expect(lucasSequence(1)).toEqual([2])
    expect(lucasSequence(2)).toEqual([2, 1])
  })

  it('lucas(n) 与序列一致，且满足递推', () => {
    const seq = lucasSequence(12)
    for (let i = 0; i < seq.length; i++) {
      expect(lucas(i)).toBe(seq[i])
    }
    for (let i = 2; i < seq.length; i++) {
      expect(seq[i]).toBe(seq[i - 1] + seq[i - 2])
    }
  })

  it('恒等式 L(n) = F(n-1) + F(n+1) 成立', () => {
    for (let n = 1; n <= 15; n++) {
      expect(lucasFromFib(n)).toBe(lucas(n))
    }
  })

  it('fibonacci 与斐波那契序列一致', () => {
    const fib = fibonacciSequence(10)
    expect(fib).toEqual([0, 1, 1, 2, 3, 5, 8, 13, 21, 34])
    for (let i = 0; i < fib.length; i++) {
      expect(fibonacci(i)).toBe(fib[i])
    }
  })

  it('相邻比趋于黄金比 φ', () => {
    const r = ratios(lucasSequence(25))
    expect(r.length).toBe(24)
    expect(Math.abs(r[r.length - 1] - PHI)).toBeLessThan(1e-6)
  })

  it('TERMS 都能生成对应长度的序列', () => {
    for (const t of TERMS) {
      expect(lucasSequence(t).length).toBe(t)
    }
  })
})
