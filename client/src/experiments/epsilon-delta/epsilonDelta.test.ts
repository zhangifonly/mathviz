import { describe, it, expect } from 'vitest'
import { findDelta, withinEpsilon, FUNCTIONS, EPSILONS, a, L } from './epsilonDelta'

describe('ε-δ 极限定义', () => {
  const lin = FUNCTIONS[0] // f(x)=2x+1, a=1, L=3

  it('线性函数 δ 约为 ε/2（斜率为2）', () => {
    const eps = 0.4
    const delta = findDelta(lin.fn, lin.a, lin.L, eps)
    // |2x+1-3|=2|x-1|<eps  <=>  |x-1|<eps/2
    expect(delta).toBeGreaterThan(0)
    expect(delta).toBeLessThanOrEqual(eps / 2 + 1e-3)
    expect(delta).toBeGreaterThan(eps / 2 - 0.01)
  })

  it('ε 越小 δ 越小（单调收缩）', () => {
    const sq = FUNCTIONS[1]
    let prev = Infinity
    for (const eps of EPSILONS) {
      const d = findDelta(sq.fn, sq.a, sq.L, eps)
      expect(d).toBeLessThanOrEqual(prev + 1e-9)
      prev = d
    }
  })

  it('δ 内的点确实落在容差带内', () => {
    for (const f of FUNCTIONS) {
      const eps = 0.3
      const d = findDelta(f.fn, f.a, f.L, eps)
      // 取 δ 内一点，应满足 |f(x)-L|<eps
      const x = f.a + d * 0.5
      expect(withinEpsilon(f.fn, f.L, eps, x)).toBe(true)
    }
  })

  it('withinEpsilon 在极限点判定正确', () => {
    // f(a)=L 时差为0，任意正 eps 都满足
    expect(withinEpsilon(lin.fn, lin.L, 0.01, lin.a)).toBe(true)
    // 远离时不满足
    expect(withinEpsilon(lin.fn, lin.L, 0.1, lin.a + 1)).toBe(false)
  })

  it('eps<=0 返回 δ=0', () => {
    expect(findDelta(lin.fn, lin.a, lin.L, 0)).toBe(0)
    expect(findDelta(lin.fn, lin.a, lin.L, -1)).toBe(0)
  })

  it('所有预设函数在极限点函数值等于 L', () => {
    for (const f of FUNCTIONS) {
      expect(Math.abs(f.fn(f.a) - f.L)).toBeLessThan(1e-9)
    }
    expect(a).toBe(1)
    expect(L).toBe(3)
  })
})
