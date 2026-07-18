import { describe, it, expect } from 'vitest'
import {
  toVec3, norm, angleBetween, slerp, greatCircleArc,
  sphericalTriangleAngleSum, sphericalExcess, haversine,
  PRESET_POINTS, PRESET_KEYS, EARTH_R,
} from './sphericalGeometry'

describe('球面几何', () => {
  it('toVec3 生成单位向量，极点/赤道方向正确', () => {
    const np = toVec3(90, 0)
    expect(norm(np)).toBeCloseTo(1, 10)
    expect(np.z).toBeCloseTo(1, 10)
    const eq = toVec3(0, 0)
    expect(eq.x).toBeCloseTo(1, 10)
    expect(eq.z).toBeCloseTo(0, 10)
  })

  it('angleBetween: 相隔 90 度经度的赤道点夹角为 90 度', () => {
    const a = toVec3(0, 0)
    const b = toVec3(0, 90)
    expect(angleBetween(a, b)).toBeCloseTo(Math.PI / 2, 10)
  })

  it('slerp 中点在球面上，且到两端等距', () => {
    const a = toVec3(0, 0)
    const b = toVec3(0, 80)
    const m = slerp(a, b, 0.5)
    expect(norm(m)).toBeCloseTo(1, 10)
    expect(angleBetween(a, m)).toBeCloseTo(angleBetween(m, b), 10)
  })

  it('greatCircleArc 返回 n+1 个单位点，首尾为端点', () => {
    const a = toVec3(10, 20)
    const b = toVec3(-30, 100)
    const arc = greatCircleArc(a, b, 32)
    expect(arc.length).toBe(33)
    for (const p of arc) expect(norm(p)).toBeCloseTo(1, 8)
    expect(angleBetween(arc[0], a)).toBeCloseTo(0, 8)
    expect(angleBetween(arc[32], b)).toBeCloseTo(0, 8)
  })

  it('八分之一球面三角形内角和为 270 度，盈余 90 度', () => {
    const [a, b, c] = PRESET_POINTS.octant.map((p) => toVec3(p.lat, p.lon))
    expect(sphericalTriangleAngleSum(a, b, c)).toBeCloseTo(270, 6)
    expect(sphericalExcess(a, b, c)).toBeCloseTo(90, 6)
  })

  it('任意球面三角形内角和恒大于 180 度', () => {
    for (const key of PRESET_KEYS) {
      const [a, b, c] = PRESET_POINTS[key].map((p) => toVec3(p.lat, p.lon))
      expect(sphericalTriangleAngleSum(a, b, c)).toBeGreaterThan(180)
    }
  })

  it('haversine: 同点距离为 0，赤道 90 度经度约为 R*pi/2', () => {
    expect(haversine(0, 0, 0, 0)).toBeCloseTo(0, 10)
    expect(haversine(0, 0, 0, 90)).toBeCloseTo((EARTH_R * Math.PI) / 2, 3)
  })
})
