import { describe, it, expect } from 'vitest'
import {
  tangent, catmullRomPoint, catmullRomCurve,
  CONTROL_POINTS, SEGMENT_SAMPLES, type Point,
} from './catmullRom'

const P = (x: number, y: number): Point => ({ x, y })

describe('Catmull-Rom 样条', () => {
  it('tangent 用中心差分估计切线', () => {
    const pts = [P(0, 0), P(10, 0), P(20, 0)]
    // 中间点切线 = (P2 - P0)/2 = (20-0)/2 = 10
    expect(tangent(pts, 1)).toEqual(P(10, 0))
    // 端点用自身夹逼：i=0 -> (P1 - P0)/2
    expect(tangent(pts, 0)).toEqual(P(5, 0))
  })

  it('catmullRomPoint 在 t=0 返回 p1, t=1 返回 p2', () => {
    const p0 = P(0, 0), p1 = P(10, 5), p2 = P(20, 5), p3 = P(30, 0)
    expect(catmullRomPoint(p0, p1, p2, p3, 0)).toEqual(p1)
    expect(catmullRomPoint(p0, p1, p2, p3, 1)).toEqual(p2)
  })

  it('曲线穿过所有控制点（插值性）', () => {
    const pts = [P(0, 0), P(30, 40), P(70, 10), P(100, 60)]
    const curve = catmullRomCurve(pts, 16)
    for (const cp of pts) {
      const hit = curve.some((q) => Math.hypot(q.x - cp.x, q.y - cp.y) < 1e-6)
      expect(hit).toBe(true)
    }
  })

  it('采样点数 = (n-1)*samples + 1', () => {
    const pts = [P(0, 0), P(1, 1), P(2, 0), P(3, 1)]
    const curve = catmullRomCurve(pts, 8)
    expect(curve.length).toBe((pts.length - 1) * 8 + 1)
  })

  it('共线控制点生成的曲线保持共线', () => {
    const pts = [P(0, 0), P(10, 0), P(20, 0), P(30, 0)]
    const curve = catmullRomCurve(pts, 16)
    for (const q of curve) expect(Math.abs(q.y)).toBeLessThan(1e-9)
  })

  it('CONTROL_POINTS 与 SEGMENT_SAMPLES 可用', () => {
    expect(CONTROL_POINTS.length).toBeGreaterThanOrEqual(4)
    for (const s of SEGMENT_SAMPLES) {
      expect(catmullRomCurve(CONTROL_POINTS, s).length).toBeGreaterThan(0)
    }
  })
})
