import { describe, it, expect } from 'vitest'
import { secant, finalEstimate, FUNCTIONS, STEP_COUNTS } from './secantMethod'

describe('割线法', () => {
  it('secant 返回指定步数的记录', () => {
    const steps = secant((x) => x * x - 3, 1, 2, 5)
    expect(steps.length).toBe(5)
    for (const s of steps) {
      expect(isFinite(s.xNext)).toBe(true)
    }
  })

  it('每步交点由割线公式确定', () => {
    const fn = (x: number) => x * x - 3
    const steps = secant(fn, 1, 2, 1)
    const s = steps[0]
    // 交点 = b - yb*(b-a)/(yb-ya)
    const expected = s.x1 - s.y1 * (s.x1 - s.x0) / (s.y1 - s.y0)
    expect(s.xNext).toBeCloseTo(expected, 10)
  })

  it('割线法收敛到 x²-3 的根 √3', () => {
    const steps = secant((x) => x * x - 3, 1, 2, 8)
    const root = finalEstimate(steps, 2)
    expect(root).toBeCloseTo(Math.sqrt(3), 6)
  })

  it('割线法收敛到 cos(x)-x 的根', () => {
    const steps = secant((x) => Math.cos(x) - x, 0, 1, 10)
    const root = finalEstimate(steps, 1)
    expect(Math.cos(root) - root).toBeCloseTo(0, 6)
  })

  it('两点函数值相等时提前停止（分母为0）', () => {
    const steps = secant(() => 5, 1, 2, 4)
    expect(steps.length).toBe(0)
  })

  it('finalEstimate 无步时返回 fallback', () => {
    expect(finalEstimate([], 3.14)).toBe(3.14)
  })

  it('内置 FUNCTIONS 都能收敛到各自的根', () => {
    for (const f of FUNCTIONS) {
      const steps = secant(f.fn, f.x0, f.x1, 12)
      const root = finalEstimate(steps, f.x1)
      expect(root).toBeCloseTo(f.root, 3)
    }
  })

  it('STEP_COUNTS 步数都能正常执行', () => {
    for (const n of STEP_COUNTS) {
      expect(secant((x) => x * x - 2, 1, 2, n).length).toBe(n)
    }
  })
})
