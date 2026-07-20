import { describe, it, expect } from 'vitest'
import {
  sieve,
  primesUpTo,
  smallestFactor,
  countPrimes,
  GRID_SIZES,
} from './sieveEratosthenes'

describe('埃氏筛法', () => {
  it('sieve 返回长度 n+1 的数组，0 和 1 非素数', () => {
    const isPrime = sieve(10)
    expect(isPrime.length).toBe(11)
    expect(isPrime[0]).toBe(false)
    expect(isPrime[1]).toBe(false)
    expect(isPrime[2]).toBe(true)
  })

  it('sieve 正确标记 20 以内的素数', () => {
    const isPrime = sieve(20)
    const primes = [2, 3, 5, 7, 11, 13, 17, 19]
    for (let i = 2; i <= 20; i++) {
      expect(isPrime[i]).toBe(primes.includes(i))
    }
  })

  it('primesUpTo 返回正确素数列表', () => {
    expect(primesUpTo(30)).toEqual([2, 3, 5, 7, 11, 13, 17, 19, 23, 29])
    expect(primesUpTo(1)).toEqual([])
    expect(primesUpTo(2)).toEqual([2])
  })

  it('smallestFactor 给出正确的最小质因子', () => {
    const spf = smallestFactor(20)
    expect(spf[0]).toBe(0)
    expect(spf[1]).toBe(0)
    expect(spf[2]).toBe(2)
    expect(spf[9]).toBe(3)
    expect(spf[15]).toBe(3)
    expect(spf[17]).toBe(17)
    // 素数的最小质因子是自身
    for (const p of primesUpTo(20)) expect(spf[p]).toBe(p)
  })

  it('smallestFactor 能整除对应数字', () => {
    const spf = smallestFactor(100)
    for (let i = 2; i <= 100; i++) {
      expect(i % spf[i]).toBe(0)
    }
  })

  it('countPrimes 与已知素数计数一致', () => {
    expect(countPrimes(10)).toBe(4)
    expect(countPrimes(100)).toBe(25)
  })

  it('GRID_SIZES 每个档位都能正常筛出素数', () => {
    for (const n of GRID_SIZES) {
      const primes = primesUpTo(n)
      expect(primes[0]).toBe(2)
      expect(primes.every((p) => sieve(n)[p])).toBe(true)
    }
  })
})
