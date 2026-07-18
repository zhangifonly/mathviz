import { describe, it, expect } from 'vitest'
import { makePoints, cross, convexHull, POINT_COUNTS, type Point } from './convexHull'

describe('凸包算法', () => {
  it('makePoints 生成指定数量点，坐标在范围内', () => {
    const pts = makePoints(20, 1, 600, 480)
    expect(pts.length).toBe(20)
    for (const p of pts) {
      expect(p.x).toBeGreaterThanOrEqual(0)
      expect(p.x).toBeLessThanOrEqual(600)
      expect(p.y).toBeGreaterThanOrEqual(0)
      expect(p.y).toBeLessThanOrEqual(480)
    }
  })

  it('makePoints 同种子可复现，不同种子不同', () => {
    expect(makePoints(10, 42)).toEqual(makePoints(10, 42))
    expect(makePoints(10, 42)).not.toEqual(makePoints(10, 99))
  })

  it('cross 判转向正确', () => {
    const o = { x: 0, y: 0 }
    expect(cross(o, { x: 1, y: 0 }, { x: 0, y: 1 })).toBeGreaterThan(0) // 逆时针
    expect(cross(o, { x: 1, y: 0 }, { x: 0, y: -1 })).toBeLessThan(0) // 顺时针
    expect(cross(o, { x: 1, y: 0 }, { x: 2, y: 0 })).toBe(0) // 共线
  })

  it('正方形+内部点：凸包只保留 4 个角', () => {
    const square: Point[] = [
      { x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 },
      { x: 5, y: 5 }, { x: 3, y: 7 }, { x: 8, y: 2 },
    ]
    const hull = convexHull(square)
    expect(hull.length).toBe(4)
    for (const c of [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }]) {
      expect(hull.some((p) => p.x === c.x && p.y === c.y)).toBe(true)
    }
    // 内部点不在凸包上
    expect(hull.some((p) => p.x === 5 && p.y === 5)).toBe(false)
  })

  it('凸包顶点按逆时针排列（有向面积为正）', () => {
    const hull = convexHull(makePoints(40, 3))
    let area = 0
    for (let i = 0; i < hull.length; i++) {
      const a = hull[i]
      const b = hull[(i + 1) % hull.length]
      area += a.x * b.y - b.x * a.y
    }
    expect(area).toBeGreaterThan(0)
  })

  it('少于 3 个点时原样返回去重结果', () => {
    expect(convexHull([{ x: 1, y: 1 }, { x: 1, y: 1 }]).length).toBe(1)
    expect(convexHull([{ x: 0, y: 0 }, { x: 2, y: 3 }]).length).toBe(2)
  })

  it('POINT_COUNTS 都能生成有效凸包', () => {
    for (const n of POINT_COUNTS) {
      const hull = convexHull(makePoints(n, 5))
      expect(hull.length).toBeGreaterThanOrEqual(3)
      expect(hull.length).toBeLessThanOrEqual(n)
    }
  })
})
