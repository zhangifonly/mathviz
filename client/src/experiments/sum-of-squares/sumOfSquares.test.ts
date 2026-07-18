import { describe, it, expect } from 'vitest'
import {
  waysToSumTwoSquares,
  isSumOfTwoSquares,
  sumsInRange,
  countSumsInRange,
  RANGE,
} from './sumOfSquares'

describe('平方和定理', () => {
  it('waysToSumTwoSquares 找出正确表示', () => {
    // 25 = 0^2+5^2 = 3^2+4^2
    expect(waysToSumTwoSquares(25)).toEqual([
      { a: 0, b: 5 },
      { a: 3, b: 4 },
    ])
    // 50 = 1^2+7^2 = 5^2+5^2
    expect(waysToSumTwoSquares(50)).toEqual([
      { a: 1, b: 7 },
      { a: 5, b: 5 },
    ])
  })

  it('waysToSumTwoSquares 验证 a^2+b^2 确实等于 n', () => {
    for (let n = 1; n <= 60; n++) {
      for (const { a, b } of waysToSumTwoSquares(n)) {
        expect(a * a + b * b).toBe(n)
        expect(a).toBeLessThanOrEqual(b)
      }
    }
  })

  it('isSumOfTwoSquares 与枚举结果一致', () => {
    for (let n = 1; n <= 200; n++) {
      const byEnum = waysToSumTwoSquares(n).length > 0
      expect(isSumOfTwoSquares(n)).toBe(byEnum)
    }
  })

  it('费马定理：4k+3 型质数不能表示', () => {
    // 3, 7, 11, 19, 23 是 4k+3 型质数
    for (const p of [3, 7, 11, 19, 23]) {
      expect(isSumOfTwoSquares(p)).toBe(false)
    }
    // 21 = 3*7，两个 4k+3 因子各出现奇数次
    expect(isSumOfTwoSquares(21)).toBe(false)
    // 9 = 3^2，4k+3 因子出现偶数次，可以表示 (0^2+3^2)
    expect(isSumOfTwoSquares(9)).toBe(true)
  })

  it('4k+1 型质数都能表示', () => {
    for (const p of [5, 13, 17, 29, 37, 41]) {
      expect(isSumOfTwoSquares(p)).toBe(true)
    }
  })

  it('sumsInRange 与 countSumsInRange 一致', () => {
    const flags = sumsInRange(RANGE)
    expect(flags.length).toBe(RANGE)
    expect(flags.filter(Boolean).length).toBe(countSumsInRange(RANGE))
  })
})
