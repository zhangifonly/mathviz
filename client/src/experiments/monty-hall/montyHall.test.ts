import { describe, it, expect } from 'vitest'
import {
  playOnce,
  simulate,
  simulateCurve,
  makeRng,
  STRATEGIES,
  THEORY,
  TRIAL_COUNTS,
} from './montyHall'

describe('蒙提霍尔问题', () => {
  it('STRATEGIES 与理论值定义正确', () => {
    expect(STRATEGIES).toEqual(['switch', 'stay'])
    expect(THEORY.switch).toBeCloseTo(2 / 3, 10)
    expect(THEORY.stay).toBeCloseTo(1 / 3, 10)
  })

  it('playOnce 返回布尔值，同种子可复现', () => {
    const a = playOnce('switch', 12345)
    const b = playOnce('switch', 12345)
    expect(typeof a).toBe('boolean')
    expect(a).toBe(b)
  })

  it('simulate 胜率落在 [0,1]，trials=0 返回 0', () => {
    expect(simulate('switch', 0, 1)).toBe(0)
    const r = simulate('stay', 100, 7)
    expect(r).toBeGreaterThanOrEqual(0)
    expect(r).toBeLessThanOrEqual(1)
  })

  it('大量模拟：换≈2/3、不换≈1/3', () => {
    const sw = simulate('switch', 20000, 42)
    const st = simulate('stay', 20000, 42)
    expect(sw).toBeGreaterThan(0.6)
    expect(sw).toBeLessThan(0.72)
    expect(st).toBeGreaterThan(0.28)
    expect(st).toBeLessThan(0.4)
  })

  it('换门胜率明显高于不换门胜率', () => {
    const sw = simulate('switch', 10000, 99)
    const st = simulate('stay', 10000, 99)
    expect(sw).toBeGreaterThan(st)
  })

  it('simulateCurve 长度正确，末值等于整体胜率', () => {
    for (const n of TRIAL_COUNTS) {
      const curve = simulateCurve('switch', n, 3)
      expect(curve.length).toBe(n)
      const whole = simulate('switch', n, 3)
      expect(curve[n - 1]).toBeCloseTo(whole, 10)
      for (const v of curve) {
        expect(v).toBeGreaterThanOrEqual(0)
        expect(v).toBeLessThanOrEqual(1)
      }
    }
  })

  it('makeRng 同种子产生相同序列', () => {
    const r1 = makeRng(5)
    const r2 = makeRng(5)
    for (let i = 0; i < 20; i++) {
      expect(r1()).toBe(r2())
    }
  })
})
