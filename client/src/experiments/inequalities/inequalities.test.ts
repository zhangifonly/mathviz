import { describe, it, expect } from 'vitest'
import {
  flipOp,
  satisfies,
  solveLinear,
  formatSolution,
  boundInclusive,
  pointsRight,
  INEQUALITY_OPTIONS,
} from './inequalities'

describe('不等式与数轴内核', () => {
  it('flipOp 正确翻转四种不等号', () => {
    expect(flipOp('<')).toBe('>')
    expect(flipOp('<=')).toBe('>=')
    expect(flipOp('>')).toBe('<')
    expect(flipOp('>=')).toBe('<=')
  })

  it('x + 2 > 5 解得 x > 3', () => {
    const sol = solveLinear({ a: 1, b: 2, c: 5, op: '>' })
    expect(sol.empty).toBe(false)
    expect(sol.all).toBe(false)
    expect(sol.bound).toBe(3)
    expect(sol.op).toBe('>')
  })

  it('2x - 1 ≤ 7 解得 x ≤ 4，除正数方向不变', () => {
    const sol = solveLinear({ a: 2, b: -1, c: 7, op: '<=' })
    expect(sol.bound).toBe(4)
    expect(sol.op).toBe('<=')
  })

  it('-3x + 1 < 10 除以负数需翻转为 x > -3', () => {
    const sol = solveLinear({ a: -3, b: 1, c: 10, op: '<' })
    expect(sol.bound).toBe(-3)
    expect(sol.op).toBe('>')
  })

  it('-x ≥ 4 乘 -1 翻转为 x ≤ -4', () => {
    const sol = solveLinear({ a: -1, b: 0, c: 4, op: '>=' })
    expect(sol.bound).toBe(-4)
    expect(sol.op).toBe('<=')
  })

  it('a=0 且恒成立时返回全体实数（0·x + 2 < 5）', () => {
    const sol = solveLinear({ a: 0, b: 2, c: 5, op: '<' })
    expect(sol.all).toBe(true)
    expect(sol.empty).toBe(false)
  })

  it('a=0 且矛盾时返回空集（0·x + 8 < 5）', () => {
    const sol = solveLinear({ a: 0, b: 8, c: 5, op: '<' })
    expect(sol.empty).toBe(true)
    expect(sol.all).toBe(false)
  })

  it('satisfies 边界点判定符合闭/开区间', () => {
    const open = solveLinear({ a: 1, b: 0, c: 3, op: '>' }) // x > 3
    expect(satisfies(3, open)).toBe(false)
    expect(satisfies(3.1, open)).toBe(true)
    const closed = solveLinear({ a: 1, b: 0, c: 3, op: '>=' }) // x >= 3
    expect(satisfies(3, closed)).toBe(true)
    expect(satisfies(2.9, closed)).toBe(false)
  })

  it('boundInclusive 与 pointsRight 方向/端点判定', () => {
    expect(boundInclusive('<=')).toBe(true)
    expect(boundInclusive('<')).toBe(false)
    expect(pointsRight('>')).toBe(true)
    expect(pointsRight('<=')).toBe(false)
  })

  it('formatSolution 文本正确', () => {
    expect(formatSolution({ empty: false, all: false, bound: 3, op: '>' })).toBe('x > 3')
    expect(formatSolution({ empty: false, all: false, bound: -1.5, op: '<=' })).toBe('x ≤ -1.5')
    expect(formatSolution({ empty: true, all: false, bound: 0, op: '<' })).toBe('无解（空集）')
    expect(formatSolution({ empty: false, all: true, bound: 0, op: '<' })).toBe('全体实数')
  })

  it('INEQUALITY_OPTIONS 每个都能求解且解与预期一致', () => {
    expect(INEQUALITY_OPTIONS.length).toBeGreaterThanOrEqual(4)
    const ids = new Set(INEQUALITY_OPTIONS.map((o) => o.id))
    expect(ids.size).toBe(INEQUALITY_OPTIONS.length) // id 唯一
    for (const opt of INEQUALITY_OPTIONS) {
      const sol = solveLinear(opt.ineq)
      expect(sol.empty).toBe(false)
      // 负系数选项解出后不等号方向应与原方向相反
      if (opt.ineq.a < 0) {
        expect(sol.op).toBe(flipOp(opt.ineq.op))
      }
    }
  })
})
