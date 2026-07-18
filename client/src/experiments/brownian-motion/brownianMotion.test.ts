import { describe, it, expect } from 'vitest'
import {
  makeRng,
  gaussian,
  brownianPath1D,
  brownianPath2D,
  theoreticalVariance,
  STEP_COUNTS,
  MODES,
} from './brownianMotion'

describe('布朗运动', () => {
  it('brownianPath1D 长度为 steps+1，起点为 0', () => {
    const path = brownianPath1D(500, 1, 7)
    expect(path.length).toBe(501)
    expect(path[0]).toBe(0)
    for (const v of path) expect(Number.isFinite(v)).toBe(true)
  })

  it('brownianPath2D 长度为 steps+1，起点为原点', () => {
    const path = brownianPath2D(300, 1, 3)
    expect(path.length).toBe(301)
    expect(path[0]).toEqual({ x: 0, y: 0 })
  })

  it('同种子可复现，不同种子结果不同', () => {
    const a = brownianPath1D(200, 1, 42)
    const b = brownianPath1D(200, 1, 42)
    const c = brownianPath1D(200, 1, 99)
    expect(a).toEqual(b)
    expect(a).not.toEqual(c)
  })

  it('gaussian 大样本均值接近 0、方差接近 1', () => {
    const rand = makeRng(123)
    const n = 20000
    let sum = 0
    let sumSq = 0
    for (let i = 0; i < n; i++) {
      const g = gaussian(rand)
      sum += g
      sumSq += g * g
    }
    const mean = sum / n
    const variance = sumSq / n - mean * mean
    expect(Math.abs(mean)).toBeLessThan(0.05)
    expect(Math.abs(variance - 1)).toBeLessThan(0.1)
  })

  it('位置方差随时间线性增长（Var≈t）', () => {
    const steps = 400
    const trials = 600
    let sumSq = 0
    for (let k = 0; k < trials; k++) {
      const path = brownianPath1D(steps, 1, k + 1)
      const end = path[steps]
      sumSq += end * end
    }
    const empirical = sumSq / trials
    const theory = theoreticalVariance(steps, 1)
    // 经验方差应落在理论值附近（相对误差 < 20%）
    expect(Math.abs(empirical - theory) / theory).toBeLessThan(0.2)
  })

  it('theoreticalVariance 等于 step*dt', () => {
    expect(theoreticalVariance(100, 1)).toBe(100)
    expect(theoreticalVariance(50, 0.5)).toBe(25)
  })

  it('STEP_COUNTS 与 MODES 常量正确', () => {
    expect(STEP_COUNTS.length).toBeGreaterThanOrEqual(3)
    for (const n of STEP_COUNTS) {
      expect(brownianPath1D(n, 1, 1).length).toBe(n + 1)
    }
    expect(MODES).toEqual(['1d', '2d'])
  })
})
