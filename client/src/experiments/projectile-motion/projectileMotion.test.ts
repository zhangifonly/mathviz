import { describe, it, expect } from 'vitest'
import { trajectory, range, maxHeight, flightTime, ANGLES } from './projectileMotion'

describe('抛体运动', () => {
  it('range: 45度射程最大，且大于30/60度', () => {
    const v0 = 20
    const r45 = range(v0, 45)
    const r30 = range(v0, 30)
    const r60 = range(v0, 60)
    expect(r45).toBeGreaterThan(r30)
    expect(r45).toBeGreaterThan(r60)
    // v0²/g = 400/9.8
    expect(r45).toBeCloseTo((v0 * v0) / 9.8, 5)
  })

  it('range: 互补角(30/60)射程相等', () => {
    expect(range(20, 30)).toBeCloseTo(range(20, 60), 6)
  })

  it('maxHeight: 90度垂直上抛高度最大且公式正确', () => {
    const v0 = 20
    expect(maxHeight(v0, 90)).toBeCloseTo((v0 * v0) / (2 * 9.8), 5)
    expect(maxHeight(v0, 90)).toBeGreaterThan(maxHeight(v0, 45))
  })

  it('flightTime: 与角度正弦成正比', () => {
    expect(flightTime(20, 90)).toBeCloseTo((2 * 20) / 9.8, 6)
    expect(flightTime(20, 30)).toBeCloseTo((2 * 20 * 0.5) / 9.8, 6)
  })

  it('trajectory: 起点在原点，终点落回地面(y≈0)，中途高度为正', () => {
    const pts = trajectory(20, 45, 9.8, 40)
    expect(pts.length).toBe(41)
    expect(pts[0].x).toBeCloseTo(0, 6)
    expect(pts[0].y).toBeCloseTo(0, 6)
    expect(pts[pts.length - 1].y).toBeCloseTo(0, 5)
    expect(Math.max(...pts.map((p) => p.y))).toBeGreaterThan(0)
  })

  it('trajectory: 落地水平距离等于射程', () => {
    const pts = trajectory(25, 50, 9.8, 60)
    expect(pts[pts.length - 1].x).toBeCloseTo(range(25, 50), 4)
  })

  it('ANGLES 常量包含 30/45/60', () => {
    expect(ANGLES).toEqual([30, 45, 60])
  })
})
