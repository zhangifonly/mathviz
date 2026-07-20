import { describe, it, expect } from 'vitest'
import {
  simulate,
  rk4Step,
  derivatives,
  conserved,
  equilibrium,
  PARAMS,
  PREY_STARTS,
} from './lotkaVolterra'

describe('洛特卡-沃尔泰拉模型', () => {
  it('simulate 返回 steps+1 个点，起点正确', () => {
    const s = simulate(PARAMS, 10, 5, 200, 0.05)
    expect(s.length).toBe(201)
    expect(s[0]).toEqual({ t: 0, prey: 10, pred: 5 })
    expect(s[1].t).toBeCloseTo(0.05, 6)
  })

  it('种群始终非负', () => {
    const s = simulate(PARAMS, 10, 5, 1000, 0.05)
    for (const pt of s) {
      expect(pt.prey).toBeGreaterThanOrEqual(0)
      expect(pt.pred).toBeGreaterThanOrEqual(0)
    }
  })

  it('derivatives 与公式一致', () => {
    const [dx, dy] = derivatives(PARAMS, 10, 5)
    expect(dx).toBeCloseTo(1.1 * 10 - 0.4 * 10 * 5, 9)
    expect(dy).toBeCloseTo(0.1 * 10 * 5 - 0.4 * 5, 9)
  })

  it('不动点处导数为零，轨迹静止', () => {
    const [xe, ye] = equilibrium(PARAMS)
    const [dx, dy] = derivatives(PARAMS, xe, ye)
    expect(dx).toBeCloseTo(0, 9)
    expect(dy).toBeCloseTo(0, 9)
    const [nx, ny] = rk4Step(PARAMS, xe, ye, 0.05)
    expect(nx).toBeCloseTo(xe, 6)
    expect(ny).toBeCloseTo(ye, 6)
  })

  it('守恒量沿轨迹近似不变（RK4 精度）', () => {
    const s = simulate(PARAMS, 10, 5, 500, 0.02)
    const v0 = conserved(PARAMS, s[0].prey, s[0].pred)
    for (const pt of s) {
      const v = conserved(PARAMS, pt.prey, pt.pred)
      expect(Math.abs(v - v0)).toBeLessThan(0.05)
    }
  })

  it('解呈周期振荡：捕食者峰值滞后于猎物', () => {
    // 从增长相（捕食者远低于平衡）起步：猎物先冲高，捕食者随后跟进
    const s = simulate(PARAMS, 10, 2, 2000, 0.02)
    const firstPeak = (key: 'prey' | 'pred') => {
      for (let i = 2; i < s.length - 1; i++) {
        if (s[i][key] > s[i - 1][key] && s[i][key] >= s[i + 1][key]) return i
      }
      return -1
    }
    const preyPeak = firstPeak('prey')
    const predPeak = firstPeak('pred')
    expect(preyPeak).toBeGreaterThan(0)
    expect(predPeak).toBeGreaterThan(preyPeak)
  })

  it('PREY_STARTS 均可正常模拟', () => {
    for (const x0 of PREY_STARTS) {
      const s = simulate(PARAMS, x0, 5, 100, 0.05)
      expect(s.length).toBe(101)
      expect(s[0].prey).toBe(x0)
    }
  })
})
