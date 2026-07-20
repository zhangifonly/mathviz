import { describe, it, expect } from 'vitest'
import {
  discriminant, curveY, onCurve, negate,
  pointAdd, pointDouble, scalarMult, CURVES,
} from './ellipticCurve'

const C = { a: -1, b: 1 }

describe('椭圆曲线群运算', () => {
  it('预设曲线均非奇异（判别式非零）', () => {
    for (const c of CURVES) {
      expect(discriminant(c)).not.toBe(0)
    }
  })

  it('curveY 求出的点确实落在曲线上', () => {
    const y = curveY(C, 1)
    expect(y).not.toBeNull()
    expect(onCurve(C, { x: 1, y: y as number })).toBe(true)
    expect(onCurve(C, { x: 1, y: (y as number) + 0.5 })).toBe(false)
  })

  it('无穷远点 O 是单位元：P+O=P, O+P=P', () => {
    const p = { x: 1, y: curveY(C, 1) as number }
    expect(pointAdd(C, p, null)).toEqual(p)
    expect(pointAdd(C, null, p)).toEqual(p)
  })

  it('P + (-P) = O（无穷远点）', () => {
    const p = { x: 1, y: curveY(C, 1) as number }
    expect(pointAdd(C, p, negate(p))).toBeNull()
  })

  it('加法结果仍在曲线上，且 P+Q=Q+P（交换律）', () => {
    const p = { x: 1, y: curveY(C, 1) as number }
    const q = { x: 2, y: curveY(C, 2) as number }
    const s1 = pointAdd(C, p, q)
    const s2 = pointAdd(C, q, p)
    expect(onCurve(C, s1)).toBe(true)
    expect(s1!.x).toBeCloseTo(s2!.x, 6)
    expect(s1!.y).toBeCloseTo(s2!.y, 6)
  })

  it('pointDouble 与 pointAdd(P,P) 一致', () => {
    const p = { x: 2, y: curveY(C, 2) as number }
    const d = pointDouble(C, p)
    const a = pointAdd(C, p, p)
    expect(d!.x).toBeCloseTo(a!.x, 6)
    expect(d!.y).toBeCloseTo(a!.y, 6)
  })

  it('scalarMult 满足 3P = P+P+P 且结合律 2P+P', () => {
    const p = { x: 2, y: curveY(C, 2) as number }
    const three = scalarMult(C, 3, p)
    const manual = pointAdd(C, pointAdd(C, p, p), p)
    expect(three!.x).toBeCloseTo(manual!.x, 5)
    expect(three!.y).toBeCloseTo(manual!.y, 5)
  })

  it('n*P 与 (-n)*P 互为负元', () => {
    const p = { x: 2, y: curveY(C, 2) as number }
    const a = scalarMult(C, 4, p)
    const b = scalarMult(C, -4, p)
    expect(pointAdd(C, a, b)).toBeNull()
  })
})
