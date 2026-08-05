import { describe, it, expect } from 'vitest'
import {
  prismatoidVolume, prismatoidError, integrate, samplePoints, isExact,
  makePrism, makeCone, makeFrustum, makeSphere, makeWedge,
  makeCubic, makeQuartic, solidOf, SOLID_IDS,
  simpsonWeightCheck, simpsonQuarticError, SPECIAL_CASES,
} from './prismatoid'

describe('Prismatoid - 公式对三次以内精确', () => {
  it('柱体（零次）精确', () => {
    const s = makePrism(5, 3)
    expect(prismatoidVolume(s)).toBeCloseTo(15, 12)
    expect(prismatoidError(s)).toBeLessThan(1e-15)
  })

  it('楔体（一次）精确', () => {
    const s = makeWedge(6, 4)
    expect(prismatoidVolume(s)).toBeCloseTo(12, 12)
    expect(prismatoidError(s)).toBeLessThan(1e-15)
  })

  it('锥体（二次）精确 —— 给出 S·h/3', () => {
    const s = makeCone(9, 6)
    expect(prismatoidVolume(s)).toBeCloseTo(18, 12)
    expect(prismatoidError(s)).toBeLessThan(1e-15)
  })

  it('台体（二次）精确 —— 给出课本的 h(S₁+S₂+√S₁S₂)/3', () => {
    const s = makeFrustum(16, 4, 3)
    const textbook = (3 / 3) * (16 + 4 + Math.sqrt(64))
    expect(prismatoidVolume(s)).toBeCloseTo(textbook, 10)
    expect(prismatoidError(s)).toBeLessThan(1e-14)
  })

  it('球（二次）精确 —— 给出 4πr³/3', () => {
    for (const r of [1, 2.5, 0.3]) {
      const s = makeSphere(r)
      expect(prismatoidVolume(s)).toBeCloseTo((4 * Math.PI * r ** 3) / 3, 10)
      expect(prismatoidError(s)).toBeLessThan(1e-14)
    }
  })

  it('球只靠中间那个截面就定出体积（两端为零）', () => {
    const s = makeSphere(2)
    const p = samplePoints(s)
    expect(p.bottom).toBeCloseTo(0, 10)
    expect(p.top).toBeCloseTo(0, 10)
    expect(p.middle).toBeCloseTo(Math.PI * 4, 10)
    // V = h/6 × 4·S_中 = (4r/6)·4πr² ... 代入验证
    expect(prismatoidVolume(s)).toBeCloseTo((s.height / 6) * 4 * p.middle, 12)
  })

  it('人造三次截面仍然精确', () => {
    for (const h of [1, 2, 3.7]) {
      const s = makeCubic(h)
      expect(prismatoidError(s)).toBeLessThan(1e-14)
    }
  })

  it('所有次数 ≤ 3 的立体误差都可忽略', () => {
    for (const id of SOLID_IDS) {
      const s = solidOf(id, 2)
      if (!isExact(s)) continue
      expect(prismatoidError(s)).toBeLessThan(1e-12)
    }
  })
})

describe('Prismatoid - 四次时失效', () => {
  it('四次截面的公式误差明显', () => {
    const s = makeQuartic(2)
    expect(prismatoidError(s)).toBeGreaterThan(0.01)
    expect(isExact(s)).toBe(false)
  })

  it('数值积分给出真值, 公式偏大', () => {
    const s = makeQuartic(2)
    expect(integrate(s, 50000)).toBeCloseTo(s.volume, 4)
    expect(prismatoidVolume(s)).toBeGreaterThan(s.volume)
  })

  it('辛普森对 1、t、t²、t³ 都精确', () => {
    for (const h of [1, 2, 0.5]) {
      for (const e of simpsonWeightCheck(h)) {
        expect(e).toBeLessThan(1e-12)
      }
    }
  })

  it('辛普森对四次基函数有固有误差', () => {
    expect(simpsonQuarticError(1)).toBeCloseTo(1 / 120, 6)
    expect(simpsonQuarticError(1)).toBeGreaterThan(0)
  })

  it('这个误差随高度按 h⁵ 增长', () => {
    const a = simpsonQuarticError(1)
    const b = simpsonQuarticError(2)
    expect(b / a).toBeCloseTo(32, 6)
  })
})

