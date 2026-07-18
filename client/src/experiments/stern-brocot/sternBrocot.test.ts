import { describe, it, expect } from 'vitest'
import {
  gcd, mediant, isReduced, buildTree, flatten,
  countNodes, continuedFraction, pathToFrac, DEPTHS,
} from './sternBrocot'

describe('Stern-Brocot 树', () => {
  it('gcd 与 mediant 计算正确', () => {
    expect(gcd(12, 8)).toBe(4)
    expect(gcd(7, 3)).toBe(1)
    expect(mediant({ n: 0, d: 1 }, { n: 1, d: 0 })).toEqual({ n: 1, d: 1 })
    expect(mediant({ n: 1, d: 2 }, { n: 1, d: 1 })).toEqual({ n: 2, d: 3 })
  })

  it('根节点是 1/1，节点数为 2^depth-1', () => {
    for (const depth of DEPTHS) {
      const root = buildTree(depth)
      expect(root?.frac).toEqual({ n: 1, d: 1 })
      expect(flatten(root).length).toBe(countNodes(depth))
    }
  })

  it('树中每个分数都既约，且互不重复', () => {
    const fracs = flatten(buildTree(5))
    const seen = new Set<string>()
    for (const f of fracs) {
      expect(isReduced(f)).toBe(true)
      const key = `${f.n}/${f.d}`
      expect(seen.has(key)).toBe(false)
      seen.add(key)
    }
  })

  it('中序遍历得到严格递增的分数序列', () => {
    const fracs = flatten(buildTree(4))
    for (let i = 1; i < fracs.length; i++) {
      const prev = fracs[i - 1].n / fracs[i - 1].d
      const cur = fracs[i].n / fracs[i].d
      expect(cur).toBeGreaterThan(prev)
    }
  })

  it('连分数展开正确', () => {
    expect(continuedFraction(7, 3)).toEqual([2, 3])
    expect(continuedFraction(1, 1)).toEqual([1])
    expect(continuedFraction(3, 7)).toEqual([0, 2, 3])
  })

  it('pathToFrac: 路径对应正确分数', () => {
    expect(pathToFrac('')).toEqual({ n: 1, d: 1 })
    expect(pathToFrac('L')).toEqual({ n: 1, d: 2 })
    expect(pathToFrac('R')).toEqual({ n: 2, d: 1 })
    expect(pathToFrac('RL')).toEqual({ n: 3, d: 2 })
  })
})
