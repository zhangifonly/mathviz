import { describe, it, expect } from 'vitest'
import { partitions, partitionCount, conjugate, NS } from './integerPartition'

describe('整数分拆', () => {
  it('partitions(4) 给出全部 5 个分拆，且都非增、和为 4', () => {
    const ps = partitions(4)
    expect(ps.length).toBe(5)
    for (const p of ps) {
      expect(p.reduce((a, b) => a + b, 0)).toBe(4)
      for (let i = 1; i < p.length; i++) {
        expect(p[i]).toBeLessThanOrEqual(p[i - 1])
      }
    }
    expect(ps).toContainEqual([4])
    expect(ps).toContainEqual([2, 1, 1])
    expect(ps).toContainEqual([1, 1, 1, 1])
  })

  it('partitionCount 与 partitions 数量一致', () => {
    for (let n = 0; n <= 8; n++) {
      expect(partitionCount(n)).toBe(partitions(n).length)
    }
  })

  it('partitionCount 匹配已知分拆数序列', () => {
    const known = [1, 1, 2, 3, 5, 7, 11, 15, 22, 30, 42]
    for (let n = 0; n < known.length; n++) {
      expect(partitionCount(n)).toBe(known[n])
    }
  })

  it('conjugate 是对合：两次共轭还原原分拆', () => {
    for (const p of partitions(6)) {
      expect(conjugate(conjugate(p))).toEqual(p)
    }
  })

  it('conjugate 保持总和不变，且结果非增', () => {
    const p = [4, 2, 1]
    const c = conjugate(p)
    expect(c.reduce((a, b) => a + b, 0)).toBe(7)
    expect(c).toEqual([3, 2, 1, 1])
    for (let i = 1; i < c.length; i++) {
      expect(c[i]).toBeLessThanOrEqual(c[i - 1])
    }
  })

  it('NS 里的每个 n 都能生成非空分拆集', () => {
    for (const n of NS) {
      expect(partitions(n).length).toBe(partitionCount(n))
      expect(partitions(n).length).toBeGreaterThan(0)
    }
  })
})
