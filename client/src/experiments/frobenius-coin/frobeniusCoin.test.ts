import { describe, it, expect } from 'vitest'
import {
  gcd,
  isCoprime,
  representable,
  frobeniusNumber,
  COIN_SETS,
} from './frobeniusCoin'

describe('Frobenius 硬币问题', () => {
  it('gcd 与 isCoprime 判定正确', () => {
    expect(gcd(12, 8)).toBe(4)
    expect(gcd(3, 5)).toBe(1)
    expect(isCoprime([3, 5])).toBe(true)
    expect(isCoprime([6, 9, 20])).toBe(true)
    expect(isCoprime([4, 6])).toBe(false)
  })

  it('representable: 面额 3,5 的可凑情况', () => {
    const reach = representable([3, 5], 12)
    expect(reach[0]).toBe(true)
    expect(reach[3]).toBe(true)
    expect(reach[5]).toBe(true)
    expect(reach[8]).toBe(true)
    // 1,2,4,7 无法用 3 和 5 凑出
    expect(reach[1]).toBe(false)
    expect(reach[2]).toBe(false)
    expect(reach[4]).toBe(false)
    expect(reach[7]).toBe(false)
  })

  it('两枚硬币满足闭式 a*b-a-b', () => {
    expect(frobeniusNumber([3, 5])).toBe(3 * 5 - 3 - 5) // 7
    expect(frobeniusNumber([4, 7])).toBe(4 * 7 - 4 - 7) // 17
    expect(frobeniusNumber([2, 3])).toBe(1)
  })

  it('麦乐鸡数 (6,9,20) 的 Frobenius 数为 43', () => {
    expect(frobeniusNumber([6, 9, 20])).toBe(43)
    const reach = representable([6, 9, 20], 60)
    expect(reach[43]).toBe(false)
    // 43 之后全部可凑
    for (let i = 44; i <= 60; i++) expect(reach[i]).toBe(true)
  })

  it('不互质或含 1 的边界情形', () => {
    expect(frobeniusNumber([4, 6])).toBe(Infinity)
    expect(frobeniusNumber([1, 5])).toBe(-1)
  })

  it('COIN_SETS 都能算出有限或特殊 Frobenius 数', () => {
    for (const set of COIN_SETS) {
      const f = frobeniusNumber(set)
      expect(Number.isFinite(f)).toBe(true)
      expect(f).toBeGreaterThan(0)
    }
  })
})
