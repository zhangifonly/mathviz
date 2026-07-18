import { describe, it, expect } from 'vitest'
import { farey, gcd, mediant, areNeighbors, fordRadius, ORDERS } from './fareySequence'

describe('法里数列', () => {
  it('F_5 与已知结果完全一致', () => {
    const f = farey(5)
    const got = f.map((x) => `${x.n}/${x.d}`)
    expect(got).toEqual([
      '0/1', '1/5', '1/4', '1/3', '2/5', '1/2',
      '3/5', '2/3', '3/4', '4/5', '1/1',
    ])
  })

  it('数列严格升序且首尾为 0/1 与 1/1', () => {
    const f = farey(7)
    expect(f[0]).toEqual({ n: 0, d: 1 })
    expect(f[f.length - 1]).toEqual({ n: 1, d: 1 })
    for (let i = 1; i < f.length; i++) {
      const prev = f[i - 1].n / f[i - 1].d
      const cur = f[i].n / f[i].d
      expect(cur).toBeGreaterThan(prev)
    }
  })

  it('所有分数既约且分母不超过 n', () => {
    const n = 7
    for (const x of farey(n)) {
      expect(gcd(x.n, x.d)).toBe(1)
      expect(x.d).toBeLessThanOrEqual(n)
      expect(x.d).toBeGreaterThanOrEqual(1)
    }
  })

  it('相邻分数满足 bc - ad = 1 邻居性质', () => {
    const f = farey(6)
    for (let i = 1; i < f.length; i++) {
      expect(areNeighbors(f[i - 1], f[i])).toBe(true)
    }
  })

  it('mediant 是两邻居的中位数且落在两者之间', () => {
    const f = farey(5)
    // 1/3 与 1/2 的中位数是 2/5，恰为 F_5 中夹在它们之间的项
    expect(mediant({ n: 1, d: 3 }, { n: 1, d: 2 })).toEqual({ n: 2, d: 5 })
    expect(f.some((x) => x.n === 2 && x.d === 5)).toBe(true)
  })

  it('fordRadius 随分母递减，且 ORDERS 都能生成', () => {
    expect(fordRadius({ n: 1, d: 2 })).toBeCloseTo(1 / 8)
    expect(fordRadius({ n: 1, d: 3 })).toBeLessThan(fordRadius({ n: 1, d: 2 }))
    for (const n of ORDERS) {
      expect(farey(n).length).toBeGreaterThan(0)
    }
  })
})