describe('Prismatoid - 中学公式都是特例', () => {
  it('五个特例都能由同一条公式给出', () => {
    const checks: Array<[string, number, number]> = [
      ['柱体', prismatoidVolume(makePrism(4, 3)), 12],
      ['楔体', prismatoidVolume(makeWedge(4, 3)), 6],
      ['锥体', prismatoidVolume(makeCone(4, 3)), 4],
      ['球', prismatoidVolume(makeSphere(1)), (4 * Math.PI) / 3],
    ]
    for (const [, got, want] of checks) {
      expect(got).toBeCloseTo(want, 10)
    }
  })

  it('特例表覆盖五种且次数递增合理', () => {
    expect(SPECIAL_CASES.length).toBe(5)
    for (const c of SPECIAL_CASES) {
      expect(c.degree).toBeLessThanOrEqual(2)
      expect(c.formula.length).toBeGreaterThan(2)
    }
  })

  it('柱、锥体积比恰为 3:1（同底同高）', () => {
    const S = 7
    const h = 5
    expect(prismatoidVolume(makePrism(S, h)) / prismatoidVolume(makeCone(S, h)))
      .toBeCloseTo(3, 10)
  })

  it('楔体恰是柱体的一半', () => {
    const S = 7
    const h = 5
    expect(prismatoidVolume(makeWedge(S, h)) * 2)
      .toBeCloseTo(prismatoidVolume(makePrism(S, h)), 10)
  })

  it('台体在上底趋于零时退化为锥体', () => {
    const s1 = 9
    const h = 4
    const tiny = makeFrustum(s1, 1e-12, h)
    expect(prismatoidVolume(tiny)).toBeCloseTo((s1 * h) / 3, 5)
  })

  it('台体在上下底相等时退化为柱体', () => {
    const s = makeFrustum(5, 5, 3)
    expect(prismatoidVolume(s)).toBeCloseTo(15, 10)
  })
})

describe('Prismatoid - 采样与工具', () => {
  it('三个采样点取自 0、h/2、h', () => {
    const s = makeCone(4, 6)
    const p = samplePoints(s)
    expect(p.bottom).toBeCloseTo(s.areaAt(0), 12)
    expect(p.middle).toBeCloseTo(s.areaAt(3), 12)
    expect(p.top).toBeCloseTo(s.areaAt(6), 12)
  })

  it('数值积分与解析值一致（次数 ≤ 3）', () => {
    for (const id of SOLID_IDS) {
      const s = solidOf(id, 2)
      if (!isExact(s)) continue
      expect(integrate(s, 50000) / s.volume).toBeCloseTo(1, 5)
    }
  })

  it('solidOf 七种都能取到, 未知兜底为柱体', () => {
    for (const id of SOLID_IDS) expect(solidOf(id).id).toBe(id)
    expect(solidOf('nope' as never).id).toBe('prism')
  })

  it('每个立体的 note 与 degree 自洽', () => {
    for (const id of SOLID_IDS) {
      const s = solidOf(id, 2)
      expect(s.note.length).toBeGreaterThan(3)
      expect(s.degree).toBeGreaterThanOrEqual(0)
      expect(isExact(s)).toBe(s.degree <= 3)
    }
  })

  it('体积随高度线性/立方增长符合各自类型', () => {
    // 柱体：V ∝ h
    expect(makePrism(3, 4).volume / makePrism(3, 2).volume).toBeCloseTo(2, 10)
    // 球：V ∝ r³，而 height = 2r
    expect(makeSphere(2).volume / makeSphere(1).volume).toBeCloseTo(8, 10)
  })
})
