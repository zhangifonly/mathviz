import { describe, it, expect } from 'vitest'
import {
  makePoints,
  triangulate,
  inCircumcircle,
  POINT_COUNTS,
  type Pt,
  type Tri,
} from './delaunayTriangulation'

describe('Delaunay 三角剖分', () => {
  it('makePoints 生成指定数量点，坐标在范围内且可复现', () => {
    const a = makePoints(16, 600, 480, 7)
    const b = makePoints(16, 600, 480, 7)
    const c = makePoints(16, 600, 480, 99)
    expect(a.length).toBe(16)
    expect(a).toEqual(b)
    expect(a).not.toEqual(c)
    for (const p of a) {
      expect(p.x).toBeGreaterThanOrEqual(0)
      expect(p.x).toBeLessThanOrEqual(600)
      expect(p.y).toBeGreaterThanOrEqual(0)
      expect(p.y).toBeLessThanOrEqual(480)
    }
  })

  it('inCircumcircle: 圆内点判为真，圆外点判为假', () => {
    const pts: Pt[] = [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 0, y: 4 },
    ]
    const tri: Tri = [0, 1, 2]
    expect(inCircumcircle(pts, tri, { x: 1, y: 1 })).toBe(true)
    expect(inCircumcircle(pts, tri, { x: 10, y: 10 })).toBe(false)
  })

  it('triangulate: 点数不足返回空', () => {
    expect(triangulate([{ x: 0, y: 0 }, { x: 1, y: 1 }])).toEqual([])
  })

  it('triangulate: n 个点满足欧拉关系三角形数 = 2n-2-h', () => {
    const pts = makePoints(16, 600, 480, 3)
    const tris = triangulate(pts)
    expect(tris.length).toBeGreaterThan(0)
    expect(tris.length).toBeLessThanOrEqual(2 * pts.length - 2)
    for (const t of tris) {
      for (const idx of t) {
        expect(idx).toBeGreaterThanOrEqual(0)
        expect(idx).toBeLessThan(pts.length)
      }
    }
  })

  it('空圆性质: 每个三角形外接圆内不含其他任何点', () => {
    const pts = makePoints(20, 600, 480, 11)
    const tris = triangulate(pts)
    for (const t of tris) {
      for (let i = 0; i < pts.length; i++) {
        if (i === t[0] || i === t[1] || i === t[2]) continue
        expect(inCircumcircle(pts, t, pts[i])).toBe(false)
      }
    }
  })

  it('POINT_COUNTS 都能剖分出三角形', () => {
    for (const n of POINT_COUNTS) {
      const tris = triangulate(makePoints(n, 600, 480, 1))
      expect(tris.length).toBeGreaterThan(0)
    }
  })
})
