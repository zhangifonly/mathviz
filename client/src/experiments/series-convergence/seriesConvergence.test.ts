import { describe, it, expect } from 'vitest'
import {
  geometricTerm, harmonicTerm, pSeriesTerm, alternatingTerm,
  partialSums, ratioTest, converges, SERIES, N_COUNTS,
} from './seriesConvergence'

describe('级数收敛判别', () => {
  it('几何级数部分和趋于 2', () => {
    const s = partialSums(geometricTerm, 40)
    expect(s.length).toBe(40)
    expect(s[39]).toBeGreaterThan(1.999)
    expect(s[39]).toBeLessThanOrEqual(2)
    // 单调递增且以 2 为上界
    for (let i = 1; i < s.length; i++) expect(s[i]).toBeGreaterThan(s[i - 1])
  })

  it('p=2 级数部分和逼近 pi^2/6', () => {
    const s = partialSums(pSeriesTerm, 5000)
    expect(Math.abs(s[s.length - 1] - Math.PI * Math.PI / 6)).toBeLessThan(1e-3)
  })

  it('调和级数发散：部分和持续增长且超过 5', () => {
    const s = partialSums(harmonicTerm, 200)
    expect(s[s.length - 1]).toBeGreaterThan(s[0])
    expect(partialSums(harmonicTerm, 20000).pop()!).toBeGreaterThan(5)
  })

  it('交错级数收敛到 ln 2', () => {
    const s = partialSums(alternatingTerm, 100000)
    expect(Math.abs(s[s.length - 1] - Math.LN2)).toBeLessThan(1e-3)
  })

  it('ratioTest 与 converges 判断一致于已知结论', () => {
    expect(ratioTest(geometricTerm)).toBeCloseTo(0.5, 3)
    expect(ratioTest(harmonicTerm)).toBeCloseTo(1, 2)
    expect(converges(geometricTerm)).toBe(true)
    expect(converges(pSeriesTerm)).toBe(true)
    expect(converges(harmonicTerm)).toBe(false)
  })

  it('SERIES 常量的 converges 标记与算法结论吻合', () => {
    for (const s of SERIES) {
      expect(partialSums(s.term, 10).length).toBe(10)
      if (s.key !== 'alternating') expect(converges(s.term)).toBe(s.converges)
    }
    expect(N_COUNTS.every((n) => n > 0)).toBe(true)
  })
})
