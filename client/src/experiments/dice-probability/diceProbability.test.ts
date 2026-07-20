import { describe, it, expect } from 'vitest'
import {
  sumDistribution,
  sumOffset,
  rollDice,
  simulate,
  DICE_COUNTS,
} from './diceProbability'

describe('骰子与古典概率', () => {
  it('单骰子分布是均匀的 1/6', () => {
    const d = sumDistribution(1)
    expect(d.length).toBe(6)
    for (const p of d) expect(p).toBeCloseTo(1 / 6, 10)
  })

  it('分布是合法概率分布，总和为 1', () => {
    for (const n of DICE_COUNTS) {
      const d = sumDistribution(n)
      const total = d.reduce((a, b) => a + b, 0)
      expect(total).toBeCloseTo(1, 10)
      expect(d.length).toBe(n * 5 + 1)
    }
  })

  it('两骰子：和为 7 概率最大，为 6/36', () => {
    const d = sumDistribution(2)
    // 下标 0 = 和2，和7 下标为 5
    expect(d[7 - sumOffset(2)]).toBeCloseTo(6 / 36, 10)
    // 7 是最大值
    const max = Math.max(...d)
    expect(d[5]).toBeCloseTo(max, 10)
    // 两端最小
    expect(d[0]).toBeCloseTo(1 / 36, 10)
  })

  it('rollDice 结果落在 [numDice, 6*numDice] 且可复现', () => {
    for (const n of DICE_COUNTS) {
      const r = rollDice(n, 42)
      expect(r).toBeGreaterThanOrEqual(n)
      expect(r).toBeLessThanOrEqual(6 * n)
      expect(rollDice(n, 42)).toBe(r)
    }
  })

  it('simulate 频数之和等于试验次数', () => {
    const counts = simulate(2, 500, 7)
    expect(counts.reduce((a, b) => a + b, 0)).toBe(500)
    expect(counts.length).toBe(11)
  })

  it('simulate 大量试验时频率逼近理论概率', () => {
    const trials = 60000
    const counts = simulate(2, trials, 123)
    const dist = sumDistribution(2)
    for (let i = 0; i < dist.length; i++) {
      expect(counts[i] / trials).toBeCloseTo(dist[i], 1)
    }
  })
})
