import { describe, it, expect } from 'vitest'
import { henonStep, iterate, bounds, PARAMS } from './henonMap'

describe('埃农映射', () => {
  it('henonStep 公式正确', () => {
    // x'=1-a*x^2+y, y'=b*x
    const p = henonStep(0, 0, 1.4, 0.3)
    expect(p.x).toBeCloseTo(1)
    expect(p.y).toBeCloseTo(0)
    const q = henonStep(1, 0, 1.4, 0.3)
    expect(q.x).toBeCloseTo(1 - 1.4)
    expect(q.y).toBeCloseTo(0.3)
  })

  it('iterate 返回指定数量的点', () => {
    const pts = iterate(1.4, 0.3, 500)
    expect(pts.length).toBe(500)
  })

  it('iterate 同参数可复现', () => {
    const a = iterate(1.4, 0.3, 200, 0, 0, 50)
    const b = iterate(1.4, 0.3, 200, 0, 0, 50)
    expect(a).toEqual(b)
  })

  it('经典参数下轨道有界（收敛到吸引子而非发散）', () => {
    const pts = iterate(1.4, 0.3, 2000)
    for (const p of pts) {
      expect(Number.isFinite(p.x)).toBe(true)
      expect(Math.abs(p.x)).toBeLessThan(2)
      expect(Math.abs(p.y)).toBeLessThan(1)
    }
  })

  it('y 分量始终等于 b*x_prev（映射的不变量）', () => {
    const a = 1.4
    const b = 0.3
    const pts = iterate(a, b, 100)
    for (let i = 1; i < pts.length; i++) {
      expect(pts[i].y).toBeCloseTo(b * pts[i - 1].x)
    }
  })

  it('bounds 给出正确包围盒', () => {
    const box = bounds([
      { x: -1, y: 2 },
      { x: 3, y: -4 },
      { x: 0, y: 0 },
    ])
    expect(box.minX).toBe(-1)
    expect(box.maxX).toBe(3)
    expect(box.minY).toBe(-4)
    expect(box.maxY).toBe(2)
  })

  it('PARAMS 含经典参数 1.4/0.3', () => {
    expect(PARAMS[0]).toEqual({ a: 1.4, b: 0.3 })
    for (const p of PARAMS) {
      expect(iterate(p.a, p.b, 100).length).toBe(100)
    }
  })
})
