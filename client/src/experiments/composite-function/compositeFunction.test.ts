import { describe, it, expect } from 'vitest'
import { FUNCTIONS, getFunc, compose, sampleCurve, DEMO_XS } from './compositeFunction'

describe('复合函数', () => {
  it('FUNCTIONS 库非空，每项都有可调用的纯函数', () => {
    expect(FUNCTIONS.length).toBeGreaterThanOrEqual(4)
    for (const f of FUNCTIONS) {
      expect(typeof f.fn).toBe('function')
      expect(f.key).toMatch(/^[a-z]+$/)
      expect(typeof f.fn(1)).toBe('number')
    }
  })

  it('getFunc 按 key 取函数，未知 key 回退第一个', () => {
    expect(getFunc('square').fn(3)).toBe(9)
    expect(getFunc('linear').fn(2)).toBe(5)
    expect(getFunc('不存在')).toBe(FUNCTIONS[0])
  })

  it('compose 满足 (f∘g)(x)=f(g(x))', () => {
    const sq = (x: number) => x * x
    const inc = (x: number) => x + 1
    const fog = compose(sq, inc) // 先加一再平方
    expect(fog(2)).toBe(9) // (2+1)^2
    expect(fog(0)).toBe(1)
  })

  it('compose 次序重要：f∘g ≠ g∘f', () => {
    const sq = (x: number) => x * x
    const inc = (x: number) => x + 1
    const fog = compose(sq, inc) // (x+1)^2
    const gof = compose(inc, sq) // x^2+1
    expect(fog(3)).toBe(16)
    expect(gof(3)).toBe(10)
    expect(fog(3)).not.toBe(gof(3))
  })

  it('sampleCurve 采样点数量与端点正确', () => {
    const pts = sampleCurve((x) => x, 0, 10, 10)
    expect(pts.length).toBe(11)
    expect(pts[0]).toEqual({ x: 0, y: 0 })
    expect(pts[10]).toEqual({ x: 10, y: 10 })
  })

  it('sampleCurve 过滤非有限值', () => {
    const pts = sampleCurve((x) => 1 / x, -1, 1, 2)
    for (const p of pts) {
      expect(Number.isFinite(p.y)).toBe(true)
    }
  })

  it('DEMO_XS 都在采样区间内且为有限数', () => {
    for (const x of DEMO_XS) {
      expect(Number.isFinite(x)).toBe(true)
      expect(Math.abs(x)).toBeLessThanOrEqual(2)
    }
  })
})
