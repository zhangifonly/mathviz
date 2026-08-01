import { describe, it, expect } from 'vitest'
import {
  trefoilCurve, torusKnot, gcd, isKnot, alexanderAt, countProjectionCrossings,
  closureGap, ALEXANDER_TREFOIL, ALEXANDER_UNKNOT, CROSSING_NUMBER,
  KNOT_PRESETS, T_RANGE,
} from './trefoilSurface'

describe('三叶结', () => {
  it('曲线闭合(t=0 与 t=2π 重合)', () => {
    expect(closureGap(1)).toBeLessThan(1e-12)
    expect(closureGap(-1)).toBeLessThan(1e-12)
  })

  it('投影交叉数为 3, 且不随采样密度变化', () => {
    for (const steps of [600, 1200, 2400]) {
      expect(countProjectionCrossings(steps)).toBe(3)
    }
    expect(CROSSING_NUMBER).toBe(3)
  })

  it('左右手结的交叉数相同(手性不改变交叉数)', () => {
    expect(countProjectionCrossings(1200, 1)).toBe(3)
    expect(countProjectionCrossings(1200, -1)).toBe(3)
  })

  it('手性: z 分量反号, x,y 不变', () => {
    for (const t of [0.4, 1.7, 3.2]) {
      const r = trefoilCurve(t, 1)
      const l = trefoilCurve(t, -1)
      expect(l[0]).toBeCloseTo(r[0], 12)
      expect(l[1]).toBeCloseTo(r[1], 12)
      expect(l[2]).toBeCloseTo(-r[2], 12)
    }
  })

  it('亚历山大多项式 t²−t+1 与平凡纽结的 1 不同', () => {
    expect(ALEXANDER_TREFOIL).toEqual([1, -1, 1])
    expect(ALEXANDER_UNKNOT).toEqual([1])
    // t=2 处两者不同 —— 这就证明了三叶结打不开
    expect(alexanderAt(ALEXANDER_TREFOIL, 2)).toBe(3)
    expect(alexanderAt(ALEXANDER_UNKNOT, 2)).toBe(1)
  })

  it('t=1 处两个多项式都等于 1(归一化性质), 故须在 t≠1 处区分', () => {
    expect(alexanderAt(ALEXANDER_TREFOIL, 1)).toBe(1)
    expect(alexanderAt(ALEXANDER_UNKNOT, 1)).toBe(1)
    // 所以只看 t=1 无法区分, 必须换点
    expect(alexanderAt(ALEXANDER_TREFOIL, -1)).toBe(3)
  })

  it('亚历山大多项式满足 Δ(t) = Δ(1/t)·t²(对称性)', () => {
    for (const t of [2, 3, 0.5]) {
      const a = alexanderAt(ALEXANDER_TREFOIL, t)
      const b = alexanderAt(ALEXANDER_TREFOIL, 1 / t) * t * t
      expect(a).toBeCloseTo(b, 10)
    }
  })

  it('gcd 计算正确', () => {
    expect(gcd(2, 3)).toBe(1)
    expect(gcd(2, 4)).toBe(2)
    expect(gcd(3, 6)).toBe(3)
    expect(gcd(12, 18)).toBe(6)
    expect(gcd(0, 5)).toBe(5)
  })

  it('gcd(p,q)=1 才是纽结, 否则是链环', () => {
    expect(isKnot(2, 3)).toBe(true)
    expect(isKnot(2, 5)).toBe(true)
    expect(isKnot(3, 4)).toBe(true)
    expect(isKnot(2, 4)).toBe(false)
    expect(isKnot(3, 6)).toBe(false)
  })

  it('环面纽结落在环面上: 到中心圈距离恒为 r', () => {
    const R = 2
    const r = 0.8
    for (const [p, q] of [[2, 3], [2, 5], [3, 4]]) {
      for (let i = 0; i < 20; i++) {
        const t = (2 * Math.PI * i) / 20
        const pt = torusKnot(t, p, q, R, r)
        // 到中心圈(半径 R 的圆)的距离
        const rho = Math.hypot(pt[0], pt[1])
        const d = Math.hypot(rho - R, pt[2])
        expect(d).toBeCloseTo(r, 10)
      }
    }
  })

  it('环面纽结在 t∈[0,2π] 上闭合', () => {
    for (const [p, q] of [[2, 3], [2, 5], [3, 4]]) {
      const a = torusKnot(0, p, q)
      const b = torusKnot(2 * Math.PI, p, q)
      expect(Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])).toBeLessThan(1e-9)
    }
  })

  it('三叶结坐标范围有界', () => {
    let maxR = 0
    for (let i = 0; i <= 200; i++) {
      const p = trefoilCurve((2 * Math.PI * i) / 200)
      maxR = Math.max(maxR, Math.hypot(p[0], p[1], p[2]))
    }
    expect(maxR).toBeLessThan(4)
    expect(maxR).toBeGreaterThan(2)
  })

  it('参数域内坐标全部有限', () => {
    for (const t of T_RANGE) {
      expect(trefoilCurve(t).every(Number.isFinite)).toBe(true)
      expect(torusKnot(t).every(Number.isFinite)).toBe(true)
    }
  })

  it('KNOT_PRESETS 含三个纽结与一个链环', () => {
    const knots = KNOT_PRESETS.filter((k) => isKnot(k.p, k.q))
    const links = KNOT_PRESETS.filter((k) => !isKnot(k.p, k.q))
    expect(knots.length).toBe(3)
    expect(links.length).toBe(1)
    expect(links[0].p).toBe(2)
    expect(links[0].q).toBe(4)
  })
})
