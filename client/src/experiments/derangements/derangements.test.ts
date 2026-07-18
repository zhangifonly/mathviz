import { describe, it, expect } from 'vitest'
import {
  derangement,
  factorial,
  derangementRatio,
  isDerangement,
  listDerangements,
  INV_E,
  N_VALUES,
} from './derangements'

describe('错排问题', () => {
  it('derangement 前几项符合已知序列', () => {
    // D(0..7) = 1,0,1,2,9,44,265,1854
    const expected = [1, 0, 1, 2, 9, 44, 265, 1854]
    expected.forEach((v, n) => expect(derangement(n)).toBe(v))
  })

  it('derangement 满足递推 D(n)=(n-1)(D(n-1)+D(n-2))', () => {
    for (let n = 2; n <= 12; n++) {
      expect(derangement(n)).toBe((n - 1) * (derangement(n - 1) + derangement(n - 2)))
    }
  })

  it('factorial 正确', () => {
    expect(factorial(0)).toBe(1)
    expect(factorial(1)).toBe(1)
    expect(factorial(5)).toBe(120)
  })

  it('derangementRatio 随 n 增大趋于 1/e', () => {
    const r7 = derangementRatio(7)
    expect(Math.abs(r7 - INV_E)).toBeLessThan(0.001)
    expect(derangementRatio(0)).toBe(1)
    expect(derangementRatio(1)).toBe(0)
  })

  it('isDerangement 判定正确', () => {
    expect(isDerangement([1, 0, 3, 2])).toBe(true)
    expect(isDerangement([0, 1, 2])).toBe(false)
    expect(isDerangement([1, 2, 0])).toBe(true)
  })

  it('listDerangements 数量等于 derangement，且每个都是错排', () => {
    for (const n of N_VALUES) {
      const all = listDerangements(n)
      expect(all.length).toBe(derangement(n))
      for (const p of all) expect(isDerangement(p)).toBe(true)
    }
  })
})
