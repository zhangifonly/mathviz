import { describe, it, expect } from 'vitest'
import { derivative, rk4Step, simulate, orbitRadius, MU_VALUES } from './limitCycle'

describe('范德波尔极限环', () => {
  it('derivative 满足一阶系统定义', () => {
    // x' = y
    expect(derivative(1, 2, 5)[0]).toBe(5)
    // y' = mu(1-x^2)y - x，取 x=0,y=1,mu=2 => 2*1*1 - 0 = 2
    expect(derivative(2, 0, 1)[1]).toBeCloseTo(2, 10)
    // x=1 时 (1-x^2)=0，故 y' = -x = -1
    expect(derivative(3, 1, 9)[1]).toBeCloseTo(-1, 10)
  })

  it('rk4Step 在原点保持不动（不稳定平衡点）', () => {
    const p = rk4Step(1, 0, 0, 0.01)
    expect(p.x).toBeCloseTo(0, 10)
    expect(p.y).toBeCloseTo(0, 10)
  })

  it('simulate 返回 steps+1 个点，且数值有限', () => {
    const path = simulate(1, 0.1, 0, 2000, 0.01)
    expect(path.length).toBe(2001)
    for (const pt of path) {
      expect(Number.isFinite(pt.x)).toBe(true)
      expect(Number.isFinite(pt.y)).toBe(true)
    }
  })

  it('内外不同初值收敛到同一极限环（半径接近）', () => {
    const mu = 1
    const inner = simulate(mu, 0.05, 0.05, 6000, 0.01)
    const outer = simulate(mu, 3.5, 3.5, 6000, 0.01)
    const rInner = orbitRadius(inner)
    const rOuter = orbitRadius(outer)
    // 两条轨线的稳态幅度应当非常接近同一环
    expect(Math.abs(rInner - rOuter)).toBeLessThan(0.3)
    // 极限环幅度约为 2 附近
    expect(rInner).toBeGreaterThan(1.5)
    expect(rInner).toBeLessThan(3)
  })

  it('极限环幅度随 mu 变化但保持有界', () => {
    for (const mu of MU_VALUES) {
      const path = simulate(mu, 0.1, 0, 8000, 0.008)
      const r = orbitRadius(path)
      // x 幅度稳定在 2 附近，但 mu 越大速度 y 的尖峰越高，故上界放宽
      expect(r).toBeGreaterThan(1.5)
      expect(r).toBeLessThan(8)
    }
  })

  it('MU_VALUES 为递增正数组', () => {
    expect(MU_VALUES.length).toBeGreaterThanOrEqual(3)
    for (let i = 0; i < MU_VALUES.length; i++) {
      expect(MU_VALUES[i]).toBeGreaterThan(0)
      if (i > 0) expect(MU_VALUES[i]).toBeGreaterThan(MU_VALUES[i - 1])
    }
  })
})
