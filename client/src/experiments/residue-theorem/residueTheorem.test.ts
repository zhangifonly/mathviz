import { describe, it, expect } from 'vitest'
import {
  cAdd,
  cMul,
  cDiv,
  cAbs,
  evaluateField,
  isEnclosed,
  residueSum,
  contourIntegralTheoretical,
  contourIntegralNumerical,
  RESIDUE_SCENARIOS,
  type Complex,
  type Pole,
} from './residueTheorem'

const near = (a: number, b: number, eps = 1e-6) => Math.abs(a - b) < eps

describe('复数运算', () => {
  it('乘法: i·i = -1', () => {
    const r = cMul({ re: 0, im: 1 }, { re: 0, im: 1 })
    expect(near(r.re, -1)).toBe(true)
    expect(near(r.im, 0)).toBe(true)
  })

  it('除法: (1)/(i) = -i', () => {
    const r = cDiv({ re: 1, im: 0 }, { re: 0, im: 1 })
    expect(near(r.re, 0)).toBe(true)
    expect(near(r.im, -1)).toBe(true)
  })

  it('加法与模长', () => {
    expect(cAdd({ re: 1, im: 2 }, { re: 3, im: -2 })).toEqual({ re: 4, im: 0 })
    expect(near(cAbs({ re: 3, im: 4 }), 5)).toBe(true)
  })
})

describe('极点与围道', () => {
  const poles: Pole[] = [
    { z: { re: -1, im: 0 }, residue: { re: 1, im: 0 }, label: 'a' },
    { z: { re: 1, im: 0 }, residue: { re: 2, im: 0 }, label: 'b' },
  ]

  it('isEnclosed 判断内外', () => {
    expect(isEnclosed(poles[0], { re: 0, im: 0 }, 2)).toBe(true)
    expect(isEnclosed(poles[0], { re: 0, im: 0 }, 0.5)).toBe(false)
  })

  it('residueSum 只累加内部极点', () => {
    // 半径 2 全部围住 → 1 + 2 = 3
    expect(residueSum(poles, { re: 0, im: 0 }, 2)).toEqual({ re: 3, im: 0 })
    // 半径 1.5 只围住 -1 与 1？两点距原点都为 1 < 1.5，仍全围住
    expect(residueSum(poles, { re: 0, im: 0 }, 1.5)).toEqual({ re: 3, im: 0 })
    // 半径 0.5 一个都不围
    expect(residueSum(poles, { re: 0, im: 0 }, 0.5)).toEqual({ re: 0, im: 0 })
  })

  it('theoretical = 2πi · Σ Res', () => {
    const r = contourIntegralTheoretical(poles, { re: 0, im: 0 }, 2)
    // 2πi·3 = 6π i
    expect(near(r.re, 0)).toBe(true)
    expect(near(r.im, 6 * Math.PI)).toBe(true)
  })
})

describe('留数定理数值验证', () => {
  it('数值围道积分 ≈ 2πi·Σ Res（两极点全围）', () => {
    const poles: Pole[] = [
      { z: { re: -1, im: 0 }, residue: { re: 1, im: 0 }, label: 'a' },
      { z: { re: 1, im: 0 }, residue: { re: 2, im: 0 }, label: 'b' },
    ]
    const num = contourIntegralNumerical(poles, { re: 0, im: 0 }, 2, 4000)
    const th = contourIntegralTheoretical(poles, { re: 0, im: 0 }, 2)
    expect(near(num.re, th.re, 1e-2)).toBe(true)
    expect(near(num.im, th.im, 1e-2)).toBe(true)
  })

  it('围道内无极点时积分 ≈ 0（柯西定理）', () => {
    const poles: Pole[] = [
      { z: { re: 3, im: 0 }, residue: { re: 1, im: 0 }, label: 'a' },
    ]
    const num = contourIntegralNumerical(poles, { re: 0, im: 0 }, 1, 3000)
    expect(near(num.re, 0, 1e-2)).toBe(true)
    expect(near(num.im, 0, 1e-2)).toBe(true)
  })

  it('单个单位留数极点 → 积分 = 2πi', () => {
    const poles: Pole[] = [
      { z: { re: 0, im: 0 }, residue: { re: 1, im: 0 }, label: 'a' },
    ]
    const num = contourIntegralNumerical(poles, { re: 0, im: 0 }, 1, 4000)
    expect(near(num.re, 0, 1e-2)).toBe(true)
    expect(near(num.im, 2 * Math.PI, 1e-2)).toBe(true)
  })

  it('evaluateField 在远处按 1/z 衰减', () => {
    const poles: Pole[] = [{ z: { re: 0, im: 0 }, residue: { re: 1, im: 0 }, label: 'a' }]
    const v: Complex = evaluateField(poles, { re: 100, im: 0 })
    expect(near(v.re, 0.01, 1e-6)).toBe(true)
  })
})

describe('预设场景有效性', () => {
  it('每个场景理论值与数值积分一致', () => {
    for (const s of RESIDUE_SCENARIOS) {
      const th = contourIntegralTheoretical(s.poles, s.center, s.radius)
      const num = contourIntegralNumerical(s.poles, s.center, s.radius, 4000)
      expect(near(num.re, th.re, 2e-2)).toBe(true)
      expect(near(num.im, th.im, 2e-2)).toBe(true)
    }
  })

  it('场景字段完整且 key 唯一', () => {
    const keys = new Set<string>()
    for (const s of RESIDUE_SCENARIOS) {
      expect(s.poles.length).toBeGreaterThan(0)
      expect(s.radius).toBeGreaterThan(0)
      expect(s.label.length).toBeGreaterThan(0)
      keys.add(s.key)
    }
    expect(keys.size).toBe(RESIDUE_SCENARIOS.length)
  })
})
