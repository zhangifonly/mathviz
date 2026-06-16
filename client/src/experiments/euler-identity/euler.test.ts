import { describe, it, expect } from 'vitest'
import { eulerPoint, unitCirclePoints, arcPoints, isAtPi } from './euler'

describe('欧拉公式核心数学', () => {
  it('e^(i·0) = 1（实轴正方向）', () => {
    const p = eulerPoint(0)
    expect(p.re).toBeCloseTo(1, 10)
    expect(p.im).toBeCloseTo(0, 10)
  })

  it('e^(iπ) = −1（欧拉恒等式核心）', () => {
    const p = eulerPoint(Math.PI)
    expect(p.re).toBeCloseTo(-1, 10)
    expect(p.im).toBeCloseTo(0, 10)
  })

  it('e^(iπ/2) = i（虚轴正方向）', () => {
    const p = eulerPoint(Math.PI / 2)
    expect(p.re).toBeCloseTo(0, 10)
    expect(p.im).toBeCloseTo(1, 10)
  })

  it('e^(iθ) 始终在单位圆上（模长为 1）', () => {
    for (const theta of [0.3, 1.1, 2.7, 4.5, 6.0]) {
      const p = eulerPoint(theta)
      expect(Math.hypot(p.re, p.im)).toBeCloseTo(1, 10)
    }
  })

  it('unitCirclePoints 首尾闭合且都在单位圆上', () => {
    const { x, y } = unitCirclePoints(100)
    expect(x.length).toBe(101)
    expect(x[0]).toBeCloseTo(x[100], 10)
    expect(y[0]).toBeCloseTo(y[100], 10)
    for (let i = 0; i < x.length; i++) {
      expect(Math.hypot(x[i], y[i])).toBeCloseTo(1, 10)
    }
  })

  it('arcPoints 随 theta 增大而变长', () => {
    const small = arcPoints(0.5)
    const large = arcPoints(Math.PI * 1.8)
    expect(large.x.length).toBeGreaterThan(small.x.length)
  })

  it('isAtPi 在 θ≈π 时为真，远离时为假', () => {
    expect(isAtPi(Math.PI)).toBe(true)
    expect(isAtPi(Math.PI + 0.01)).toBe(true)
    expect(isAtPi(Math.PI / 2)).toBe(false)
    expect(isAtPi(0)).toBe(false)
  })
})
