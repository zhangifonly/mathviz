import { describe, it, expect } from 'vitest'
import {
  gcd,
  isPythagorean,
  tripleFrom,
  primitiveTriples,
  LIMIT_OPTIONS,
} from './pythagoreanTriples'

describe('勾股数', () => {
  it('gcd 计算正确', () => {
    expect(gcd(12, 8)).toBe(4)
    expect(gcd(7, 3)).toBe(1)
    expect(gcd(0, 5)).toBe(5)
  })

  it('isPythagorean 识别经典三元组', () => {
    expect(isPythagorean(3, 4, 5)).toBe(true)
    expect(isPythagorean(5, 12, 13)).toBe(true)
    expect(isPythagorean(6, 8, 10)).toBe(true)
    expect(isPythagorean(2, 3, 4)).toBe(false)
    expect(isPythagorean(0, 4, 5)).toBe(false)
  })

  it('tripleFrom(2,1) 给出经典 3-4-5', () => {
    const t = tripleFrom(2, 1)
    expect(t.a).toBe(3)
    expect(t.b).toBe(4)
    expect(t.c).toBe(5)
    expect(t.primitive).toBe(true)
  })

  it('primitiveTriples 全部满足勾股定理且斜边不超限', () => {
    const list = primitiveTriples(100)
    expect(list.length).toBeGreaterThan(0)
    for (const t of list) {
      expect(isPythagorean(t.a, t.b, t.c)).toBe(true)
      expect(t.c).toBeLessThanOrEqual(100)
    }
  })

  it('primitiveTriples 生成的都是本原（三边互质）', () => {
    for (const t of primitiveTriples(120)) {
      expect(t.primitive).toBe(true)
      expect(gcd(gcd(t.a, t.b), t.c)).toBe(1)
    }
  })

  it('primitiveTriples 含 3-4-5 与 5-12-13，且不含派生 6-8-10', () => {
    const list = primitiveTriples(60)
    const has = (a: number, b: number, c: number) =>
      list.some((t) => t.a === a && t.b === b && t.c === c)
    expect(has(3, 4, 5)).toBe(true)
    expect(has(5, 12, 13)).toBe(true)
    expect(has(6, 8, 10)).toBe(false)
  })

  it('斜边上限越大，本原勾股数越多', () => {
    const [small, mid, big] = LIMIT_OPTIONS
    expect(primitiveTriples(small).length).toBeLessThanOrEqual(primitiveTriples(mid).length)
    expect(primitiveTriples(mid).length).toBeLessThanOrEqual(primitiveTriples(big).length)
  })
})
