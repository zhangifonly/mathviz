import { describe, it, expect } from 'vitest'
import { rewrite, gosperPoints, ORDERS } from './gosperCurve'

describe('戈斯珀曲线', () => {
  it('rewrite(0) 就是公理 A', () => {
    expect(rewrite(0)).toBe('A')
  })

  it('rewrite(1) 等于 A 规则展开', () => {
    expect(rewrite(1)).toBe('A-B--B+A++AA+B-')
  })

  it('rewrite 每阶前进步数 (A/B 计数) 呈 7 倍增长', () => {
    const count = (s: string) => [...s].filter((c) => c === 'A' || c === 'B').length
    expect(count(rewrite(0))).toBe(1)
    expect(count(rewrite(1))).toBe(7)
    expect(count(rewrite(2))).toBe(49)
    expect(count(rewrite(3))).toBe(343)
  })

  it('gosperPoints 点数 = 前进步数 + 1', () => {
    const count = (s: string) => [...s].filter((c) => c === 'A' || c === 'B').length
    for (const o of [1, 2, 3]) {
      expect(gosperPoints(o).length).toBe(count(rewrite(o)) + 1)
    }
  })

  it('gosperPoints 坐标全部归一化到 [0,1]', () => {
    for (const p of gosperPoints(3)) {
      expect(p.x).toBeGreaterThanOrEqual(0)
      expect(p.x).toBeLessThanOrEqual(1)
      expect(p.y).toBeGreaterThanOrEqual(0)
      expect(p.y).toBeLessThanOrEqual(1)
    }
  })

  it('归一化后至少一个维度铺满 [0,1] 全幅', () => {
    const pts = gosperPoints(3)
    const maxX = Math.max(...pts.map((p) => p.x))
    const maxY = Math.max(...pts.map((p) => p.y))
    expect(Math.max(maxX, maxY)).toBeCloseTo(1, 6)
  })

  it('ORDERS 都能生成非空点列', () => {
    for (const o of ORDERS) {
      expect(gosperPoints(o).length).toBeGreaterThan(1)
    }
  })
})
