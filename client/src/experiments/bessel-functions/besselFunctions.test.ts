import { describe, it, expect } from 'vitest'
import { factorial, besselJ, besselZeros, sampleBessel, ORDERS } from './besselFunctions'

describe('贝塞尔函数', () => {
  it('factorial 计算正确', () => {
    expect(factorial(0)).toBe(1)
    expect(factorial(1)).toBe(1)
    expect(factorial(5)).toBe(120)
  })

  it('besselJ 在 x=0 处：J_0=1，J_n=0 (n>=1)', () => {
    expect(besselJ(0, 0)).toBeCloseTo(1, 6)
    expect(besselJ(1, 0)).toBeCloseTo(0, 6)
    expect(besselJ(2, 0)).toBeCloseTo(0, 6)
  })

  it('besselJ 与已知数值吻合', () => {
    // J_0(1) ≈ 0.7651976, J_1(1) ≈ 0.4400506
    expect(besselJ(0, 1)).toBeCloseTo(0.7651976, 5)
    expect(besselJ(1, 1)).toBeCloseTo(0.4400506, 5)
    // J_0(2) ≈ 0.2238908
    expect(besselJ(0, 2)).toBeCloseTo(0.2238908, 5)
  })

  it('besselZeros 前几个 J_0 零点吻合已知值', () => {
    const z = besselZeros(0, 3)
    expect(z.length).toBe(3)
    expect(z[0]).toBeCloseTo(2.4048, 2)
    expect(z[1]).toBeCloseTo(5.5201, 2)
    expect(z[2]).toBeCloseTo(8.6537, 2)
  })

  it('besselZeros: J_n 处的值确实接近 0', () => {
    for (const n of ORDERS) {
      for (const x of besselZeros(n, 3)) {
        expect(Math.abs(besselJ(n, x))).toBeLessThan(1e-3)
      }
    }
  })

  it('sampleBessel 返回有序采样且起点符合 J_n(0)', () => {
    const pts = sampleBessel(0, 20, 100)
    expect(pts.length).toBe(101)
    expect(pts[0].x).toBe(0)
    expect(pts[0].y).toBeCloseTo(1, 6)
    expect(pts[pts.length - 1].x).toBeCloseTo(20, 6)
  })

  it('ORDERS 每个阶数都能采样', () => {
    for (const n of ORDERS) {
      expect(sampleBessel(n, 10, 50).length).toBe(51)
    }
  })
})
