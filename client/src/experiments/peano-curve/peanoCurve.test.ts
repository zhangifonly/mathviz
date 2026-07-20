import { describe, it, expect } from 'vitest'
import { peanoLSystem, peanoPoints, pointCount, ORDERS } from './peanoCurve'

describe('皮亚诺曲线', () => {
  it('peanoLSystem 迭代后指令串随阶数增长', () => {
    const a = peanoLSystem(1)
    const b = peanoLSystem(2)
    expect(a.length).toBeGreaterThan(1)
    expect(b.length).toBeGreaterThan(a.length)
    // 只含合法字符
    expect(a).toMatch(/^[XYF+-]+$/)
  })

  it('pointCount 遵循 9^order（3x3 自相似）', () => {
    expect(pointCount(1)).toBe(9)
    expect(pointCount(2)).toBe(81)
    expect(pointCount(3)).toBe(729)
  })

  it('peanoPoints 顶点数等于 pointCount，且互不重复（真填充）', () => {
    for (const o of [1, 2, 3]) {
      const pts = peanoPoints(o)
      expect(pts.length).toBe(pointCount(o))
      const uniq = new Set(pts.map((p) => `${p.x.toFixed(6)},${p.y.toFixed(6)}`))
      expect(uniq.size).toBe(pts.length)
    }
  })

  it('peanoPoints 归一化到 [0,1]x[0,1]', () => {
    const pts = peanoPoints(3)
    for (const p of pts) {
      expect(p.x).toBeGreaterThanOrEqual(0)
      expect(p.x).toBeLessThanOrEqual(1)
      expect(p.y).toBeGreaterThanOrEqual(0)
      expect(p.y).toBeLessThanOrEqual(1)
    }
    // 至少各出现一次极值 0 和 1
    expect(pts.some((p) => p.x === 0)).toBe(true)
    expect(pts.some((p) => p.x === 1 || p.y === 1)).toBe(true)
  })

  it('相邻点为格点单位步长（连续曲线、无跳跃）', () => {
    const pts = peanoPoints(2)
    const step = 1 / 8 // order=2 覆盖 9x9 格点，间隔 1/(9-1)
    for (let i = 1; i < pts.length; i++) {
      const d = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y)
      expect(Math.abs(d - step)).toBeLessThan(1e-9)
    }
  })

  it('ORDERS 每个阶数都能生成非空点列', () => {
    for (const o of ORDERS) {
      expect(peanoPoints(o).length).toBeGreaterThan(0)
    }
  })
})
