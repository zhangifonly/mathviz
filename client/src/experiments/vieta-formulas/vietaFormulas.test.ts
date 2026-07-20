import { describe, it, expect } from 'vitest'
import {
  rootsToCoeffs,
  elementarySymmetric,
  vietaCheck,
  evalPoly,
  SAMPLE_ROOTS,
} from './vietaFormulas'

describe('韦达定理', () => {
  it('rootsToCoeffs: (x-1)(x-3) = x^2 -4x +3', () => {
    // 升幂 [3, -4, 1]
    expect(rootsToCoeffs([1, 3])).toEqual([3, -4, 1])
  })

  it('rootsToCoeffs: 三次 (x+1)(x-1)(x-2) 展开正确', () => {
    // (x^2-1)(x-2) = x^3 -2x^2 -x +2 -> 升幂 [2,-1,-2,1]
    expect(rootsToCoeffs([-1, 1, 2])).toEqual([2, -1, -2, 1])
  })

  it('还原的多项式在每个根处取值为 0', () => {
    for (const roots of SAMPLE_ROOTS) {
      const c = rootsToCoeffs(roots)
      for (const r of roots) {
        expect(Math.abs(evalPoly(c, r))).toBeLessThan(1e-9)
      }
    }
  })

  it('elementarySymmetric: e0=1, e1=和, en=积', () => {
    const roots = [-2, 4]
    expect(elementarySymmetric(roots, 0)).toBe(1)
    expect(elementarySymmetric(roots, 1)).toBe(2) // -2+4
    expect(elementarySymmetric(roots, 2)).toBe(-8) // -2*4
    expect(elementarySymmetric([-1, 1, 2], 2)).toBe(-1) // -1 + -2 + 2
  })

  it('elementarySymmetric 与系数关系: a_{n-k} = (-1)^k e_k', () => {
    const roots = [-1, 1, 2]
    const c = rootsToCoeffs(roots) // 升幂
    const n = roots.length
    for (let k = 0; k <= n; k++) {
      const expected = (k % 2 === 0 ? 1 : -1) * elementarySymmetric(roots, k)
      expect(c[n - k]).toBeCloseTo(expected, 9)
    }
  })

  it('vietaCheck: 和=-a_{n-1}/a_n, 积=(-1)^n a0/a_n 全部匹配', () => {
    for (const roots of SAMPLE_ROOTS) {
      const r = vietaCheck(roots)
      expect(r.sumMatches).toBe(true)
      expect(r.productMatches).toBe(true)
      expect(r.sum).toBeCloseTo(r.sumFromCoeffs, 9)
      expect(r.product).toBeCloseTo(r.productFromCoeffs, 9)
    }
  })

  it('vietaCheck 二次经典: 和=-b/a, 积=c/a', () => {
    const r = vietaCheck([1, 3]) // x^2-4x+3, a=1,b=-4,c=3
    expect(r.sum).toBe(4)
    expect(r.product).toBe(3)
  })
})
