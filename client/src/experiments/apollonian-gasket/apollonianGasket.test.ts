import { describe, it, expect } from 'vitest'
import { descartesCurvature, generateGasket, DEPTHS, type Circle } from './apollonianGasket'

// 两圆是否相切（外切或内切），比较圆心距与半径和/差
function tangent(a: Circle, b: Circle, eps = 1e-6): boolean {
  const d = Math.hypot(a.x - b.x, a.y - b.y)
  return Math.abs(d - (a.r + b.r)) < eps || Math.abs(d - Math.abs(a.r - b.r)) < eps
}

describe('阿波罗尼垫片', () => {
  it('descartesCurvature 对 (2,2,3) 解出 -1 与 15', () => {
    const [big, small] = descartesCurvature(2, 2, 3)
    expect(big).toBeCloseTo(15, 6)
    expect(small).toBeCloseTo(-1, 6)
  })

  it('descartesCurvature 满足笛卡尔圆定理恒等式', () => {
    const k1 = 1, k2 = 2, k3 = 3
    for (const k4 of descartesCurvature(k1, k2, k3)) {
      const lhs = (k1 + k2 + k3 + k4) ** 2
      const rhs = 2 * (k1 * k1 + k2 * k2 + k3 * k3 + k4 * k4)
      expect(lhs).toBeCloseTo(rhs, 6)
    }
  })

  it('generateGasket 返回非空且半径递减有界', () => {
    const circles = generateGasket(3)
    expect(circles.length).toBeGreaterThan(5)
    for (const c of circles) {
      expect(c.r).toBeGreaterThan(0)
      expect(c.r).toBeLessThanOrEqual(1 + 1e-9)
      expect(isFinite(c.x) && isFinite(c.y)).toBe(true)
    }
  })

  it('外圆是唯一负曲率的包围圆，半径为 1', () => {
    const circles = generateGasket(3)
    const outer = circles.filter((c) => c.k < 0)
    expect(outer.length).toBe(1)
    expect(outer[0].r).toBeCloseTo(1, 6)
  })

  it('深度越大圆越多（单调不减）', () => {
    const a = generateGasket(2).length
    const b = generateGasket(4).length
    expect(b).toBeGreaterThan(a)
  })

  it('种子四圆两两相切', () => {
    const c = generateGasket(1)
    const [O, A, B, C] = c
    expect(tangent(O, A)).toBe(true)
    expect(tangent(A, B)).toBe(true)
    expect(tangent(A, C)).toBe(true)
    expect(tangent(B, C)).toBe(true)
  })

  it('DEPTHS 每个深度都能生成', () => {
    for (const d of DEPTHS) {
      expect(generateGasket(d).length).toBeGreaterThan(5)
    }
  })
})
