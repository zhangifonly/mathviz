import { describe, it, expect } from 'vitest'
import {
  derivative,
  rk4Step,
  simulate,
  energy,
  SEPARATRIX_ENERGY,
  INITIAL_STATES,
  G,
  L,
} from './pendulumPhase'

describe('单摆相空间', () => {
  it('derivative: theta 变化率等于 omega, 平衡点导数为零', () => {
    const d = derivative({ theta: 0, omega: 2 })
    expect(d.theta).toBe(2)
    expect(d.omega).toBeCloseTo(0, 12)
    const rest = derivative({ theta: 0, omega: 0 })
    expect(rest.theta).toBe(0)
    expect(rest.omega).toBeCloseTo(0, 12)
  })

  it('rk4Step: 从平衡静止出发保持不动', () => {
    const s = rk4Step({ theta: 0, omega: 0 }, 0.05)
    expect(Math.abs(s.theta)).toBeLessThan(1e-9)
    expect(Math.abs(s.omega)).toBeLessThan(1e-9)
  })

  it('simulate: 返回 steps+1 个状态且首元素为初值', () => {
    const path = simulate(0.5, 0, 100, 0.02)
    expect(path.length).toBe(101)
    expect(path[0]).toEqual({ theta: 0.5, omega: 0 })
  })

  it('energy 守恒: RK4 长程积分能量漂移很小', () => {
    const path = simulate(1.0, 0, 2000, 0.01)
    const e0 = energy(path[0])
    const e1 = energy(path[path.length - 1])
    expect(Math.abs(e1 - e0)).toBeLessThan(1e-3)
  })

  it('振荡轨迹能量低于分界线, 翻转轨迹高于分界线', () => {
    const swing = energy({ theta: 0.5, omega: 0 })
    const flip = energy({ theta: 0, omega: 8 })
    expect(swing).toBeLessThan(SEPARATRIX_ENERGY)
    expect(flip).toBeGreaterThan(SEPARATRIX_ENERGY)
  })

  it('SEPARATRIX_ENERGY 等于 2g/L, INITIAL_STATES 含振荡与翻转两类', () => {
    expect(SEPARATRIX_ENERGY).toBeCloseTo((2 * G) / L, 10)
    const below = INITIAL_STATES.filter((s) => energy(s) < SEPARATRIX_ENERGY)
    const above = INITIAL_STATES.filter((s) => energy(s) > SEPARATRIX_ENERGY)
    expect(below.length).toBeGreaterThan(0)
    expect(above.length).toBeGreaterThan(0)
  })
})
