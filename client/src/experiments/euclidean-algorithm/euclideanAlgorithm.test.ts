import { describe, it, expect } from 'vitest'
import { gcdSteps, gcd, extendedGcd, squareTiling, SAMPLES } from './euclideanAlgorithm'

describe('欧几里得算法', () => {
  it('gcdSteps 每步满足 a=q*b+r 且 0<=r<b', () => {
    const steps = gcdSteps(1071, 462)
    expect(steps.length).toBeGreaterThan(0)
    for (const s of steps) {
      expect(s.a).toBe(s.q * s.b + s.r)
      expect(s.r).toBeGreaterThanOrEqual(0)
      expect(s.r).toBeLessThan(s.b)
    }
    // 最后一步的除数即为 gcd
    expect(steps[steps.length - 1].b).toBe(21)
  })

  it('gcd 计算正确，含互质与整除情形', () => {
    expect(gcd(48, 36)).toBe(12)
    expect(gcd(1071, 462)).toBe(21)
    expect(gcd(17, 5)).toBe(1)
    expect(gcd(100, 25)).toBe(25)
    expect(gcd(7, 0)).toBe(7)
  })

  it('extendedGcd 满足裴蜀等式 a*x+b*y=g', () => {
    for (const [a, b] of SAMPLES) {
      const { g, x, y } = extendedGcd(a, b)
      expect(g).toBe(gcd(a, b))
      expect(a * x + b * y).toBe(g)
    }
  })

  it('squareTiling 面积守恒且最小正方形=gcd', () => {
    const a = 48
    const b = 36
    const squares = squareTiling(a, b)
    const area = squares.reduce((sum, s) => sum + s.size * s.size, 0)
    expect(area).toBe(a * b)
    const minSide = Math.min(...squares.map((s) => s.size))
    expect(minSide).toBe(gcd(a, b))
  })

  it('squareTiling 所有正方形在 a×b 边界内', () => {
    const a = 1071
    const b = 462
    for (const s of squareTiling(a, b)) {
      expect(s.x).toBeGreaterThanOrEqual(0)
      expect(s.y).toBeGreaterThanOrEqual(0)
      expect(s.x + s.size).toBeLessThanOrEqual(a)
      expect(s.y + s.size).toBeLessThanOrEqual(b)
    }
  })

  it('gcd 满足交换律，负数取绝对值', () => {
    expect(gcd(36, 48)).toBe(gcd(48, 36))
    expect(gcd(-48, 36)).toBe(12)
    expect(gcd(48, -36)).toBe(12)
  })
})
