import { describe, it, expect } from 'vitest'
import {
  deriv,
  rk4Step,
  poincareMap,
  PARAM_SETS,
  SET_NAMES,
  type DuffingParams,
} from './poincareSection'

const P: DuffingParams = PARAM_SETS.periodic

describe('庞加莱截面', () => {
  it('deriv: x 的导数等于速度 v', () => {
    const [dx] = deriv(0.5, 1.3, 0, P)
    expect(dx).toBeCloseTo(1.3, 12)
  })

  it('deriv: v 的导数含阻尼/刚度/驱动项', () => {
    const p: DuffingParams = { ...P, delta: 0, alpha: 1, beta: 0, gamma: 0 }
    // 简谐: v' = -alpha x = -x
    const [, dv] = deriv(2, 0, 0, p)
    expect(dv).toBeCloseTo(-2, 12)
  })

  it('rk4Step: 无阻尼简谐振子近似守恒能量', () => {
    const p: DuffingParams = { delta: 0, alpha: 1, beta: 0, gamma: 0, omega: 1, x0: 1, v0: 0 }
    let x = 1
    let v = 0
    let t = 0
    const dt = 0.01
    const e0 = 0.5 * v * v + 0.5 * x * x
    for (let i = 0; i < 2000; i++) {
      ;[x, v] = rk4Step(x, v, t, dt, p)
      t += dt
    }
    const e1 = 0.5 * v * v + 0.5 * x * x
    expect(Math.abs(e1 - e0)).toBeLessThan(1e-3)
  })

  it('poincareMap: 返回点数等于 steps，坐标有限', () => {
    const pts = poincareMap(P, 30, 40, 10)
    expect(pts.length).toBe(30)
    for (const q of pts) {
      expect(Number.isFinite(q.x)).toBe(true)
      expect(Number.isFinite(q.v)).toBe(true)
    }
  })

  it('poincareMap: 周期解点云聚成很小的簇', () => {
    const pts = poincareMap(PARAM_SETS.periodic, 60, 80, 40)
    const xs = pts.map((q) => q.x)
    const spread = Math.max(...xs) - Math.min(...xs)
    expect(spread).toBeLessThan(0.5)
  })

  it('poincareMap: 混沌解比周期解散布更广', () => {
    const spread = (p: DuffingParams) => {
      const pts = poincareMap(p, 80, 80, 40)
      const xs = pts.map((q) => q.x)
      return Math.max(...xs) - Math.min(...xs)
    }
    expect(spread(PARAM_SETS.chaotic)).toBeGreaterThan(spread(PARAM_SETS.periodic))
  })

  it('SET_NAMES 都能在 PARAM_SETS 找到参数', () => {
    for (const name of SET_NAMES) {
      expect(PARAM_SETS[name]).toBeTruthy()
    }
  })
})
