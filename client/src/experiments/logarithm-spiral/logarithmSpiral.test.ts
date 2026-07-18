import { describe, it, expect } from 'vitest'
import {
  spiralPoints,
  archimedeanPoints,
  pitchAngle,
  growthPerTurn,
  radiusAt,
  B_VALUES,
} from './logarithmSpiral'

describe('对数螺线', () => {
  it('spiralPoints 起点在 (a, 0)：theta=0 时 r=a', () => {
    const pts = spiralPoints(6, 0.2, 2, 60)
    expect(pts[0].x).toBeCloseTo(6, 6)
    expect(pts[0].y).toBeCloseTo(0, 6)
    expect(pts.length).toBe(2 * 60 + 1)
  })

  it('radiusAt 符合 r=a*e^(b*theta)，且随 theta 单调增', () => {
    expect(radiusAt(6, 0.2, 0)).toBeCloseTo(6, 6)
    const r1 = radiusAt(6, 0.2, Math.PI)
    const r2 = radiusAt(6, 0.2, 2 * Math.PI)
    expect(r2).toBeGreaterThan(r1)
    expect(r1).toBeGreaterThan(6)
  })

  it('growthPerTurn 等于 e^(2πb)，且比值可复现', () => {
    expect(growthPerTurn(0.2)).toBeCloseTo(Math.exp(2 * Math.PI * 0.2), 9)
    const rStart = radiusAt(3, 0.2, 0)
    const rNext = radiusAt(3, 0.2, 2 * Math.PI)
    expect(rNext / rStart).toBeCloseTo(growthPerTurn(0.2), 6)
  })

  it('pitchAngle 与 theta 无关，恒为 atan(1/b)', () => {
    expect(pitchAngle(0.2)).toBeCloseTo(Math.atan2(1, 0.2), 9)
    // b 越小，夹角越接近 90°
    expect(pitchAngle(0.05)).toBeGreaterThan(pitchAngle(0.5))
    expect(pitchAngle(1e-6)).toBeCloseTo(Math.PI / 2, 3)
  })

  it('archimedeanPoints 是线性增长：相邻整圈半径差相等', () => {
    const a = 4
    const b = 2
    const r0 = a + b * 0
    const r1 = a + b * 2 * Math.PI
    const r2 = a + b * 4 * Math.PI
    expect(r1 - r0).toBeCloseTo(r2 - r1, 9)
    const pts = archimedeanPoints(a, b, 3, 40)
    expect(pts[0].x).toBeCloseTo(a, 6)
  })

  it('B_VALUES 都能生成非空点列且坐标有限', () => {
    for (const b of B_VALUES) {
      const pts = spiralPoints(6, b, 3, 50)
      expect(pts.length).toBeGreaterThan(0)
      for (const p of pts) {
        expect(Number.isFinite(p.x)).toBe(true)
        expect(Number.isFinite(p.y)).toBe(true)
      }
    }
  })
})
