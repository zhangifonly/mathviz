import { describe, it, expect } from 'vitest'
import {
  legendreP,
  innerProduct,
  orthogonalityMatrix,
  sampleCurve,
  DEGREES,
} from './legendrePolynomials'

describe('勒让德多项式', () => {
  it('低阶多项式的解析值正确', () => {
    // P0=1, P1=x, P2=(3x^2-1)/2, P3=(5x^3-3x)/2
    expect(legendreP(0, 0.5)).toBeCloseTo(1, 10)
    expect(legendreP(1, 0.5)).toBeCloseTo(0.5, 10)
    expect(legendreP(2, 0.5)).toBeCloseTo((3 * 0.25 - 1) / 2, 10)
    expect(legendreP(3, 0.7)).toBeCloseTo((5 * 0.343 - 3 * 0.7) / 2, 10)
  })

  it('端点值 P_n(1)=1, P_n(-1)=(-1)^n', () => {
    for (let n = 0; n <= 5; n++) {
      expect(legendreP(n, 1)).toBeCloseTo(1, 8)
      expect(legendreP(n, -1)).toBeCloseTo((-1) ** n, 8)
    }
  })

  it('正交性：不同阶内积近似为 0', () => {
    expect(Math.abs(innerProduct(1, 2))).toBeLessThan(1e-6)
    expect(Math.abs(innerProduct(0, 3))).toBeLessThan(1e-6)
    expect(Math.abs(innerProduct(2, 4))).toBeLessThan(1e-6)
  })

  it('归一化：同阶内积等于 2/(2n+1)', () => {
    for (let n = 0; n <= 4; n++) {
      expect(innerProduct(n, n)).toBeCloseTo(2 / (2 * n + 1), 4)
    }
  })

  it('orthogonalityMatrix 对角非零、非对角近零', () => {
    const M = orthogonalityMatrix(DEGREES)
    for (let i = 0; i < DEGREES.length; i++) {
      for (let j = 0; j < DEGREES.length; j++) {
        if (i === j) expect(Math.abs(M[i][j])).toBeGreaterThan(0.01)
        else expect(Math.abs(M[i][j])).toBeLessThan(1e-6)
      }
    }
  })

  it('sampleCurve 覆盖 [-1,1] 且端点正确', () => {
    const pts = sampleCurve(2, 100)
    expect(pts.length).toBe(101)
    expect(pts[0].x).toBeCloseTo(-1, 10)
    expect(pts[pts.length - 1].x).toBeCloseTo(1, 10)
    expect(pts[pts.length - 1].y).toBeCloseTo(1, 8)
  })

  it('DEGREES 是预期的阶数集合', () => {
    expect(DEGREES).toEqual([1, 2, 3, 4])
  })
})
