import { describe, it, expect } from 'vitest'
import { extendedGcd, modInverse, gcd, crt, satisfies, SAMPLES } from './chineseRemainder'

describe('中国剩余定理', () => {
  it('extendedGcd 满足贝祖等式 a*x + b*y = g', () => {
    const cases: [number, number][] = [[240, 46], [35, 15], [3, 5], [7, 1]]
    for (const [a, b] of cases) {
      const [g, x, y] = extendedGcd(a, b)
      expect(a * x + b * y).toBe(g)
      expect(g).toBe(gcd(a, b))
    }
  })

  it('modInverse 满足 a*inv ≡ 1 (mod m)', () => {
    expect((3 * modInverse(3, 7)) % 7).toBe(1)
    expect((35 * modInverse(35, 3)) % 3).toBe(1)
    expect(modInverse(1, 5)).toBe(1)
  })

  it('modInverse 对不互质抛错', () => {
    expect(() => modInverse(2, 4)).toThrow()
  })

  it('物不知数经典解为 23', () => {
    const { x, M } = crt([2, 3, 2], [3, 5, 7])
    expect(x).toBe(23)
    expect(M).toBe(105)
  })

  it('crt 结果满足全部同余条件', () => {
    for (const s of SAMPLES) {
      const { x, M } = crt(s.remainders, s.moduli)
      expect(satisfies(x, s.remainders, s.moduli)).toBe(true)
      expect(x).toBeGreaterThanOrEqual(0)
      expect(x).toBeLessThan(M)
    }
  })

  it('模不互质时 crt 抛错', () => {
    expect(() => crt([1, 2], [4, 6])).toThrow()
  })

  it('周期 M 内解唯一，x+M 也满足条件', () => {
    const { x, M } = crt([2, 3, 2], [3, 5, 7])
    expect(satisfies(x + M, [2, 3, 2], [3, 5, 7])).toBe(true)
    expect(satisfies(x + 1, [2, 3, 2], [3, 5, 7])).toBe(false)
  })
})
