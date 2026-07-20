import { describe, it, expect } from 'vitest'
import {
  kochIterate,
  initialTriangle,
  snowflake,
  perimeter,
  area,
  LEVELS,
  type Point,
} from './kochSnowflake'

describe('科赫雪花', () => {
  it('kochIterate 一次迭代把段数变成 4 倍', () => {
    // 闭合折线：n 个点 = n 条边，一次迭代 -> 4n 个点
    const tri = initialTriangle(0, 0, 100)
    expect(tri.length).toBe(3)
    const once = kochIterate(tri, 1)
    expect(once.length).toBe(12)
    const twice = kochIterate(tri, 2)
    expect(twice.length).toBe(48)
  })

  it('kochIterate 0 次返回原折线', () => {
    const seg: Point[] = [
      { x: 0, y: 0 },
      { x: 9, y: 0 },
    ]
    expect(kochIterate(seg, 0)).toEqual(seg)
  })

  it('单段科赫替换的三等分点位置正确', () => {
    const pts = kochIterate([{ x: 0, y: 0 }, { x: 9, y: 0 }], 1)
    // 起点 + 三个新点 + 原终点在下一段循环里
    expect(pts[0]).toEqual({ x: 0, y: 0 })
    expect(pts[1].x).toBeCloseTo(3)
    expect(pts[1].y).toBeCloseTo(0)
    expect(pts[3].x).toBeCloseTo(6)
    expect(pts[3].y).toBeCloseTo(0)
    // 尖顶在中间且向一侧凸出（y 偏离 0）
    expect(pts[2].x).toBeCloseTo(4.5)
    expect(Math.abs(pts[2].y)).toBeGreaterThan(0)
  })

  it('perimeter 按 (4/3)^n 增长并发散', () => {
    expect(perimeter(3, 0)).toBeCloseTo(9)
    expect(perimeter(3, 1)).toBeCloseTo(12)
    expect(perimeter(3, 2)).toBeCloseTo(16)
    expect(perimeter(3, 10)).toBeGreaterThan(perimeter(3, 5))
  })

  it('area 单调递增且收敛到初始面积的 8/5', () => {
    const a0 = (Math.sqrt(3) / 4) * 3 * 3
    expect(area(3, 0)).toBeCloseTo(a0)
    expect(area(3, 1)).toBeGreaterThan(area(3, 0))
    // 极限 = 8/5 * a0
    expect(area(3, 50)).toBeCloseTo((8 / 5) * a0, 4)
  })

  it('snowflake 顶点数随层数按 3*4^n 增长', () => {
    expect(snowflake(0, 0, 100, 0).length).toBe(3)
    expect(snowflake(0, 0, 100, 1).length).toBe(12)
    expect(snowflake(0, 0, 100, 3).length).toBe(3 * Math.pow(4, 3))
  })

  it('LEVELS 每一层都能生成有意义的雪花', () => {
    for (const n of LEVELS) {
      const pts = snowflake(300, 270, 200, n)
      expect(pts.length).toBe(3 * Math.pow(4, n))
    }
  })
})
