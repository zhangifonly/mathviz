import { describe, it, expect } from 'vitest'
import {
  triangular, square, pentagonal, figurate, dotsFor, TYPES, N_VALUES,
} from './triangularNumbers'

describe('图形数', () => {
  it('三角形数前几项正确', () => {
    expect([1, 2, 3, 4, 5].map(triangular)).toEqual([1, 3, 6, 10, 15])
    expect(triangular(0)).toBe(0)
  })

  it('正方形数与五边形数前几项正确', () => {
    expect([1, 2, 3, 4].map(square)).toEqual([1, 4, 9, 16])
    expect([1, 2, 3, 4, 5].map(pentagonal)).toEqual([1, 5, 12, 22, 35])
  })

  it('三角形数求和公式 T(n)=1+2+..+n', () => {
    for (let n = 1; n <= 20; n++) {
      let sum = 0
      for (let k = 1; k <= n; k++) sum += k
      expect(triangular(n)).toBe(sum)
    }
  })

  it('相邻三角形数之和是完全平方数 T(n)+T(n-1)=n^2', () => {
    for (let n = 1; n <= 20; n++) {
      expect(triangular(n) + triangular(n - 1)).toBe(square(n))
    }
  })

  it('figurate 按类型分发正确', () => {
    expect(figurate('triangular', 5)).toBe(15)
    expect(figurate('square', 5)).toBe(25)
    expect(figurate('pentagonal', 5)).toBe(35)
  })

  it('dotsFor 点数等于对应图形数', () => {
    for (const type of TYPES) {
      for (const n of N_VALUES) {
        expect(dotsFor(type, n).length).toBe(figurate(type, n))
      }
    }
    expect(dotsFor('triangular', 0)).toEqual([])
  })
})
