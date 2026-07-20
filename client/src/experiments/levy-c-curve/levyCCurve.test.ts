import { describe, it, expect } from 'vitest'
import { splitSegment, levyPoints, segmentCount, ORDERS } from './levyCCurve'

describe('列维C形曲线', () => {
  it('splitSegment: 水平线段的直角顶点在正上方', () => {
    const m = splitSegment({ x: 0, y: 0 }, { x: 2, y: 0 })
    // 中点 (1,0) 偏移半个边长，等腰直角顶点应在 (1,1)
    expect(m.x).toBeCloseTo(1)
    expect(m.y).toBeCloseTo(1)
  })

  it('splitSegment: 直角顶点到两端距离相等（等腰）', () => {
    const a = { x: 0, y: 0 }
    const b = { x: 4, y: 2 }
    const m = splitSegment(a, b)
    const da = Math.hypot(m.x - a.x, m.y - a.y)
    const db = Math.hypot(m.x - b.x, m.y - b.y)
    expect(da).toBeCloseTo(db)
  })

  it('levyPoints: 0 阶只有起止两点', () => {
    const pts = levyPoints(0, { x: 0, y: 0 }, { x: 1, y: 0 })
    expect(pts).toHaveLength(2)
  })

  it('levyPoints: n 阶顶点数为 2^n + 1，端点保持不变', () => {
    const a = { x: 0, y: 0 }
    const b = { x: 10, y: 0 }
    for (const order of [1, 2, 3, 5]) {
      const pts = levyPoints(order, a, b)
      expect(pts).toHaveLength(Math.pow(2, order) + 1)
      expect(pts[0]).toEqual(a)
      expect(pts[pts.length - 1]).toEqual(b)
    }
  })

  it('segmentCount: 等于 2 的幂', () => {
    expect(segmentCount(0)).toBe(1)
    expect(segmentCount(8)).toBe(256)
  })

  it('ORDERS 各阶都能生成有限坐标', () => {
    for (const order of ORDERS) {
      const pts = levyPoints(order, { x: 0, y: 0 }, { x: 100, y: 0 })
      expect(pts.length).toBe(Math.pow(2, order) + 1)
      expect(pts.every((p) => Number.isFinite(p.x) && Number.isFinite(p.y))).toBe(true)
    }
  })
})
