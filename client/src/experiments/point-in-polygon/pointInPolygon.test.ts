import { describe, it, expect } from 'vitest'
import {
  rayCasting,
  windingNumber,
  insideNonzero,
  POLYGONS,
  POLYGON_KEYS,
  type Pt,
} from './pointInPolygon'

const SQUARE: Pt[] = [
  { x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 },
]

describe('点在多边形内', () => {
  it('射线法：正方形中心在内，远处在外', () => {
    expect(rayCasting(SQUARE, { x: 5, y: 5 })).toBe(true)
    expect(rayCasting(SQUARE, { x: 50, y: 5 })).toBe(false)
    expect(rayCasting(SQUARE, { x: -5, y: 5 })).toBe(false)
  })

  it('环绕数：凸多边形与射线法结果一致', () => {
    for (const p of [
      { x: 5, y: 5 }, { x: 1, y: 1 }, { x: 50, y: 50 }, { x: -3, y: 4 },
    ]) {
      expect(insideNonzero(SQUARE, p)).toBe(rayCasting(SQUARE, p))
    }
  })

  it('环绕数：内部点绕数非零，外部点为零', () => {
    expect(windingNumber(SQUARE, { x: 5, y: 5 })).not.toBe(0)
    expect(windingNumber(SQUARE, { x: 100, y: 100 })).toBe(0)
  })

  it('内置凸多边形：质心在内部（两法一致）', () => {
    const poly = POLYGONS.convex
    const cx = poly.reduce((s, q) => s + q.x, 0) / poly.length
    const cy = poly.reduce((s, q) => s + q.y, 0) / poly.length
    const c = { x: cx, y: cy }
    expect(rayCasting(poly, c)).toBe(true)
    expect(insideNonzero(poly, c)).toBe(true)
  })

  it('自交五角星：中心两法可能不同（偶奇 vs 非零）', () => {
    const star = POLYGONS.star
    const center = { x: 300, y: 250 }
    // 非零规则把星芯算作内部
    expect(insideNonzero(star, center)).toBe(true)
    // 偶奇规则下星芯穿越 2 次为偶=外部，两法结论相反
    expect(rayCasting(star, center)).toBe(false)
    expect(insideNonzero(star, center)).not.toBe(rayCasting(star, center))
  })

  it('所有内置多边形至少 3 个顶点且键齐全', () => {
    for (const k of POLYGON_KEYS) {
      expect(POLYGONS[k].length).toBeGreaterThanOrEqual(3)
    }
  })
})
