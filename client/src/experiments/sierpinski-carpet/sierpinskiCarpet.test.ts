import { describe, it, expect } from 'vitest'
import { carpetSquares, squareCount, fractalDimension, LEVELS } from './sierpinskiCarpet'

describe('谢尔宾斯基地毯', () => {
  it('n=0 返回整块正方形', () => {
    const sq = carpetSquares(0)
    expect(sq.length).toBe(1)
    expect(sq[0]).toEqual({ x: 0, y: 0, size: 1 })
  })

  it('n=1 保留 8 个小正方形（挖掉中心）', () => {
    const sq = carpetSquares(1)
    expect(sq.length).toBe(8)
    // 每格边长为 1/3
    for (const s of sq) {
      expect(s.size).toBeCloseTo(1 / 3, 10)
    }
    // 正中心格不应出现
    const center = sq.find((s) => Math.abs(s.x - 1 / 3) < 1e-9 && Math.abs(s.y - 1 / 3) < 1e-9)
    expect(center).toBeUndefined()
  })

  it('每层数量为 8^n', () => {
    expect(carpetSquares(2).length).toBe(64)
    expect(carpetSquares(3).length).toBe(512)
    expect(squareCount(0)).toBe(1)
    expect(squareCount(4)).toBe(4096)
  })

  it('所有正方形都落在原始范围内且不越界', () => {
    const size = 300
    for (const s of carpetSquares(3, 0, 0, size)) {
      expect(s.x).toBeGreaterThanOrEqual(0)
      expect(s.y).toBeGreaterThanOrEqual(0)
      expect(s.x + s.size).toBeLessThanOrEqual(size + 1e-9)
      expect(s.y + s.size).toBeLessThanOrEqual(size + 1e-9)
    }
  })

  it('分数维数约为 1.8928', () => {
    expect(fractalDimension()).toBeCloseTo(1.8927892607, 8)
    expect(fractalDimension()).toBeGreaterThan(1)
    expect(fractalDimension()).toBeLessThan(2)
  })

  it('LEVELS 各层都能生成对应数量', () => {
    for (const n of LEVELS) {
      expect(carpetSquares(n).length).toBe(squareCount(n))
    }
  })
})
