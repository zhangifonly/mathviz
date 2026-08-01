import { describe, it, expect } from 'vitest'
import {
  associateFamily, helicoid, catenoid, firstFundamental, meanCurvature,
  STAGES, U_RANGE, V_RANGE,
} from './helicoidCatenoid'

describe('螺旋面与悬链面', () => {
  const samples: Array<[number, number]> = [
    [0, 0], [1, 0.5], [-2, -0.7], [Math.PI / 3, 0.9], [-1.2, 0.2],
  ]

  it('theta=0 与 theta=PI/2 分别退化为螺旋面与悬链面', () => {
    for (const [u, v] of samples) {
      expect(associateFamily(u, v, 0)).toEqual(helicoid(u, v))
      expect(associateFamily(u, v, Math.PI / 2)).toEqual(catenoid(u, v))
    }
  })

  it('螺旋面的 z 只由 u 决定(直纹面特征)', () => {
    // 固定 u 变 v, z 不变 —— 这条水平线就是那族直线
    for (const u of [-1, 0, 1.5]) {
      const z0 = helicoid(u, -0.8)[2]
      const z1 = helicoid(u, 0.8)[2]
      expect(z1).toBeCloseTo(z0, 12)
      expect(z0).toBeCloseTo(u, 12)
    }
  })

  it('悬链面是旋转面: 到 z 轴距离只由 v 决定', () => {
    for (const v of [-0.9, 0, 0.6]) {
      const r = [0, 1, 2.5, -1.7].map((u) => {
        const p = catenoid(u, v)
        return Math.hypot(p[0], p[1])
      })
      for (const x of r) expect(x).toBeCloseTo(Math.cosh(v), 10)
    }
  })

  it('整族曲面都是极小曲面: 平均曲率处处为零', () => {
    for (const theta of [0, 0.3, Math.PI / 4, 1.2, Math.PI / 2]) {
      for (const [u, v] of samples) {
        expect(Math.abs(meanCurvature(u, v, theta))).toBeLessThan(1e-3)
      }
    }
  })

  it('变形是等距的: 第一基本形式全程不变', () => {
    for (const [u, v] of samples) {
      const base = firstFundamental(u, v, 0)
      for (const theta of [0.4, Math.PI / 4, 1.1, Math.PI / 2]) {
        const f = firstFundamental(u, v, theta)
        expect(f.E).toBeCloseTo(base.E, 4)
        expect(f.F).toBeCloseTo(base.F, 4)
        expect(f.G).toBeCloseTo(base.G, 4)
      }
    }
  })

  it('第一基本形式满足等温参数化 E=G、F=0', () => {
    for (const [u, v] of samples) {
      const { E, F, G } = firstFundamental(u, v, 0.7)
      expect(E).toBeCloseTo(G, 4)
      expect(Math.abs(F)).toBeLessThan(1e-4)
      // 等温系数应为 cosh^2(v)
      expect(E).toBeCloseTo(Math.cosh(v) ** 2, 3)
    }
  })

  it('所有坐标有限, 参数域端点也不发散', () => {
    for (const theta of [0, Math.PI / 4, Math.PI / 2]) {
      for (const u of U_RANGE) {
        for (const v of V_RANGE) {
          expect(associateFamily(u, v, theta).every(Number.isFinite)).toBe(true)
        }
      }
    }
  })

  it('STAGES 覆盖三个关键阶段且 theta 递增', () => {
    expect(STAGES.length).toBe(3)
    expect(STAGES[0].theta).toBe(0)
    expect(STAGES[2].theta).toBeCloseTo(Math.PI / 2, 12)
    for (let i = 1; i < STAGES.length; i++) {
      expect(STAGES[i].theta).toBeGreaterThan(STAGES[i - 1].theta)
    }
  })
})
