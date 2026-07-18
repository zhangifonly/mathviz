import { describe, it, expect } from 'vitest'
import {
  dot,
  norm,
  projectOnto,
  projectionCoeff,
  residual,
  isOrthogonal,
  dirFromAngle,
  SAMPLES,
} from './orthogonalProjection'

describe('正交投影', () => {
  it('dot 与 norm 计算正确', () => {
    expect(dot({ x: 3, y: 4 }, { x: 3, y: 4 })).toBe(25)
    expect(dot({ x: 1, y: 0 }, { x: 0, y: 1 })).toBe(0)
    expect(norm({ x: 3, y: 4 })).toBe(5)
  })

  it('projectOnto 投到 x 轴只保留水平分量', () => {
    const p = projectOnto({ x: 3, y: 5 }, { x: 1, y: 0 })
    expect(p.x).toBeCloseTo(3)
    expect(p.y).toBeCloseTo(0)
  })

  it('残差与投影方向正交（点积≈0）', () => {
    for (const s of SAMPLES) {
      const v = { x: s.vx, y: s.vy }
      const u = dirFromAngle((s.angleDeg * Math.PI) / 180)
      const r = residual(v, u)
      expect(Math.abs(dot(r, u))).toBeLessThan(1e-9)
      expect(isOrthogonal(r, u)).toBe(true)
    }
  })

  it('投影加残差还原原向量 proj + r = v', () => {
    const v = { x: 2, y: 5 }
    const u = { x: 2, y: 1 }
    const p = projectOnto(v, u)
    const r = residual(v, u)
    expect(p.x + r.x).toBeCloseTo(v.x)
    expect(p.y + r.y).toBeCloseTo(v.y)
  })

  it('投影是直线上离 v 最近的点', () => {
    const v = { x: 1, y: 4 }
    const u = { x: 1, y: 0 }
    const p = projectOnto(v, u)
    const dBest = norm({ x: v.x - p.x, y: v.y - p.y })
    // 直线上任取几个别的点，距离都不小于垂足
    for (const t of [-2, -0.5, 0.5, 3]) {
      const q = { x: t * u.x, y: t * u.y }
      const d = norm({ x: v.x - q.x, y: v.y - q.y })
      expect(d).toBeGreaterThanOrEqual(dBest - 1e-9)
    }
  })

  it('零方向向量退化为零投影，系数为 0', () => {
    expect(projectOnto({ x: 3, y: 3 }, { x: 0, y: 0 })).toEqual({ x: 0, y: 0 })
    expect(projectionCoeff({ x: 3, y: 3 }, { x: 0, y: 0 })).toBe(0)
  })

  it('dirFromAngle 生成单位向量', () => {
    for (const s of SAMPLES) {
      expect(norm(dirFromAngle((s.angleDeg * Math.PI) / 180))).toBeCloseTo(1)
    }
  })
})
