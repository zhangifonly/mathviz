import { describe, it, expect } from 'vitest'
import {
  lcs,
  knapsack01,
  LCS_SAMPLE,
  KNAPSACK_SAMPLE,
} from './dynamicProgramming'

describe('动态规划', () => {
  it('lcs 计算长度正确（经典 AGCAT / GAC）', () => {
    const r = lcs('AGCAT', 'GAC')
    expect(r.length).toBe(2)
    expect(r.sequence.length).toBe(2)
  })

  it('lcs 返回的序列确实是两串的子序列', () => {
    const { s1, s2 } = LCS_SAMPLE
    const r = lcs(s1, s2)
    const isSub = (seq: string, str: string) => {
      let k = 0
      for (const ch of str) if (k < seq.length && ch === seq[k]) k++
      return k === seq.length
    }
    expect(isSub(r.sequence, s1)).toBe(true)
    expect(isSub(r.sequence, s2)).toBe(true)
  })

  it('lcs 表维度为 (m+1)x(n+1)，空串长度为 0', () => {
    const r = lcs('ABC', 'AB')
    expect(r.table.length).toBe(4)
    expect(r.table[0].length).toBe(3)
    expect(lcs('', 'XYZ').length).toBe(0)
  })

  it('knapsack01 最优价值正确且不超重', () => {
    const { items, cap } = KNAPSACK_SAMPLE
    const r = knapsack01(items, cap)
    const w = r.chosen.reduce((s, i) => s + items[i].weight, 0)
    const v = r.chosen.reduce((s, i) => s + items[i].value, 0)
    expect(w).toBeLessThanOrEqual(cap)
    expect(v).toBe(r.best)
    expect(r.best).toBeGreaterThan(0)
  })

  it('knapsack01 容量为 0 时价值为 0，无选中物品', () => {
    const r = knapsack01(KNAPSACK_SAMPLE.items, 0)
    expect(r.best).toBe(0)
    expect(r.chosen.length).toBe(0)
  })

  it('knapsack01 单物品：放得下则选，放不下则空', () => {
    const one = [{ name: 'x', weight: 3, value: 9 }]
    expect(knapsack01(one, 3).best).toBe(9)
    expect(knapsack01(one, 2).best).toBe(0)
  })

  it('lcs/knapsack 回溯路径非空且落在表内', () => {
    const l = lcs('AGCAT', 'GAC')
    expect(l.path.length).toBeGreaterThan(0)
    const k = knapsack01(KNAPSACK_SAMPLE.items, KNAPSACK_SAMPLE.cap)
    expect(k.path.length).toBe(KNAPSACK_SAMPLE.items.length)
  })
})
