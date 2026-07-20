import { describe, it, expect } from 'vitest'
import { bisection, FUNCTIONS } from './bisectionMethod'

describe('二分法求根', () => {
  const sqrt2 = (x: number) => x * x - 2

  it('第一步记录初始区间', () => {
    const steps = bisection(sqrt2, 0, 2, 1e-6)
    expect(steps[0].a).toBe(0)
    expect(steps[0].b).toBe(2)
    expect(steps[0].mid).toBe(1)
    expect(steps[0].width).toBe(2)
  })

  it('最终中点逼近 √2', () => {
    const steps = bisection(sqrt2, 0, 2, 1e-6)
    const last = steps[steps.length - 1]
    expect(Math.abs(last.mid - Math.SQRT2)).toBeLessThan(1e-4)
  })

  it('区间宽度每步严格减半', () => {
    const steps = bisection(sqrt2, 0, 2, 1e-9, 20)
    for (let i = 1; i < steps.length; i++) {
      expect(steps[i].width).toBeCloseTo(steps[i - 1].width / 2, 12)
    }
  })

  it('根始终被含在 [a,b] 区间内', () => {
    const steps = bisection(sqrt2, 0, 2, 1e-6)
    for (const s of steps) {
      expect(s.a).toBeLessThanOrEqual(Math.SQRT2)
      expect(s.b).toBeGreaterThanOrEqual(Math.SQRT2)
    }
  })

  it('收紧容差得到更多步、更小误差', () => {
    const coarse = bisection(sqrt2, 0, 2, 1e-2)
    const fine = bisection(sqrt2, 0, 2, 1e-8)
    expect(fine.length).toBeGreaterThan(coarse.length)
    expect(fine[fine.length - 1].width).toBeLessThan(coarse[coarse.length - 1].width)
  })

  it('内置 FUNCTIONS 都能收敛到各自的根', () => {
    for (const f of FUNCTIONS) {
      expect(f.fn(f.a) * f.fn(f.b)).toBeLessThan(0)
      const steps = bisection(f.fn, f.a, f.b, 1e-7)
      const last = steps[steps.length - 1]
      expect(Math.abs(last.mid - f.root)).toBeLessThan(1e-3)
    }
  })
})
