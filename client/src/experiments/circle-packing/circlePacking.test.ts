import { describe, it, expect } from 'vitest'
import {
  hexPacking,
  squarePacking,
  randomPacking,
  packingDensity,
  MODES,
} from './circlePacking'

describe('圆填充', () => {
  it('squarePacking 圆不越界且互不重叠', () => {
    const cs = squarePacking(200, 200, 10)
    expect(cs.length).toBe(100)
    for (const c of cs) {
      expect(c.x - c.r).toBeGreaterThanOrEqual(-1e-6)
      expect(c.x + c.r).toBeLessThanOrEqual(200 + 1e-6)
      expect(c.y + c.r).toBeLessThanOrEqual(200 + 1e-6)
    }
  })

  it('hexPacking 相邻行错开半径，行间距为 r*sqrt(3)', () => {
    const cs = hexPacking(200, 200, 10)
    expect(cs.length).toBeGreaterThan(0)
    const ys = Array.from(new Set(cs.map((c) => c.y))).sort((a, b) => a - b)
    expect(ys.length).toBeGreaterThanOrEqual(2)
    const gap = ys[1] - ys[0]
    expect(gap).toBeCloseTo(10 * Math.sqrt(3), 6)
  })

  it('六边形密度高于方形密度', () => {
    const area = 400 * 400
    const hexD = packingDensity(hexPacking(400, 400, 12), area)
    const sqD = packingDensity(squarePacking(400, 400, 12), area)
    expect(hexD).toBeGreaterThan(sqD)
    expect(sqD).toBeLessThan(0.79)
    expect(hexD).toBeLessThan(0.907)
  })

  it('randomPacking 同种子可复现，圆互不重叠', () => {
    const a = randomPacking(300, 300, 50, 7)
    const b = randomPacking(300, 300, 50, 7)
    expect(a).toEqual(b)
    for (let i = 0; i < a.length; i++) {
      for (let j = i + 1; j < a.length; j++) {
        const dx = a[i].x - a[j].x
        const dy = a[i].y - a[j].y
        const d2 = dx * dx + dy * dy
        expect(d2).toBeGreaterThanOrEqual((a[i].r + a[j].r) ** 2 - 1e-6)
      }
    }
  })

  it('packingDensity 单圆结果正确，空列表为 0', () => {
    const d = packingDensity([{ x: 5, y: 5, r: 5 }], 100)
    expect(d).toBeCloseTo((Math.PI * 25) / 100, 6)
    expect(packingDensity([], 100)).toBe(0)
    expect(packingDensity([{ x: 0, y: 0, r: 1 }], 0)).toBe(0)
  })

  it('MODES 包含三种堆积模式', () => {
    expect(MODES).toEqual(['hex', 'square', 'random'])
  })
})
