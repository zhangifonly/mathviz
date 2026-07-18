import { describe, it, expect } from 'vitest'
import {
  powMod,
  powerCycle,
  isPrimitiveRoot,
  findPrimitiveRoots,
  orbitSize,
  PRIMES,
} from './primitiveRoot'

describe('原根', () => {
  it('powMod 计算幂模正确', () => {
    expect(powMod(3, 0, 7)).toBe(1)
    expect(powMod(3, 1, 7)).toBe(3)
    expect(powMod(2, 4, 7)).toBe(2) // 16 mod 7 = 2
    expect(powMod(3, 6, 7)).toBe(1) // 费马小定理 g^(p-1)=1
  })

  it('powerCycle 长度为 p-1 且首项为 1', () => {
    const seq = powerCycle(3, 7)
    expect(seq.length).toBe(6)
    expect(seq[0]).toBe(1)
    // 3 的幂模 7: 1,3,2,6,4,5
    expect(seq).toEqual([1, 3, 2, 6, 4, 5])
  })

  it('isPrimitiveRoot: 3 是模 7 原根, 2 不是', () => {
    expect(isPrimitiveRoot(3, 7)).toBe(true)
    // 2 的幂模 7: 1,2,4,1,... 只覆盖 {1,2,4}
    expect(isPrimitiveRoot(2, 7)).toBe(false)
  })

  it('findPrimitiveRoots: 模 7 原根为 [3,5]', () => {
    expect(findPrimitiveRoots(7)).toEqual([3, 5])
    // 模 11 原根个数应为 phi(10)=4
    expect(findPrimitiveRoots(11).length).toBe(4)
  })

  it('原根 orbitSize=p-1, 非原根 orbitSize<p-1', () => {
    expect(orbitSize(3, 7)).toBe(6)
    expect(orbitSize(2, 7)).toBe(3) // 子群 {1,2,4}
  })

  it('PRIMES 中每个素数都存在原根', () => {
    for (const p of PRIMES) {
      expect(findPrimitiveRoots(p).length).toBeGreaterThan(0)
    }
  })
})
