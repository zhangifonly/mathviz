import { describe, it, expect } from 'vitest'
import {
  position,
  dampingType,
  dampedFrequency,
  sampleCurve,
  ZETA_VALUES,
} from './dampedOscillation'

describe('阻尼振荡', () => {
  it('初始条件 x(0)=1 对三种阻尼都成立', () => {
    for (const zeta of ZETA_VALUES) {
      expect(position(0, zeta, 1)).toBeCloseTo(1, 10)
    }
  })

  it('dampingType 正确区分欠阻尼/临界/过阻尼', () => {
    expect(dampingType(0.2)).toBe('under')
    expect(dampingType(1)).toBe('critical')
    expect(dampingType(2)).toBe('over')
  })

  it('所有情形随时间衰减趋于 0', () => {
    for (const zeta of ZETA_VALUES) {
      const late = Math.abs(position(30, zeta, 1))
      expect(late).toBeLessThan(0.05)
    }
  })

  it('欠阻尼会越过零点（发生振荡），过阻尼不越过', () => {
    const under = sampleCurve(0.2, 1, 20, 400).map((p) => p[1])
    const over = sampleCurve(2, 1, 20, 400).map((p) => p[1])
    const underNeg = under.some((v) => v < -1e-3)
    const overNeg = over.some((v) => v < -1e-3)
    expect(underNeg).toBe(true)
    expect(overNeg).toBe(false)
  })

  it('dampedFrequency 仅欠阻尼为正', () => {
    expect(dampedFrequency(0.2, 1)).toBeGreaterThan(0)
    expect(dampedFrequency(0.2, 1)).toBeCloseTo(Math.sqrt(1 - 0.04), 10)
    expect(dampedFrequency(1, 1)).toBe(0)
    expect(dampedFrequency(2, 1)).toBe(0)
  })

  it('sampleCurve 采样数量正确且首点为初值', () => {
    const c = sampleCurve(1, 1, 20, 400)
    expect(c.length).toBe(401)
    expect(c[0][0]).toBe(0)
    expect(c[0][1]).toBeCloseTo(1, 10)
  })

  it('临界阻尼比同 omega 下比欠阻尼更快静止', () => {
    // 在 t=6 附近临界阻尼残余应很小
    expect(Math.abs(position(6, 1, 1))).toBeLessThan(0.03)
  })
})
