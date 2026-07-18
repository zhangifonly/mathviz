import { describe, it, expect } from 'vitest'
import { gamma, factorial, sampleGammaCurve, SAMPLE_POINTS } from './gammaFunction'

const near = (a: number, b: number, tol = 1e-6) =>
  expect(Math.abs(a - b)).toBeLessThan(tol)

describe('伽马函数', () => {
  it('Γ(n) = (n-1)! 对小整数成立', () => {
    near(gamma(1), 1)
    near(gamma(2), 1)
    near(gamma(3), 2)
    near(gamma(4), 6)
    near(gamma(5), 24)
    near(gamma(6), 120)
  })

  it('Γ(1/2) = √π', () => {
    near(gamma(0.5), Math.sqrt(Math.PI))
  })

  it('递推关系 Γ(x+1) = x·Γ(x)', () => {
    for (const x of [0.7, 1.3, 2.6, 3.9, 5.2]) {
      near(gamma(x + 1), x * gamma(x), 1e-5)
    }
  })

  it('半整数值 Γ(3/2)=√π/2, Γ(5/2)=3√π/4', () => {
    near(gamma(1.5), Math.sqrt(Math.PI) / 2)
    near(gamma(2.5), (3 * Math.sqrt(Math.PI)) / 4)
  })

  it('factorial 与 Γ(n+1) 一致', () => {
    for (let n = 0; n <= 7; n++) {
      near(gamma(n + 1), factorial(n), 1e-4)
    }
  })

  it('sampleGammaCurve 返回 n+1 个点且横坐标递增', () => {
    const pts = sampleGammaCurve(0.1, 5, 40)
    expect(pts.length).toBe(41)
    for (let i = 1; i < pts.length; i++) {
      expect(pts[i][0]).toBeGreaterThan(pts[i - 1][0])
    }
  })

  it('SAMPLE_POINTS 均可求值且为有限正数', () => {
    for (const x of SAMPLE_POINTS) {
      const y = gamma(x)
      expect(Number.isFinite(y)).toBe(true)
      expect(y).toBeGreaterThan(0)
    }
  })
})
