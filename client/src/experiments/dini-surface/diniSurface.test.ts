import { describe, it, expect } from 'vitest'
import {
  dini, gaussianCurvature, gaussianCurvatureNumeric, firstFundamental,
  pitch, PRESETS, U_RANGE, V_RANGE,
} from './diniSurface'

describe('迪尼曲面', () => {
  const samples: Array<[number, number]> = [[1, 0.6], [2.5, 1.0], [4, 1.3], [0.4, 0.3]]

  it('高斯曲率恒为 -1/(a²+b²), 与位置无关', () => {
    for (const [a, b] of [[1, 0.2], [1.3, 0.5], [0.8, 0.3]]) {
      const want = -1 / (a * a + b * b)
      expect(gaussianCurvature(a, b)).toBeCloseTo(want, 12)
      for (const [u, v] of samples) {
        expect(gaussianCurvatureNumeric(u, v, a, b)).toBeCloseTo(want, 4)
      }
    }
  })

  it('曲率处处为负', () => {
    for (const [a, b] of [[0.5, 0], [1, 0.2], [2, 1]]) {
      expect(gaussianCurvature(a, b)).toBeLessThan(0)
    }
  })

  it('b=0 时退化为旋转面: 到 z 轴距离只由 v 决定', () => {
    for (const v of [0.4, 0.9, 1.4]) {
      const rs = [0, 1.5, 3, 5].map((u) => {
        const p = dini(u, v, 1, 0)
        return Math.hypot(p[0], p[1])
      })
      for (const r of rs) expect(r).toBeCloseTo(Math.sin(v), 12)
    }
  })

  it('b=0 时 z 与 u 无关(纯旋转, 不螺旋上升)', () => {
    for (const v of [0.5, 1.2]) {
      const z0 = dini(0, v, 1, 0)[2]
      for (const u of [1, 3, 6]) expect(dini(u, v, 1, 0)[2]).toBeCloseTo(z0, 12)
    }
  })

  it('b>0 时每绕一圈上升 2πb', () => {
    for (const b of [0.2, 0.6, 1.1]) {
      expect(pitch(b)).toBeCloseTo(2 * Math.PI * b, 12)
      const z0 = dini(0.7, 0.8, 1, b)[2]
      const z1 = dini(0.7 + 2 * Math.PI, 0.8, 1, b)[2]
      expect(z1 - z0).toBeCloseTo(pitch(b), 10)
    }
  })

  it('b=0 的螺距为零', () => {
    expect(pitch(0)).toBe(0)
  })

  it('a 线性缩放水平半径', () => {
    for (const v of [0.5, 1.1]) {
      const r1 = Math.hypot(...dini(1, v, 1, 0.2).slice(0, 2))
      const r2 = Math.hypot(...dini(1, v, 2.5, 0.2).slice(0, 2))
      expect(r2).toBeCloseTo(r1 * 2.5, 10)
    }
  })

  it('第一基本形式与数值导数一致', () => {
    const h = 1e-6
    const a = 1.2
    const b = 0.35
    for (const [u, v] of samples) {
      const p0 = dini(u - h, v, a, b)
      const p1 = dini(u + h, v, a, b)
      const xu = [0, 1, 2].map((i) => (p1[i] - p0[i]) / (2 * h))
      const E = xu.reduce((s, c) => s + c * c, 0)
      expect(E).toBeCloseTo(firstFundamental(v, a, b).E, 5)
    }
  })

  it('参数域端点坐标有限(避开 ln tan 的发散点)', () => {
    for (const u of U_RANGE) {
      for (const v of V_RANGE) {
        expect(dini(u, v, 1, 0.2).every(Number.isFinite)).toBe(true)
      }
    }
  })

  it('PRESETS 覆盖 b=0 的退化情形与 b>0 的螺旋情形', () => {
    expect(PRESETS.some((p) => p.b === 0)).toBe(true)
    expect(PRESETS.some((p) => p.b > 0)).toBe(true)
    for (const p of PRESETS) expect(p.a).toBeGreaterThan(0)
  })
})
