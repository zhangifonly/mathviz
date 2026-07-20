import { describe, it, expect } from 'vitest'
import {
  harmonic,
  expectedDraws,
  approxDraws,
  simulate,
  simulateTotal,
  COUPON_COUNTS,
} from './couponCollector'

describe('赠券收集问题', () => {
  it('harmonic 计算调和数正确', () => {
    expect(harmonic(1)).toBeCloseTo(1)
    expect(harmonic(2)).toBeCloseTo(1.5)
    expect(harmonic(3)).toBeCloseTo(1 + 0.5 + 1 / 3)
  })

  it('expectedDraws = n * H(n)', () => {
    expect(expectedDraws(1)).toBeCloseTo(1)
    expect(expectedDraws(2)).toBeCloseTo(3) // 2 * 1.5
    expect(expectedDraws(6)).toBeCloseTo(6 * harmonic(6))
    expect(expectedDraws(0)).toBe(0)
  })

  it('近似 n*ln(n) 小于精确期望且随 n 增长', () => {
    expect(approxDraws(24)).toBeLessThan(expectedDraws(24))
    expect(approxDraws(50)).toBeGreaterThan(approxDraws(10))
  })

  it('simulate 恰好收集到 n 种，进度严格递增', () => {
    const p = simulate(12, 7)
    expect(p.length).toBe(12)
    for (let i = 1; i < p.length; i++) {
      expect(p[i]).toBeGreaterThan(p[i - 1])
    }
    expect(p[0]).toBe(1) // 第一次抽必定是新的
  })

  it('simulate 同种子可复现，不同种子多半不同', () => {
    expect(simulate(12, 42)).toEqual(simulate(12, 42))
    expect(simulateTotal(12, 42)).toBe(simulate(12, 42).slice(-1)[0])
  })

  it('模拟总次数至少为 n，且各档位都能集齐', () => {
    for (const n of COUPON_COUNTS) {
      const total = simulateTotal(n, 3)
      expect(total).toBeGreaterThanOrEqual(n)
    }
  })
})
