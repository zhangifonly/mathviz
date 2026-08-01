import { describe, it, expect } from 'vitest'
import {
  whitneyUmbrella, implicitResidual, selfIntersectionGap, selfIntersectionLine,
  UMBRELLA_POINT, jacobianColumns, jacobianRankDefect, isImmersive,
  sheetAngle, PRESETS, U_RANGE, V_RANGE,
} from './whitneyUmbrella'

describe('惠特尼伞', () => {
  it('参数化满足隐式方程 x² = y²·z', () => {
    for (let i = 0; i <= 25; i++) {
      for (let j = 0; j <= 25; j++) {
        const u = -1.3 + (2.6 * i) / 25
        const v = -1.3 + (2.6 * j) / 25
        expect(Math.abs(implicitResidual(whitneyUmbrella(u, v)))).toBeLessThan(1e-12)
      }
    }
  })

  it('自交线: (0,v) 与 (0,−v) 映到同一点', () => {
    for (const v of [0.3, 0.8, 1.2]) {
      expect(selfIntersectionGap(v)).toBeLessThan(1e-15)
    }
  })

  it('自交线落在 z 轴正半轴上', () => {
    for (const p of selfIntersectionLine(20)) {
      expect(Math.abs(p[0])).toBeLessThan(1e-15)
      expect(Math.abs(p[1])).toBeLessThan(1e-15)
      expect(p[2]).toBeGreaterThanOrEqual(0)
    }
  })

  it('自交线从伞点(原点)出发', () => {
    const line = selfIntersectionLine(20)
    expect(line[0]).toEqual([0, 0, 0])
    expect(line[line.length - 1][2]).toBeGreaterThan(1)
  })

  it('伞点是原点, 且在曲面上', () => {
    expect(UMBRELLA_POINT).toEqual([0, 0, 0])
    expect(Math.abs(implicitResidual(UMBRELLA_POINT))).toBe(0)
    expect(whitneyUmbrella(0, 0)).toEqual([0, 0, 0])
  })

  it('雅可比列向量与解析式一致: ∂f/∂u=(v,1,0), ∂f/∂v=(u,0,2v)', () => {
    for (const [u, v] of [[0.5, 0.3], [-1, 0.8]]) {
      const { du, dv } = jacobianColumns(u, v)
      expect(du).toEqual([v, 1, 0])
      expect(dv).toEqual([u, 0, 2 * v])
    }
  })

  it('原点处雅可比退化(秩从 2 掉到 1), 即不是浸入', () => {
    expect(jacobianRankDefect(0, 0)).toBeLessThan(1e-15)
    expect(isImmersive(0, 0)).toBe(false)
  })

  it('原点之外处处是浸入', () => {
    for (const [u, v] of [[0.5, 0.3], [0, 0.5], [1, 0], [0.8, -0.6], [-1.2, 1.1]]) {
      expect(isImmersive(u, v)).toBe(true)
      expect(jacobianRankDefect(u, v)).toBeGreaterThan(0.1)
    }
  })

  it('原点是唯一的退化点', () => {
    let degenerate = 0
    for (let i = 0; i <= 40; i++) {
      for (let j = 0; j <= 40; j++) {
        const u = -1.3 + (2.6 * i) / 40
        const v = -1.3 + (2.6 * j) / 40
        if (!isImmersive(u, v)) degenerate++
      }
    }
    // 网格上恰好命中原点一次
    expect(degenerate).toBeLessThanOrEqual(1)
  })

  it('两片曲面的夹角在伞点附近趋于零', () => {
    const angles = [0.05, 0.2, 0.6, 1.2].map((v) => sheetAngle(v))
    for (let i = 1; i < angles.length; i++) {
      expect(angles[i]).toBeGreaterThan(angles[i - 1])
    }
    // 极近伞点处两片几乎贴合
    expect(sheetAngle(0.05)).toBeLessThan(0.2)
    expect(sheetAngle(0)).toBe(0)
  })

  it('scale 线性缩放所有坐标', () => {
    for (const [u, v] of [[0.6, 0.4], [-1, 0.9]]) {
      const base = whitneyUmbrella(u, v, 1)
      const big = whitneyUmbrella(u, v, 3)
      base.forEach((c, i) => expect(big[i]).toBeCloseTo(c * 3, 10))
    }
  })

  it('z 分量恒非负(v² ≥ 0)', () => {
    for (let i = 0; i <= 20; i++) {
      for (let j = 0; j <= 20; j++) {
        const u = -1.3 + (2.6 * i) / 20
        const v = -1.3 + (2.6 * j) / 20
        expect(whitneyUmbrella(u, v)[2]).toBeGreaterThanOrEqual(0)
      }
    }
  })

  it('参数域内坐标全部有限', () => {
    for (const u of U_RANGE) {
      for (const v of V_RANGE) {
        expect(whitneyUmbrella(u, v).every(Number.isFinite)).toBe(true)
      }
    }
  })

  it('PRESETS 的 scale 递增且为正', () => {
    for (let i = 0; i < PRESETS.length; i++) {
      expect(PRESETS[i].scale).toBeGreaterThan(0)
      if (i > 0) expect(PRESETS[i].scale).toBeGreaterThan(PRESETS[i - 1].scale)
    }
  })
})
