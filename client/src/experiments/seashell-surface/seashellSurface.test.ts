import { describe, it, expect } from 'vitest'
import {
  seashell, growthFactor, growthPerTurn, selfSimilarityRatio,
  radialTangentAngle, crossSectionRadius, DEFAULT_PARAMS, PRESETS,
  U_RANGE, V_RANGE,
} from './seashellSurface'

describe('海螺曲面', () => {
  const alphas = [1.52, 1.47, 1.4]

  it('生长因子在 u=0 处为 1', () => {
    for (const a of alphas) expect(growthFactor(0, a)).toBeCloseTo(1, 12)
  })

  it('生长因子随 u 单调递增(α < π/2)', () => {
    for (const a of alphas) {
      const gs = [0, 2, 4, 6].map((u) => growthFactor(u, a))
      for (let i = 1; i < gs.length; i++) expect(gs[i]).toBeGreaterThan(gs[i - 1])
    }
  })

  it('每圈放大倍数等于 exp(2π·cot α)', () => {
    for (const a of alphas) {
      expect(growthPerTurn(a)).toBeCloseTo(Math.exp((2 * Math.PI) / Math.tan(a)), 10)
    }
    // α=1.47 对应约 1.89 倍
    expect(growthPerTurn(1.47)).toBeCloseTo(1.888, 2)
  })

  it('自相似: x,y 坐标比值精确等于每圈放大倍数', () => {
    for (const a of alphas) {
      const p = { ...DEFAULT_PARAMS, alpha: a }
      for (const [u, v] of [[1, 0.5], [3, 2.0], [5, 4.0]]) {
        const { xRatio, yRatio, expected } = selfSimilarityRatio(u, v, p)
        expect(xRatio).toBeCloseTo(expected, 8)
        expect(yRatio).toBeCloseTo(expected, 8)
      }
    }
  })

  it('对数螺线的定角性质: 径向与切向夹角恒为 α', () => {
    for (const a of alphas) {
      for (const u of [0.5, 2, 4, 6]) {
        expect(radialTangentAngle(u, a)).toBeCloseTo(a, 5)
      }
    }
  })

  it('截面半径随生长因子同步放大, 等于 b·exp(u·cot α)', () => {
    for (const a of alphas) {
      const p = { ...DEFAULT_PARAMS, alpha: a }
      for (const u of [0, 1.5, 3.5]) {
        expect(crossSectionRadius(u, p)).toBeCloseTo(p.b * growthFactor(u, a), 8)
      }
    }
  })

  it('u=0 时螺体起点在基准位置', () => {
    const p = DEFAULT_PARAMS
    const q = seashell(0, 0, p)
    // g=1, radial=a+b, z=b·sin 0 = 0
    expect(q[0]).toBeCloseTo(p.a + p.b, 10)
    expect(q[1]).toBeCloseTo(0, 10)
    expect(q[2]).toBeCloseTo(0, 10)
  })

  it('到轴距离随盘绕角指数增长', () => {
    const rs = [0, 2, 4, 6].map((u) => {
      const q = seashell(u, 0)
      return Math.hypot(q[0], q[1])
    })
    for (let i = 1; i < rs.length; i++) expect(rs[i]).toBeGreaterThan(rs[i - 1])
    // 相邻两点比值应等于 exp(2·cot α)
    const want = Math.exp(2 / Math.tan(DEFAULT_PARAMS.alpha))
    expect(rs[1] / rs[0]).toBeCloseTo(want, 6)
  })

  it('α 越小生长越快', () => {
    const gs = [1.52, 1.47, 1.4].map((a) => growthPerTurn(a))
    for (let i = 1; i < gs.length; i++) expect(gs[i]).toBeGreaterThan(gs[i - 1])
  })

  it('默认参数三圈累计放大不超过 8 倍(保证画面可看)', () => {
    const total = growthFactor(6 * Math.PI, DEFAULT_PARAMS.alpha)
    expect(total).toBeLessThan(8)
    expect(total).toBeGreaterThan(2)
  })

  it('参数域内坐标全部有限', () => {
    for (const u of U_RANGE) {
      for (const v of V_RANGE) {
        expect(seashell(u, v).every(Number.isFinite)).toBe(true)
      }
    }
  })

  it('PRESETS 的每圈放大倍数与标注一致', () => {
    const want = [1.38, 1.89, 2.96]
    PRESETS.forEach((p, i) => {
      expect(growthPerTurn(p.alpha)).toBeCloseTo(want[i], 1)
    })
  })

  it('PRESETS 的 α 递减(生长逐渐加快)', () => {
    for (let i = 1; i < PRESETS.length; i++) {
      expect(PRESETS[i].alpha).toBeLessThan(PRESETS[i - 1].alpha)
    }
  })
})
