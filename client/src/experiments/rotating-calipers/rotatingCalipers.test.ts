import { describe, it, expect } from 'vitest'
import {
  makePoints, convexHull, diameter, minAreaRect, cross, dist2, POINT_COUNTS,
} from './rotatingCalipers'

describe('旋转卡壳', () => {
  it('makePoints 生成指定数量点，坐标在带边距范围内且可复现', () => {
    const a = makePoints(24, 600, 480, 5)
    const b = makePoints(24, 600, 480, 5)
    expect(a.length).toBe(24)
    expect(a).toEqual(b)
    for (const p of a) {
      expect(p.x).toBeGreaterThanOrEqual(40)
      expect(p.x).toBeLessThanOrEqual(560)
      expect(p.y).toBeGreaterThanOrEqual(40)
      expect(p.y).toBeLessThanOrEqual(440)
    }
  })

  it('cross 与 dist2 计算正确', () => {
    expect(cross({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 })).toBe(1)
    expect(dist2({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(25)
  })

  it('convexHull: 正方形加内点仍只保留四角，且逆时针无退化', () => {
    const sq = [
      { x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }, { x: 5, y: 5 },
    ]
    const h = convexHull(sq)
    expect(h.length).toBe(4)
    let area2 = 0
    for (let i = 0; i < h.length; i++) {
      const j = (i + 1) % h.length
      area2 += h[i].x * h[j].y - h[j].x * h[i].y
    }
    expect(area2).toBeGreaterThan(0)
  })

  it('diameter: 单位正方形直径为对角线长度平方 200', () => {
    const h = convexHull([{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }])
    const d = diameter(h)
    expect(d.d2).toBe(200)
  })

  it('diameter 与暴力最远点对一致', () => {
    const pts = makePoints(40, 500, 400, 13)
    const h = convexHull(pts)
    let brute = 0
    for (let i = 0; i < h.length; i++) {
      for (let j = i + 1; j < h.length; j++) brute = Math.max(brute, dist2(h[i], h[j]))
    }
    expect(diameter(h).d2).toBe(brute)
  })

  it('minAreaRect: 轴对齐矩形面积恰为宽乘高', () => {
    const h = convexHull([{ x: 0, y: 0 }, { x: 20, y: 0 }, { x: 20, y: 10 }, { x: 0, y: 10 }])
    const r = minAreaRect(h)
    expect(r.corners.length).toBe(4)
    expect(r.area).toBeCloseTo(200, 5)
  })

  it('POINT_COUNTS 都能求出非空凸包', () => {
    for (const n of POINT_COUNTS) {
      const h = convexHull(makePoints(n, 500, 500, 3))
      expect(h.length).toBeGreaterThanOrEqual(3)
    }
  })
})
