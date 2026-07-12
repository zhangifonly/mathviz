import { describe, it, expect } from 'vitest'
import { lissajous, rose, buildFigure, petalCount, FIGURE_INFO } from './lissajous'

describe('利萨茹图形与玫瑰曲线', () => {
  it('lissajous 生成正确点数且全为有限值，幅值不超过 1', () => {
    const pts = lissajous(3, 2, Math.PI / 2, 1000)
    expect(pts.length).toBe(1001)
    for (const p of pts) {
      expect(Math.abs(p.x)).toBeLessThanOrEqual(1 + 1e-9)
      expect(Math.abs(p.y)).toBeLessThanOrEqual(1 + 1e-9)
    }
  })

  it('lissajous 1:1 相位 π/2 是单位圆：x²+y²=1', () => {
    const pts = lissajous(1, 1, Math.PI / 2, 500)
    for (const p of pts) {
      expect(p.x * p.x + p.y * p.y).toBeCloseTo(1, 6)
    }
  })

  it('lissajous 闭合：首尾点重合', () => {
    const pts = lissajous(3, 2, Math.PI / 2, 1000)
    expect(pts[0].x).toBeCloseTo(pts[pts.length - 1].x, 6)
    expect(pts[0].y).toBeCloseTo(pts[pts.length - 1].y, 6)
  })

  it('rose 全为有限值，半径不超过 1', () => {
    const pts = rose(3, 1000)
    for (const p of pts) {
      expect(Number.isFinite(p.x)).toBe(true)
      expect(Math.hypot(p.x, p.y)).toBeLessThanOrEqual(1 + 1e-9)
    }
  })

  it('petalCount: 奇数 k 得 k 瓣，偶数 k 得 2k 瓣', () => {
    expect(petalCount(3)).toBe(3)
    expect(petalCount(5)).toBe(5)
    expect(petalCount(4)).toBe(8)
    expect(petalCount(2)).toBe(4)
  })

  it('buildFigure 覆盖所有 FIGURE_INFO 种类且非空', () => {
    for (const info of FIGURE_INFO) {
      const pts = buildFigure(info.kind)
      expect(pts.length).toBeGreaterThan(10)
      for (const p of pts) expect(Number.isFinite(p.x)).toBe(true)
    }
  })
})
