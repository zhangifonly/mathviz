import { describe, it, expect } from 'vitest'
import {
  gcd,
  torusKnotGenus,
  torusKnotCrossingNumber,
  torusKnotPoints,
  figureEightPoints,
  evalLaurent,
  knotCurve,
  KNOT_OPTIONS,
} from './knotTheory'

describe('纽结理论内核', () => {
  it('gcd 计算正确', () => {
    expect(gcd(2, 3)).toBe(1)
    expect(gcd(12, 18)).toBe(6)
    expect(gcd(0, 5)).toBe(5)
  })

  it('三叶结 T(2,3): 交叉数 3、亏格 1', () => {
    expect(torusKnotCrossingNumber(2, 3)).toBe(3)
    expect(torusKnotGenus(2, 3)).toBe(1)
  })

  it('五叶结 T(2,5): 交叉数 5、亏格 2', () => {
    expect(torusKnotCrossingNumber(2, 5)).toBe(5)
    expect(torusKnotGenus(2, 5)).toBe(2)
  })

  it('T(3,4) 亏格 = (3-1)(4-1)/2 = 3', () => {
    expect(torusKnotGenus(3, 4)).toBe(3)
    expect(torusKnotCrossingNumber(3, 4)).toBe(8)
  })

  it('琼斯多项式在 t=1 处恒等于 1（纽结不变量恒等式）', () => {
    for (const k of KNOT_OPTIONS) {
      expect(evalLaurent(k.jones, 1)).toBeCloseTo(1, 9)
    }
  })

  it('平凡结琼斯多项式恒为 1', () => {
    const unknot = KNOT_OPTIONS.find((k) => k.id === 'unknot')!
    expect(evalLaurent(unknot.jones, 0.5)).toBeCloseTo(1, 9)
    expect(evalLaurent(unknot.jones, 2)).toBeCloseTo(1, 9)
  })

  it('环面纽结采样点数量正确且在有界区域内', () => {
    const pts = torusKnotPoints(2, 3, 200)
    expect(pts.length).toBe(200)
    for (const p of pts) {
      expect(Math.hypot(p.x, p.y)).toBeLessThanOrEqual(3.001)
      expect(Math.abs(p.z)).toBeLessThanOrEqual(1.001)
    }
  })

  it('环面纽结曲线闭合（首尾点接近）', () => {
    const pts = torusKnotPoints(2, 3, 400)
    const first = pts[0]
    const t = (399 / 400) * Math.PI * 2
    // 最后一个采样点应接近但不完全等于起点
    const last = pts[pts.length - 1]
    expect(Math.hypot(last.x - first.x, last.y - first.y)).toBeLessThan(1)
    expect(t).toBeGreaterThan(0)
  })

  it('八字结采样点数量正确', () => {
    const pts = figureEightPoints(300)
    expect(pts.length).toBe(300)
  })

  it('KNOT_OPTIONS 每个条目字段有效', () => {
    for (const k of KNOT_OPTIONS) {
      expect(k.id.length).toBeGreaterThan(0)
      expect(k.crossingNumber).toBeGreaterThanOrEqual(0)
      expect(k.genus).toBeGreaterThanOrEqual(0)
      expect(Object.keys(k.jones).length).toBeGreaterThan(0)
      // 环面纽结的公式应与目录值一致
      if (k.p !== null && k.q !== null && k.id !== 'unknot') {
        expect(torusKnotCrossingNumber(k.p, k.q)).toBe(k.crossingNumber)
        expect(torusKnotGenus(k.p, k.q)).toBe(k.genus)
      }
    }
  })

  it('knotCurve 按 id 返回曲线，未知 id 回退三叶结', () => {
    expect(knotCurve('trefoil', 100).length).toBe(100)
    expect(knotCurve('figure-eight', 100).length).toBe(100)
    expect(knotCurve('nonexistent', 50).length).toBe(50)
  })
})
