import { describe, it, expect } from 'vitest'
import {
  chuaDiode, chuaField, chuaFieldAlpha, equilibria, equilibriumResidual,
  diodeSlope, paramsOf, CLASSIC, START, PRESETS,
} from './chuaAttractor'
import { lyapunovExponent, divergence, orbit, orbitExtent } from '../../lib/attractor3d'

describe('蔡氏电路吸引子', () => {
  it('三个平衡点的残差精确为零', () => {
    for (const q of equilibria()) {
      expect(equilibriumResidual(q)).toBeLessThan(1e-12)
    }
    expect(equilibria().length).toBe(3)
  })

  it('平衡点关于原点对称', () => {
    const [origin, a, b] = equilibria()
    expect(origin).toEqual([0, 0, 0])
    for (let k = 0; k < 3; k++) expect(b[k]).toBeCloseTo(-a[k], 12)
  })

  it('外侧平衡点的 x 与 z 互为相反数', () => {
    for (const q of equilibria().slice(1)) {
      expect(q[2]).toBeCloseTo(-q[0], 12)
      expect(q[1]).toBe(0)
    }
  })

  it('蔡氏二极管是分段线性: 内段斜率 m0, 外段 m1', () => {
    for (const x of [-0.5, 0, 0.5]) {
      expect(diodeSlope(x)).toBeCloseTo(CLASSIC.m0, 3)
    }
    for (const x of [-2, 2, 3]) {
      expect(diodeSlope(x)).toBeCloseTo(CLASSIC.m1, 3)
    }
  })

  it('二极管函数是奇函数', () => {
    for (const x of [0.3, 1.5, 2.8]) {
      expect(chuaDiode(-x, CLASSIC.m0, CLASSIC.m1))
        .toBeCloseTo(-chuaDiode(x, CLASSIC.m0, CLASSIC.m1), 12)
    }
  })

  it('二极管在原点取零', () => {
    expect(chuaDiode(0, CLASSIC.m0, CLASSIC.m1)).toBeCloseTo(0, 12)
  })

  it('经典参数下是混沌的(λ₁ > 0)', () => {
    const l = lyapunovExponent(chuaField(), START, 0.005, 15000)
    expect(l).toBeGreaterThan(0.1)
  })

  it('α 降到 10 时不再混沌(λ₁ ≤ 0) —— 这让正值有意义', () => {
    const l = lyapunovExponent(chuaField(paramsOf(10, 28)), START, 0.005, 15000)
    expect(l).toBeLessThan(0.05)
  })

  it('散度分段变号: 内段为正(膨胀), 外段为负(收缩)', () => {
    // 这正是双涡卷的机制 —— 内段把轨道推开, 外段再拉回来, 交替造成混沌。
    // 解析式 div = −α(1+h′(x)) − 1, 内段 h′=m₀ 使它为正, 外段 h′=m₁ 使它为负。
    for (const p of [[0, 0.2, 0.1], [0.5, 0.2, 0.1]] as Array<[number, number, number]>) {
      expect(divergence(chuaField(), p)).toBeGreaterThan(0)
    }
    for (const p of [[2, 0.3, -1], [-2, 0.3, 1]] as Array<[number, number, number]>) {
      expect(divergence(chuaField(), p)).toBeLessThan(0)
    }
  })

  it('散度与解析式 −α(1+h′(x))−1 一致', () => {
    const inner = -CLASSIC.alpha * (1 + CLASSIC.m0) - 1
    const outer = -CLASSIC.alpha * (1 + CLASSIC.m1) - 1
    expect(divergence(chuaField(), [0.5, 0.2, 0.1])).toBeCloseTo(inner, 3)
    expect(divergence(chuaField(), [2, 0.3, -1])).toBeCloseTo(outer, 3)
  })

  it('轨道有界(落在吸引子上)', () => {
    const pts = orbit(chuaField(), { start: START, dt: 0.005, steps: 8000, skip: 3000 })
    expect(pts.length).toBe(8000)
    expect(orbitExtent(pts)).toBeLessThan(30)
    expect(orbitExtent(pts)).toBeGreaterThan(1)
  })

  it('轨道会跨越两个涡卷(x 取到正负两侧)', () => {
    const pts = orbit(chuaField(), { start: START, dt: 0.005, steps: 20000, skip: 3000 })
    const xs = pts.map((p) => p[0])
    expect(Math.min(...xs)).toBeLessThan(-0.5)
    expect(Math.max(...xs)).toBeGreaterThan(0.5)
  })

  it('dz/dt 只依赖 y', () => {
    const f = chuaField()
    const a = f([1, 0.5, 3])
    const b = f([-2, 0.5, -7])
    expect(a[2]).toBeCloseTo(b[2], 12)
    expect(a[2]).toBeCloseTo(-CLASSIC.beta * 0.5, 12)
  })

  it('paramsOf 只改 α,β 保留二极管斜率', () => {
    const p = paramsOf(20, 30)
    expect(p.alpha).toBe(20)
    expect(p.beta).toBe(30)
    expect(p.m0).toBe(CLASSIC.m0)
    expect(p.m1).toBe(CLASSIC.m1)
  })

  it('PRESETS 的 α 递增, 且首档故意取非混沌值作对照', () => {
    for (let i = 0; i < PRESETS.length; i++) {
      expect(PRESETS[i].alpha).toBeGreaterThan(0)
      if (i > 0) expect(PRESETS[i].alpha).toBeGreaterThan(PRESETS[i - 1].alpha)
    }
    // 首档 α=10 的 λ₁ 应为负 —— 有对照才能说明「λ₁>0 才是混沌」
    const l = lyapunovExponent(chuaFieldAlpha(PRESETS[0].alpha), START, 0.005, 12000)
    expect(l).toBeLessThan(0.05)
  })
})
