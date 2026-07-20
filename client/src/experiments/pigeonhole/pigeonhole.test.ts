import { describe, it, expect } from 'vitest'
import { distribute, guaranteedMax, hasCollision, actualMax, SCENARIOS } from './pigeonhole'

describe('鸽巢原理', () => {
  it('distribute 返回长度为 holes 的数组，且总和等于 items', () => {
    const counts = distribute(13, 12, 1)
    expect(counts.length).toBe(12)
    expect(counts.reduce((a, b) => a + b, 0)).toBe(13)
    for (const c of counts) expect(c).toBeGreaterThanOrEqual(0)
  })

  it('distribute 同种子可复现，不同种子结果可不同', () => {
    const a = distribute(20, 6, 42)
    const b = distribute(20, 6, 42)
    expect(a).toEqual(b)
    expect(a.reduce((x, y) => x + y, 0)).toBe(20)
  })

  it('distribute 边界：0 物品或 0 抽屉安全返回', () => {
    expect(distribute(0, 5, 1)).toEqual([0, 0, 0, 0, 0])
    expect(distribute(5, 0, 1)).toEqual([])
  })

  it('guaranteedMax = ceil(items/holes)，且实际最大不小于它', () => {
    expect(guaranteedMax(13, 12)).toBe(2)
    expect(guaranteedMax(10, 3)).toBe(4)
    expect(guaranteedMax(8, 8)).toBe(1)
    const counts = distribute(10, 3, 7)
    expect(actualMax(counts)).toBeGreaterThanOrEqual(guaranteedMax(10, 3))
  })

  it('hasCollision 当且仅当 items > holes', () => {
    expect(hasCollision(13, 12)).toBe(true)
    expect(hasCollision(8, 8)).toBe(false)
    expect(hasCollision(3, 10)).toBe(false)
  })

  it('SCENARIOS 均为合法场景，label 非空', () => {
    for (const s of SCENARIOS) {
      expect(s.items).toBeGreaterThan(0)
      expect(s.holes).toBeGreaterThan(0)
      expect(s.label.length).toBeGreaterThan(0)
      expect(guaranteedMax(s.items, s.holes)).toBeGreaterThanOrEqual(1)
    }
  })
})
