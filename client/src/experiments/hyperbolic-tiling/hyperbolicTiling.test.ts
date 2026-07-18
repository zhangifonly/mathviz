import { describe, it, expect } from 'vitest'
import {
  tileRadius,
  centerPolygon,
  edgeCircle,
  invert,
  reflectTile,
  generateTiling,
  TILINGS,
} from './hyperbolicTiling'

describe('双曲镶嵌', () => {
  it('tileRadius 落在开单位圆盘内 (0,1)', () => {
    for (const { p, q } of TILINGS) {
      const r = tileRadius(p, q)
      expect(r).toBeGreaterThan(0)
      expect(r).toBeLessThan(1)
    }
  })

  it('centerPolygon 生成 p 个顶点且模长等于 tileRadius', () => {
    const p = 5
    const verts = centerPolygon(p, 4)
    expect(verts.length).toBe(p)
    const r = tileRadius(p, 4)
    for (const v of verts) {
      expect(Math.hypot(v.x, v.y)).toBeCloseTo(r, 6)
    }
  })

  it('edgeCircle 反演圆垂直单位圆: cx^2+cy^2 = r^2+1', () => {
    const verts = centerPolygon(7, 3)
    const c = edgeCircle(verts[0], verts[1])
    expect(c).not.toBeNull()
    if (c) {
      expect(c.cx * c.cx + c.cy * c.cy).toBeCloseTo(c.r * c.r + 1, 6)
      // 顶点落在反演圆上
      expect(Math.hypot(verts[0].x - c.cx, verts[0].y - c.cy)).toBeCloseTo(c.r, 6)
    }
  })

  it('invert 是对合: 反演两次回到原点', () => {
    const c = { cx: 1.3, cy: 0.4, r: 0.9 }
    const p = { x: 0.2, y: -0.1 }
    const back = invert(invert(p, c), c)
    expect(back.x).toBeCloseTo(p.x, 8)
    expect(back.y).toBeCloseTo(p.y, 8)
  })

  it('reflectTile 把中心瓦片翻折出的邻居仍在圆盘内', () => {
    const verts = centerPolygon(5, 4)
    const nb = reflectTile(verts, verts[0], verts[1])
    expect(nb.length).toBe(verts.length)
    for (const v of nb) {
      expect(Math.hypot(v.x, v.y)).toBeLessThan(1.0001)
    }
  })

  it('generateTiling 层数越多瓦片越多且互不重复', () => {
    const t1 = generateTiling(5, 4, 1)
    const t2 = generateTiling(5, 4, 2)
    expect(t1.length).toBeGreaterThan(1)
    expect(t2.length).toBeGreaterThan(t1.length)
    const keys = t2.map((tile) => {
      const cx = tile.reduce((s, v) => s + v.x, 0) / tile.length
      const cy = tile.reduce((s, v) => s + v.y, 0) / tile.length
      return `${cx.toFixed(3)},${cy.toFixed(3)}`
    })
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('所有瓦片顶点都在闭单位圆盘内', () => {
    for (const { p, q } of TILINGS) {
      for (const tile of generateTiling(p, q, 2)) {
        for (const v of tile) {
          expect(Math.hypot(v.x, v.y)).toBeLessThan(1.0001)
        }
      }
    }
  })
})
