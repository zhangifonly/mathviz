import { describe, it, expect } from 'vitest'
import {
  signedPow, superquadric, implicitResidual, volumeNumeric, PRESETS,
  U_RANGE, V_RANGE,
} from './superquadric'

describe('超二次曲面 - signedPow', () => {
  it('保留符号, 对绝对值取幂', () => {
    expect(signedPow(2, 3)).toBeCloseTo(8, 12)
    expect(signedPow(-2, 3)).toBeCloseTo(-8, 12)
    // 负数的分数次幂: 普通 Math.pow 会给 NaN, 这里必须有值
    expect(signedPow(-4, 0.5)).toBeCloseTo(-2, 12)
    expect(Number.isNaN(signedPow(-4, 0.5))).toBe(false)
  })

  it('零点返回零, 不产生 NaN', () => {
    expect(signedPow(0, 0.3)).toBe(0)
    expect(signedPow(1e-15, 2)).toBe(0)
  })
})

describe('超二次曲面 - 几何', () => {
  const shapes: Array<[number, number]> = [
    [1, 1], [0.5, 0.5], [2, 2], [0.2, 0.2], [1, 0.3], [3.5, 3.5],
  ]

  it('参数化与隐式方程一致(残差近零)', () => {
    for (const [n1, n2] of shapes) {
      for (let i = 1; i < 20; i++) {
        for (let j = 1; j < 20; j++) {
          const u = -Math.PI + (2 * Math.PI * i) / 20
          const v = -Math.PI / 2 + (Math.PI * j) / 20
          const r = implicitResidual(superquadric(u, v, n1, n2), n1, n2)
          expect(Math.abs(r)).toBeLessThan(1e-10)
        }
      }
    }
  })

  it('n1=n2=1 退化为标准椭球', () => {
    for (const [u, v] of [[0.4, 0.3], [2.1, -0.8], [-1.5, 1.0]]) {
      const p = superquadric(u, v, 1, 1, 1.4, 0.9, 1.2)
      // 椭球方程 (x/a)²+(y/b)²+(z/c)² = 1
      const s = (p[0] / 1.4) ** 2 + (p[1] / 0.9) ** 2 + (p[2] / 1.2) ** 2
      expect(s).toBeCloseTo(1, 10)
    }
  })

  it('n1=n2=1 的体积等于椭球体积 4πabc/3', () => {
    expect(volumeNumeric(1, 1, 1, 1, 1, 60)).toBeCloseTo((4 * Math.PI) / 3, 1)
  })

  it('指数趋于 0 时体积趋于外接立方体 8abc', () => {
    expect(volumeNumeric(0.05, 0.05, 1, 1, 1, 60)).toBeGreaterThan(7.5)
    expect(volumeNumeric(0.05, 0.05, 1, 1, 1, 60)).toBeLessThanOrEqual(8.001)
  })

  it('n1=n2=2 是八面体, 体积为 4/3', () => {
    expect(volumeNumeric(2, 2, 1, 1, 1, 60)).toBeCloseTo(4 / 3, 1)
  })

  it('体积随指数增大而减小(从方到球到星)', () => {
    const vs = [0.1, 0.5, 1, 2].map((n) => volumeNumeric(n, n, 1, 1, 1, 40))
    for (let i = 1; i < vs.length; i++) expect(vs[i]).toBeLessThan(vs[i - 1])
  })

  it('a,b,c 线性缩放对应坐标', () => {
    for (const [n1, n2] of shapes.slice(0, 3)) {
      const base = superquadric(0.7, 0.4, n1, n2, 1, 1, 1)
      const scaled = superquadric(0.7, 0.4, n1, n2, 2, 3, 4)
      expect(scaled[0]).toBeCloseTo(base[0] * 2, 10)
      expect(scaled[1]).toBeCloseTo(base[1] * 3, 10)
      expect(scaled[2]).toBeCloseTo(base[2] * 4, 10)
    }
  })

  it('两极 v=±π/2 处收缩到 z 轴', () => {
    for (const [n1, n2] of shapes) {
      for (const u of [0, 1.2, 3.0]) {
        const top = superquadric(u, Math.PI / 2, n1, n2)
        expect(Math.abs(top[0])).toBeLessThan(1e-10)
        expect(Math.abs(top[1])).toBeLessThan(1e-10)
      }
    }
  })

  it('关于三个坐标平面对称', () => {
    for (const [n1, n2] of shapes.slice(0, 4)) {
      const p = superquadric(0.6, 0.5, n1, n2)
      const q = superquadric(0.6, -0.5, n1, n2)
      // v 取反只翻转 z
      expect(q[0]).toBeCloseTo(p[0], 10)
      expect(q[1]).toBeCloseTo(p[1], 10)
      expect(q[2]).toBeCloseTo(-p[2], 10)
    }
  })

  it('参数域内坐标全部有限', () => {
    for (const [n1, n2] of shapes) {
      for (const u of U_RANGE) {
        for (const v of V_RANGE) {
          expect(superquadric(u, v, n1, n2).every(Number.isFinite)).toBe(true)
        }
      }
    }
  })

  it('PRESETS 覆盖方/圆/双锥/星四类形态', () => {
    expect(PRESETS.some((p) => p.n1 < 0.3)).toBe(true)
    expect(PRESETS.some((p) => p.n1 === 1 && p.n2 === 1)).toBe(true)
    expect(PRESETS.some((p) => p.n1 === 2)).toBe(true)
    expect(PRESETS.some((p) => p.n1 > 3)).toBe(true)
    for (const p of PRESETS) {
      expect(p.n1).toBeGreaterThan(0)
      expect(p.n2).toBeGreaterThan(0)
    }
  })
})
