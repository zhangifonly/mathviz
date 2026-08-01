import { describe, it, expect } from 'vitest'
import {
  saddle, ruled, ruledResidual, firstFamilyLine, secondFamilyLine,
  collinearityError, gaussianCurvature, meanCurvature, PRESETS,
  U_RANGE, V_RANGE,
} from './hyperbolicParaboloid'

describe('双曲抛物面', () => {
  const shapes: Array<[number, number]> = [[1, 1], [1.5, 0.7], [0.7, 1.5]]

  it('显式形式满足 z = x²/a² − y²/b²', () => {
    for (const [a, b] of shapes) {
      for (const [x, y] of [[0.4, 0.3], [-0.8, 0.6], [1, -1]]) {
        const p = saddle(x, y, a, b)
        expect(p[0]).toBe(x)
        expect(p[1]).toBe(y)
        expect(p[2]).toBeCloseTo((x * x) / (a * a) - (y * y) / (b * b), 12)
      }
    }
  })

  it('直纹参数化落在同一张曲面上', () => {
    for (const [a, b] of shapes) {
      for (let i = 0; i <= 12; i++) {
        for (let j = 0; j <= 12; j++) {
          const s = -1 + i / 6
          const t = -1 + j / 6
          expect(Math.abs(ruledResidual(s, t, a, b))).toBeLessThan(1e-12)
        }
      }
    }
  })

  it('第一族: 固定 t 变 s 得到的是直线', () => {
    for (const [a, b] of shapes) {
      for (const t of [-0.6, 0, 0.8]) {
        const err = collinearityError(
          ruled(-1, t, a, b), ruled(0.3, t, a, b), ruled(1, t, a, b),
        )
        expect(err).toBeLessThan(1e-12)
      }
    }
  })

  it('第二族: 固定 s 变 t 也得到直线', () => {
    for (const [a, b] of shapes) {
      for (const s of [-0.4, 0.2, 0.9]) {
        const err = collinearityError(
          ruled(s, -1, a, b), ruled(s, 0.2, a, b), ruled(s, 1, a, b),
        )
        expect(err).toBeLessThan(1e-12)
      }
    }
  })

  it('每点恰有两条直线穿过(双直纹面)', () => {
    // 取一点对应的 (s,t), 两族各给出一条过该点的直线
    const s = 0.3
    const t = -0.5
    const p = ruled(s, t)
    const l1 = firstFamilyLine(t)
    const l2 = secondFamilyLine(s)
    // p 在两条线上: 与各线两端点共线
    expect(collinearityError(l1[0], p, l1[1])).toBeLessThan(1e-12)
    expect(collinearityError(l2[0], p, l2[1])).toBeLessThan(1e-12)
    // 两条线方向不同
    const d1 = [l1[1][0] - l1[0][0], l1[1][1] - l1[0][1], l1[1][2] - l1[0][2]]
    const d2 = [l2[1][0] - l2[0][0], l2[1][1] - l2[0][1], l2[1][2] - l2[0][2]]
    expect(collinearityError([0, 0, 0], d1 as never, d2 as never)).toBeGreaterThan(1e-6)
  })

  it('高斯曲率处处为负(处处是鞍点)', () => {
    for (const [a, b] of shapes) {
      for (const [x, y] of [[0, 0], [0.5, 0.3], [1, 1], [-0.7, 0.9]]) {
        expect(gaussianCurvature(x, y, a, b)).toBeLessThan(0)
      }
    }
  })

  it('原点高斯曲率为 -4/(a²b²)', () => {
    for (const [a, b] of shapes) {
      expect(gaussianCurvature(0, 0, a, b)).toBeCloseTo(-4 / (a * a * b * b), 10)
    }
  })

  it('曲率随远离原点趋于 0', () => {
    const ks = [0, 1, 2, 5].map((r) => Math.abs(gaussianCurvature(r, r)))
    for (let i = 1; i < ks.length; i++) expect(ks[i]).toBeLessThan(ks[i - 1])
  })

  it('a=b 时原点平均曲率为 0, 但曲面不是极小曲面', () => {
    expect(meanCurvature(0, 0, 1, 1)).toBeCloseTo(0, 12)
    // 别处不为零 —— 说明它不是极小曲面
    expect(Math.abs(meanCurvature(0.8, 0.2, 1, 1))).toBeGreaterThan(1e-3)
  })

  it('a≠b 时原点平均曲率不为零', () => {
    expect(Math.abs(meanCurvature(0, 0, 1.5, 0.7))).toBeGreaterThan(0.1)
  })

  it('沿 x 上凸沿 y 下凹(鞍形的直观判据)', () => {
    // y=0 时 z 随 |x| 增大
    expect(saddle(1, 0)[2]).toBeGreaterThan(saddle(0.2, 0)[2])
    // x=0 时 z 随 |y| 减小
    expect(saddle(0, 1)[2]).toBeLessThan(saddle(0, 0.2)[2])
  })

  it('参数域内坐标有限', () => {
    for (const u of U_RANGE) {
      for (const v of V_RANGE) {
        expect(saddle(u, v).every(Number.isFinite)).toBe(true)
        expect(ruled(u, v).every(Number.isFinite)).toBe(true)
      }
    }
  })

  it('PRESETS 覆盖 a=b 与两种不等情形', () => {
    expect(PRESETS.some((p) => p.a === p.b)).toBe(true)
    expect(PRESETS.some((p) => p.a > p.b)).toBe(true)
    expect(PRESETS.some((p) => p.a < p.b)).toBe(true)
  })
})
