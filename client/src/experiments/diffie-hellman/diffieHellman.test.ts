import { describe, it, expect } from 'vitest'
import { modPow, computePublic, computeShared, dhExchange, SAMPLE, PRIVATE_KEYS } from './diffieHellman'

describe('迪菲-赫尔曼密钥交换', () => {
  it('modPow 与直接计算一致（小数）', () => {
    expect(modPow(5, 3, 23)).toBe(125 % 23) // 10
    expect(modPow(2, 10, 1000)).toBe(24)
    expect(modPow(7, 0, 13)).toBe(1)
    expect(modPow(4, 1, 5)).toBe(4)
  })

  it('modPow 对 mod=1 返回 0', () => {
    expect(modPow(9, 9, 1)).toBe(0)
  })

  it('computePublic 就是 g^priv mod p', () => {
    const { p, g } = SAMPLE
    expect(computePublic(g, 6, p)).toBe(modPow(g, 6, p))
    expect(computePublic(g, 6, p)).toBe(8) // 5^6 mod 23 = 8
  })

  it('双方算出的共享密钥必然相同', () => {
    const { p, g } = SAMPLE
    const r = dhExchange(p, g, 6, 15)
    expect(r.sharedAlice).toBe(r.sharedBob)
    expect(r.agree).toBe(true)
    expect(r.sharedAlice).toBe(2) // 经典教科书结果
  })

  it('共享密钥满足 g^(ab) mod p 的对称性', () => {
    const { p, g } = SAMPLE
    for (const a of PRIVATE_KEYS) {
      for (const b of PRIVATE_KEYS) {
        const r = dhExchange(p, g, a, b)
        expect(r.sharedAlice).toBe(r.sharedBob)
        expect(r.sharedAlice).toBe(modPow(g, a * b, p))
      }
    }
  })

  it('computeShared 对称：other^priv 与顺序无关地收敛到同一密钥', () => {
    const { p, g } = SAMPLE
    const A = computePublic(g, 4, p)
    const B = computePublic(g, 7, p)
    expect(computeShared(B, 4, p)).toBe(computeShared(A, 7, p))
  })

  it('SAMPLE 是合法参数，PRIVATE_KEYS 非空且在范围内', () => {
    expect(SAMPLE.p).toBeGreaterThan(SAMPLE.g)
    expect(PRIVATE_KEYS.length).toBeGreaterThan(0)
    for (const k of PRIVATE_KEYS) {
      expect(k).toBeGreaterThan(0)
      expect(k).toBeLessThan(SAMPLE.p)
    }
  })
})
