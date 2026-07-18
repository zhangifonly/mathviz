import { describe, it, expect } from 'vitest'
import {
  catenaryY,
  matchingParabola,
  arcLength,
  solveA,
  sag,
  A_VALUES,
} from './catenary'

describe('悬链线', () => {
  it('catenaryY: 顶点在 x=0 处高度为 a，且左右对称', () => {
    expect(catenaryY(0, 50)).toBeCloseTo(50, 10)
    expect(catenaryY(30, 50)).toBeCloseTo(catenaryY(-30, 50), 10)
    // 离开顶点后必然升高
    expect(catenaryY(30, 50)).toBeGreaterThan(catenaryY(0, 50))
  })

  it('matchingParabola: 顶点与悬链线吻合，且离顶点越远悬链线抬升更快', () => {
    const a = 60
    expect(matchingParabola(0, a)).toBeCloseTo(catenaryY(0, a), 10)
    // 二阶吻合，但 cosh 更"陡"，远处悬链线更高
    expect(catenaryY(120, a)).toBeGreaterThan(matchingParabola(120, a))
  })

  it('arcLength: 满足 2a*sinh(x0/a)，且大于两倍水平距离', () => {
    const a = 50
    const x0 = 80
    expect(arcLength(a, x0)).toBeCloseTo(2 * a * Math.sinh(x0 / a), 8)
    expect(arcLength(a, x0)).toBeGreaterThan(2 * x0)
  })

  it('solveA: 求出的 a 能让弧长回代吻合给定链长', () => {
    const halfSpan = 100
    const length = 260
    const a = solveA(halfSpan, length)
    expect(a).toBeGreaterThan(0)
    expect(arcLength(a, halfSpan)).toBeCloseTo(length, 3)
  })

  it('solveA: 链长不足水平距离时无解，返回 NaN', () => {
    expect(Number.isNaN(solveA(100, 150))).toBe(true)
    expect(Number.isNaN(solveA(100, 200))).toBe(true)
  })

  it('sag: 下垂量非负，且 a 越小同宽度下垂越大', () => {
    const x0 = 100
    expect(sag(50, x0)).toBeGreaterThan(0)
    expect(sag(30, x0)).toBeGreaterThan(sag(80, x0))
  })

  it('A_VALUES 均为正且递增', () => {
    expect(A_VALUES.length).toBeGreaterThanOrEqual(3)
    for (let i = 1; i < A_VALUES.length; i++) {
      expect(A_VALUES[i]).toBeGreaterThan(A_VALUES[i - 1])
    }
  })
})
