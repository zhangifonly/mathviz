import { describe, it, expect } from 'vitest'
import {
  l84Field, l84FieldF, analyticDivergence, divergenceSignChangeX,
  waveEnergy, jetStrength, complexFormNoG, complexFormError,
  CLASSIC, START, SEASONS,
} from './lorenzAtmosphere'
import {
  lyapunovExponent, divergence, orbit, orbitExtent,
} from '../../lib/attractor3d'
import type { Vec3 } from '../../lib/proj3d'

describe('洛伦兹 84 大气模型', () => {
  const samples: Vec3[] = [[1.2, 0.5, 0.8], [0.3, -1, 0.6], [-0.5, 0.2, -0.9]]

  it('散度解析式 −a−2+2X 与数值求导一致', () => {
    const f = l84Field()
    for (const X of [0.3, 0.5, 1.125, 2, -0.4]) {
      expect(divergence(f, [X, 0.6, 0.4])).toBeCloseTo(analyticDivergence(X), 4)
    }
  })

  it('散度只依赖 X, 与 Y,Z 无关', () => {
    const f = l84Field()
    const base = divergence(f, [0.8, 0, 0])
    for (const [Y, Z] of [[1, 0], [0, 2], [-1.5, 0.7]]) {
      expect(divergence(f, [0.8, Y, Z])).toBeCloseTo(base, 4)
    }
  })

  it('散度变号临界 X = (a+2)/2, 两侧异号', () => {
    const xc = divergenceSignChangeX()
    expect(xc).toBeCloseTo((CLASSIC.a + 2) / 2, 12)
    expect(analyticDivergence(xc)).toBeCloseTo(0, 12)
    // 西风弱时耗散, 强时局部膨胀 —— 与蔡氏系统同一机制
    expect(analyticDivergence(xc - 0.5)).toBeLessThan(0)
    expect(analyticDivergence(xc + 0.5)).toBeGreaterThan(0)
  })

  it('冬季强迫 F=8 时混沌(λ₁ > 0)', () => {
    expect(lyapunovExponent(l84FieldF(8), START, 0.01, 25000)).toBeGreaterThan(0.05)
  })

  it('F=8 的混沌强于 F=6', () => {
    const summer = lyapunovExponent(l84FieldF(6), START, 0.01, 25000)
    const winter = lyapunovExponent(l84FieldF(8), START, 0.01, 25000)
    expect(winter).toBeGreaterThan(summer)
  })

  it('季节序列 F 单调递增', () => {
    for (let i = 1; i < SEASONS.length; i++) {
      expect(SEASONS[i].F).toBeGreaterThan(SEASONS[i - 1].F)
    }
    expect(SEASONS.length).toBe(3)
  })

  it('G=0 时后两个方程满足复数形式', () => {
    for (const q of samples) {
      expect(complexFormError(q, { ...CLASSIC, G: 0 })).toBeLessThan(1e-12)
    }
  })

  it('复数形式的实部为 X−1, 虚部为 b·X', () => {
    // Y=1,Z=0 时结果直接就是 (re, im)
    const [re, im] = complexFormNoG(1.5, 1, 0)
    expect(re).toBeCloseTo(1.5 - 1, 12)
    expect(im).toBeCloseTo(CLASSIC.b * 1.5, 12)
  })

  it('G≠0 时复数形式不再严格成立(G 只作用在 Y 上)', () => {
    // complexFormError 已把 G 减掉, 故仍为零; 直接比原式则差 G
    const f = l84Field()
    const q = samples[0]
    const [re] = complexFormNoG(q[0], q[1], q[2])
    expect(f(q)[1] - re).toBeCloseTo(CLASSIC.G, 12)
  })

  it('涡旋通过 −(Y²+Z²) 抽走西风能量', () => {
    const f = l84Field()
    const noEddy = f([1, 0, 0])[0]
    const withEddy = f([1, 0.8, 0.6])[0]
    expect(withEddy).toBeLessThan(noEddy)
    expect(noEddy - withEddy).toBeCloseTo(0.64 + 0.36, 12)
  })

  it('waveEnergy 就是 Y²+Z², jetStrength 就是 X', () => {
    expect(waveEnergy([1, 3, 4])).toBe(25)
    expect(jetStrength([2.5, 0, 0])).toBe(2.5)
  })

  it('无强迫无涡旋时西风按 −a·X 衰减', () => {
    const f = l84Field({ ...CLASSIC, F: 0, G: 0 })
    expect(f([2, 0, 0])[0]).toBeCloseTo(-CLASSIC.a * 2, 12)
    expect(f([0.5, 0, 0])[0]).toBeCloseTo(-CLASSIC.a * 0.5, 12)
  })

  it('强迫项 a·F 与 G 是唯一的常数驱动', () => {
    const f0 = l84Field({ ...CLASSIC, F: 0, G: 0 })
    const f1 = l84Field({ ...CLASSIC, F: 2, G: 1 })
    const p: Vec3 = [0.7, 0.3, -0.2]
    const d0 = f0(p)
    const d1 = f1(p)
    expect(d1[0] - d0[0]).toBeCloseTo(CLASSIC.a * 2, 12)
    expect(d1[1] - d0[1]).toBeCloseTo(1, 12)
    expect(d1[2] - d0[2]).toBeCloseTo(0, 12)
  })

  it('轨道有界且西风在合理范围内', () => {
    const pts = orbit(l84Field(), { start: START, dt: 0.01, steps: 15000, skip: 3000 })
    expect(pts.length).toBe(15000)
    const xs = pts.map(jetStrength)
    expect(Math.min(...xs)).toBeGreaterThan(-3)
    expect(Math.max(...xs)).toBeLessThan(5)
    expect(orbitExtent(pts)).toBeLessThan(15)
  })

  it('西风急流在强弱之间切换(对应阻塞与正常环流)', () => {
    const pts = orbit(l84Field(), { start: START, dt: 0.01, steps: 20000, skip: 3000 })
    const xs = pts.map(jetStrength)
    // 应同时出现明显强与明显弱的时段
    expect(Math.max(...xs) - Math.min(...xs)).toBeGreaterThan(1)
  })
})
