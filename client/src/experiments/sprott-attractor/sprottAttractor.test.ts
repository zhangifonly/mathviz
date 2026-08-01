import { describe, it, expect } from 'vitest'
import {
  sprottField, analyticDivergence, termCount, nonlinearCount, startOf,
  infoOf, CASES, CASE_INFO, REFERENCE_SYSTEMS, type SprottCase,
} from './sprottAttractor'
import {
  lyapunovExponent, divergence, orbit, orbitExtent, rk4Step,
} from '../../lib/attractor3d'
import type { Vec3 } from '../../lib/proj3d'

describe('斯普罗特极简吸引子', () => {
  it('三个 Case 信息完整', () => {
    expect(CASES.length).toBe(3)
    expect(CASE_INFO.length).toBe(3)
    for (const i of CASE_INFO) {
      expect(i.equations.length).toBeGreaterThan(10)
      expect(i.terms).toBe(5)
    }
  })

  it('都只有 5 项 —— 这就是「极简」的量化', () => {
    for (const c of CASES) expect(termCount(c)).toBe(5)
  })

  it('比洛伦兹与罗斯勒都少 2 项', () => {
    const sprott = REFERENCE_SYSTEMS.find((r) => r.name.includes('Sprott'))
    const lorenz = REFERENCE_SYSTEMS.find((r) => r.name.includes('洛伦兹'))
    const rossler = REFERENCE_SYSTEMS.find((r) => r.name.includes('罗斯勒'))
    expect(sprott?.terms).toBe(5)
    expect(lorenz?.terms).toBe(7)
    expect(rossler?.terms).toBe(7)
    expect(lorenz!.terms - sprott!.terms).toBe(2)
  })

  it('每个 Case 恰有 2 个二次项(从方程字符串数出)', () => {
    for (const c of CASES) expect(nonlinearCount(c)).toBe(2)
  })

  it('Case B 与 C 的散度恒为 −1', () => {
    for (const c of ['B', 'C'] as SprottCase[]) {
      for (const q of [[1, 1, 1], [-2, 0.5, 3]] as Vec3[]) {
        expect(divergence(sprottField(c), q)).toBeCloseTo(-1, 4)
        expect(analyticDivergence(c, q)).toBe(-1)
      }
    }
  })

  it('Case A 的散度逐点等于 z, 不是常数', () => {
    for (const z of [-2, 0, 1, 3]) {
      const q: Vec3 = [0.5, 0.7, z]
      expect(divergence(sprottField('A'), q)).toBeCloseTo(z, 4)
      expect(analyticDivergence('A', q)).toBe(z)
    }
  })

  it('Case A 的散度沿轨道时间平均趋于零 —— 这才是「保守」的正确含义', () => {
    let p = startOf('A')
    const f = sprottField('A')
    for (let i = 0; i < 3000; i++) p = rk4Step(f, p, 0.005)
    let sum = 0
    let n = 0
    for (let i = 0; i < 30000; i++) {
      p = rk4Step(f, p, 0.005)
      if (!Number.isFinite(p[0])) break
      sum += divergence(f, p)
      n++
    }
    expect(Math.abs(sum / n)).toBeLessThan(0.05)
  })

  it('CASE_INFO 里标 conservative 的只有 A', () => {
    expect(CASE_INFO.filter((i) => i.conservative).map((i) => i.id)).toEqual(['A'])
  })

  it('三个 Case 都混沌(λ₁ > 0) —— 保守的 A 也混沌', () => {
    for (const c of CASES) {
      const l = lyapunovExponent(sprottField(c), startOf(c), 0.005, 20000)
      expect(l).toBeGreaterThan(0.005)
    }
  })

  it('保守系统也能混沌: 耗散不是混沌的必要条件', () => {
    const a = lyapunovExponent(sprottField('A'), startOf('A'), 0.005, 20000)
    expect(a).toBeGreaterThan(0)
    expect(infoOf('A').conservative).toBe(true)
  })

  it('轨道都有界', () => {
    for (const c of CASES) {
      const pts = orbit(sprottField(c), {
        start: startOf(c), dt: 0.005, steps: 10000, skip: 3000,
      })
      expect(pts.length).toBe(10000)
      expect(orbitExtent(pts)).toBeLessThan(60)
      expect(orbitExtent(pts)).toBeGreaterThan(1)
    }
  })

  it('Case A 的方程就是 (y, −x+yz, 1−y²)', () => {
    const d = sprottField('A')([2, 3, 4])
    expect(d[0]).toBe(3)
    expect(d[1]).toBeCloseTo(-2 + 12, 12)
    expect(d[2]).toBeCloseTo(1 - 9, 12)
  })

  it('Case B 与 C 只差第三个方程(xy vs x²)', () => {
    const q: Vec3 = [2, 3, 4]
    const b = sprottField('B')(q)
    const c = sprottField('C')(q)
    expect(b[0]).toBe(c[0])
    expect(b[1]).toBe(c[1])
    expect(b[2]).toBeCloseTo(1 - 6, 12)
    expect(c[2]).toBeCloseTo(1 - 4, 12)
  })

  it('infoOf 能查到每个 Case, 未知有兜底', () => {
    for (const c of CASES) expect(infoOf(c).id).toBe(c)
    expect(infoOf('Z' as SprottCase).id).toBe('A')
  })
})
