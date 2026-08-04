import { describe, it, expect } from 'vitest'
import {
  CUBE, TETRAHEDRON, OCTAHEDRON, PRISM, SOLIDS, solidOf,
  rationalMultipleOfPi, dehnIsZero, dehnNonzeroWeight,
  couldBeEquidecomposable, edgeRatioForEqualVolume,
  continuedFraction, fromContinuedFraction, nivenNumerator, nivenDivisibleBy3,
  TIMELINE, PLANE_FACT,
} from './dehnInvariant'

const DEG = 180 / Math.PI

describe('Dehn 不变量 - 二面角的有理性', () => {
  it('π/2 是 π 的有理倍数', () => {
    const r = rationalMultipleOfPi(Math.PI / 2)
    expect(r.rational).toBe(true)
    expect(r.p).toBe(1)
    expect(r.q).toBe(2)
  })

  it('π/3、2π/3、π 都能识别', () => {
    expect(rationalMultipleOfPi(Math.PI / 3).rational).toBe(true)
    expect(rationalMultipleOfPi((2 * Math.PI) / 3).rational).toBe(true)
    expect(rationalMultipleOfPi(Math.PI).rational).toBe(true)
    expect(rationalMultipleOfPi(0).rational).toBe(true)
  })

  it('arccos(1/3) 不是 π 的有理倍数(枚举到 10000)', () => {
    expect(rationalMultipleOfPi(Math.acos(1 / 3)).rational).toBe(false)
  })

  it('arccos(−1/3) 也不是', () => {
    expect(rationalMultipleOfPi(Math.acos(-1 / 3)).rational).toBe(false)
  })

  it('正四面体二面角约 70.53°', () => {
    expect(Math.acos(1 / 3) * DEG).toBeCloseTo(70.5288, 3)
  })

  it('正八面体二面角约 109.47°, 与四面体互补', () => {
    expect(Math.acos(-1 / 3) * DEG).toBeCloseTo(109.4712, 3)
    expect(Math.acos(1 / 3) + Math.acos(-1 / 3)).toBeCloseTo(Math.PI, 12)
  })
})

describe('Dehn 不变量 - 四种立体', () => {
  it('立方体的 Dehn 不变量为零', () => {
    expect(dehnIsZero(CUBE)).toBe(true)
    expect(dehnNonzeroWeight(CUBE)).toBe(0)
  })

  it('正三棱柱的 Dehn 不变量也为零(两种角都是有理倍数)', () => {
    expect(dehnIsZero(PRISM)).toBe(true)
    expect(dehnNonzeroWeight(PRISM)).toBe(0)
  })

  it('正四面体的 Dehn 不变量非零', () => {
    expect(dehnIsZero(TETRAHEDRON)).toBe(false)
    // 6 条棱全挂在不可通约的角上
    expect(dehnNonzeroWeight(TETRAHEDRON, 1)).toBeCloseTo(6, 10)
  })

  it('正八面体的 Dehn 不变量非零', () => {
    expect(dehnIsZero(OCTAHEDRON)).toBe(false)
    expect(dehnNonzeroWeight(OCTAHEDRON, 1)).toBeCloseTo(12, 10)
  })

  it('非零权重与棱长成正比', () => {
    expect(dehnNonzeroWeight(TETRAHEDRON, 2)).toBeCloseTo(12, 10)
    expect(dehnNonzeroWeight(TETRAHEDRON, 0.5)).toBeCloseTo(3, 10)
  })

  it('体积公式正确', () => {
    expect(CUBE.volume(2)).toBe(8)
    expect(TETRAHEDRON.volume(1)).toBeCloseTo(1 / (6 * Math.SQRT2), 12)
    expect(OCTAHEDRON.volume(1)).toBeCloseTo(Math.SQRT2 / 3, 12)
    expect(PRISM.volume(1)).toBeCloseTo(Math.sqrt(3) / 4, 12)
  })

  it('棱的条数正确', () => {
    const count = (s: typeof CUBE) => s.terms(1).reduce((n, t) => n + t.count, 0)
    expect(count(CUBE)).toBe(12)
    expect(count(TETRAHEDRON)).toBe(6)
    expect(count(OCTAHEDRON)).toBe(12)
    expect(count(PRISM)).toBe(9)
  })

  it('solidOf 四种都能取到, 未知兜底为立方体', () => {
    for (const s of SOLIDS) expect(solidOf(s.id as never).id).toBe(s.id)
    expect(solidOf('nope' as never).id).toBe('cube')
  })
})

