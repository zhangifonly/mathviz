import { describe, it, expect } from 'vitest'
import {
  FUNCTIONS,
  fieldById,
  gradient,
  gradMagnitude,
  gradAngle,
  dirDeriv,
} from './directionalDerivative'

const paraboloid = (x: number, y: number) => x * x + y * y

describe('方向导数', () => {
  it('gradient: 抛物面 z=x²+y² 在 (1,1) 处梯度约为 (2,2)', () => {
    const [gx, gy] = gradient(paraboloid, 1, 1)
    expect(gx).toBeCloseTo(2, 3)
    expect(gy).toBeCloseTo(2, 3)
  })

  it('dirDeriv: 沿梯度方向取到最大值 |grad f|', () => {
    const angle = gradAngle(paraboloid, 1, 1)
    const mag = gradMagnitude(paraboloid, 1, 1)
    expect(dirDeriv(paraboloid, 1, 1, angle)).toBeCloseTo(mag, 3)
  })

  it('dirDeriv: 与梯度垂直的方向导数为 0', () => {
    const angle = gradAngle(paraboloid, 1, 1)
    expect(dirDeriv(paraboloid, 1, 1, angle + Math.PI / 2)).toBeCloseTo(0, 3)
  })

  it('dirDeriv: 反方向取到最小值 -|grad f|', () => {
    const angle = gradAngle(paraboloid, 1, 1)
    const mag = gradMagnitude(paraboloid, 1, 1)
    expect(dirDeriv(paraboloid, 1, 1, angle + Math.PI)).toBeCloseTo(-mag, 3)
  })

  it('dirDeriv = grad·u 的一致性（任意角度）', () => {
    const [gx, gy] = gradient(paraboloid, 1, 1)
    for (const a of [0, 0.7, 1.9, 3.3, 5.1]) {
      const expected = gx * Math.cos(a) + gy * Math.sin(a)
      expect(dirDeriv(paraboloid, 1, 1, a)).toBeCloseTo(expected, 6)
    }
  })

  it('fieldById 与 FUNCTIONS: 每个函数可取回且可计算', () => {
    expect(FUNCTIONS.length).toBeGreaterThanOrEqual(3)
    for (const fn of FUNCTIONS) {
      expect(fieldById(fn.id).id).toBe(fn.id)
      expect(Number.isFinite(fn.f(0.5, 0.5))).toBe(true)
    }
    expect(fieldById('nope').id).toBe(FUNCTIONS[0].id)
  })
})
