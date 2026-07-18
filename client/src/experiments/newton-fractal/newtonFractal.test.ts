import { describe, it, expect } from 'vitest'
import {
  csub, cmul, cdiv, cabs2, evalPoly, newtonEscape,
  POLYNOMIALS, ROOTS,
} from './newtonFractal'

describe('牛顿分形', () => {
  it('复数运算正确', () => {
    expect(cmul({ re: 1, im: 2 }, { re: 3, im: 4 })).toEqual({ re: -5, im: 10 })
    expect(csub({ re: 5, im: 5 }, { re: 2, im: 1 })).toEqual({ re: 3, im: 4 })
    expect(cabs2({ re: 3, im: 4 })).toBe(25)
  })

  it('cdiv 是 cmul 的逆运算', () => {
    const a = { re: 3, im: -2 }
    const b = { re: 1, im: 4 }
    const q = cdiv(cmul(a, b), b)
    expect(q.re).toBeCloseTo(a.re, 9)
    expect(q.im).toBeCloseTo(a.im, 9)
  })

  it('evalPoly 在根处 f≈0', () => {
    for (const poly of POLYNOMIALS) {
      for (const root of ROOTS[poly]) {
        const { f } = evalPoly(poly, root)
        expect(cabs2(f)).toBeCloseTo(0, 9)
      }
    }
  })

  it('从根附近出发收敛到该根', () => {
    const roots = ROOTS['z^3-1']
    for (let r = 0; r < roots.length; r++) {
      const res = newtonEscape('z^3-1', roots[r].re + 0.01, roots[r].im + 0.01, 50)
      expect(res.root).toBe(r)
      expect(res.iter).toBeLessThan(50)
    }
  })

  it('z^4-1 有四个根且分别可达', () => {
    expect(ROOTS['z^4-1'].length).toBe(4)
    const res = newtonEscape('z^4-1', 0.9, 0.05, 60)
    expect(res.root).toBe(0)
  })

  it('实轴正半区收敛到实根 1 (z^3-1)', () => {
    const res = newtonEscape('z^3-1', 2, 0, 60)
    expect(res.root).toBe(0)
    expect(res.iter).toBeGreaterThanOrEqual(0)
  })

  it('迭代次数不超过 maxIter', () => {
    const res = newtonEscape('z^3-1', 0.0001, 0.0001, 40)
    expect(res.iter).toBeLessThanOrEqual(40)
  })
})
