import { describe, it, expect } from 'vitest'
import {
  objective,
  gradObjective,
  constraint,
  gradConstraint,
  cross,
  norm,
  solveCircle,
  objectiveOnCircle,
  LAGRANGE_PROBLEMS,
} from './lagrangeMultiplier'

describe('拉格朗日乘数法内核', () => {
  it('线性目标与梯度', () => {
    expect(objective(1, 2, 3, 4)).toBe(11)
    expect(gradObjective(1, 2)).toEqual([1, 2])
  })

  it('圆约束在圆上取 0，圆内为负', () => {
    expect(constraint(1, 0, 1)).toBeCloseTo(0)
    expect(constraint(0, 0, 1)).toBe(-1)
    expect(gradConstraint(3, 4)).toEqual([6, 8])
  })

  it('极值点处 ∇f 与 ∇g 平行（叉积为 0）', () => {
    const sol = solveCircle(1, 2, 1.5, 'max')
    const gf = gradObjective(1, 2)
    const gg = gradConstraint(sol.x, sol.y)
    expect(cross(gf, gg)).toBeCloseTo(0, 10)
  })

  it('f=x 在单位圆上最大值点为 (1,0)，最大值 1', () => {
    const sol = solveCircle(1, 0, 1, 'max')
    expect(sol.x).toBeCloseTo(1)
    expect(sol.y).toBeCloseTo(0)
    expect(sol.value).toBeCloseTo(1)
  })

  it('最大值等于 r·|∇f|（这里 f=x+y，r=1 → 根号二）', () => {
    const sol = solveCircle(1, 1, 1, 'max')
    expect(sol.value).toBeCloseTo(Math.SQRT2, 10)
    expect(sol.value).toBeCloseTo(1 * norm([1, 1]), 10)
  })

  it('最小值是最大值的相反数，位置对径相反', () => {
    const max = solveCircle(1, 2, 1.2, 'max')
    const min = solveCircle(1, 2, 1.2, 'min')
    expect(min.value).toBeCloseTo(-max.value, 10)
    expect(min.x).toBeCloseTo(-max.x, 10)
    expect(min.y).toBeCloseTo(-max.y, 10)
  })

  it('解点在圆上（满足约束）', () => {
    const sol = solveCircle(2, -3, 2, 'max')
    expect(constraint(sol.x, sol.y, 2)).toBeCloseTo(0, 10)
  })

  it('λ 满足 ∇f = λ·∇g', () => {
    const a = 3
    const b = 4
    const r = 2
    const sol = solveCircle(a, b, r, 'max')
    const gg = gradConstraint(sol.x, sol.y)
    expect(sol.lambda * gg[0]).toBeCloseTo(a, 10)
    expect(sol.lambda * gg[1]).toBeCloseTo(b, 10)
  })

  it('圆上采样：解析最大值确为全圆上界', () => {
    const a = 1
    const b = 2
    const r = 1.3
    const sol = solveCircle(a, b, r, 'max')
    for (let t = 0; t < Math.PI * 2; t += 0.05) {
      expect(objectiveOnCircle(a, b, r, t)).toBeLessThanOrEqual(sol.value + 1e-9)
    }
  })

  it('LAGRANGE_PROBLEMS 均可解且平行条件成立', () => {
    for (const p of LAGRANGE_PROBLEMS) {
      const sol = solveCircle(p.a, p.b, p.r, 'max')
      expect(constraint(sol.x, sol.y, p.r)).toBeCloseTo(0, 8)
      expect(cross(gradObjective(p.a, p.b), gradConstraint(sol.x, sol.y))).toBeCloseTo(0, 8)
    }
  })
})
