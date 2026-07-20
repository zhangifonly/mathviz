import { describe, it, expect } from 'vitest'
import {
  isPerfectSquare,
  continuedFractionSqrt,
  fundamentalSolution,
  generateSolutions,
  NS,
} from './pellEquation'

describe('佩尔方程', () => {
  it('isPerfectSquare 正确判断完全平方数', () => {
    expect(isPerfectSquare(4)).toBe(true)
    expect(isPerfectSquare(9)).toBe(true)
    expect(isPerfectSquare(2)).toBe(false)
    expect(isPerfectSquare(7)).toBe(false)
  })

  it('continuedFractionSqrt 展开正确', () => {
    // sqrt(2) = [1; 2,2,...]，一个周期为 [1,2]
    expect(continuedFractionSqrt(2)).toEqual([1, 2])
    // sqrt(3) = [1; 1,2,...]
    expect(continuedFractionSqrt(3)).toEqual([1, 1, 2])
    // sqrt(7) = [2; 1,1,1,4]
    expect(continuedFractionSqrt(7)).toEqual([2, 1, 1, 1, 4])
  })

  it('fundamentalSolution 给出已知基本解', () => {
    expect(fundamentalSolution(2)).toEqual({ x: 3, y: 2 })
    expect(fundamentalSolution(3)).toEqual({ x: 2, y: 1 })
    expect(fundamentalSolution(5)).toEqual({ x: 9, y: 4 })
    expect(fundamentalSolution(13)).toEqual({ x: 649, y: 180 })
  })

  it('fundamentalSolution 完全平方数返回 null', () => {
    expect(fundamentalSolution(4)).toBeNull()
    expect(fundamentalSolution(9)).toBeNull()
  })

  it('generateSolutions 每个解都满足方程（安全整数范围内）', () => {
    for (const N of NS) {
      const sols = generateSolutions(N, 4)
      expect(sols.length).toBe(4)
      for (const s of sols) {
        // 平方乘积超出双精度安全整数后浮点会失真，只校验安全范围内的解
        if (Number.isSafeInteger(s.x * s.x) && Number.isSafeInteger(N * s.y * s.y)) {
          expect(s.x * s.x - N * s.y * s.y).toBe(1)
        }
      }
    }
  })

  it('generateSolutions 解严格递增', () => {
    const sols = generateSolutions(2, 5)
    for (let i = 1; i < sols.length; i++) {
      expect(sols[i].x).toBeGreaterThan(sols[i - 1].x)
      expect(sols[i].y).toBeGreaterThan(sols[i - 1].y)
    }
  })
})
