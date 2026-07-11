import { describe, it, expect } from 'vitest'
import {
  parabolaY,
  focus,
  directrixY,
  distanceToFocus,
  distanceToDirectrix,
  tangentSlope,
  reflectVertical,
  reflectionPassesFocusError,
  PARABOLA_OPTIONS,
} from './parabolaOptics'

describe('抛物线与光学', () => {
  it('顶点在原点，y(0)=0', () => {
    expect(parabolaY(0, 1)).toBe(0)
    expect(parabolaY(0, 2)).toBe(0)
  })

  it('x^2 = 4p y 满足：y = x^2/(4p)', () => {
    const p = 1
    for (const x of [1, 2, 3, -4]) {
      const y = parabolaY(x, p)
      expect(x * x).toBeCloseTo(4 * p * y, 10)
    }
  })

  it('焦点 (0,p)、准线 y=-p', () => {
    expect(focus(1.5)).toEqual({ x: 0, y: 1.5 })
    expect(directrixY(1.5)).toBe(-1.5)
  })

  it('准线定义：到焦点距离 = 到准线距离', () => {
    const p = 1.3
    for (const x of [0, 1, -2, 3.5]) {
      expect(distanceToFocus(x, p)).toBeCloseTo(distanceToDirectrix(x, p), 10)
    }
  })

  it('切线斜率 dy/dx = x/(2p)，顶点处水平', () => {
    expect(tangentSlope(0, 1)).toBe(0)
    expect(tangentSlope(4, 2)).toBeCloseTo(1, 10)
  })

  it('竖直入射光反射后为单位向量', () => {
    const r = reflectVertical(3, 1)
    expect(Math.hypot(r.x, r.y)).toBeCloseTo(1, 10)
  })

  it('反射性质：竖直光线反射后精确过焦点（误差≈0）', () => {
    const p = 1
    for (const x of [0.5, 1, 2, 3, -2.5]) {
      expect(reflectionPassesFocusError(x, p)).toBeCloseTo(0, 9)
    }
  })

  it('顶点处反射方向竖直向上（射向焦点）', () => {
    const r = reflectVertical(0, 1)
    expect(r.x).toBeCloseTo(0, 10)
    expect(r.y).toBeCloseTo(1, 10)
  })

  it('PARABOLA_OPTIONS 各项 p 均为正、反射都过焦点', () => {
    for (const opt of PARABOLA_OPTIONS) {
      expect(opt.p).toBeGreaterThan(0)
      expect(reflectionPassesFocusError(2, opt.p)).toBeCloseTo(0, 9)
    }
  })
})
