import { describe, it, expect } from 'vitest'
import {
  powMod,
  quadraticResidues,
  legendreSymbol,
  isQR,
  squarePairs,
  PRIMES,
} from './quadraticResidue'

describe('二次剩余', () => {
  it('powMod 快速幂取模正确', () => {
    expect(powMod(2, 10, 1000)).toBe(24)
    expect(powMod(3, 0, 7)).toBe(1)
    expect(powMod(5, 3, 13)).toBe(125 % 13)
  })

  it('quadraticResidues: 模7的二次剩余是 {1,2,4}', () => {
    expect(quadraticResidues(7)).toEqual([1, 2, 4])
  })

  it('奇素数恰有 (p-1)/2 个非零二次剩余', () => {
    for (const p of PRIMES) {
      expect(quadraticResidues(p).length).toBe((p - 1) / 2)
    }
  })

  it('legendreSymbol: 欧拉判别法与暴力集合一致', () => {
    const p = 13
    const qr = new Set(quadraticResidues(p))
    for (let a = 1; a < p; a++) {
      const sym = legendreSymbol(a, p)
      expect(sym === 1).toBe(qr.has(a))
      expect(sym === -1).toBe(!qr.has(a))
    }
    expect(legendreSymbol(p, p)).toBe(0)
  })

  it('isQR: 0 与剩余为真，非剩余为假', () => {
    expect(isQR(0, 11)).toBe(true)
    expect(isQR(3, 11)).toBe(true) // 5^2=25=3 mod 11
    expect(isQR(2, 11)).toBe(false)
  })

  it('squarePairs: x 与 p-x 平方相同', () => {
    const p = 11
    const pairs = squarePairs(p)
    expect(pairs.length).toBe(p - 1)
    for (let x = 1; x < p; x++) {
      const a = pairs.find((q) => q.x === x)!.sq
      const b = pairs.find((q) => q.x === p - x)!.sq
      expect(a).toBe(b)
    }
  })
})
