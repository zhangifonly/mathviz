import { describe, it, expect } from 'vitest'
import {
  legendreP, normalization, realSphericalHarmonic, harmonicSurface,
  laplaceEigenvalue, nodalLines, innerProduct, ORBITALS,
  THETA_RANGE, PHI_RANGE,
} from './sphericalHarmonics'

describe('球谐函数 - 勒让德', () => {
  it('P_0^0 恒为 1', () => {
    for (const x of [-0.9, 0, 0.5, 1]) expect(legendreP(0, 0, x)).toBeCloseTo(1, 12)
  })

  it('P_1^0 = x, P_2^0 = (3x²−1)/2', () => {
    for (const x of [-0.7, 0, 0.4, 0.9]) {
      expect(legendreP(1, 0, x)).toBeCloseTo(x, 12)
      expect(legendreP(2, 0, x)).toBeCloseTo((3 * x * x - 1) / 2, 12)
    }
  })

  it('P_3^0 = (5x³−3x)/2', () => {
    for (const x of [-0.6, 0.2, 0.8]) {
      expect(legendreP(3, 0, x)).toBeCloseTo((5 * x ** 3 - 3 * x) / 2, 12)
    }
  })

  it('|m| > l 时为零', () => {
    expect(legendreP(1, 2, 0.5)).toBe(0)
    expect(legendreP(2, 5, 0.3)).toBe(0)
  })

  it('P_1^1 = −√(1−x²)', () => {
    for (const x of [-0.5, 0, 0.7]) {
      expect(legendreP(1, 1, x)).toBeCloseTo(-Math.sqrt(1 - x * x), 12)
    }
  })
})

describe('球谐函数 - 正交归一', () => {
  const modes: Array<[number, number]> = [
    [0, 0], [1, 0], [1, 1], [1, -1], [2, 0], [2, 2], [3, 1], [4, 3],
  ]

  it('归一性: 每个球谐与自身的内积为 1', () => {
    for (const [l, m] of modes) {
      expect(innerProduct(l, m, l, m, 100)).toBeCloseTo(1, 3)
    }
  })

  it('正交性: 不同模态的内积为 0', () => {
    const pairs: Array<[[number, number], [number, number]]> = [
      [[0, 0], [1, 0]], [[1, 0], [2, 0]], [[1, 1], [1, -1]],
      [[2, 0], [2, 2]], [[2, 1], [3, 1]],
    ]
    for (const [[l1, m1], [l2, m2]] of pairs) {
      expect(Math.abs(innerProduct(l1, m1, l2, m2, 100))).toBeLessThan(1e-8)
    }
  })

  it('Y_00 = 1/(2√π), 与球面均匀分布对应', () => {
    const want = 1 / (2 * Math.sqrt(Math.PI))
    for (const th of [0.4, 1.5, 2.8]) {
      for (const ph of [0, 2, 5]) {
        expect(realSphericalHarmonic(0, 0, th, ph)).toBeCloseTo(want, 12)
      }
    }
  })

  it('Y_10 在北极取到 √(3/4π)', () => {
    expect(realSphericalHarmonic(1, 0, 0, 0)).toBeCloseTo(Math.sqrt(3 / (4 * Math.PI)), 10)
  })

  it('归一化系数与解析式一致', () => {
    expect(normalization(0, 0)).toBeCloseTo(Math.sqrt(1 / (4 * Math.PI)), 12)
    expect(normalization(1, 0)).toBeCloseTo(Math.sqrt(3 / (4 * Math.PI)), 12)
  })
})

describe('球谐函数 - 结构', () => {
  it('m=0 时与方位角无关(轴对称)', () => {
    for (const l of [1, 2, 3]) {
      const base = realSphericalHarmonic(l, 0, 1.1, 0)
      for (const ph of [1, 3, 5]) {
        expect(realSphericalHarmonic(l, 0, 1.1, ph)).toBeCloseTo(base, 12)
      }
    }
  })

  it('m>0 时绕轴有 m 个周期', () => {
    for (const m of [1, 2, 3]) {
      const a = realSphericalHarmonic(4, m, 1.2, 0.3)
      const b = realSphericalHarmonic(4, m, 1.2, 0.3 + (2 * Math.PI) / m)
      expect(b).toBeCloseTo(a, 10)
    }
  })

  it('节线数: 纬向 l−|m| 条, 经向 |m| 条', () => {
    expect(nodalLines(3, 1)).toEqual({ latitudinal: 2, longitudinal: 1 })
    expect(nodalLines(2, 2)).toEqual({ latitudinal: 0, longitudinal: 2 })
    expect(nodalLines(0, 0)).toEqual({ latitudinal: 0, longitudinal: 0 })
    // 总数恒为 l
    for (const [l, m] of [[4, 2], [5, 3], [3, 0]]) {
      const n = nodalLines(l, m)
      expect(n.latitudinal + n.longitudinal).toBe(l)
    }
  })

  it('拉普拉斯特征值为 −l(l+1)', () => {
    // -0*(0+1) 得 -0, 而 toBe 下 -0 !== 0, 故用 toBeCloseTo
    expect(laplaceEigenvalue(0)).toBeCloseTo(0, 12)
    expect(laplaceEigenvalue(1)).toBe(-2)
    expect(laplaceEigenvalue(2)).toBe(-6)
    expect(laplaceEigenvalue(3)).toBe(-12)
  })

  it('球谐曲面的半径等于 |Y|', () => {
    for (const [l, m] of [[1, 0], [2, 2], [3, 1]]) {
      for (const th of [0.5, 1.8]) {
        const p = harmonicSurface(l, m, th, 0.7, 1)
        const want = Math.abs(realSphericalHarmonic(l, m, th, 0.7))
        expect(Math.hypot(p[0], p[1], p[2])).toBeCloseTo(want, 10)
      }
    }
  })

  it('l=0 的曲面是正球面(半径处处相同)', () => {
    const rs: number[] = []
    for (const th of [0.4, 1.2, 2.5]) {
      for (const ph of [0, 2, 4]) {
        const p = harmonicSurface(0, 0, th, ph)
        rs.push(Math.hypot(p[0], p[1], p[2]))
      }
    }
    for (const r of rs) expect(r).toBeCloseTo(rs[0], 12)
  })

  it('参数域内坐标全部有限', () => {
    for (const { l, m } of ORBITALS) {
      for (const th of THETA_RANGE) {
        for (const ph of PHI_RANGE) {
          expect(harmonicSurface(l, m, th, ph).every(Number.isFinite)).toBe(true)
        }
      }
    }
  })

  it('ORBITALS 覆盖 s/p/d/f 四类轨道且 |m| <= l', () => {
    expect(ORBITALS.some((o) => o.l === 0)).toBe(true)
    expect(ORBITALS.some((o) => o.l === 1)).toBe(true)
    expect(ORBITALS.some((o) => o.l === 2)).toBe(true)
    expect(ORBITALS.some((o) => o.l === 3)).toBe(true)
    for (const o of ORBITALS) expect(Math.abs(o.m)).toBeLessThanOrEqual(o.l)
  })
})
