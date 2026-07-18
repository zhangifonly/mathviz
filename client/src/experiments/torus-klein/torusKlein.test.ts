import { describe, it, expect } from 'vitest'
import {
  torusPoint,
  kleinPoint,
  surfacePoint,
  project,
  isOrientable,
  gridCurve,
  SURFACES,
} from './torusKlein'

describe('环面与克莱因瓶', () => {
  it('torusPoint 满足环面隐式方程 (sqrt(x^2+y^2)-R)^2+z^2=r^2', () => {
    const R = 2
    const r = 0.8
    for (const [u, v] of [[0, 0], [1, 2], [3, 5]]) {
      const p = torusPoint(u, v, R, r)
      const rho = Math.hypot(p.x, p.y)
      const lhs = (rho - R) ** 2 + p.z ** 2
      expect(lhs).toBeCloseTo(r * r, 6)
    }
  })

  it('torusPoint 沿 u 与 v 均以 2π 为周期（同向粘合两对边）', () => {
    const a = torusPoint(0.7, 1.3)
    const bu = torusPoint(0.7 + Math.PI * 2, 1.3)
    const bv = torusPoint(0.7, 1.3 + Math.PI * 2)
    expect(bu.x).toBeCloseTo(a.x, 9)
    expect(bv.z).toBeCloseTo(a.z, 9)
  })

  it('kleinPoint u->u+2π 时截面翻转（反向粘合，不是恒等）', () => {
    const v = 1.1
    const a = kleinPoint(0.4, v)
    const b = kleinPoint(0.4 + Math.PI * 2, v)
    // v 方向仍闭合
    const cv = kleinPoint(0.4, v + Math.PI * 2)
    expect(cv.x).toBeCloseTo(a.x, 6)
    // u 绕一圈后不回到同一点（发生翻转）
    const same = Math.abs(a.x - b.x) < 1e-6 && Math.abs(a.z - b.z) < 1e-6
    expect(same).toBe(false)
  })

  it('project 保持原点不变且随角度改变投影', () => {
    const o = project({ x: 0, y: 0, z: 0 }, 0.5, 0.3)
    expect(o.x).toBeCloseTo(0, 9)
    expect(o.y).toBeCloseTo(0, 9)
    const p = { x: 1, y: 0, z: 0 }
    const a = project(p, 0, 0)
    const b = project(p, Math.PI / 2, 0)
    expect(a.x).not.toBeCloseTo(b.x, 3)
  })

  it('isOrientable: 环面可定向、克莱因瓶不可定向', () => {
    expect(isOrientable('torus')).toBe(true)
    expect(isOrientable('klein')).toBe(false)
  })

  it('SURFACES 与 surfacePoint/gridCurve 覆盖两种曲面', () => {
    expect(SURFACES).toEqual(['torus', 'klein'])
    for (const kind of SURFACES) {
      expect(surfacePoint(kind, 0, 0)).toEqual(surfacePoint(kind, 0, 0))
      const curve = gridCurve(kind, 'u', 1, 12)
      expect(curve.length).toBe(13)
    }
  })
})
