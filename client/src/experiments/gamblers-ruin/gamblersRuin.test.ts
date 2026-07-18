import { describe, it, expect } from 'vitest'
import {
  ruinProbability,
  reachProbability,
  simulate,
  SCENARIOS,
} from './gamblersRuin'

describe('赌徒破产', () => {
  it('公平赌局破产概率为 (N-i)/N', () => {
    expect(ruinProbability(10, 20, 0.5)).toBeCloseTo(0.5, 9)
    expect(ruinProbability(5, 20, 0.5)).toBeCloseTo(0.75, 9)
    expect(ruinProbability(15, 20, 0.5)).toBeCloseTo(0.25, 9)
  })

  it('边界：i<=0 必破产，i>=N 不破产', () => {
    expect(ruinProbability(0, 20, 0.5)).toBe(1)
    expect(ruinProbability(20, 20, 0.5)).toBe(0)
    expect(ruinProbability(25, 20, 0.4)).toBe(0)
  })

  it('不公平赌局用比值公式，p<0.5 时破产概率更高', () => {
    const fair = ruinProbability(10, 20, 0.5)
    const unfair = ruinProbability(10, 20, 0.45)
    expect(unfair).toBeGreaterThan(fair)
    // 手算校验：r=(0.55/0.45)，(r^10-r^20)/(1-r^20)
    const r = 0.55 / 0.45
    const expected = (Math.pow(r, 10) - Math.pow(r, 20)) / (1 - Math.pow(r, 20))
    expect(unfair).toBeCloseTo(expected, 9)
  })

  it('破产概率与达标概率互补，均在 [0,1]', () => {
    for (const p of [0.4, 0.5, 0.55]) {
      const ruin = ruinProbability(7, 20, p)
      expect(ruin + reachProbability(7, 20, p)).toBeCloseTo(1, 9)
      expect(ruin).toBeGreaterThanOrEqual(0)
      expect(ruin).toBeLessThanOrEqual(1)
    }
  })

  it('simulate 一定被吸收到 0 或 N，且同种子可复现', () => {
    const a = simulate(10, 20, 0.5, 42)
    const b = simulate(10, 20, 0.5, 42)
    expect(a).toEqual(b)
    const last = a.path[a.path.length - 1]
    expect(last === 0 || last === 20).toBe(true)
    expect(a.ruined).toBe(last <= 0)
    expect(a.path.length).toBe(a.steps + 1)
  })

  it('SCENARIOS 各预设都能模拟出被吸收的结局', () => {
    for (const sc of SCENARIOS) {
      const res = simulate(sc.i, sc.N, sc.p, 7)
      const last = res.path[res.path.length - 1]
      expect(last === 0 || last === sc.N).toBe(true)
    }
  })
})
