import { describe, it, expect } from 'vitest'
import {
  supertoroid, torusResidual, centerlineRadius, heightRange, hasHole,
  GENUS, EULER_CHARACTERISTIC, ORIENTABLE, PRESETS, U_RANGE, V_RANGE,
} from './supertoroid'

describe('超环面族', () => {
  const shapes: Array<[number, number]> = [
    [1, 1], [0.3, 1], [1, 0.3], [0.3, 0.3], [1, 2], [2, 1],
  ]

  it('e1=e2=1 时精确满足环面隐式方程', () => {
    for (const [R, r] of [[1, 0.4], [1.5, 0.5]]) {
      for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
          const u = -Math.PI + (2 * Math.PI * i) / 20
          const v = -Math.PI + (2 * Math.PI * j) / 20
          const p = supertoroid(u, v, 1, 1, R, r)
          expect(Math.abs(torusResidual(p, R, r))).toBeLessThan(1e-12)
        }
      }
    }
  })

  it('e1=1 时中心线是半径恰为 R 的正圆', () => {
    for (const R of [1, 1.6]) {
      for (const u of [0, 0.5, 1.0, 2.0, 4.5]) {
        expect(centerlineRadius(u, 1, R, 0.4)).toBeCloseTo(R, 10)
      }
    }
  })

  it('e1≠1 时中心线不再是圆(俯视轮廓变形的根源)', () => {
    const rs = [0, 0.5, 1.0, 2.0].map((u) => centerlineRadius(u, 0.3, 1, 0.4))
    const spread = Math.max(...rs) - Math.min(...rs)
    expect(spread).toBeGreaterThan(0.1)
  })

  it('z 的取值范围恒为 ±r, 与两个指数都无关', () => {
    for (const [e1, e2] of shapes) {
      let lo = Infinity
      let hi = -Infinity
      for (let j = 0; j <= 100; j++) {
        const v = -Math.PI + (2 * Math.PI * j) / 100
        const z = supertoroid(0.7, v, e1, e2, 1, 0.4)[2]
        lo = Math.min(lo, z)
        hi = Math.max(hi, z)
      }
      expect(lo).toBeCloseTo(-0.4, 6)
      expect(hi).toBeCloseTo(0.4, 6)
    }
    expect(heightRange(0.65)).toEqual([-0.65, 0.65])
  })

  it('R > r 时中心有洞, R <= r 时退化', () => {
    expect(hasHole(1, 0.4)).toBe(true)
    expect(hasHole(0.4, 0.4)).toBe(false)
    expect(hasHole(0.3, 0.5)).toBe(false)
  })

  it('拓扑不变: 无论指数如何都是亏格 1 的环面', () => {
    expect(GENUS).toBe(1)
    expect(EULER_CHARACTERISTIC).toBe(2 - 2 * GENUS)
    expect(EULER_CHARACTERISTIC).toBe(0)
    expect(ORIENTABLE).toBe(true)
  })

  it('R,r 线性缩放对应尺寸', () => {
    const base = supertoroid(0.6, 0.8, 1, 1, 1, 0.4)
    const big = supertoroid(0.6, 0.8, 1, 1, 2, 0.8)
    base.forEach((c, i) => expect(big[i]).toBeCloseTo(c * 2, 10))
  })

  it('关于 xy 平面对称(v 取反只翻转 z)', () => {
    for (const [e1, e2] of shapes) {
      const p = supertoroid(0.9, 0.6, e1, e2)
      const q = supertoroid(0.9, -0.6, e1, e2)
      expect(q[0]).toBeCloseTo(p[0], 10)
      expect(q[1]).toBeCloseTo(p[1], 10)
      expect(q[2]).toBeCloseTo(-p[2], 10)
    }
  })

  it('e1=1 时径向距离落在 [R−r, R+r] 内', () => {
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 24; j++) {
        const u = -Math.PI + (2 * Math.PI * i) / 24
        const v = -Math.PI + (2 * Math.PI * j) / 24
        const rad = Math.hypot(...supertoroid(u, v, 1, 1, 1, 0.4).slice(0, 2))
        expect(rad).toBeGreaterThanOrEqual(0.6 - 1e-9)
        expect(rad).toBeLessThanOrEqual(1.4 + 1e-9)
      }
    }
  })

  it('e1<1 时俯视轮廓外凸, 径向距离可超过 R+r', () => {
    // 方框化会把角落顶出 R+r 之外 —— 这是形状指数的直接后果, 不是 bug
    let maxRad = 0
    for (let i = 0; i < 48; i++) {
      for (let j = 0; j < 48; j++) {
        const u = -Math.PI + (2 * Math.PI * i) / 48
        const v = -Math.PI + (2 * Math.PI * j) / 48
        maxRad = Math.max(maxRad, Math.hypot(...supertoroid(u, v, 0.3, 0.3, 1, 0.4).slice(0, 2)))
      }
    }
    expect(maxRad).toBeGreaterThan(1.4)
    // 但仍有界: 不会超过外接正方形的对角
    expect(maxRad).toBeLessThan(1.4 * Math.SQRT2 + 1e-9)
  })

  it('参数域内坐标全部有限', () => {
    for (const [e1, e2] of shapes) {
      for (const u of U_RANGE) {
        for (const v of V_RANGE) {
          expect(supertoroid(u, v, e1, e2).every(Number.isFinite)).toBe(true)
        }
      }
    }
  })

  it('PRESETS 覆盖方框/方管/菱形三类变形', () => {
    expect(PRESETS.some((p) => p.e1 === 1 && p.e2 === 1)).toBe(true)
    expect(PRESETS.some((p) => p.e1 < 0.5)).toBe(true)
    expect(PRESETS.some((p) => p.e2 < 0.5)).toBe(true)
    expect(PRESETS.some((p) => p.e2 === 2)).toBe(true)
    for (const p of PRESETS) {
      expect(p.e1).toBeGreaterThan(0)
      expect(p.e2).toBeGreaterThan(0)
    }
  })
})
