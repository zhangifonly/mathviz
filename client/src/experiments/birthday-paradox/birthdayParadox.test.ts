import { describe, it, expect } from 'vitest'
import { collisionProb, distinctProb, simulate, GROUP_SIZES } from './birthdayParadox'

describe('生日悖论', () => {
  it('collisionProb 边界：0 或 1 人时概率为 0', () => {
    expect(collisionProb(0)).toBe(0)
    expect(collisionProb(1)).toBe(0)
  })

  it('collisionProb: 超过 365 人必然碰撞（鸽笼原理）', () => {
    expect(collisionProb(366)).toBe(1)
    expect(collisionProb(400)).toBe(1)
  })

  it('collisionProb: 关键人数概率符合经典结论', () => {
    expect(collisionProb(23)).toBeGreaterThan(0.5)
    expect(collisionProb(23)).toBeCloseTo(0.5073, 3)
    expect(collisionProb(70)).toBeGreaterThan(0.999)
  })

  it('collisionProb: 随人数单调不减', () => {
    for (let n = 2; n <= 100; n++) {
      expect(collisionProb(n)).toBeGreaterThanOrEqual(collisionProb(n - 1))
    }
  })

  it('distinctProb 与 collisionProb 互补，和为 1', () => {
    for (const n of GROUP_SIZES) {
      expect(distinctProb(n) + collisionProb(n)).toBeCloseTo(1, 12)
    }
  })

  it('simulate: 同种子可复现，且频率接近理论值', () => {
    const a = simulate(23, 4000, 42)
    const b = simulate(23, 4000, 42)
    expect(a).toBe(b)
    expect(a).toBeGreaterThan(0.4)
    expect(a).toBeLessThan(0.6)
  })

  it('simulate 边界：人数不足或试验为 0 返回 0', () => {
    expect(simulate(1, 100, 1)).toBe(0)
    expect(simulate(23, 0, 1)).toBe(0)
  })

  it('GROUP_SIZES 都能算出合法概率', () => {
    for (const n of GROUP_SIZES) {
      const p = collisionProb(n)
      expect(p).toBeGreaterThanOrEqual(0)
      expect(p).toBeLessThanOrEqual(1)
    }
  })
})
