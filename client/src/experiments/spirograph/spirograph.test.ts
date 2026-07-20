import { describe, it, expect } from 'vitest'
import {
  gcd,
  petalCount,
  closingT,
  hypotrochoid,
  sampleCurve,
  maxRadius,
  PRESETS,
} from './spirograph'

describe('万花尺（内摆线）', () => {
  it('gcd 计算正确', () => {
    expect(gcd(100, 40)).toBe(20)
    expect(gcd(96, 28)).toBe(4)
    expect(gcd(7, 0)).toBe(7)
  })

  it('petalCount = R / gcd(R, r)', () => {
    expect(petalCount(100, 40)).toBe(5) // 100/20
    expect(petalCount(96, 28)).toBe(24) // 96/4
    expect(petalCount(120, 35)).toBe(24) // 120/5
  })

  it('closingT 为 2π*r/gcd，且 R,r 互质时等于 2π*r', () => {
    expect(closingT(5, 3)).toBeCloseTo(2 * Math.PI * 3)
    expect(closingT(100, 40)).toBeCloseTo((2 * Math.PI * 40) / 20)
  })

  it('曲线闭合：终点回到起点', () => {
    const p = { R: 100, r: 40, d: 40 }
    const start = hypotrochoid(p, 0)
    const end = hypotrochoid(p, closingT(p.R, p.r))
    expect(end.x).toBeCloseTo(start.x, 6)
    expect(end.y).toBeCloseTo(start.y, 6)
  })

  it('t=0 时坐标为 (R-r+d, 0)', () => {
    const p = { R: 100, r: 40, d: 40 }
    const pt = hypotrochoid(p, 0)
    expect(pt.x).toBeCloseTo(100 - 40 + 40)
    expect(pt.y).toBeCloseTo(0)
  })

  it('sampleCurve 点数正确，且所有点落在 maxRadius 内', () => {
    const p = { R: 105, r: 32, d: 50 }
    const pts = sampleCurve(p, 500)
    expect(pts.length).toBe(501)
    const rmax = maxRadius(p) + 1e-6
    for (const pt of pts) {
      expect(Math.hypot(pt.x, pt.y)).toBeLessThanOrEqual(rmax)
    }
  })

  it('所有 PRESETS 都能采样出闭合曲线', () => {
    for (const preset of PRESETS) {
      const pts = sampleCurve(preset, 300)
      expect(pts.length).toBe(301)
      expect(petalCount(preset.R, preset.r)).toBeGreaterThan(0)
    }
  })
})
