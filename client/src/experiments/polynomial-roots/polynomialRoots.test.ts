import { describe, it, expect } from 'vitest'
import { evalPoly, deriv, degree, findRealRoots, SAMPLE_POLYS } from './polynomialRoots'

describe('多项式求根', () => {
  it('evalPoly 霍纳法求值正确', () => {
    // p(x) = 1 + 2x + 3x^2, p(2) = 1 + 4 + 12 = 17
    expect(evalPoly([1, 2, 3], 2)).toBe(17)
    expect(evalPoly([-1, 0, 1], 0)).toBe(-1)
    expect(evalPoly([5], 100)).toBe(5)
  })

  it('deriv 求导系数正确', () => {
    // p = 1 + 2x + 3x^2 => p' = 2 + 6x
    expect(deriv([1, 2, 3])).toEqual([2, 6])
    // 常数导数为 [0]
    expect(deriv([7])).toEqual([0])
  })

  it('degree 忽略最高次零系数', () => {
    expect(degree([-1, 0, 1])).toBe(2)
    expect(degree([3, 0, 0])).toBe(0)
    expect(degree([0, 2, 0, 0])).toBe(1)
  })

  it('findRealRoots 找到二次方程 x^2-1 的两个根', () => {
    const roots = findRealRoots([-1, 0, 1])
    expect(roots.length).toBe(2)
    expect(roots[0]).toBeCloseTo(-1, 4)
    expect(roots[1]).toBeCloseTo(1, 4)
  })

  it('findRealRoots 找到三次方程 x^3-3x 的三个根', () => {
    const roots = findRealRoots([0, -3, 0, 1])
    expect(roots.length).toBe(3)
    expect(roots[0]).toBeCloseTo(-Math.sqrt(3), 3)
    expect(roots[1]).toBeCloseTo(0, 3)
    expect(roots[2]).toBeCloseTo(Math.sqrt(3), 3)
  })

  it('findRealRoots 对含复根的四次方程只返回实根', () => {
    // (x^2-4)(x^2+1): 实根 ±2，另两根为复数
    const roots = findRealRoots(SAMPLE_POLYS[2].coeffs)
    expect(roots.length).toBe(2)
    expect(roots[0]).toBeCloseTo(-2, 3)
    expect(roots[1]).toBeCloseTo(2, 3)
  })

  it('SAMPLE_POLYS 每组都能求出至少一个实根', () => {
    for (const p of SAMPLE_POLYS) {
      expect(findRealRoots(p.coeffs).length).toBeGreaterThanOrEqual(1)
    }
  })

  it('求出的实根代入多项式接近 0', () => {
    for (const p of SAMPLE_POLYS) {
      for (const r of findRealRoots(p.coeffs)) {
        expect(Math.abs(evalPoly(p.coeffs, r))).toBeLessThan(1e-3)
      }
    }
  })
})
