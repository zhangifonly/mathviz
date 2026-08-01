import { describe, it, expect } from 'vitest'
import {
  curveOf, rangeOf, curvatureOf, torsionOf, frenetSerretError, isPlanar,
  binormalDrift, infoOf, CURVE_KINDS, CURVE_INFO,
  HELIX_CURVATURE, HELIX_TORSION, type CurveKind,
} from './spaceCurveFrenet'
import { frenetOrthoError, frenetUnitError, closureGap } from '../../lib/curve3d'

describe('空间曲线与活动标架', () => {
  it('四条曲线覆盖 (κ,τ) 的四种典型组合', () => {
    expect(CURVE_KINDS.length).toBe(4)
    expect(CURVE_INFO.length).toBe(4)
    // 三条常曲率常挠率 + 一条都变化
    expect(CURVE_INFO.filter((c) => c.constCurvature && c.constTorsion).length).toBe(3)
    expect(CURVE_INFO.filter((c) => !c.constCurvature).length).toBe(1)
  })

  it('Frenet–Serret 三条公式都成立', () => {
    for (const kind of ['circle', 'helix', 'trefoil'] as CurveKind[]) {
      for (const t of [0.7, 1.9, 3.4]) {
        const { tErr, nErr, bErr } = frenetSerretError(kind, t)
        expect(tErr).toBeLessThan(1e-3)
        expect(nErr).toBeLessThan(1e-3)
        expect(bErr).toBeLessThan(1e-3)
      }
    }
  })

  it('直线: κ = 0', () => {
    for (const t of [-1, 0, 1.5]) {
      expect(curvatureOf('line', t)).toBeLessThan(1e-6)
    }
  })

  it('圆: κ = 1 且 τ = 0', () => {
    for (const t of [0.4, 1.8, 3.5, 5.2]) {
      expect(curvatureOf('circle', t)).toBeCloseTo(1, 5)
      expect(Math.abs(torsionOf('circle', t))).toBeLessThan(1e-6)
    }
  })

  it('螺旋线: κ 与 τ 都等于解析常数', () => {
    for (const t of [0.5, 2.5, 6, 12]) {
      expect(curvatureOf('helix', t)).toBeCloseTo(HELIX_CURVATURE, 5)
      expect(torsionOf('helix', t)).toBeCloseTo(HELIX_TORSION, 4)
    }
  })

  it('螺旋线解析常数与公式 a/(a²+b²)、b/(a²+b²) 一致', () => {
    expect(HELIX_CURVATURE).toBeCloseTo(1 / (1 + 0.1225), 12)
    expect(HELIX_TORSION).toBeCloseTo(0.35 / (1 + 0.1225), 12)
  })

  it('三叶结: κ 与 τ 都随 t 变化', () => {
    const ks = [0.5, 1.5, 2.5, 4].map((t) => curvatureOf('trefoil', t))
    const ts = [0.5, 1.5, 2.5, 4].map((t) => torsionOf('trefoil', t))
    expect(Math.max(...ks) - Math.min(...ks)).toBeGreaterThan(0.02)
    expect(Math.max(...ts) - Math.min(...ts)).toBeGreaterThan(0.02)
  })

  it('平面性判据: 只有直线与圆是平面曲线', () => {
    expect(isPlanar('circle')).toBe(true)
    expect(isPlanar('line')).toBe(true)
    expect(isPlanar('helix')).toBe(false)
    expect(isPlanar('trefoil')).toBe(false)
  })

  it('平面曲线的副法向量是常向量(τ=0 的几何含义)', () => {
    // 圆: B 不漂移
    expect(binormalDrift('circle')).toBeLessThan(1e-6)
    // 螺旋线与三叶结: B 明显转动
    expect(binormalDrift('helix')).toBeGreaterThan(0.5)
    expect(binormalDrift('trefoil')).toBeGreaterThan(0.5)
  })

  it('曲率恒非负', () => {
    for (const kind of CURVE_KINDS) {
      const [t0, t1] = rangeOf(kind)
      for (let i = 1; i < 15; i++) {
        expect(curvatureOf(kind, t0 + ((t1 - t0) * i) / 15))
          .toBeGreaterThanOrEqual(-1e-9)
      }
    }
  })

  it('Frenet 标架处处正交且单位长', () => {
    for (const kind of CURVE_KINDS) {
      const [t0, t1] = rangeOf(kind)
      const c = curveOf(kind)
      for (let i = 1; i < 10; i++) {
        const t = t0 + ((t1 - t0) * i) / 10
        expect(frenetOrthoError(c, t)).toBeLessThan(1e-8)
        expect(frenetUnitError(c, t)).toBeLessThan(1e-8)
      }
    }
  })

  it('圆与三叶结闭合, 直线与螺旋线不闭合', () => {
    for (const kind of ['circle', 'trefoil'] as CurveKind[]) {
      const [t0, t1] = rangeOf(kind)
      expect(closureGap(curveOf(kind), t0, t1)).toBeLessThan(1e-9)
    }
    for (const kind of ['line', 'helix'] as CurveKind[]) {
      const [t0, t1] = rangeOf(kind)
      expect(closureGap(curveOf(kind), t0, t1)).toBeGreaterThan(0.5)
    }
  })

  it('曲率常数性标注与实测一致', () => {
    for (const info of CURVE_INFO) {
      const [t0, t1] = rangeOf(info.kind)
      const ks = [0.2, 0.45, 0.7].map((f) => curvatureOf(info.kind, t0 + (t1 - t0) * f))
      const spread = Math.max(...ks) - Math.min(...ks)
      if (info.constCurvature) expect(spread).toBeLessThan(1e-3)
      else expect(spread).toBeGreaterThan(1e-3)
    }
  })

  it('参数域内坐标全部有限', () => {
    for (const kind of CURVE_KINDS) {
      const [t0, t1] = rangeOf(kind)
      const c = curveOf(kind)
      for (const t of [t0, (t0 + t1) / 2, t1]) {
        expect(c(t).every(Number.isFinite)).toBe(true)
      }
    }
  })

  it('infoOf 能查到每条曲线, 未知有兜底', () => {
    for (const kind of CURVE_KINDS) expect(infoOf(kind).kind).toBe(kind)
    expect(infoOf('nope' as CurveKind).kind).toBe('line')
  })
})
