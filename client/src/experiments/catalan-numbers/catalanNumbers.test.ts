import { describe, it, expect } from 'vitest'
import {
  catalanList,
  catalan,
  validParentheses,
  isBalanced,
  triangulationCount,
  NS,
} from './catalanNumbers'

describe('卡特兰数', () => {
  it('catalanList 前几项等于已知序列', () => {
    expect(catalanList(6)).toEqual([1, 1, 2, 5, 14, 42, 132])
  })

  it('catalan 闭式与递推一致 C(n)=C(2n,n)/(n+1)', () => {
    const comb = (a: number, b: number) => {
      let r = 1
      for (let i = 0; i < b; i++) r = (r * (a - i)) / (i + 1)
      return Math.round(r)
    }
    for (let n = 0; n <= 8; n++) {
      expect(catalan(n)).toBe(comb(2 * n, n) / (n + 1))
    }
  })

  it('validParentheses 数量等于 C(n) 且全部合法', () => {
    for (let n = 0; n <= 5; n++) {
      const seqs = validParentheses(n)
      expect(seqs.length).toBe(catalan(n))
      for (const s of seqs) {
        expect(s.length).toBe(2 * n)
        expect(isBalanced(s)).toBe(true)
      }
    }
  })

  it('validParentheses 去重后仍等量（无重复序列）', () => {
    const seqs = validParentheses(4)
    expect(new Set(seqs).size).toBe(seqs.length)
  })

  it('isBalanced 拒绝非法串', () => {
    expect(isBalanced('(()')).toBe(false)
    expect(isBalanced(')(')).toBe(false)
    expect(isBalanced('(())')).toBe(true)
  })

  it('triangulationCount 凸多边形三角剖分数 = C(m-2)', () => {
    expect(triangulationCount(3)).toBe(1)
    expect(triangulationCount(4)).toBe(2)
    expect(triangulationCount(5)).toBe(5)
    expect(triangulationCount(6)).toBe(14)
    expect(triangulationCount(2)).toBe(0)
  })

  it('NS 每个取值都能生成组合对象', () => {
    for (const n of NS) {
      expect(validParentheses(n).length).toBe(catalan(n))
      expect(triangulationCount(n + 2)).toBe(catalan(n))
    }
  })
})
