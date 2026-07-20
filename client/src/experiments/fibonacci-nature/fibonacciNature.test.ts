import { describe, it, expect } from 'vitest'
import { fibonacci, ratios, phyllotaxis, GOLDEN_ANGLE, ANGLES, SEED_COUNTS } from './fibonacciNature'

describe('斐波那契与自然', () => {
  it('fibonacci 前几项正确', () => {
    expect(fibonacci(0)).toEqual([])
    expect(fibonacci(1)).toEqual([0])
    expect(fibonacci(8)).toEqual([0, 1, 1, 2, 3, 5, 8, 13])
  })

  it('fibonacci 满足递推关系', () => {
    const fib = fibonacci(20)
    for (let i = 2; i < fib.length; i++) {
      expect(fib[i]).toBe(fib[i - 1] + fib[i - 2])
    }
  })

  it('ratios 趋近黄金比 1.618', () => {
    const r = ratios(25)
    const phi = (1 + Math.sqrt(5)) / 2
    expect(r.length).toBeGreaterThan(0)
    expect(Math.abs(r[r.length - 1] - phi)).toBeLessThan(1e-4)
  })

  it('phyllotaxis 数量正确且首个种子在原点', () => {
    const seeds = phyllotaxis(500)
    expect(seeds.length).toBe(500)
    expect(seeds[0].x).toBeCloseTo(0, 6)
    expect(seeds[0].y).toBeCloseTo(0, 6)
  })

  it('phyllotaxis 半径随索引以 sqrt 增长', () => {
    const seeds = phyllotaxis(101, GOLDEN_ANGLE)
    const r100 = Math.hypot(seeds[100].x, seeds[100].y)
    expect(r100).toBeCloseTo(10, 6)
  })

  it('phyllotaxis 不同角度产生不同排布', () => {
    const a = phyllotaxis(50, 137.5)
    const b = phyllotaxis(50, 90)
    expect(a).not.toEqual(b)
  })

  it('常量集合可用', () => {
    expect(ANGLES).toContain(GOLDEN_ANGLE)
    for (const c of SEED_COUNTS) {
      expect(phyllotaxis(c).length).toBe(c)
    }
  })
})
