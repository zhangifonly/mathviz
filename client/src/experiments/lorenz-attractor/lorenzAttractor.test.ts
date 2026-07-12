import { describe, it, expect } from 'vitest'
import {
  lorenzDeriv,
  rk4Step,
  integrateLorenz,
  trajectoryDivergence,
  CLASSIC_PARAMS,
  LORENZ_PRESETS,
  type Vec3,
} from './lorenzAttractor'

describe('洛伦兹吸引子内核', () => {
  it('原点是不动点：所有导数为 0', () => {
    const d = lorenzDeriv({ x: 0, y: 0, z: 0 }, CLASSIC_PARAMS)
    expect(d.x).toBe(0)
    expect(d.y).toBe(0)
    expect(d.z).toBe(0)
  })

  it('rho>1 时非零不动点 C+ 处导数为 0（已知解析解）', () => {
    // 不动点 x=y=±sqrt(beta*(rho-1)), z=rho-1
    const { rho, beta } = CLASSIC_PARAMS
    const c = Math.sqrt(beta * (rho - 1))
    const fp: Vec3 = { x: c, y: c, z: rho - 1 }
    const d = lorenzDeriv(fp, CLASSIC_PARAMS)
    expect(Math.abs(d.x)).toBeLessThan(1e-9)
    expect(Math.abs(d.y)).toBeLessThan(1e-9)
    expect(Math.abs(d.z)).toBeLessThan(1e-9)
  })

  it('lorenzDeriv 数值正确：sigma*(y-x) 等', () => {
    const d = lorenzDeriv({ x: 1, y: 2, z: 3 }, { sigma: 10, rho: 28, beta: 2 })
    expect(d.x).toBeCloseTo(10 * (2 - 1))
    expect(d.y).toBeCloseTo(1 * (28 - 3) - 2)
    expect(d.z).toBeCloseTo(1 * 2 - 2 * 3)
  })

  it('在不动点处 RK4 一步保持不动', () => {
    const step = rk4Step({ x: 0, y: 0, z: 0 }, CLASSIC_PARAMS, 0.01)
    expect(Math.abs(step.x)).toBeLessThan(1e-12)
    expect(Math.abs(step.y)).toBeLessThan(1e-12)
    expect(Math.abs(step.z)).toBeLessThan(1e-12)
  })

  it('integrateLorenz 返回 steps+1 个点且数值有界（不发散到 NaN）', () => {
    const traj = integrateLorenz({ x: 1, y: 1, z: 1 }, CLASSIC_PARAMS, 2000, 0.01)
    expect(traj.length).toBe(2001)
    for (const p of traj) {
      expect(Number.isFinite(p.x)).toBe(true)
      expect(Number.isFinite(p.y)).toBe(true)
      expect(Number.isFinite(p.z)).toBe(true)
    }
    // 吸引子有界：坐标不会跑到极端大
    const last = traj[traj.length - 1]
    expect(Math.abs(last.x)).toBeLessThan(100)
    expect(Math.abs(last.z)).toBeLessThan(100)
  })

  it('蝴蝶效应：微小初值差异随时间放大', () => {
    const a = integrateLorenz({ x: 1, y: 1, z: 1 }, CLASSIC_PARAMS, 3000, 0.01)
    const b = integrateLorenz({ x: 1 + 1e-8, y: 1, z: 1 }, CLASSIC_PARAMS, 3000, 0.01)
    const div = trajectoryDivergence(a, b)
    expect(div[0]).toBeCloseTo(1e-8, 10)
    // 数千步后差异远大于初始差异
    expect(div[div.length - 1]).toBeGreaterThan(div[0] * 1000)
  })

  it('trajectoryDivergence 相同轨迹距离恒为 0', () => {
    const a = integrateLorenz({ x: 2, y: 3, z: 4 }, CLASSIC_PARAMS, 100, 0.01)
    const div = trajectoryDivergence(a, a)
    for (const d of div) expect(d).toBe(0)
  })

  it('LORENZ_PRESETS 每个预设都能积分出有限轨迹', () => {
    for (const preset of LORENZ_PRESETS) {
      const traj = integrateLorenz({ x: 1, y: 1, z: 1 }, preset.params, 1500, 0.01)
      expect(traj.length).toBe(1501)
      const last = traj[traj.length - 1]
      expect(Number.isFinite(last.x)).toBe(true)
      expect(Number.isFinite(last.z)).toBe(true)
    }
  })
})
