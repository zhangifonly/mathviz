import { describe, it, expect } from 'vitest'
import {
  norm,
  isRationalPrime,
  isGaussianPrime,
  gaussianPrimes,
  splitKind,
  RANGE,
} from './gaussianIntegers'

describe('高斯整数', () => {
  it('norm 计算 a^2+b^2', () => {
    expect(norm(3, 4)).toBe(25)
    expect(norm(0, 0)).toBe(0)
    expect(norm(-1, 1)).toBe(2)
  })

  it('isRationalPrime 判定普通素数', () => {
    expect(isRationalPrime(2)).toBe(true)
    expect(isRationalPrime(3)).toBe(true)
    expect(isRationalPrime(9)).toBe(false)
    expect(isRationalPrime(1)).toBe(false)
    expect(isRationalPrime(97)).toBe(true)
  })

  it('轴上的高斯素数须是 4k+3 型素数', () => {
    // 3 是 4k+3 型素数 -> 3i, 3 都是高斯素数
    expect(isGaussianPrime(3, 0)).toBe(true)
    expect(isGaussianPrime(0, 3)).toBe(true)
    expect(isGaussianPrime(0, -7)).toBe(true)
    // 2 与 5 分别分歧/分裂，在轴上不是高斯素数
    expect(isGaussianPrime(2, 0)).toBe(false)
    expect(isGaussianPrime(5, 0)).toBe(false)
  })

  it('非轴点：范数为素数时才是高斯素数', () => {
    // 1+i 范数 2（素数）-> 高斯素数
    expect(isGaussianPrime(1, 1)).toBe(true)
    // 2+i 范数 5（素数）-> 高斯素数
    expect(isGaussianPrime(2, 1)).toBe(true)
    // 3+3i 范数 18（非素数）-> 不是
    expect(isGaussianPrime(3, 3)).toBe(false)
    // 原点不是
    expect(isGaussianPrime(0, 0)).toBe(false)
  })

  it('gaussianPrimes 呈四重对称（±a,±b 同时存在）', () => {
    const set = new Set(gaussianPrimes(6).map((g) => `${g.a},${g.b}`))
    expect(set.size).toBeGreaterThan(0)
    for (const key of set) {
      const [a, b] = key.split(',').map(Number)
      expect(set.has(`${-a},${b}`)).toBe(true)
      expect(set.has(`${a},${-b}`)).toBe(true)
      expect(set.has(`${b},${a}`)).toBe(true) // 八重对称：交换 a,b
    }
  })

  it('splitKind 分辨分歧/分裂/惰性', () => {
    expect(splitKind(2)).toBe('ramified')
    expect(splitKind(5)).toBe('split')
    expect(splitKind(13)).toBe('split')
    expect(splitKind(3)).toBe('inert')
    expect(splitKind(7)).toBe('inert')
  })

  it('RANGE 半径都能枚举出高斯素数', () => {
    for (const r of RANGE) {
      expect(gaussianPrimes(r).length).toBeGreaterThan(0)
    }
  })
})
