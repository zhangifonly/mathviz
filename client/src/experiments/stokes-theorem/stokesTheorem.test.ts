import { describe, it, expect } from 'vitest'
import {
  curlDensity,
  pointInRegion,
  boundaryPoints,
  circulation,
  curlIntegral,
  FIELDS,
  REGIONS,
  type VectorField,
  type Region,
} from './stokesTheorem'

const rotation = FIELDS[0] // (-y, x)，处处旋度为 2
const source = FIELDS[2] // (x, y)，无旋，旋度为 0
const rect = REGIONS[0] as Extract<Region, { type: 'rect' }>
const circle = REGIONS[1] as Extract<Region, { type: 'circle' }>

describe('斯托克斯定理（格林定理）', () => {
  it('旋转场旋度密度处处约等于 2', () => {
    expect(curlDensity(rotation, 0, 0)).toBeCloseTo(2, 4)
    expect(curlDensity(rotation, 1.3, -0.7)).toBeCloseTo(2, 4)
  })

  it('无旋源场旋度密度处处约等于 0', () => {
    expect(curlDensity(source, 0.5, 0.5)).toBeCloseTo(0, 4)
    expect(curlDensity(source, -1, 2)).toBeCloseTo(0, 4)
  })

  it('pointInRegion 判断矩形与圆形内外正确', () => {
    expect(pointInRegion(rect, 0, 0)).toBe(true)
    expect(pointInRegion(rect, 10, 0)).toBe(false)
    expect(pointInRegion(circle, 0, 0)).toBe(true)
    expect(pointInRegion(circle, 3, 0)).toBe(false)
  })

  it('boundaryPoints 首尾闭合且都落在边界附近', () => {
    const p = boundaryPoints(circle, 200)
    expect(p[0].x).toBeCloseTo(p[p.length - 1].x, 6)
    expect(p[0].y).toBeCloseTo(p[p.length - 1].y, 6)
    for (const pt of p) {
      const r = Math.hypot(pt.x - circle.cx, pt.y - circle.cy)
      expect(r).toBeCloseTo(circle.r, 6)
    }
  })

  it('核心不变量：环量 ≈ 旋度二重积分（矩形，旋转场）', () => {
    const c = circulation(rotation, rect, 2000)
    const s = curlIntegral(rotation, rect, 160)
    expect(c).toBeCloseTo(s, 1)
    // 旋转场旋度=2，矩形面积=12，理论值 24
    expect(c).toBeCloseTo(24, 1)
  })

  it('核心不变量：环量 ≈ 旋度二重积分（圆形，非均匀场）', () => {
    const field: VectorField = FIELDS[3] // (0, x³/3)，旋度 = x²
    const c = circulation(field, circle, 4000)
    const s = curlIntegral(field, circle, 200)
    expect(c).toBeCloseTo(s, 0)
  })

  it('无旋场环量与旋度积分均约为 0', () => {
    expect(circulation(source, circle, 2000)).toBeCloseTo(0, 2)
    expect(curlIntegral(source, circle, 160)).toBeCloseTo(0, 2)
  })

  it('常量数组结构完整', () => {
    expect(FIELDS.length).toBeGreaterThanOrEqual(4)
    expect(REGIONS.length).toBe(2)
    for (const f of FIELDS) expect(typeof f.P).toBe('function')
  })
})
