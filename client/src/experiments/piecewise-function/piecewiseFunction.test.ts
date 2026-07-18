import { describe, it, expect } from 'vitest'
import {
  evalPiecewise, inPiece, checkContinuity, leftLimit, rightLimit, sampleCurve, SAMPLES,
} from './piecewiseFunction'

const abs = SAMPLES[0]
const sign = SAMPLES[1]
const floor = SAMPLES[2]
const custom = SAMPLES[3]

describe('分段函数', () => {
  it('evalPiecewise: 绝对值各区间取值正确', () => {
    expect(evalPiecewise(abs, -2)).toBe(2)
    expect(evalPiecewise(abs, 0)).toBe(0)
    expect(evalPiecewise(abs, 3)).toBe(3)
    expect(evalPiecewise(abs, 100)).toBeNaN()
  })

  it('inPiece: 半开区间边界归属正确', () => {
    const p = abs.pieces[1] // [0, 4]
    expect(inPiece(p, 0)).toBe(true)
    expect(inPiece(abs.pieces[0], 0)).toBe(false) // [-4,0) 不含 0
  })

  it('checkContinuity: 绝对值在 0 处连续', () => {
    const r = checkContinuity(abs, 0)
    expect(r.kind).toBe('continuous')
    expect(Math.abs(r.jump)).toBeLessThan(1e-3)
  })

  it('checkContinuity: 符号函数在 0 处跳跃间断，跳跃量为 2', () => {
    const r = checkContinuity(sign, 0)
    expect(r.kind).toBe('jump')
    expect(r.left).toBeCloseTo(-1, 3)
    expect(r.right).toBeCloseTo(1, 3)
    expect(r.jump).toBeCloseTo(2, 3)
  })

  it('checkContinuity: 取整函数每个整数点都跳跃', () => {
    for (const b of floor.breakpoints) {
      expect(checkContinuity(floor, b).kind).toBe('jump')
    }
  })

  it('左右极限: 自定义函数在 0 处间断 (0 vs 1)', () => {
    expect(leftLimit(custom, 0)).toBeCloseTo(0, 3)
    expect(rightLimit(custom, 0)).toBeCloseTo(1, 3)
    expect(checkContinuity(custom, 0).kind).toBe('jump')
  })

  it('sampleCurve: 采样点数量与定义域端点正确', () => {
    const pts = sampleCurve(abs, 100)
    expect(pts.length).toBe(101)
    expect(pts[0][0]).toBeCloseTo(-4, 6)
    expect(pts[100][0]).toBeCloseTo(4, 6)
  })

  it('SAMPLES: 每个样例定义域内都有有限取值', () => {
    for (const def of SAMPLES) {
      const mid = (def.domain[0] + def.domain[1]) / 2
      expect(Number.isFinite(evalPiecewise(def, mid))).toBe(true)
    }
  })
})
