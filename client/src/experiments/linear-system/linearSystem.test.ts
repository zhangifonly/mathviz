import { describe, it, expect } from 'vitest'
import {
  determinant,
  solveLinearSystem,
  yAt,
  isVertical,
  formatEquation,
  SYSTEM_OPTIONS,
} from './linearSystem'

describe('二元一次方程组', () => {
  it('determinant 计算系数行列式', () => {
    // D = 1*(-1) - 2*1 = -3
    expect(determinant({ a: 1, b: 1, c: 5 }, { a: 2, b: -1, c: 1 })).toBe(-3)
  })

  it('唯一解：x+y=5, 2x-y=1 → x=2, y=3', () => {
    const sol = solveLinearSystem({ a: 1, b: 1, c: 5 }, { a: 2, b: -1, c: 1 })
    expect(sol.type).toBe('unique')
    expect(sol.x).toBeCloseTo(2, 9)
    expect(sol.y).toBeCloseTo(3, 9)
  })

  it('解代回两个方程都成立', () => {
    const eq1 = { a: 3, b: -2, c: 4 }
    const eq2 = { a: 1, b: 5, c: 7 }
    const sol = solveLinearSystem(eq1, eq2)
    expect(sol.type).toBe('unique')
    expect(eq1.a * sol.x! + eq1.b * sol.y!).toBeCloseTo(eq1.c, 9)
    expect(eq2.a * sol.x! + eq2.b * sol.y!).toBeCloseTo(eq2.c, 9)
  })

  it('平行线无解', () => {
    const sol = solveLinearSystem({ a: 1, b: -1, c: 1 }, { a: 1, b: -1, c: -2 })
    expect(sol.type).toBe('none')
  })

  it('重合线无穷多解', () => {
    const sol = solveLinearSystem({ a: 1, b: 2, c: 4 }, { a: 2, b: 4, c: 8 })
    expect(sol.type).toBe('infinite')
  })

  it('yAt 在直线上取点', () => {
    // 2x + y = 6 → x=1 时 y=4
    expect(yAt({ a: 2, b: 1, c: 6 }, 1)).toBeCloseTo(4, 9)
    // 竖直线 b=0 返回 null
    expect(yAt({ a: 1, b: 0, c: 3 }, 0)).toBeNull()
  })

  it('isVertical 判断竖直线', () => {
    expect(isVertical({ a: 1, b: 0, c: 3 })).toBe(true)
    expect(isVertical({ a: 1, b: 1, c: 3 })).toBe(false)
  })

  it('formatEquation 生成可读字符串', () => {
    expect(formatEquation({ a: 2, b: 3, c: 6 })).toBe('2x + 3y = 6')
    expect(formatEquation({ a: 1, b: -1, c: 0 })).toBe('x - y = 0')
  })

  it('SYSTEM_OPTIONS 三种情况解类型正确', () => {
    const byId = Object.fromEntries(SYSTEM_OPTIONS.map((o) => [o.id, o]))
    expect(solveLinearSystem(byId.unique.eq1, byId.unique.eq2).type).toBe('unique')
    expect(solveLinearSystem(byId.parallel.eq1, byId.parallel.eq2).type).toBe('none')
    expect(solveLinearSystem(byId.coincident.eq1, byId.coincident.eq2).type).toBe('infinite')
  })

  it('SYSTEM_OPTIONS 都有非退化系数', () => {
    for (const opt of SYSTEM_OPTIONS) {
      expect(opt.eq1.a !== 0 || opt.eq1.b !== 0).toBe(true)
      expect(opt.eq2.a !== 0 || opt.eq2.b !== 0).toBe(true)
    }
  })
})
