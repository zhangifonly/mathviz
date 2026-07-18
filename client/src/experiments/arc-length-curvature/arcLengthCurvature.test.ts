import { describe, it, expect } from 'vitest'
import {
  deriv1, deriv2, arcLength, curvature, radiusOfCurvature, CURVES, type ParamCurve,
} from './arcLengthCurvature'

const circle: ParamCurve = CURVES[0] // 半径 2 的圆

describe('弧长与曲率', () => {
  it('deriv1/deriv2 数值微分：sin 的一阶导≈cos，二阶导≈-sin', () => {
    const f = Math.sin
    expect(deriv1(f, 1)).toBeCloseTo(Math.cos(1), 4)
    expect(deriv2(f, 1)).toBeCloseTo(-Math.sin(1), 3)
  })

  it('arcLength：半径 2 的整圆周长≈4π', () => {
    const L = arcLength(circle, 0, 2 * Math.PI, 800)
    expect(L).toBeCloseTo(4 * Math.PI, 2)
  })

  it('arcLength：直线段长度精确（x=t,y=t 从0到1长度为√2）', () => {
    const line: ParamCurve = { id: 'l', name: 'l', x: (t) => t, y: (t) => t, tMin: 0, tMax: 1 }
    expect(arcLength(line, 0, 1, 10)).toBeCloseTo(Math.SQRT2, 6)
  })

  it('curvature：半径 R 的圆曲率≈1/R', () => {
    expect(Math.abs(curvature(circle, 0.7))).toBeCloseTo(0.5, 3)
    expect(Math.abs(curvature(circle, 2.3))).toBeCloseTo(0.5, 3)
  })

  it('radiusOfCurvature：圆的曲率半径≈半径 2', () => {
    expect(radiusOfCurvature(circle, 1.1)).toBeCloseTo(2, 2)
  })

  it('直线曲率为 0，曲率半径为 Infinity', () => {
    const line: ParamCurve = { id: 'l', name: 'l', x: (t) => t, y: (t) => 3 * t, tMin: 0, tMax: 5 }
    expect(Math.abs(curvature(line, 2))).toBeLessThan(1e-4)
    expect(radiusOfCurvature(line, 2)).toBe(Infinity)
  })

  it('CURVES 均可求出有限弧长', () => {
    for (const c of CURVES) {
      const L = arcLength(c, c.tMin, c.tMax, 200)
      expect(L).toBeGreaterThan(0)
      expect(isFinite(L)).toBe(true)
    }
  })
})
