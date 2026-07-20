import { describe, it, expect } from 'vitest'
import { hilbertD2XY, hilbertPoints, ORDERS } from './hilbertCurve'

describe('希尔伯特曲线', () => {
  it('hilbertD2XY: 起点 d=0 映射到 (0,0)', () => {
    for (const order of ORDERS) {
      expect(hilbertD2XY(order, 0)).toEqual({ x: 0, y: 0 })
    }
  })

  it('hilbertD2XY: 坐标始终落在 [0, 2^order-1] 范围内', () => {
    const order = 5
    const max = (1 << order) - 1
    for (let d = 0; d < (1 << order) * (1 << order); d++) {
      const { x, y } = hilbertD2XY(order, d)
      expect(x).toBeGreaterThanOrEqual(0)
      expect(x).toBeLessThanOrEqual(max)
      expect(y).toBeGreaterThanOrEqual(0)
      expect(y).toBeLessThanOrEqual(max)
    }
  })

  it('hilbertPoints: 点数等于 (2^order)^2', () => {
    for (const order of ORDERS) {
      const n = 1 << order
      expect(hilbertPoints(order).length).toBe(n * n)
    }
  })

  it('hilbertPoints: 是一条双射且连续的曲线（无重复、相邻点曼哈顿距离为1）', () => {
    const order = 4
    const pts = hilbertPoints(order)
    const seen = new Set<string>()
    for (let i = 0; i < pts.length; i++) {
      seen.add(`${pts[i].x},${pts[i].y}`)
      if (i > 0) {
        const md = Math.abs(pts[i].x - pts[i - 1].x) + Math.abs(pts[i].y - pts[i - 1].y)
        expect(md).toBe(1)
      }
    }
    expect(seen.size).toBe(pts.length)
  })

  it('hilbertD2XY: 二阶曲线遍历顺序符合已知 U 形', () => {
    // order=1: 4 个点从左下 U 形展开
    const seq = [0, 1, 2, 3].map((d) => hilbertD2XY(1, d))
    expect(seq).toEqual([
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 0 },
    ])
  })

  it('邻近保持: 一维相邻两点在二维中总是紧邻', () => {
    const pts = hilbertPoints(5)
    for (let i = 1; i < pts.length; i++) {
      const dx = Math.abs(pts[i].x - pts[i - 1].x)
      const dy = Math.abs(pts[i].y - pts[i - 1].y)
      expect(dx + dy).toBe(1)
    }
  })
})
