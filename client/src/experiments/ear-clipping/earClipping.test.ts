import { describe, it, expect } from 'vitest'
import {
  signedArea2, cross, pointInTriangle, isEar, earClipping,
  starPolygon, POLYGONS, POLYGON_NAMES, type Pt,
} from './earClipping'

const square: Pt[] = [
  { x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 },
]

describe('耳切三角剖分', () => {
  it('signedArea2: 逆时针为正，顺时针为负', () => {
    expect(signedArea2(square)).toBeGreaterThan(0)
    expect(signedArea2([...square].reverse())).toBeLessThan(0)
  })

  it('pointInTriangle: 内部点命中，外部点不命中', () => {
    const a = { x: 0, y: 0 }, b = { x: 10, y: 0 }, c = { x: 0, y: 10 }
    expect(pointInTriangle({ x: 2, y: 2 }, a, b, c)).toBe(true)
    expect(pointInTriangle({ x: 9, y: 9 }, a, b, c)).toBe(false)
    expect(cross(a, b, c)).toBeGreaterThan(0)
  })

  it('isEar: 正方形每个顶点都是耳', () => {
    for (let i = 0; i < square.length; i++) {
      expect(isEar(square, i)).toBe(true)
    }
  })

  it('earClipping: n 边多边形切出 n-2 个三角形', () => {
    for (const name of POLYGON_NAMES) {
      const poly = POLYGONS[name]
      const { triangles } = earClipping(poly)
      expect(triangles.length).toBe(poly.length - 2)
    }
  })

  it('earClipping: 三角形面积之和等于多边形面积', () => {
    const poly = POLYGONS['L形']
    const { triangles } = earClipping(poly)
    const polyArea = Math.abs(signedArea2(poly)) / 2
    const triArea = triangles.reduce(
      (s, t) => s + Math.abs(cross(t.a, t.b, t.c)) / 2, 0,
    )
    expect(triArea).toBeCloseTo(polyArea, 6)
  })

  it('earClipping: 顺时针输入也能正确剖分', () => {
    const cw = [...POLYGONS['L形']].reverse()
    const { triangles } = earClipping(cw)
    expect(triangles.length).toBe(cw.length - 2)
  })

  it('starPolygon: 五角星有 10 个顶点且为凹多边形', () => {
    const star = starPolygon(0, 0, 100, 40, 5)
    expect(star.length).toBe(10)
    // 凹多边形并非所有顶点都为耳
    let ears = 0
    const ccw = signedArea2(star) < 0 ? [...star].reverse() : star
    for (let i = 0; i < ccw.length; i++) if (isEar(ccw, i)) ears++
    expect(ears).toBeLessThan(ccw.length)
  })
})
