import { describe, it, expect } from 'vitest'
import { cycloid, hypocycloid, epicycloid, gcd, buildCurve, CURVE_INFO } from './cycloid'

describe('旋轮线家族参数方程', () => {
  it('cycloid 生成正确点数且全为有限值', () => {
    const pts = cycloid(1, 2, 400)
    expect(pts.length).toBe(401)
    for (const p of pts) {
      expect(Number.isFinite(p.x)).toBe(true)
      expect(Number.isFinite(p.y)).toBe(true)
    }
  })

  it('cycloid 起点在原点，y 始终非负且最大为 2r', () => {
    const r = 1
    const pts = cycloid(r, 2, 400)
    expect(pts[0].x).toBeCloseTo(0, 6)
    expect(pts[0].y).toBeCloseTo(0, 6)
    for (const p of pts) {
      expect(p.y).toBeGreaterThanOrEqual(-1e-9)
      expect(p.y).toBeLessThanOrEqual(2 * r + 1e-9)
    }
  })

  it('cycloid 拱顶在 t=π 处达到 y=2r', () => {
    const r = 1
    const pts = cycloid(r, 1, 400) // 一拱，t∈[0,2π]，顶点在中间
    const top = Math.max(...pts.map((p) => p.y))
    expect(top).toBeCloseTo(2 * r, 4)
  })

  it('hypocycloid(4,1) 星形线：尖点落在坐标轴上 (±R, 0)/(0, ±R)', () => {
    const pts = hypocycloid(4, 1, 800)
    const maxX = Math.max(...pts.map((p) => p.x))
    expect(maxX).toBeCloseTo(4, 2) // R=4 处有尖点
  })

  it('epicycloid 全为有限值且闭合（首尾接近）', () => {
    const pts = epicycloid(4, 1, 600)
    for (const p of pts) expect(Number.isFinite(p.x)).toBe(true)
    const d = Math.hypot(pts[0].x - pts[pts.length - 1].x, pts[0].y - pts[pts.length - 1].y)
    expect(d).toBeCloseTo(0, 2)
  })

  it('gcd 正确', () => {
    expect(gcd(4, 1)).toBe(1)
    expect(gcd(6, 4)).toBe(2)
    expect(gcd(5, 5)).toBe(5)
    expect(gcd(0, 0)).toBe(1)
  })

  it('buildCurve 覆盖所有 CURVE_INFO 种类且非空', () => {
    for (const info of CURVE_INFO) {
      const pts = buildCurve(info.kind)
      expect(pts.length).toBeGreaterThan(10)
      for (const p of pts) expect(Number.isFinite(p.x)).toBe(true)
    }
  })
})
