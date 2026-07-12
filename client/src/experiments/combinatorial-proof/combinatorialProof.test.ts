import { describe, it, expect } from 'vitest'
import {
  binomial,
  binomialRow,
  sumIdentity,
  symmetryPairs,
  pascalRule,
  hockeyStick,
  IDENTITY_OPTIONS,
} from './combinatorialProof'

describe('组合恒等式内核', () => {
  it('binomial 边界与已知值', () => {
    expect(binomial(0, 0)).toBe(1)
    expect(binomial(5, 0)).toBe(1)
    expect(binomial(5, 5)).toBe(1)
    expect(binomial(5, 2)).toBe(10)
    expect(binomial(10, 3)).toBe(120)
    expect(binomial(5, 6)).toBe(0) // 越界
    expect(binomial(5, -1)).toBe(0)
  })

  it('binomialRow 生成帕斯卡三角行', () => {
    expect(binomialRow(0)).toEqual([1])
    expect(binomialRow(4)).toEqual([1, 4, 6, 4, 1])
    expect(binomialRow(5)).toEqual([1, 5, 10, 10, 5, 1])
  })

  it('求和恒等式：整行之和 = 2^n', () => {
    for (let n = 0; n <= 15; n++) {
      const r = sumIdentity(n)
      expect(r.sum).toBe(2 ** n)
      expect(r.equal).toBe(true)
    }
  })

  it('对称恒等式：C(n,k) = C(n,n-k)', () => {
    const pairs = symmetryPairs(8)
    for (const p of pairs) expect(p.equal).toBe(true)
    expect(binomial(8, 3)).toBe(binomial(8, 5))
  })

  it('帕斯卡法则：C(n,k) = C(n-1,k-1)+C(n-1,k)', () => {
    for (let n = 1; n <= 12; n++) {
      for (let k = 0; k <= n; k++) {
        const r = pascalRule(n, k)
        expect(r.equal).toBe(true)
        expect(r.value).toBe(r.upperLeft + r.upperRight)
      }
    }
  })

  it('曲棍球棒恒等式：ΣC(i,r) = C(n+1,r+1)', () => {
    const r = hockeyStick(2, 6)
    // C(2,2)+C(3,2)+C(4,2)+C(5,2)+C(6,2) = 1+3+6+10+15 = 35 = C(7,3)
    expect(r.terms).toEqual([1, 3, 6, 10, 15])
    expect(r.sum).toBe(35)
    expect(r.closed).toBe(35)
    expect(r.equal).toBe(true)
  })

  it('曲棍球棒对多组参数均成立', () => {
    for (let rr = 0; rr <= 4; rr++) {
      for (let n = rr; n <= 10; n++) {
        expect(hockeyStick(rr, n).equal).toBe(true)
      }
    }
  })

  it('IDENTITY_OPTIONS 结构有效且 id 唯一', () => {
    expect(IDENTITY_OPTIONS.length).toBe(4)
    const ids = IDENTITY_OPTIONS.map((o) => o.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const o of IDENTITY_OPTIONS) {
      expect(o.label.length).toBeGreaterThan(0)
      expect(o.formula.length).toBeGreaterThan(0)
      expect(o.note.length).toBeGreaterThan(0)
    }
  })
})
