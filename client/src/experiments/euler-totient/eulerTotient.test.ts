import { describe, it, expect } from 'vitest'
import {
  gcd,
  primeFactors,
  totient,
  isCoprime,
  coprimesUpTo,
  isMultiplicative,
  SAMPLES,
} from './eulerTotient'

describe('欧拉函数', () => {
  it('gcd 计算正确', () => {
    expect(gcd(12, 18)).toBe(6)
    expect(gcd(17, 5)).toBe(1)
    expect(gcd(0, 7)).toBe(7)
    expect(gcd(100, 100)).toBe(100)
  })

  it('primeFactors 给出不同质因子', () => {
    expect(primeFactors(12)).toEqual([2, 3])
    expect(primeFactors(30)).toEqual([2, 3, 5])
    expect(primeFactors(13)).toEqual([13])
    expect(primeFactors(1)).toEqual([])
  })

  it('totient 对已知值正确', () => {
    expect(totient(1)).toBe(1)
    expect(totient(2)).toBe(1)
    expect(totient(9)).toBe(6)
    expect(totient(12)).toBe(4)
    expect(totient(36)).toBe(12)
  })

  it('质数 p 的 phi(p) = p-1', () => {
    for (const p of [2, 3, 5, 7, 11, 13, 97]) {
      expect(totient(p)).toBe(p - 1)
    }
  })

  it('coprimesUpTo 长度等于 totient，且都互质', () => {
    for (const n of [1, 10, 12, 30, 36]) {
      const list = coprimesUpTo(n)
      expect(list.length).toBe(totient(n))
      for (const k of list) expect(isCoprime(k, n)).toBe(true)
    }
  })

  it('积性性质：gcd(m,n)=1 时 phi(mn)=phi(m)phi(n)', () => {
    expect(isMultiplicative(4, 9)).toBe(true)
    expect(isMultiplicative(5, 7)).toBe(true)
    expect(isMultiplicative(6, 10)).toBe(false) // 不互质，直接返回 false
    expect(totient(6 * 35)).toBe(totient(6) * totient(35))
  })

  it('SAMPLES 都能算出正整数 phi', () => {
    for (const n of SAMPLES) {
      const t = totient(n)
      expect(t).toBeGreaterThan(0)
      expect(Number.isInteger(t)).toBe(true)
    }
  })
})
