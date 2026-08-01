import { describe, it, expect } from 'vitest'
import {
  enneper, firstFundamental, gaussianCurvature, meanCurvature,
  meanCurvatureNumeric, PRESETS, U_RANGE, V_RANGE,
} from './enneperSurface'

describe('恩内佩尔曲面', () => {
  const samples: Array<[number, number]> = [
    [0, 0], [0.5, 0.3], [-1.2, 0.8], [1.5, -1.1], [-0.4, -1.6],
  ]

  it('原点映到原点', () => {
    expect(enneper(0, 0)).toEqual([0, 0, 0])
  })

  it('是极小曲面: 数值平均曲率与解析值 0 一致', () => {
    expect(meanCurvature()).toBe(0)
    for (const [u, v] of samples) {
      expect(Math.abs(meanCurvatureNumeric(u, v))).toBeLessThan(1e-3)
    }
  })

  it('等温参数化: E=G 且 F=0, 系数为 (1+u²+v²)²', () => {
    for (const [u, v] of samples) {
      const { E, F, G } = firstFundamental(u, v)
      expect(E).toBeCloseTo(G, 12)
      expect(F).toBe(0)
      expect(E).toBeCloseTo((1 + u * u + v * v) ** 2, 12)
    }
  })

  it('第一基本形式与参数方程的数值导数吻合', () => {
    const h = 1e-5
    for (const [u, v] of samples) {
      const xu = enneper(u + h, v).map((c, i) => (c - enneper(u - h, v)[i]) / (2 * h))
      const xv = enneper(u, v + h).map((c, i) => (c - enneper(u, v - h)[i]) / (2 * h))
      const E = xu.reduce((s, c) => s + c * c, 0)
      const F = xu.reduce((s, c, i) => s + c * xv[i], 0)
      expect(E).toBeCloseTo(firstFundamental(u, v).E, 3)
      expect(Math.abs(F)).toBeLessThan(1e-4)
    }
  })

  it('高斯曲率处处为负, 原点取到最小值 -4', () => {
    expect(gaussianCurvature(0, 0)).toBeCloseTo(-4, 12)
    for (const [u, v] of samples) {
      expect(gaussianCurvature(u, v)).toBeLessThan(0)
    }
  })

  it('高斯曲率随离原点变远单调趋于 0', () => {
    const ks = [0, 1, 2, 4, 8].map((r) => gaussianCurvature(r, 0))
    for (let i = 1; i < ks.length; i++) {
      expect(ks[i]).toBeGreaterThan(ks[i - 1])
    }
    expect(gaussianCurvature(50, 50)).toBeCloseTo(0, 10)
  })

  it('z 分量关于交换 u,v 反号(四片花瓣的对称性)', () => {
    for (const [u, v] of samples) {
      expect(enneper(v, u)[2]).toBeCloseTo(-enneper(u, v)[2], 12)
    }
  })

  it('scale 线性缩放所有坐标', () => {
    for (const [u, v] of samples) {
      const base = enneper(u, v, 1)
      const big = enneper(u, v, 2.5)
      base.forEach((c, i) => expect(big[i]).toBeCloseTo(c * 2.5, 10))
    }
  })

  it('参数域内坐标全部有限', () => {
    for (const u of U_RANGE) {
      for (const v of V_RANGE) {
        expect(enneper(u, v).every(Number.isFinite)).toBe(true)
      }
    }
  })

  it('PRESETS 的 scale 递增且均为正', () => {
    for (let i = 0; i < PRESETS.length; i++) {
      expect(PRESETS[i].scale).toBeGreaterThan(0)
      if (i > 0) expect(PRESETS[i].scale).toBeGreaterThan(PRESETS[i - 1].scale)
    }
  })
})
