import { describe, it, expect } from 'vitest'
import {
  derivatives,
  rk4Step,
  positions,
  totalEnergy,
  DEFAULT_PARAMS,
  PRESET_OPTIONS,
  type PendulumState,
} from './doublePendulum'

describe('双摆混沌核心', () => {
  it('静止在最低点是平衡态：导数全为 0', () => {
    const rest: PendulumState = { th1: 0, th2: 0, w1: 0, w2: 0 }
    const d = derivatives(rest, DEFAULT_PARAMS)
    expect(d.th1).toBeCloseTo(0, 12)
    expect(d.th2).toBeCloseTo(0, 12)
    expect(d.w1).toBeCloseTo(0, 12)
    expect(d.w2).toBeCloseTo(0, 12)
  })

  it('静止平衡态经 RK4 一步仍保持静止', () => {
    const rest: PendulumState = { th1: 0, th2: 0, w1: 0, w2: 0 }
    const next = rk4Step(rest, DEFAULT_PARAMS, 0.01)
    expect(next.th1).toBeCloseTo(0, 10)
    expect(next.th2).toBeCloseTo(0, 10)
    expect(next.w1).toBeCloseTo(0, 10)
    expect(next.w2).toBeCloseTo(0, 10)
  })

  it('偏离最低点时第一摆产生回复加速度（指向减小角度方向）', () => {
    const s: PendulumState = { th1: 0.3, th2: 0.3, w1: 0, w2: 0 }
    const d = derivatives(s, DEFAULT_PARAMS)
    // 正角度偏移应产生负角加速度（回复力）
    expect(d.w1).toBeLessThan(0)
  })

  it('positions: 两摆竖直向下时坐标符合杆长', () => {
    const s: PendulumState = { th1: 0, th2: 0, w1: 0, w2: 0 }
    const pos = positions(s, DEFAULT_PARAMS)
    expect(pos.x1).toBeCloseTo(0, 12)
    expect(pos.y1).toBeCloseTo(DEFAULT_PARAMS.l1, 12)
    expect(pos.x2).toBeCloseTo(0, 12)
    expect(pos.y2).toBeCloseTo(DEFAULT_PARAMS.l1 + DEFAULT_PARAMS.l2, 12)
  })

  it('positions: 第一摆水平时 x1 等于 l1', () => {
    const s: PendulumState = { th1: Math.PI / 2, th2: 0, w1: 0, w2: 0 }
    const pos = positions(s, DEFAULT_PARAMS)
    expect(pos.x1).toBeCloseTo(DEFAULT_PARAMS.l1, 10)
    expect(pos.y1).toBeCloseTo(0, 10)
  })

  it('RK4 长时间积分能量近似守恒（漂移 < 1%）', () => {
    let s: PendulumState = { th1: 2, th2: 1, w1: 0, w2: 0 }
    const e0 = totalEnergy(s, DEFAULT_PARAMS)
    for (let i = 0; i < 5000; i++) s = rk4Step(s, DEFAULT_PARAMS, 0.002)
    const e1 = totalEnergy(s, DEFAULT_PARAMS)
    const drift = Math.abs((e1 - e0) / e0)
    expect(drift).toBeLessThan(0.01)
  })

  it('对初值敏感：微小扰动随时间显著放大（混沌特征）', () => {
    let a: PendulumState = { th1: 2, th2: 1, w1: 0, w2: 0 }
    let b: PendulumState = { th1: 2 + 1e-4, th2: 1, w1: 0, w2: 0 }
    for (let i = 0; i < 3000; i++) {
      a = rk4Step(a, DEFAULT_PARAMS, 0.005)
      b = rk4Step(b, DEFAULT_PARAMS, 0.005)
    }
    const sep = Math.abs(a.th2 - b.th2) + Math.abs(a.th1 - b.th1)
    // 初始差 1e-4，混沌应把差异放大若干数量级
    expect(sep).toBeGreaterThan(1e-2)
  })

  it('PRESET_OPTIONS 均有效且可积分不产生 NaN', () => {
    expect(PRESET_OPTIONS.length).toBeGreaterThanOrEqual(3)
    const ids = new Set(PRESET_OPTIONS.map((o) => o.id))
    expect(ids.size).toBe(PRESET_OPTIONS.length)
    for (const opt of PRESET_OPTIONS) {
      let s = { ...opt.state }
      for (let i = 0; i < 500; i++) s = rk4Step(s, DEFAULT_PARAMS, 0.005)
      expect(Number.isFinite(s.th1)).toBe(true)
      expect(Number.isFinite(s.th2)).toBe(true)
      expect(Number.isFinite(s.w1)).toBe(true)
      expect(Number.isFinite(s.w2)).toBe(true)
    }
  })
})
