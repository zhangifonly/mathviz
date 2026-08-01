import { describe, it, expect } from 'vitest'
import {
  vivianiCurve, sphereResidual, cylinderResidual, sphereRadius, cylinderRadius,
  projectionResidualXZ, projectionResidualYZ, vivianiWindowArea,
  selfIntersectionPoint, SELF_INTERSECTION_PARAMS, T_RANGE, DEFAULT_A, PRESETS,
} from './vivianiCurve'
import { curvature, torsion, closureGap, arcLength, frenetOrthoError } from '../../lib/curve3d'

describe('维维亚尼曲线', () => {
  const scales = [0.7, 1, 1.4]

  it('同时落在球面与圆柱面上', () => {
    for (const a of scales) {
      const c = vivianiCurve(a)
      for (let i = 0; i <= 100; i++) {
        const t = (T_RANGE[1] * i) / 100
        expect(Math.abs(sphereResidual(t, a))).toBeLessThan(1e-12)
        expect(Math.abs(cylinderResidual(t, a))).toBeLessThan(1e-12)
        expect(c(t).every(Number.isFinite)).toBe(true)
      }
    }
  })

  it('球半径为 2a, 柱半径为 a', () => {
    for (const a of scales) {
      expect(sphereRadius(a)).toBeCloseTo(2 * a, 12)
      expect(cylinderRadius(a)).toBeCloseTo(a, 12)
    }
  })

  it('xz 投影是抛物线 z² = 2a(2a−x)', () => {
    for (const a of scales) {
      for (let i = 0; i <= 100; i++) {
        expect(Math.abs(projectionResidualXZ((T_RANGE[1] * i) / 100, a)))
          .toBeLessThan(1e-12)
      }
    }
  })

  it('yz 投影是双纽线 z²(4a²−z²) = 4a²y²', () => {
    for (const a of scales) {
      for (let i = 0; i <= 100; i++) {
        expect(Math.abs(projectionResidualYZ((T_RANGE[1] * i) / 100, a)))
          .toBeLessThan(1e-11)
      }
    }
  })

  it('xy 投影是圆(就是柱面残差为零的另一种说法)', () => {
    const a = 1
    const c = vivianiCurve(a)
    for (let i = 0; i <= 50; i++) {
      const [x, y] = c((T_RANGE[1] * i) / 50)
      expect(Math.hypot(x - a, y)).toBeCloseTo(a, 10)
    }
  })

  it('参数域必须取 [0,4π]: z 的周期是 4π 而非 2π', () => {
    expect(T_RANGE[1]).toBeCloseTo(4 * Math.PI, 12)
    const c = vivianiCurve()
    // 只取 [0,2π] 时 z 恒非负, 少了下半条
    let minHalf = Infinity
    for (let i = 0; i <= 100; i++) minHalf = Math.min(minHalf, c((2 * Math.PI * i) / 100)[2])
    expect(minHalf).toBeGreaterThanOrEqual(-1e-12)
    // 取满 [0,4π] 才有负 z
    let minFull = Infinity
    for (let i = 0; i <= 200; i++) minFull = Math.min(minFull, c((4 * Math.PI * i) / 200)[2])
    expect(minFull).toBeCloseTo(-2, 2)
  })

  it('自交点在 (2a,0,0), 由 t=0 与 t=2π 给出', () => {
    for (const a of scales) {
      const c = vivianiCurve(a)
      const [t1, t2] = SELF_INTERSECTION_PARAMS
      const p1 = c(t1)
      const p2 = c(t2)
      expect(Math.hypot(p1[0] - p2[0], p1[1] - p2[1], p1[2] - p2[2]))
        .toBeLessThan(1e-12)
      const sp = selfIntersectionPoint(a)
      expect(p1[0]).toBeCloseTo(sp[0], 12)
    }
  })

  it('t=π 与 t=3π 是上下极点, 并不重合', () => {
    const c = vivianiCurve()
    const up = c(Math.PI)
    const down = c(3 * Math.PI)
    expect(up[2]).toBeCloseTo(2, 10)
    expect(down[2]).toBeCloseTo(-2, 10)
    expect(Math.abs(up[2] - down[2])).toBeGreaterThan(3)
  })

  it('在 t∈[0,4π] 上闭合', () => {
    for (const a of scales) {
      expect(closureGap(vivianiCurve(a), 0, T_RANGE[1])).toBeLessThan(1e-12)
    }
  })

  it('维维亚尼窗剩余面积为 4a², 不含 π 故可尺规作图', () => {
    for (const a of scales) {
      expect(vivianiWindowArea(a)).toBeCloseTo(4 * a * a, 12)
    }
    // 与半球面积 2πa'² 对比: 这个值确实不含 π
    expect(vivianiWindowArea(1)).toBe(4)
  })

  it('曲率处处为正(非退化曲线)', () => {
    const c = vivianiCurve()
    for (let i = 1; i < 40; i++) {
      expect(curvature(c, (T_RANGE[1] * i) / 40)).toBeGreaterThan(0.05)
    }
  })

  it('挠率不恒为零(确实是空间曲线而非平面曲线)', () => {
    const c = vivianiCurve()
    const ts = [1, 2, 4, 8].map((t) => Math.abs(torsion(c, t)))
    expect(Math.max(...ts)).toBeGreaterThan(0.05)
  })

  it('Frenet 标架处处正交', () => {
    const c = vivianiCurve()
    for (const t of [0.5, 2, 4, 7, 10]) {
      expect(frenetOrthoError(c, t)).toBeLessThan(1e-8)
    }
  })

  it('弧长为有限正值, 且随 a 线性增长', () => {
    const l1 = arcLength(vivianiCurve(1), 0, T_RANGE[1])
    const l2 = arcLength(vivianiCurve(2), 0, T_RANGE[1])
    expect(l1).toBeGreaterThan(0)
    expect(Number.isFinite(l1)).toBe(true)
    expect(l2 / l1).toBeCloseTo(2, 6)
  })

  it('a 线性缩放所有坐标', () => {
    const base = vivianiCurve(1)(1.3)
    const scaled = vivianiCurve(2.5)(1.3)
    base.forEach((v, i) => expect(scaled[i]).toBeCloseTo(v * 2.5, 10))
  })

  it('PRESETS 的 a 递增且为正', () => {
    for (let i = 0; i < PRESETS.length; i++) {
      expect(PRESETS[i].a).toBeGreaterThan(0)
      if (i > 0) expect(PRESETS[i].a).toBeGreaterThan(PRESETS[i - 1].a)
    }
    expect(PRESETS.some((p) => p.a === DEFAULT_A)).toBe(true)
  })
})
