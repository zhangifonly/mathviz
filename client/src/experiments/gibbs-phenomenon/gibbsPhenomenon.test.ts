import { describe, it, expect } from 'vitest'
import {
  squarePartialSum,
  squareTarget,
  overshootPeak,
  overshootFraction,
  TARGET_AMP,
  JUMP,
  TERM_COUNTS,
} from './gibbsPhenomenon'

describe('吉布斯现象', () => {
  it('部分和是奇函数，原点为 0', () => {
    expect(squarePartialSum(0, 20)).toBeCloseTo(0, 10)
    for (const x of [0.3, 1.1, 2.5]) {
      expect(squarePartialSum(-x, 15)).toBeCloseTo(-squarePartialSum(x, 15), 10)
    }
  })

  it('部分和在区间内部收敛到目标电平 π/4', () => {
    // x=π/2 处方波取 +π/4，项数越多越接近
    expect(squarePartialSum(Math.PI / 2, 200)).toBeCloseTo(TARGET_AMP, 2)
    expect(squareTarget(Math.PI / 2)).toBeCloseTo(TARGET_AMP, 10)
  })

  it('目标方波跳变正确：(0,π) 为正，(-π,0) 为负', () => {
    expect(squareTarget(1)).toBe(TARGET_AMP)
    expect(squareTarget(-1)).toBe(-TARGET_AMP)
    expect(squareTarget(0)).toBe(0)
    expect(JUMP).toBeCloseTo(2 * TARGET_AMP, 10)
  })

  it('过冲峰位于 x=π/(2n) 且高于目标电平', () => {
    for (const n of [5, 20, 80]) {
      const p = overshootPeak(n)
      expect(p.x).toBeCloseTo(Math.PI / (2 * n), 10)
      expect(p.value).toBeGreaterThan(TARGET_AMP)
    }
  })

  it('过冲比例随项数收敛到约 9% 而不消失', () => {
    const f50 = overshootFraction(50)
    const f500 = overshootFraction(500)
    expect(f50).toBeGreaterThan(0.08)
    expect(f50).toBeLessThan(0.1)
    // 大项数逼近吉布斯常数 0.0894898
    expect(f500).toBeCloseTo(0.0895, 3)
  })

  it('TERM_COUNTS 每档都能算出有限过冲', () => {
    for (const n of TERM_COUNTS) {
      const p = overshootPeak(n)
      expect(Number.isFinite(p.value)).toBe(true)
      expect(p.value).toBeGreaterThan(TARGET_AMP)
    }
  })
})
