import { describe, it, expect } from 'vitest'
import { factorialMod, isPrime, wilsonCheck, wilsonTable, RANGE } from './wilsonTheorem'

describe('威尔逊定理', () => {
  it('factorialMod 逐步取模，结果落在 [0, n)', () => {
    expect(factorialMod(4, 5)).toBe(4) // 4! = 24, 24 mod 5 = 4
    expect(factorialMod(6, 7)).toBe(6) // 6! = 720, 720 mod 7 = 6
    expect(factorialMod(3, 4)).toBe(2) // 3! = 6, 6 mod 4 = 2
    for (let n = 2; n <= 30; n++) {
      const v = factorialMod(n - 1, n)
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(n)
    }
  })

  it('factorialMod 不溢出（大 n 仍在范围内）', () => {
    const v = factorialMod(96, 97)
    expect(v).toBe(96) // 97 是素数，(97-1)! ≡ -1 ≡ 96
  })

  it('isPrime 正确判定小整数', () => {
    expect([2, 3, 5, 7, 11, 13].every(isPrime)).toBe(true)
    expect([1, 4, 6, 8, 9, 15].some(isPrime)).toBe(false)
  })

  it('wilsonCheck 与真实素性完全一致（2..100）', () => {
    for (let n = 2; n <= 100; n++) {
      expect(wilsonCheck(n)).toBe(isPrime(n))
    }
  })

  it('合数（除4外）多为 (n-1)! ≡ 0', () => {
    expect(factorialMod(8, 9)).toBe(0)
    expect(factorialMod(5, 6)).toBe(0)
    expect(factorialMod(3, 4)).toBe(2) // n=4 特例
  })

  it('wilsonTable 覆盖 2..N，素数行 value=n-1', () => {
    const rows = wilsonTable(20)
    expect(rows.length).toBe(19)
    expect(rows[0].n).toBe(2)
    for (const r of rows) {
      if (r.prime) expect(r.value).toBe(r.n - 1)
    }
  })

  it('RANGE 都能生成非空表', () => {
    for (const n of RANGE) {
      expect(wilsonTable(n).length).toBe(n - 1)
    }
  })
})
