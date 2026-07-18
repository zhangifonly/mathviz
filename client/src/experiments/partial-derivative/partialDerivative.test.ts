import { describe, it, expect } from 'vitest'
import {
  partialX,
  partialY,
  gradient,
  gradientMagnitude,
  FUNCTIONS,
  fieldById,
} from './partialDerivative'

describe('偏导数与梯度', () => {
  it('碗 f=x²+y²: ∂f/∂x=2x, ∂f/∂y=2y', () => {
    const f = (x: number, y: number) => x * x + y * y
    expect(partialX(f, 3, 5)).toBeCloseTo(6, 3)
    expect(partialY(f, 3, 5)).toBeCloseTo(10, 3)
  })

  it('鞍面 f=x²−y²: ∂f/∂x=2x, ∂f/∂y=−2y', () => {
    const f = (x: number, y: number) => x * x - y * y
    expect(partialX(f, 2, 4)).toBeCloseTo(4, 3)
    expect(partialY(f, 2, 4)).toBeCloseTo(-8, 3)
  })

  it('gradient 返回 [fx, fy] 两分量', () => {
    const f = (x: number, y: number) => 3 * x + 7 * y
    const g = gradient(f, 1, 1)
    expect(g).toHaveLength(2)
    expect(g[0]).toBeCloseTo(3, 3)
    expect(g[1]).toBeCloseTo(7, 3)
  })

  it('极小值点(原点)梯度接近零', () => {
    const f = (x: number, y: number) => x * x + y * y
    expect(gradientMagnitude(f, 0, 0)).toBeCloseTo(0, 3)
  })

  it('梯度垂直于等高线: 沿梯度方向函数增大最快', () => {
    // 常数场梯度为零；线性场梯度处处相同
    const f = (x: number, y: number) => x * x + y * y
    const [gx, gy] = gradient(f, 1, 0)
    // 在(1,0)处梯度应指向 +x 方向
    expect(gx).toBeGreaterThan(0)
    expect(Math.abs(gy)).toBeLessThan(1e-2)
  })

  it('FUNCTIONS 均可求值且 fieldById 命中', () => {
    for (const d of FUNCTIONS) {
      expect(Number.isFinite(d.f(0.5, 0.5))).toBe(true)
      expect(fieldById(d.id).id).toBe(d.id)
    }
    expect(fieldById('__missing__').id).toBe(FUNCTIONS[0].id)
  })
})
