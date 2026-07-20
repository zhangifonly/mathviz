import { describe, it, expect } from 'vitest'
import { midpoint, subdivide, chaosGame, LEVELS, MODES, type Triangle } from './sierpinskiTriangle'

const TRI: Triangle = [
  { x: 0, y: 0 },
  { x: 100, y: 0 },
  { x: 50, y: 100 },
]

describe('谢尔宾斯基三角', () => {
  it('midpoint 计算两点中点', () => {
    expect(midpoint({ x: 0, y: 0 }, { x: 10, y: 20 })).toEqual({ x: 5, y: 10 })
  })

  it('subdivide: n=0 返回原三角本身', () => {
    const r = subdivide(TRI, 0)
    expect(r.length).toBe(1)
    expect(r[0]).toEqual(TRI)
  })

  it('subdivide: 第 n 层三角数量为 3^n', () => {
    for (const n of [1, 2, 3, 4]) {
      expect(subdivide(TRI, n).length).toBe(3 ** n)
    }
  })

  it('subdivide: 子三角顶点都落在原三角包围盒内', () => {
    for (const t of subdivide(TRI, 3)) {
      for (const p of t) {
        expect(p.x).toBeGreaterThanOrEqual(0)
        expect(p.x).toBeLessThanOrEqual(100)
        expect(p.y).toBeGreaterThanOrEqual(0)
        expect(p.y).toBeLessThanOrEqual(100)
      }
    }
  })

  it('chaosGame: 生成指定数量的点且落在三角包围盒内', () => {
    const pts = chaosGame(TRI, 500, 7)
    expect(pts.length).toBe(500)
    for (const p of pts) {
      expect(p.x).toBeGreaterThanOrEqual(0)
      expect(p.x).toBeLessThanOrEqual(100)
      expect(p.y).toBeGreaterThanOrEqual(0)
      expect(p.y).toBeLessThanOrEqual(100)
    }
  })

  it('chaosGame: 同种子可复现，不同种子不同', () => {
    expect(chaosGame(TRI, 200, 42)).toEqual(chaosGame(TRI, 200, 42))
    expect(chaosGame(TRI, 200, 42)).not.toEqual(chaosGame(TRI, 200, 99))
  })

  it('LEVELS 与 MODES 常量正确', () => {
    expect(LEVELS).toEqual([1, 2, 3, 4, 5])
    expect(MODES).toEqual(['recursive', 'chaos'])
  })
})
