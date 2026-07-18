import { describe, it, expect } from 'vitest'
import { turnSequence, dragonPoints, boundingBox, ITERATIONS } from './dragonCurve'

describe('龙形曲线', () => {
  it('turnSequence 长度为 2^n - 1', () => {
    for (let n = 0; n <= 8; n++) {
      expect(turnSequence(n).length).toBe(Math.pow(2, n) - 1)
    }
  })

  it('turnSequence 前几项符合折叠递推', () => {
    expect(turnSequence(0)).toEqual([])
    expect(turnSequence(1)).toEqual(['L'])
    expect(turnSequence(2)).toEqual(['L', 'L', 'R'])
    expect(turnSequence(3)).toEqual(['L', 'L', 'R', 'L', 'L', 'R', 'R'])
  })

  it('转向序列中点始终为 L（对折中心永远左转）', () => {
    for (let n = 1; n <= 10; n++) {
      const seq = turnSequence(n)
      expect(seq[(seq.length - 1) / 2]).toBe('L')
    }
  })

  it('dragonPoints 点数为 2^n + 1，起点在原点', () => {
    for (let n = 0; n <= 8; n++) {
      const pts = dragonPoints(n, 1)
      expect(pts.length).toBe(Math.pow(2, n) + 1)
      expect(pts[0]).toEqual({ x: 0, y: 0 })
    }
  })

  it('相邻点距离恒为 step（每步等长）', () => {
    const step = 5
    const pts = dragonPoints(6, step)
    for (let i = 1; i < pts.length; i++) {
      const d = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y)
      expect(d).toBeCloseTo(step, 6)
    }
  })

  it('所有折线段都是水平或垂直的单位轴向', () => {
    const pts = dragonPoints(7, 1)
    for (let i = 1; i < pts.length; i++) {
      const dx = Math.round(pts[i].x - pts[i - 1].x)
      const dy = Math.round(pts[i].y - pts[i - 1].y)
      expect(Math.abs(dx) + Math.abs(dy)).toBe(1)
    }
  })

  it('boundingBox 覆盖全部点', () => {
    const pts = dragonPoints(8, 2)
    const box = boundingBox(pts)
    for (const p of pts) {
      expect(p.x).toBeGreaterThanOrEqual(box.minX)
      expect(p.x).toBeLessThanOrEqual(box.maxX)
      expect(p.y).toBeGreaterThanOrEqual(box.minY)
      expect(p.y).toBeLessThanOrEqual(box.maxY)
    }
    expect(box.width).toBeGreaterThan(0)
    expect(box.height).toBeGreaterThan(0)
  })

  it('ITERATIONS 都能生成有效点列', () => {
    for (const n of ITERATIONS) {
      const pts = dragonPoints(n, 1)
      expect(pts.length).toBe(Math.pow(2, n) + 1)
    }
  })
})
