import { describe, it, expect } from 'vitest'
import {
  pseudosphere, tractrix, gaussianCurvature, firstFundamental,
  surfaceArea, surfaceAreaNumeric, tangentSegmentLength, PRESETS,
  U_RANGE, V_RANGE,
} from './pseudosphere'

describe('伪球面', () => {
  it('是旋转面: 到 z 轴距离只由 u 决定', () => {
    for (const u of [0.2, 0.8, 2.1]) {
      const rs = [0, 1, 2.5, 4.4].map((v) => {
        const p = pseudosphere(u, v)
        return Math.hypot(p[0], p[1])
      })
      for (const r of rs) expect(r).toBeCloseTo(1 / Math.cosh(u), 12)
    }
  })

  it('母线就是曳物线, 与曲面 r/z 一致', () => {
    for (const u of [0.3, 1.2, 2.7]) {
      const t = tractrix(u)
      const p = pseudosphere(u, 0)
      expect(Math.hypot(p[0], p[1])).toBeCloseTo(t.r, 12)
      expect(p[2]).toBeCloseTo(t.z, 12)
    }
  })

  it('高斯曲率恒为 -1/a², 与位置无关', () => {
    expect(gaussianCurvature(1)).toBeCloseTo(-1, 12)
    expect(gaussianCurvature(2)).toBeCloseTo(-0.25, 12)
    expect(gaussianCurvature(0.5)).toBeCloseTo(-4, 12)
  })

  it('曲率恒为负: 每一点都是鞍形', () => {
    for (const a of [0.4, 1, 3.3]) expect(gaussianCurvature(a)).toBeLessThan(0)
  })

  it('半径随 u 增大单调收缩趋于 0(尖端)', () => {
    const rs = [0.1, 0.5, 1, 2, 4, 8].map((u) => tractrix(u).r)
    for (let i = 1; i < rs.length; i++) expect(rs[i]).toBeLessThan(rs[i - 1])
    expect(tractrix(20).r).toBeCloseTo(0, 6)
  })

  it('z 随 u 单调递增(母线一路向上)', () => {
    const zs = [0.1, 0.5, 1, 2, 4].map((u) => tractrix(u).z)
    for (let i = 1; i < zs.length; i++) expect(zs[i]).toBeGreaterThan(zs[i - 1])
  })

  it('u→0 时收敛到赤道圈 r=a, z=0', () => {
    const t = tractrix(1e-6)
    expect(t.r).toBeCloseTo(1, 8)
    expect(t.z).toBeCloseTo(0, 8)
  })

  it('第一基本形式 F=0, 且 G=a²sech²u', () => {
    for (const u of [0.4, 1.1, 2.6]) {
      const { F, G } = firstFundamental(u, 1.3)
      expect(F).toBe(0)
      expect(G).toBeCloseTo(1.3 ** 2 / Math.cosh(u) ** 2, 12)
    }
  })

  it('曳物线的定义性质: 切线到 z 轴的线段长恒为 a', () => {
    // 这就是「拖拉」得名的由来: 拉一根定长绳子拖动重物走出的轨迹
    for (const a of [0.7, 1, 2.2]) {
      for (const u of [0.3, 0.8, 1.5, 2.5]) {
        expect(tangentSegmentLength(u, a)).toBeCloseTo(a, 6)
      }
    }
  })

  it('总面积 4πa² 与数值积分吻合(与同半径球面相同)', () => {
    for (const a of [0.8, 1, 1.7]) {
      expect(surfaceArea(a)).toBeCloseTo(4 * Math.PI * a * a, 12)
      expect(surfaceAreaNumeric(a)).toBeCloseTo(surfaceArea(a), 2)
    }
  })

  it('参数域内坐标全部有限', () => {
    for (const u of U_RANGE) {
      for (const v of V_RANGE) {
        expect(pseudosphere(u, v).every(Number.isFinite)).toBe(true)
      }
    }
  })

  it('PRESETS 的 a 递增且为正', () => {
    for (let i = 0; i < PRESETS.length; i++) {
      expect(PRESETS[i].a).toBeGreaterThan(0)
      if (i > 0) expect(PRESETS[i].a).toBeGreaterThan(PRESETS[i - 1].a)
    }
  })
})
