import { describe, it, expect } from 'vitest'
import {
  gcd,
  extendedGcd,
  modInverse,
  modPow,
  chooseE,
  generateKeys,
  encrypt,
  decrypt,
  SAMPLE_PRIMES,
} from './rsaCipher'

describe('RSA 加密', () => {
  it('gcd 与 extendedGcd 计算正确', () => {
    expect(gcd(61 * 53 - 1, 60)).toBe(gcd(3232, 60))
    expect(gcd(12, 18)).toBe(6)
    const [g, x, y] = extendedGcd(240, 46)
    expect(g).toBe(gcd(240, 46))
    expect(240 * x + 46 * y).toBe(g)
  })

  it('modInverse 满足 e*d mod phi = 1', () => {
    const phi = 3120
    const d = modInverse(17, phi)
    expect((17 * d) % phi).toBe(1)
  })

  it('modInverse 对不互质输入抛错', () => {
    expect(() => modInverse(4, 8)).toThrow()
  })

  it('modPow 与朴素幂取模一致', () => {
    expect(modPow(7, 4, 100)).toBe((7 ** 4) % 100)
    expect(modPow(2, 10, 1000)).toBe(24)
    expect(modPow(65, 17, 3233)).toBe(2790)
  })

  it('chooseE 选出的 e 与 phi 互质且小于 phi', () => {
    for (const [p, q] of SAMPLE_PRIMES) {
      const phi = (p - 1) * (q - 1)
      const e = chooseE(phi)
      expect(gcd(e, phi)).toBe(1)
      expect(e).toBeLessThan(phi)
    }
  })

  it('generateKeys 生成自洽的密钥', () => {
    const k = generateKeys(61, 53)
    expect(k.n).toBe(3233)
    expect(k.phi).toBe(3120)
    expect((k.e * k.d) % k.phi).toBe(1)
  })

  it('encrypt/decrypt 对每对素数都可逆', () => {
    for (const [p, q] of SAMPLE_PRIMES) {
      const keys = generateKeys(p, q)
      for (const m of [0, 1, 2, 42, keys.n - 1]) {
        const c = encrypt(m, keys)
        expect(decrypt(c, keys)).toBe(m)
      }
    }
  })
})
