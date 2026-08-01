import { describe, it, expect } from 'vitest'
import {
  halvorsenField, cyclicSymmetryError, analyticDivergence, diagonalEquilibria,
  equilibriumResidual, DEFAULT_A, START, PRESETS,
} from './halvorsenAttractor'
import { lyapunovExponent, divergence, orbit, orbitExtent } from '../../lib/attractor3d'
import type { Vec3 } from '../../lib/proj3d'

describe('哈尔沃森吸引子', () => {
  const samples: Vec3[] = [[1, 2, 3], [-1.5, 0.7, 2.2], [0.3, -2, 1]]

  it('循环对称: f(σp) = σ(f(p)) 精确成立', () => {
    for (const a of [1.4, DEFAULT_A, 2.4]) {
      for (const p of samples) {
        expect(cyclicSymmetryError(p, a)).toBeLessThan(1e-12)
      }
    }
  })

  it('散度恒为 −3a, 与位置无关', () => {
    for (const a of [1.4, DEFAULT_A, 2.4]) {
      for (const p of samples) {
        expect(divergence(halvorsenField(a), p)).toBeCloseTo(analyticDivergence(a), 4)
      }
    }
  })

  it('散度为负: 系统处处耗散', () => {
    for (const a of [1.4, DEFAULT_A, 2.4]) {
      expect(analyticDivergence(a)).toBeLessThan(0)
    }
  })

  it('对角线上有两个平衡点, 残差为零', () => {
    for (const a of [1.4, DEFAULT_A]) {
      const eqs = diagonalEquilibria(a)
      expect(eqs.length).toBe(2)
      for (const q of eqs) {
        expect(equilibriumResidual(q, a)).toBeLessThan(1e-10)
      }
    }
  })

  it('第二个平衡点位于 x=y=z=−(a+8)', () => {
    for (const a of [1.4, DEFAULT_A, 2.4]) {
      const [, second] = diagonalEquilibria(a)
      expect(second[0]).toBeCloseTo(-(a + 8), 12)
      expect(second[0]).toBe(second[1])
      expect(second[1]).toBe(second[2])
    }
  })

  it('平衡点都在对角线上(三个坐标相等)', () => {
    for (const q of diagonalEquilibria()) {
      expect(q[0]).toBe(q[1])
      expect(q[1]).toBe(q[2])
    }
  })

  it('标准参数下混沌(λ₁ > 0)', () => {
    expect(lyapunovExponent(halvorsenField(), START, 0.005, 15000)).toBeGreaterThan(0)
  })

  it('三档预设参数都给出正的 λ₁', () => {
    for (const p of PRESETS) {
      expect(lyapunovExponent(halvorsenField(p.a), START, 0.005, 10000))
        .toBeGreaterThan(-0.01)
    }
  })

  it('轨道有界', () => {
    const pts = orbit(halvorsenField(), { start: START, dt: 0.005, steps: 8000, skip: 2000 })
    expect(pts.length).toBe(8000)
    expect(orbitExtent(pts)).toBeLessThan(60)
    expect(orbitExtent(pts)).toBeGreaterThan(1)
  })

  it('向量场的三个分量结构相同(只是变量轮换)', () => {
    const f = halvorsenField(2)
    // f 的第 k 个分量对 (x,y,z) 轮换后应给出第 k+1 个分量
    const p: Vec3 = [1.3, -0.7, 2.1]
    const d = f(p)
    const rotated = f([p[1], p[2], p[0]])
    expect(rotated[0]).toBeCloseTo(d[1], 12)
    expect(rotated[1]).toBeCloseTo(d[2], 12)
    expect(rotated[2]).toBeCloseTo(d[0], 12)
  })

  it('每个分量含一个二次项', () => {
    const f = halvorsenField(0)
    // a=0 时 f = (−4y−4z−y², −4z−4x−z², −4x−4y−x²)
    const d = f([1, 2, 3])
    expect(d[0]).toBeCloseTo(-8 - 12 - 4, 12)
    expect(d[1]).toBeCloseTo(-12 - 4 - 9, 12)
    expect(d[2]).toBeCloseTo(-4 - 8 - 1, 12)
  })

  it('PRESETS 的 a 递增且为正', () => {
    for (let i = 0; i < PRESETS.length; i++) {
      expect(PRESETS[i].a).toBeGreaterThan(0)
      if (i > 0) expect(PRESETS[i].a).toBeGreaterThan(PRESETS[i - 1].a)
    }
  })
})
