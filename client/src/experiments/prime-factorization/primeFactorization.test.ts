import { describe, it, expect } from 'vitest'
import {
  factorize,
  isPrime,
  factorPairs,
  smallestFactor,
  factorTree,
  formatFactorization,
  SAMPLES,
} from './primeFactorization'

describe('质因数分解', () => {
  it('factorize 拆出带重复的质因数', () => {
    expect(factorize(12)).toEqual([2, 2, 3])
    expect(factorize(60)).toEqual([2, 2, 3, 5])
    expect(factorize(17)).toEqual([17])
    expect(factorize(1)).toEqual([])
  })

  it('factorize 乘积还原为原数', () => {
    for (const n of [60, 100, 360, 97, 1024]) {
      const prod = factorize(n).reduce((a, b) => a * b, 1)
      expect(prod).toBe(n)
    }
  })

  it('isPrime 正确判定', () => {
    expect(isPrime(2)).toBe(true)
    expect(isPrime(17)).toBe(true)
    expect(isPrime(1)).toBe(false)
    expect(isPrime(100)).toBe(false)
  })

  it('factorPairs 给出指数形式', () => {
    expect(factorPairs(12)).toEqual([
      { prime: 2, exp: 2 },
      { prime: 3, exp: 1 },
    ])
    expect(factorPairs(360)).toEqual([
      { prime: 2, exp: 3 },
      { prime: 3, exp: 2 },
      { prime: 5, exp: 1 },
    ])
  })

  it('smallestFactor 返回最小质因数', () => {
    expect(smallestFactor(15)).toBe(3)
    expect(smallestFactor(14)).toBe(2)
    expect(smallestFactor(17)).toBe(17)
  })

  it('factorTree 叶子都是质数，且乘积等于原数', () => {
    const leaves: number[] = []
    const walk = (node: ReturnType<typeof factorTree>) => {
      if (node.left || node.right) {
        if (node.left) walk(node.left)
        if (node.right) walk(node.right)
      } else {
        leaves.push(node.value)
      }
    }
    walk(factorTree(360))
    for (const v of leaves) expect(isPrime(v)).toBe(true)
    expect(leaves.reduce((a, b) => a * b, 1)).toBe(360)
  })

  it('factorTree 对质数返回单叶子', () => {
    const t = factorTree(17)
    expect(t.value).toBe(17)
    expect(t.prime).toBe(true)
    expect(t.left).toBeUndefined()
  })

  it('formatFactorization 输出可读字符串', () => {
    expect(formatFactorization(12)).toBe('2^2 x 3')
    expect(formatFactorization(17)).toBe('17')
    expect(formatFactorization(100)).toBe('2^2 x 5^2')
  })

  it('SAMPLES 都能分解', () => {
    for (const n of SAMPLES) {
      expect(factorize(n).length).toBeGreaterThan(0)
    }
  })
})
