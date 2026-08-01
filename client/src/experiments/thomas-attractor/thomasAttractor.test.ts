import { describe, it, expect } from 'vitest'
import {
  thomasField, cyclicSymmetryError, analyticDivergence, originResidual,
  diagonalRoot, boundEstimate, DEFAULT_B, START, PRESETS,
} from './thomasAttractor'
import { lyapunovExponent, divergence, orbit, orbitExtent } from '../../lib/attractor3d'
import type { Vec3 } from '../../lib/proj3d'

describe('托马斯吸引子', () => {
  const samples: Vec3[] = [[1, 2, 3], [-1.5, 0.7, 2.2], [0.3, -2, 1]]

  it('循环对称: f(σp) = σ(f(p))', () => {
    for (const b of [0.1, DEFAULT_B, 0.5]) {
      for (const p of samples) {
        expect(cyclicSymmetryError(p, b)).toBeLessThan(1e-12)
      }
    }
  })

  it('散度恒为 −3b, 与位置无关', () => {
    for (const b of [0.1, DEFAULT_B, 0.5]) {
      for (const p of samples) {
        expect(divergence(thomasField(b), p)).toBeCloseTo(analyticDivergence(b), 4)
      }
    }
  })

  it('原点恒为平衡点(sin 0 = 0)', () => {
    for (const b of [0.1, DEFAULT_B, 0.5, 1.5]) {
      expect(originResidual(b)).toBeLessThan(1e-15)
    }
  })

  it('b 越大阻尼越强, 散度越负', () => {
    const ds = [0.1, 0.2, 0.5].map((b) => analyticDivergence(b))
    for (let i = 1; i < ds.length; i++) expect(ds[i]).toBeLessThan(ds[i - 1])
  })

  it('对角线根满足 sin x = b·x', () => {
    for (const b of [0.5, 0.32, DEFAULT_B, 0.1]) {
      const r = diagonalRoot(b)
      expect(Math.abs(Math.sin(r) - b * r)).toBeLessThan(1e-10)
      expect(r).toBeGreaterThan(0)
      expect(r).toBeLessThan(Math.PI)
    }
  })

  it('b 越小对角线根越接近 π', () => {
    const rs = [0.5, 0.32, 0.1].map((b) => diagonalRoot(b))
    for (let i = 1; i < rs.length; i++) expect(rs[i]).toBeGreaterThan(rs[i - 1])
    expect(diagonalRoot(0.01)).toBeGreaterThan(3.0)
  })

  it('b ≥ 1 时无非零对角线根', () => {
    expect(diagonalRoot(1)).toBe(0)
    expect(diagonalRoot(2)).toBe(0)
  })

  it('b=0.5 时收敛到不动点(λ₁ < 0, 轨道尺度趋零)', () => {
    expect(lyapunovExponent(thomasField(0.5), START, 0.01, 20000)).toBeLessThan(0)
    const pts = orbit(thomasField(0.5), { start: START, dt: 0.01, steps: 20000, skip: 5000 })
    expect(orbitExtent(pts)).toBeLessThan(0.5)
  })

  it('b=0.208 时混沌(λ₁ > 0)', () => {
    expect(lyapunovExponent(thomasField(DEFAULT_B), START, 0.01, 25000))
      .toBeGreaterThan(0.005)
  })

  it('b 越小混沌越强, 轨道范围越大', () => {
    const e1 = orbitExtent(orbit(thomasField(0.208186), {
      start: START, dt: 0.01, steps: 20000, skip: 5000,
    }))
    const e2 = orbitExtent(orbit(thomasField(0.1), {
      start: START, dt: 0.01, steps: 20000, skip: 5000,
    }))
    expect(e2).toBeGreaterThan(e1)
  })

  it('轨道被限制在 |x| ≤ 1/b 附近(sin 有界于 1)', () => {
    const b = DEFAULT_B
    const bound = boundEstimate(b)
    expect(bound).toBeCloseTo(1 / b, 10)
    const pts = orbit(thomasField(b), { start: START, dt: 0.01, steps: 20000, skip: 5000 })
    for (const p of pts) {
      for (const c of p) expect(Math.abs(c)).toBeLessThan(bound * 1.5)
    }
  })

  it('向量场三个分量结构相同(变量轮换)', () => {
    const f = thomasField(0.3)
    const p: Vec3 = [1.3, -0.7, 2.1]
    const d = f(p)
    const rot = f([p[1], p[2], p[0]])
    expect(rot[0]).toBeCloseTo(d[1], 12)
    expect(rot[1]).toBeCloseTo(d[2], 12)
    expect(rot[2]).toBeCloseTo(d[0], 12)
  })

  it('PRESETS 覆盖收敛/极限环/混沌三种状态且 b 递减', () => {
    expect(PRESETS.length).toBe(4)
    for (let i = 1; i < PRESETS.length; i++) {
      expect(PRESETS[i].b).toBeLessThan(PRESETS[i - 1].b)
    }
    expect(PRESETS[0].b).toBeGreaterThan(0.4)
    expect(PRESETS[PRESETS.length - 1].b).toBeLessThan(0.15)
  })
})
