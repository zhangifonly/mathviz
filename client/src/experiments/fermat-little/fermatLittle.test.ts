import { describe, it, expect } from 'vitest'
import {
  powMod,
  isPrime,
  gcd,
  verifyFermat,
  fermatTest,
  powModTable,
  multiplicativeOrder,
  SAMPLES,
  CARMICHAEL,
} from './fermatLittle'

describe('费马小定理', () => {
  it('powMod 计算模幂正确，且不溢出', () => {
    expect(powMod(2, 10, 1000)).toBe(24) // 1024 mod 1000
    expect(powMod(3, 0, 7)).toBe(1)
    expect(powMod(7, 4, 1)).toBe(0)
    expect(powMod(2, 5, 13)).toBe(6) // 32 mod 13
  })

  it('费马小定理: 素数 p 且互素底数, a^(p-1) ≡ 1', () => {
    for (const p of SAMPLES) {
      for (let a = 1; a < p; a++) {
        expect(powMod(a, p - 1, p)).toBe(1)
        expect(verifyFermat(a, p)).toBe(true)
      }
    }
  })

  it('a^p ≡ a (mod p) 对任意整数成立', () => {
    for (const p of [5, 7, 11]) {
      for (let a = 0; a < 20; a++) {
        expect(powMod(a, p, p)).toBe(a % p)
      }
    }
  })

  it('fermatTest 通过所有真素数，拒绝普通合数', () => {
    expect(fermatTest(97, 2)).toBe(true)
    expect(fermatTest(13, 2)).toBe(true)
    expect(fermatTest(15, 2)).toBe(false)
    expect(fermatTest(21, 2)).toBe(false)
    expect(fermatTest(25, 3)).toBe(false)
  })

  it('卡迈克尔数骗过费马测试: 对所有互素底数都通过', () => {
    for (const n of CARMICHAEL) {
      expect(isPrime(n)).toBe(false)
      for (let a = 2; a < n; a++) {
        if (gcd(a, n) === 1) {
          expect(fermatTest(n, a)).toBe(true)
        }
      }
    }
  })

  it('powModTable 首项为1且长度为p，multiplicativeOrder 整除 p-1', () => {
    const p = 7
    const row = powModTable(3, p)
    expect(row.length).toBe(p)
    expect(row[0]).toBe(1)
    const ord = multiplicativeOrder(3, p)
    expect(ord).toBeGreaterThan(0)
    expect((p - 1) % ord).toBe(0)
  })
})
