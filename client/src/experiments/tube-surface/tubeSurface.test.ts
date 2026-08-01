import { describe, it, expect } from 'vitest'
import {
  CURVES, CURVE_INFO, centerCurve, curveRange, frenetFrame, tubeSurface,
  curvature, radialError, dot, infoOf, THETA_RANGE, type CurveKind,
} from './tubeSurface'

describe('管状曲面', () => {
  it('三条中心曲线信息完整', () => {
    expect(CURVES.length).toBe(3)
    expect(CURVE_INFO.length).toBe(3)
    for (const c of CURVE_INFO) expect(c.equation.length).toBeGreaterThan(5)
  })

  it('Frenet 标架三向量两两正交', () => {
    for (const kind of CURVES) {
      const [t0, t1] = curveRange(kind)
      for (let i = 1; i < 20; i++) {
        const { T, N, B } = frenetFrame(kind, t0 + ((t1 - t0) * i) / 20)
        expect(Math.abs(dot(T, N))).toBeLessThan(1e-6)
        expect(Math.abs(dot(T, B))).toBeLessThan(1e-6)
        expect(Math.abs(dot(N, B))).toBeLessThan(1e-6)
      }
    }
  })

  it('Frenet 标架三向量都是单位长', () => {
    for (const kind of CURVES) {
      const [t0, t1] = curveRange(kind)
      for (let i = 1; i < 15; i++) {
        const { T, N, B } = frenetFrame(kind, t0 + ((t1 - t0) * i) / 15)
        for (const v of [T, N, B]) {
          expect(Math.hypot(v[0], v[1], v[2])).toBeCloseTo(1, 8)
        }
      }
    }
  })

  it('管面上每点到中心线的距离恒等于 r', () => {
    for (const kind of CURVES) {
      const [t0, t1] = curveRange(kind)
      for (const r of [0.15, 0.25, 0.4]) {
        for (let i = 1; i < 15; i++) {
          for (let j = 0; j < 8; j++) {
            const t = t0 + ((t1 - t0) * i) / 15
            const th = (2 * Math.PI * j) / 8
            expect(radialError(kind, t, th, r)).toBeLessThan(1e-10)
          }
        }
      }
    }
  })

  it('三条曲线曲率处处非零(Frenet 有定义的前提)', () => {
    for (const kind of CURVES) {
      const [t0, t1] = curveRange(kind)
      for (let i = 0; i <= 40; i++) {
        expect(curvature(kind, t0 + ((t1 - t0) * i) / 40)).toBeGreaterThan(0.1)
      }
    }
  })

  it('螺旋线的曲率是常数', () => {
    const ks = [1, 2.5, 4, 7].map((t) => curvature('helix', t))
    for (let i = 1; i < ks.length; i++) expect(ks[i]).toBeCloseTo(ks[0], 5)
  })

  it('螺旋线曲率的解析值 a/(a²+b²) = 1/1.09', () => {
    // a=1, b=0.3 时 κ = 1/(1+0.09)
    expect(curvature('helix', 2)).toBeCloseTo(1 / 1.09, 4)
  })

  it('螺旋线: 到 z 轴距离恒为 1, z 线性上升', () => {
    for (const t of [0, 2, 5, 9]) {
      const p = centerCurve('helix', t)
      expect(Math.hypot(p[0], p[1])).toBeCloseTo(1, 12)
      expect(p[2]).toBeCloseTo(0.3 * t, 12)
    }
  })

  it('三叶结与维维亚尼曲线都闭合', () => {
    for (const kind of ['trefoil', 'viviani'] as CurveKind[]) {
      const a = centerCurve(kind, 0)
      const b = centerCurve(kind, 2 * Math.PI)
      expect(Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])).toBeLessThan(1e-9)
    }
  })

  it('维维亚尼曲线落在球面与柱面的交上', () => {
    // 球心原点半径 2, 柱面 (x-1)²+y²=1
    for (let i = 0; i <= 20; i++) {
      const p = centerCurve('viviani', (2 * Math.PI * i) / 20)
      expect(Math.hypot(p[0], p[1], p[2])).toBeCloseTo(2, 6)
      expect((p[0] - 1) ** 2 + p[1] ** 2).toBeCloseTo(1, 10)
    }
  })

  it('r 线性缩放管面到中心线的偏移量', () => {
    for (const kind of CURVES) {
      const c = centerCurve(kind, 1.2)
      const p1 = tubeSurface(kind, 1.2, 0.8, 0.2)
      const p2 = tubeSurface(kind, 1.2, 0.8, 0.6)
      const d1 = Math.hypot(p1[0] - c[0], p1[1] - c[1], p1[2] - c[2])
      const d2 = Math.hypot(p2[0] - c[0], p2[1] - c[1], p2[2] - c[2])
      expect(d2).toBeCloseTo(d1 * 3, 8)
    }
  })

  it('管面参数域内坐标全部有限', () => {
    for (const kind of CURVES) {
      const [t0, t1] = curveRange(kind)
      for (const t of [t0 + 0.1, (t0 + t1) / 2, t1 - 0.1]) {
        for (const th of THETA_RANGE) {
          expect(tubeSurface(kind, t, th).every(Number.isFinite)).toBe(true)
        }
      }
    }
  })

  it('infoOf 能查到每条曲线, 未知类型有兜底', () => {
    for (const kind of CURVES) expect(infoOf(kind).kind).toBe(kind)
    expect(infoOf('nope' as CurveKind).kind).toBe('helix')
  })
})
