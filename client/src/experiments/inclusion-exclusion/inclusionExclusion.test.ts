import { describe, it, expect } from 'vitest'
import {
  multiplesUpTo,
  intersectionSize,
  allSubsets,
  iexTerms,
  unionSizeIE,
  unionSizeDirect,
  vennRegions,
  divisibleSets,
  SAMPLES,
} from './inclusionExclusion'

describe('容斥原理', () => {
  it('multiplesUpTo 正确列出倍数', () => {
    expect(multiplesUpTo(10, 3)).toEqual([3, 6, 9])
    expect(multiplesUpTo(30, 5).length).toBe(6)
    expect(multiplesUpTo(5, 7)).toEqual([])
  })

  it('intersectionSize 求交集大小', () => {
    const sets = [
      [1, 2, 3, 4],
      [2, 4, 6],
      [4, 5],
    ]
    expect(intersectionSize(sets, [0, 1])).toBe(2) // {2,4}
    expect(intersectionSize(sets, [0, 1, 2])).toBe(1) // {4}
    expect(intersectionSize(sets, [])).toBe(0)
  })

  it('allSubsets 枚举全部非空子集', () => {
    expect(allSubsets(3).length).toBe(7) // 2^3 - 1
    expect(allSubsets(2)).toContainEqual([0, 1])
  })

  it('容斥符号随子集大小奇偶交替', () => {
    const terms = iexTerms(divisibleSets(30, [2, 3, 5]))
    for (const t of terms) {
      expect(t.sign).toBe(t.subset.length % 2 === 1 ? 1 : -1)
    }
  })

  it('容斥公式并集大小与直接构造一致', () => {
    for (const s of SAMPLES) {
      const sets = divisibleSets(s.n, s.divisors)
      expect(unionSizeIE(sets)).toBe(unionSizeDirect(sets))
    }
  })

  it('1..30 能被 2/3/5 整除的数共 22 个', () => {
    // |2|=15,|3|=10,|5|=6; |6|=5,|10|=3,|15|=2; |30|=1
    // 15+10+6 - (5+3+2) + 1 = 31 - 10 + 1 = 22
    const sets = divisibleSets(30, [2, 3, 5])
    expect(unionSizeIE(sets)).toBe(22)
  })

  it('vennRegions 七区域之和等于并集大小', () => {
    const sets = divisibleSets(60, [2, 3, 5])
    const regions = vennRegions(sets)
    expect(regions.length).toBe(7)
    const sum = regions.reduce((a, b) => a + b, 0)
    expect(sum).toBe(unionSizeDirect(sets))
    for (const r of regions) expect(r).toBeGreaterThanOrEqual(0)
  })
})
