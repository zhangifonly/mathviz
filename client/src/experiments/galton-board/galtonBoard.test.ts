import { describe, it, expect } from 'vitest'
import { dropBall, simulate, binomial, binomialDist, ROWS, BALL_COUNTS } from './galtonBoard'

describe('高尔顿板', () => {
  it('dropBall 结果落在 [0, rows] 内且可复现', () => {
    for (let s = 1; s <= 50; s++) {
      const slot = dropBall(12, s)
      expect(slot).toBeGreaterThanOrEqual(0)
      expect(slot).toBeLessThanOrEqual(12)
    }
    expect(dropBall(12, 42)).toBe(dropBall(12, 42))
  })

  it('simulate 各槽计数之和等于小球数', () => {
    const counts = simulate(10, 1000, 7)
    expect(counts.length).toBe(11)
    const total = counts.reduce((a, b) => a + b, 0)
    expect(total).toBe(1000)
    for (const c of counts) expect(c).toBeGreaterThanOrEqual(0)
  })

  it('simulate 分布峰值靠近中间槽', () => {
    const rows = 12
    const counts = simulate(rows, 5000, 3)
    let maxIdx = 0
    for (let i = 1; i < counts.length; i++) {
      if (counts[i] > counts[maxIdx]) maxIdx = i
    }
    expect(maxIdx).toBeGreaterThanOrEqual(rows / 2 - 2)
    expect(maxIdx).toBeLessThanOrEqual(rows / 2 + 2)
  })

  it('binomial 计算正确', () => {
    expect(binomial(4, 0)).toBe(1)
    expect(binomial(4, 2)).toBe(6)
    expect(binomial(4, 4)).toBe(1)
    expect(binomial(5, 6)).toBe(0)
  })

  it('binomialDist 概率之和为 1 且对称', () => {
    const dist = binomialDist(10)
    expect(dist.length).toBe(11)
    const sum = dist.reduce((a, b) => a + b, 0)
    expect(sum).toBeCloseTo(1, 6)
    expect(dist[0]).toBeCloseTo(dist[10], 10)
    expect(dist[3]).toBeCloseTo(dist[7], 10)
  })

  it('常量 ROWS 与 BALL_COUNTS 有效', () => {
    expect(ROWS).toBeGreaterThan(0)
    expect(BALL_COUNTS.length).toBeGreaterThan(0)
    for (const b of BALL_COUNTS) {
      expect(simulate(ROWS, b, 1).reduce((a, x) => a + x, 0)).toBe(b)
    }
  })
})