describe('Dehn 不变量 - 希尔伯特第三问题', () => {
  it('立方体与正四面体剪不成对方', () => {
    const r = couldBeEquidecomposable(CUBE, TETRAHEDRON)
    expect(r.possible).toBe(false)
    expect(r.reason).toContain('剪不成')
  })

  it('立方体与正三棱柱不构成障碍(都为零)', () => {
    const r = couldBeEquidecomposable(CUBE, PRISM)
    expect(r.possible).toBe(true)
  })

  it('两个都非零时需进一步判断', () => {
    const r = couldBeEquidecomposable(TETRAHEDRON, OCTAHEDRON)
    expect(r.possible).toBe(true)
    expect(r.reason).toContain('需比较')
  })

  it('等体积棱长比正确', () => {
    const k = edgeRatioForEqualVolume(CUBE, TETRAHEDRON)
    expect(TETRAHEDRON.volume(k)).toBeCloseTo(CUBE.volume(1), 10)
    expect(k).toBeCloseTo(2.0396, 3)
  })

  it('等体积但仍剪不成 —— 这正是第三问题的答案', () => {
    const k = edgeRatioForEqualVolume(CUBE, TETRAHEDRON)
    // 体积相等
    expect(TETRAHEDRON.volume(k)).toBeCloseTo(CUBE.volume(1), 10)
    // 但 Dehn 不变量不同
    expect(dehnIsZero(CUBE)).not.toBe(dehnIsZero(TETRAHEDRON))
    expect(couldBeEquidecomposable(CUBE, TETRAHEDRON, 1, k).possible).toBe(false)
  })

  it('对每种立体都能算出等体积棱长', () => {
    for (const s of SOLIDS) {
      const k = edgeRatioForEqualVolume(CUBE, s)
      expect(s.volume(k)).toBeCloseTo(1, 9)
      expect(k).toBeGreaterThan(0)
    }
  })

  it('年表按时间排序且覆盖关键节点', () => {
    expect(TIMELINE.length).toBe(4)
    for (let i = 1; i < TIMELINE.length; i++) {
      expect(TIMELINE[i].year).toBeGreaterThanOrEqual(TIMELINE[i - 1].year)
    }
    expect(TIMELINE[0].year).toBe(1833)
    expect(TIMELINE.some((t) => t.event.includes('Dehn'))).toBe(true)
    expect(TIMELINE.some((t) => t.event.includes('Sydler'))).toBe(true)
  })

  it('平面对照事实有内容', () => {
    expect(PLANE_FACT).toContain('Bolyai')
    expect(PLANE_FACT.length).toBeGreaterThan(20)
  })
})

describe('Dehn 不变量 - 无理性的数值证据', () => {
  it('Niven 递推与直接计算一致', () => {
    const theta = Math.acos(1 / 3)
    for (let n = 0; n <= 12; n++) {
      const direct = Math.pow(3, n) * Math.cos(n * theta)
      expect(nivenNumerator(n)).toBeCloseTo(direct, 6)
    }
  })

  it('3ⁿcos(nθ) 永不被 3 整除 —— θ 不是 π 的有理倍数', () => {
    for (let n = 0; n <= 30; n++) {
      expect(nivenDivisibleBy3(n)).toBe(false)
    }
  })

  it('递推起点正确: a_0 = a_1 = 1', () => {
    expect(nivenNumerator(0)).toBe(1)
    expect(nivenNumerator(1)).toBe(1)
    expect(nivenNumerator(2)).toBe(-7)
  })

  it('若 θ 是 π 的有理倍数, cos(nθ) 会循环 —— 对照 π/3', () => {
    const t = Math.PI / 3
    // cos(nπ/3) 只取 6 个值, 周期为 6
    for (let n = 0; n < 12; n++) {
      expect(Math.cos(n * t)).toBeCloseTo(Math.cos((n + 6) * t), 12)
    }
    // 而 arccos(1/3) 不循环
    const th = Math.acos(1 / 3)
    let sameCount = 0
    for (let n = 1; n < 30; n++) {
      if (Math.abs(Math.cos(n * th) - Math.cos(0)) < 1e-9) sameCount++
    }
    expect(sameCount).toBe(0)
  })

  it('有理数的连分数会终止', () => {
    expect(continuedFraction(0.5, 12)).toEqual([0, 2])
    expect(continuedFraction(0.25, 12)).toEqual([0, 4])
    expect(continuedFraction(1 / 3, 12)).toEqual([0, 3])
  })

  it('arccos(1/3)/π 的连分数不终止', () => {
    const cf = continuedFraction(Math.acos(1 / 3) / Math.PI, 12)
    expect(cf.length).toBe(12)
    expect(cf[0]).toBe(0)
    expect(cf[1]).toBe(2)
  })

  it('连分数能还原原值', () => {
    for (const x of [0.5, 0.25, Math.acos(1 / 3) / Math.PI, Math.SQRT2 - 1]) {
      const cf = continuedFraction(x, 20)
      expect(fromContinuedFraction(cf)).toBeCloseTo(x, 9)
    }
  })
})
