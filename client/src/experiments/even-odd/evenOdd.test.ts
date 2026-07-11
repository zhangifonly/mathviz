import { describe, it, expect } from 'vitest'
import {
  isEven,
  isOdd,
  isDivisible,
  parity,
  addParity,
  mulParity,
  buildGrid,
  countDivisible,
  DIVISOR_OPTIONS,
} from './evenOdd'

describe('奇偶数与整除', () => {
  it('isEven / isOdd 基本判定（含 0 与负数）', () => {
    expect(isEven(0)).toBe(true)
    expect(isEven(4)).toBe(true)
    expect(isEven(-6)).toBe(true)
    expect(isOdd(7)).toBe(true)
    expect(isOdd(-3)).toBe(true)
    expect(isOdd(0)).toBe(false)
  })

  it('isDivisible：除数为 0 返回 false，余数为 0 才整除', () => {
    expect(isDivisible(12, 3)).toBe(true)
    expect(isDivisible(13, 3)).toBe(false)
    expect(isDivisible(10, 0)).toBe(false)
  })

  it('奇偶恒等式：偶+偶=偶，奇+奇=偶，奇+偶=奇', () => {
    expect(addParity(2, 4)).toBe(0)
    expect(addParity(3, 5)).toBe(0)
    expect(addParity(3, 4)).toBe(1)
  })

  it('奇偶恒等式：奇*奇=奇，其余情况积为偶', () => {
    expect(mulParity(3, 5)).toBe(1)
    expect(mulParity(2, 5)).toBe(0)
    expect(mulParity(2, 4)).toBe(0)
  })

  it('parity 与 isEven 一致', () => {
    for (let n = -5; n <= 5; n++) {
      expect(parity(n)).toBe(isEven(n) ? 0 : 1)
    }
  })

  it('buildGrid 标注整除情况正确', () => {
    const grid = buildGrid(6, 2)
    expect(grid.length).toBe(6)
    expect(grid[0]).toEqual({ n: 1, remainder: 1, divisible: false })
    expect(grid[1]).toEqual({ n: 2, remainder: 0, divisible: true })
    // 偶数（被 2 整除）应为 2,4,6
    expect(grid.filter((c) => c.divisible).map((c) => c.n)).toEqual([2, 4, 6])
  })

  it('countDivisible 等于 floor(count/divisor)', () => {
    expect(countDivisible(100, 2)).toBe(50)
    expect(countDivisible(100, 3)).toBe(33)
    expect(countDivisible(100, 5)).toBe(20)
    // 与 buildGrid 交叉验证
    const grid = buildGrid(50, 5)
    expect(grid.filter((c) => c.divisible).length).toBe(countDivisible(50, 5))
  })

  it('DIVISOR_OPTIONS 都能正常生成有效数格', () => {
    for (const opt of DIVISOR_OPTIONS) {
      const grid = buildGrid(30, opt.divisor)
      expect(grid.length).toBe(30)
      for (const c of grid) {
        expect(c.remainder).toBeGreaterThanOrEqual(0)
        expect(c.remainder).toBeLessThan(opt.divisor)
        expect(c.divisible).toBe(c.remainder === 0)
      }
    }
  })
})
