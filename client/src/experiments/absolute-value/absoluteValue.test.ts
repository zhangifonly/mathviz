import { describe, it, expect } from 'vitest'
import {
  absValue,
  absFunction,
  vertex,
  samplePoints,
  roots,
  ABSOLUTE_VALUE_OPTIONS,
} from './absoluteValue'

describe('绝对值函数内核', () => {
  it('absValue 处理正负零', () => {
    expect(absValue(5)).toBe(5)
    expect(absValue(-5)).toBe(5)
    expect(absValue(0)).toBe(0)
  })

  it('absFunction 基本形 y=|x| 关于 y 轴对称', () => {
    expect(absFunction(-3, 1, 0, 0)).toBe(3)
    expect(absFunction(3, 1, 0, 0)).toBe(3)
    expect(absFunction(0, 1, 0, 0)).toBe(0)
  })

  it('absFunction 平移与缩放', () => {
    // y = 2|x-2|+1，在 x=2 取顶点值 1
    expect(absFunction(2, 2, 2, 1)).toBe(1)
    // x=4 时 2*|4-2|+1 = 5
    expect(absFunction(4, 2, 2, 1)).toBe(5)
    // 顶点两侧等距点函数值相等
    expect(absFunction(1, 2, 2, 1)).toBe(absFunction(3, 2, 2, 1))
  })

  it('vertex 返回 (h,k)', () => {
    expect(vertex(2, 1)).toEqual({ x: 2, y: 1 })
  })

  it('samplePoints 端点与数量正确', () => {
    const pts = samplePoints(1, 0, 0, -4, 4, 8)
    expect(pts.length).toBe(9)
    expect(pts[0]).toEqual({ x: -4, y: 4 })
    expect(pts[8]).toEqual({ x: 4, y: 4 })
    // 顶点处 y 最小
    const ys = pts.map((p) => p.y)
    expect(Math.min(...ys)).toBe(0)
  })

  it('roots 两个交点', () => {
    // y = |x| - 2 → x = ±2
    const r = roots(1, 0, -2)
    expect(r).toEqual([-2, 2])
  })

  it('roots 顶点恰在 x 轴上时单根', () => {
    // y = |x-3| → 唯一零点 x=3
    expect(roots(1, 3, 0)).toEqual([3])
  })

  it('roots 无解情形（顶点在上方且开口向上）', () => {
    // y = |x| + 1 恒正，无零点
    expect(roots(1, 0, 1)).toEqual([])
  })

  it('roots 开口向下可有解', () => {
    // y = -|x| + 3 → x = ±3
    expect(roots(-1, 0, 3)).toEqual([-3, 3])
  })

  it('ABSOLUTE_VALUE_OPTIONS 均有效且顶点处取极值', () => {
    expect(ABSOLUTE_VALUE_OPTIONS.length).toBeGreaterThan(0)
    for (const opt of ABSOLUTE_VALUE_OPTIONS) {
      expect(opt.a).not.toBe(0)
      expect(opt.label.length).toBeGreaterThan(0)
      // 顶点函数值等于 k
      expect(absFunction(opt.h, opt.a, opt.h, opt.k)).toBe(opt.k)
    }
  })
})
