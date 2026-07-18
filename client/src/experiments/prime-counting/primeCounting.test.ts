import { describe, it, expect } from 'vitest'
import {
  sieve,
  primePi,
  pnlApprox,
  logIntegral,
  primeRatio,
  UPPER_BOUNDS,
} from './primeCounting'

describe('素数计数与素数定理', () => {
  it('sieve 正确标记合数：0,1,4,6 是合数，2,3,5,7 是素数', () => {
    const c = sieve(10)
    expect(c[0]).toBe(true)
    expect(c[1]).toBe(true)
    expect(c[2]).toBe(false)
    expect(c[3]).toBe(false)
    expect(c[4]).toBe(true)
    expect(c[5]).toBe(false)
    expect(c[6]).toBe(true)
    expect(c[9]).toBe(true)
  })

  it('primePi 已知值正确', () => {
    expect(primePi(1)).toBe(0)
    expect(primePi(2)).toBe(1)
    expect(primePi(10)).toBe(4)
    expect(primePi(100)).toBe(25)
    expect(primePi(1000)).toBe(168)
  })

  it('primePi 单调不减', () => {
    let prev = 0
    for (let x = 2; x <= 200; x++) {
      const cur = primePi(x)
      expect(cur).toBeGreaterThanOrEqual(prev)
      prev = cur
    }
  })

  it('pnlApprox 计算正确且对小值稳健', () => {
    expect(pnlApprox(1)).toBe(0)
    expect(pnlApprox(Math.E)).toBeCloseTo(Math.E, 6)
    expect(pnlApprox(100)).toBeCloseTo(100 / Math.log(100), 6)
  })

  it('logIntegral 比 x/ln(x) 更接近 π(x)', () => {
    const x = 10000
    const pi = primePi(x)
    const li = logIntegral(x)
    const approx = pnlApprox(x)
    expect(Math.abs(li - pi)).toBeLessThan(Math.abs(approx - pi))
  })

  it('primeRatio 随 x 增大趋近 1', () => {
    const r100 = primeRatio(100)
    const r10000 = primeRatio(10000)
    expect(Math.abs(r10000 - 1)).toBeLessThan(Math.abs(r100 - 1))
    expect(r10000).toBeGreaterThan(0.9)
    expect(r10000).toBeLessThan(1.2)
  })

  it('UPPER_BOUNDS 每个上界都能算出正的 π(x)', () => {
    for (const b of UPPER_BOUNDS) {
      expect(primePi(b)).toBeGreaterThan(0)
    }
  })
})
