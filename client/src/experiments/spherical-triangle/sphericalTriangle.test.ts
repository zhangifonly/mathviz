import { describe, it, expect } from 'vitest'
import {
  triangleOf, angleSum, excessOf, areaFraction, scaledAngleSum, sidesOf,
  anglesOf, infoOf, TRIANGLE_KINDS, TRIANGLE_INFO,
  EUCLIDEAN_ANGLE_SUM, ANGLE_SUM_RANGE,
} from './sphericalTriangle'
import {
  cosineRuleResidual, sineRuleSpread, triangleArea, pythagoreanResidual,
  sphericalDistance, sphericalAngle, norm,
} from '../../lib/sphere3d'

describe('球面三角形 - 五个预设', () => {
  it('五种类型信息完整', () => {
    expect(TRIANGLE_KINDS.length).toBe(5)
    expect(TRIANGLE_INFO.length).toBe(5)
  })

  it('所有顶点都在单位球上', () => {
    for (const k of TRIANGLE_KINDS) {
      const t = triangleOf(k)
      for (const v of [t.A, t.B, t.C]) {
        expect(norm(v)).toBeCloseTo(1, 10)
      }
    }
  })

  it('每个三角形的内角和都严格大于 π', () => {
    for (const k of TRIANGLE_KINDS) {
      expect(angleSum(triangleOf(k))).toBeGreaterThan(EUCLIDEAN_ANGLE_SUM)
    }
  })

  it('内角和落在 (π, 3π) 区间内', () => {
    for (const k of TRIANGLE_KINDS) {
      const s = angleSum(triangleOf(k))
      expect(s).toBeGreaterThan(ANGLE_SUM_RANGE[0])
      expect(s).toBeLessThan(ANGLE_SUM_RANGE[1])
    }
  })

  it('球面余弦定理对五个预设都成立', () => {
    for (const k of TRIANGLE_KINDS) {
      expect(Math.abs(cosineRuleResidual(triangleOf(k)))).toBeLessThan(1e-12)
    }
  })

  it('球面正弦定理对五个预设都成立', () => {
    for (const k of TRIANGLE_KINDS) {
      expect(sineRuleSpread(triangleOf(k))).toBeLessThan(1e-8)
    }
  })

  it('吉拉尔定理: 面积 = 球面盈余', () => {
    for (const k of TRIANGLE_KINDS) {
      expect(triangleArea(triangleOf(k))).toBeCloseTo(excessOf(k), 12)
    }
  })
})

describe('球面三角形 - 具体数值', () => {
  it('八分之一球面: 三个直角, 面积恰好占 12.5%', () => {
    const angs = anglesOf('octant')
    for (const a of angs) expect(a).toBeCloseTo(Math.PI / 2, 10)
    expect(angleSum(triangleOf('octant'))).toBeCloseTo((3 * Math.PI) / 2, 10)
    expect(areaFraction('octant')).toBeCloseTo(0.125, 8)
  })

  it('八分之一球面: 三边都是 π/2', () => {
    for (const s of sidesOf('octant')) expect(s).toBeCloseTo(Math.PI / 2, 10)
  })

  it('小三角形: 内角和接近 180°(近似欧氏)', () => {
    const sum = (angleSum(triangleOf('small')) * 180) / Math.PI
    expect(sum).toBeGreaterThan(180)
    expect(sum).toBeLessThan(183)
    // 面积占比极小
    expect(areaFraction('small')).toBeLessThan(0.01)
  })

  it('接近半球: 面积占比趋近 50%, 内角趋近 180°', () => {
    expect(areaFraction('hemisphere')).toBeGreaterThan(0.49)
    expect(areaFraction('hemisphere')).toBeLessThan(0.5)
    // 盈余趋近 2π
    expect(excessOf('hemisphere')).toBeGreaterThan(2 * Math.PI - 0.1)
    expect(excessOf('hemisphere')).toBeLessThan(2 * Math.PI)
    for (const a of anglesOf('hemisphere')) {
      expect((a * 180) / Math.PI).toBeGreaterThan(178)
    }
  })

  it('大三角形介于小与半球之间', () => {
    const small = areaFraction('small')
    const large = areaFraction('large')
    const hemi = areaFraction('hemisphere')
    expect(large).toBeGreaterThan(small)
    expect(large).toBeLessThan(hemi)
  })

  it('直角三角形: A 处确实是直角', () => {
    const t = triangleOf('rightAngled')
    expect(sphericalAngle(t.A, t.B, t.C)).toBeCloseTo(Math.PI / 2, 8)
  })

  it('直角三角形满足球面勾股定理 cos c = cos a·cos b', () => {
    const t = triangleOf('rightAngled')
    const hyp = sphericalDistance(t.B, t.C)
    const legB = sphericalDistance(t.C, t.A)
    const legC = sphericalDistance(t.A, t.B)
    expect(Math.abs(pythagoreanResidual(legB, legC, hyp))).toBeLessThan(1e-12)
  })

  it('直角三角形不满足欧氏勾股定理(边长不小时差别明显)', () => {
    const t = triangleOf('rightAngled')
    const hyp = sphericalDistance(t.B, t.C)
    const legB = sphericalDistance(t.C, t.A)
    const legC = sphericalDistance(t.A, t.B)
    const euclid = Math.hypot(legB, legC)
    // 球面斜边比欧氏预测短
    expect(hyp).toBeLessThan(euclid)
    expect(Math.abs(hyp - euclid)).toBeGreaterThan(0.01)
  })

  it('面积占比随三角形增大而增大', () => {
    const order: Array<typeof TRIANGLE_KINDS[number]> = [
      'small', 'rightAngled', 'octant', 'large', 'hemisphere',
    ]
    const fracs = order.map((k) => areaFraction(k))
    for (let i = 1; i < fracs.length; i++) {
      expect(fracs[i]).toBeGreaterThan(fracs[i - 1])
    }
  })
})

describe('球面三角形 - 没有相似三角形', () => {
  it('把三角形缩小, 内角和会跟着变(欧氏几何里不会)', () => {
    const sums = [1, 0.7, 0.4, 0.1].map((s) => scaledAngleSum('octant', s))
    // 越小越接近 π
    for (let i = 1; i < sums.length; i++) {
      expect(sums[i]).toBeLessThan(sums[i - 1])
    }
    expect(sums[0]).toBeCloseTo((3 * Math.PI) / 2, 8)
  })

  it('缩到极小时内角和趋于 π(欧氏极限)', () => {
    const tiny = scaledAngleSum('octant', 0.02)
    expect(tiny).toBeGreaterThan(Math.PI)
    expect((tiny * 180) / Math.PI).toBeLessThan(180.1)
  })

  it('角度随大小变化 ⟹ 角相同则大小必相同 ⟹ 无相似非全等三角形', () => {
    // 同一形状不同尺度给出不同内角和, 故「角相同」蕴含「尺度相同」
    const a = scaledAngleSum('octant', 1)
    const b = scaledAngleSum('octant', 0.5)
    expect(Math.abs(a - b)).toBeGreaterThan(0.1)
  })

  it('缩放对所有预设都有同样效应', () => {
    for (const k of TRIANGLE_KINDS) {
      const full = scaledAngleSum(k, 1)
      const half = scaledAngleSum(k, 0.3)
      expect(half).toBeLessThan(full)
      expect(half).toBeGreaterThan(Math.PI - 1e-9)
    }
  })

  it('infoOf 能查到每种, 未知有兜底', () => {
    for (const k of TRIANGLE_KINDS) expect(infoOf(k).kind).toBe(k)
    expect(infoOf('nope' as never).kind).toBe('small')
  })
})
