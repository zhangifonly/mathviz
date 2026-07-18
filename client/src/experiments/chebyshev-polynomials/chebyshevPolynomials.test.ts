import { describe, it, expect } from 'vitest'
import { chebyshevT, chebyshevRoots, sampleCurve, DEGREES } from './chebyshevPolynomials'

describe('切比雪夫多项式', () => {
  it('低阶多项式与显式公式一致', () => {
    // T0=1, T1=x, T2=2x^2-1, T3=4x^3-3x
    for (const x of [-1, -0.5, 0, 0.3, 1]) {
      expect(chebyshevT(0, x)).toBeCloseTo(1)
      expect(chebyshevT(1, x)).toBeCloseTo(x)
      expect(chebyshevT(2, x)).toBeCloseTo(2 * x * x - 1)
      expect(chebyshevT(3, x)).toBeCloseTo(4 * x * x * x - 3 * x)
    }
  })

  it('端点值 T_n(1)=1, T_n(-1)=(-1)^n', () => {
    for (let n = 0; n <= 6; n++) {
      expect(chebyshevT(n, 1)).toBeCloseTo(1)
      expect(chebyshevT(n, -1)).toBeCloseTo((-1) ** n)
    }
  })

  it('区间内等幅振荡：|T_n(x)| <= 1', () => {
    for (let n = 2; n <= 5; n++) {
      for (const [, y] of sampleCurve(n, 200)) {
        expect(Math.abs(y)).toBeLessThanOrEqual(1 + 1e-9)
      }
    }
  })

  it('chebyshevRoots 返回 n 个根且确为零点', () => {
    for (const n of DEGREES) {
      const roots = chebyshevRoots(n)
      expect(roots.length).toBe(n)
      for (const r of roots) {
        expect(r).toBeGreaterThan(-1)
        expect(r).toBeLessThan(1)
        expect(chebyshevT(n, r)).toBeCloseTo(0)
      }
    }
  })

  it('三角恒等式 T_n(cosθ)=cos(nθ)', () => {
    for (const theta of [0.2, 0.7, 1.1, 2.4]) {
      for (let n = 0; n <= 5; n++) {
        expect(chebyshevT(n, Math.cos(theta))).toBeCloseTo(Math.cos(n * theta))
      }
    }
  })

  it('DEGREES 每个阶数都能采样出曲线', () => {
    for (const n of DEGREES) {
      expect(sampleCurve(n, 50).length).toBe(51)
    }
  })
})
