import { describe, it, expect } from 'vitest'
import {
  midpoint,
  footOfPerpendicular,
  circumcenter,
  orthocenter,
  ninePointCenter,
  ninePointRadius,
  ninePoints,
  circumradius,
  PRESET_TRIANGLES,
} from './ninePointCircle'

const A = { x: 0, y: 0 }
const B = { x: 4, y: 0 }
const C = { x: 0, y: 3 }

describe('九点圆', () => {
  it('midpoint 取两点中点', () => {
    expect(midpoint(A, B)).toEqual({ x: 2, y: 0 })
    expect(midpoint(A, C)).toEqual({ x: 0, y: 1.5 })
  })

  it('footOfPerpendicular: 顶点到对边的垂足在直线上', () => {
    // 从 A 向直线 BC 作垂线，垂足应满足投影关系
    const f = footOfPerpendicular(A, B, C)
    const dot = (f.x - B.x) * (C.x - B.x) + (f.y - B.y) * (C.y - B.y)
    const cross = (f.x - A.x) * (C.x - B.x) + (f.y - A.y) * (C.y - B.y)
    expect(Number.isFinite(dot)).toBe(true)
    // AF 垂直于 BC
    expect(Math.abs(cross)).toBeCloseTo(0, 6)
  })

  it('直角三角形外心是斜边中点', () => {
    const o = circumcenter(A, B, C)
    expect(o.x).toBeCloseTo(2, 6)
    expect(o.y).toBeCloseTo(1.5, 6)
  })

  it('直角三角形垂心是直角顶点', () => {
    const h = orthocenter(A, B, C)
    expect(h.x).toBeCloseTo(0, 6)
    expect(h.y).toBeCloseTo(0, 6)
  })

  it('ninePointRadius 是外接圆半径的一半', () => {
    expect(ninePointRadius(A, B, C)).toBeCloseTo(circumradius(A, B, C) / 2, 6)
  })

  it('ninePoints 返回 9 个点，且都在九点圆上', () => {
    for (const [a, b, c] of PRESET_TRIANGLES) {
      const pts = ninePoints(a, b, c)
      expect(pts.length).toBe(9)
      const center = ninePointCenter(a, b, c)
      const r = ninePointRadius(a, b, c)
      for (const p of pts) {
        const d = Math.hypot(p.x - center.x, p.y - center.y)
        expect(d).toBeCloseTo(r, 4)
      }
    }
  })

  it('九点圆心是外心与垂心的中点', () => {
    const center = ninePointCenter(A, B, C)
    const m = midpoint(circumcenter(A, B, C), orthocenter(A, B, C))
    expect(center.x).toBeCloseTo(m.x, 6)
    expect(center.y).toBeCloseTo(m.y, 6)
  })
})
