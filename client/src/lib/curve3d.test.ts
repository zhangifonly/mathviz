import { describe, it, expect } from 'vitest'
import {
  cross3, dot3, norm3, unit3, d1, d2, d3, curvature, torsion, frenet,
  arcLength, closureGap, sample, frenetOrthoError, frenetUnitError,
  type Curve3D,
} from './curve3d'
import type { Vec3 } from './proj3d'

/** 螺旋线。κ = a/(a²+b²), τ = b/(a²+b²) —— 有闭式解, 用来校准 */
const helix = (a: number, b: number): Curve3D =>
  (t) => [a * Math.cos(t), a * Math.sin(t), b * t]

/** 平面圆: κ = 1/r, τ = 0 */
const circle = (r: number): Curve3D => (t) => [r * Math.cos(t), r * Math.sin(t), 0]

/** 直线: κ = 0 */
const line: Curve3D = (t) => [t, 2 * t, 3 * t]

describe('curve3d - 向量工具', () => {
  it('叉积满足右手法则', () => {
    expect(cross3([1, 0, 0], [0, 1, 0])).toEqual([0, 0, 1])
    expect(cross3([0, 1, 0], [0, 0, 1])).toEqual([1, 0, 0])
  })

  it('叉积与两向量都正交', () => {
    const a: Vec3 = [1.3, -0.7, 2.1]
    const b: Vec3 = [0.4, 2.2, -1.1]
    const c = cross3(a, b)
    expect(Math.abs(dot3(c, a))).toBeLessThan(1e-12)
    expect(Math.abs(dot3(c, b))).toBeLessThan(1e-12)
  })

  it('unit3 给出单位向量, 零向量有兜底', () => {
    expect(norm3(unit3([3, 4, 0]))).toBeCloseTo(1, 12)
    expect(unit3([0, 0, 0])).toEqual([0, 0, 1])
  })
})

describe('curve3d - 数值导数', () => {
  it('一阶导对螺旋线准确', () => {
    const c = helix(1, 0.3)
    const v = d1(c, 0.7)
    expect(v[0]).toBeCloseTo(-Math.sin(0.7), 6)
    expect(v[1]).toBeCloseTo(Math.cos(0.7), 6)
    expect(v[2]).toBeCloseTo(0.3, 6)
  })

  it('二阶导对螺旋线准确', () => {
    const c = helix(1, 0.3)
    const a = d2(c, 0.7)
    expect(a[0]).toBeCloseTo(-Math.cos(0.7), 4)
    expect(a[1]).toBeCloseTo(-Math.sin(0.7), 4)
    expect(a[2]).toBeCloseTo(0, 4)
  })

  it('三阶导对螺旋线准确', () => {
    const c = helix(1, 0)
    const j = d3(c, 0.7)
    // (cos t)''' = sin t, (sin t)''' = -cos t
    expect(j[0]).toBeCloseTo(Math.sin(0.7), 3)
    expect(j[1]).toBeCloseTo(-Math.cos(0.7), 3)
  })
})

describe('curve3d - 曲率与挠率', () => {
  it('螺旋线曲率等于解析式 a/(a²+b²)', () => {
    for (const [a, b] of [[1, 0.3], [2, 1], [1.5, -0.8]]) {
      const c = helix(a, b)
      const want = a / (a * a + b * b)
      for (const t of [0.4, 1.7, 3.2]) {
        expect(curvature(c, t)).toBeCloseTo(want, 5)
      }
    }
  })

  it('螺旋线挠率等于解析式 b/(a²+b²), 含左手螺旋的负值', () => {
    for (const [a, b] of [[1, 0.3], [2, 1], [1.5, -0.8]]) {
      const c = helix(a, b)
      const want = b / (a * a + b * b)
      for (const t of [0.4, 1.7, 3.2]) {
        expect(torsion(c, t)).toBeCloseTo(want, 5)
      }
    }
  })

  it('螺旋线的曲率与挠率都是常数(与解析值比对而非互相比对)', () => {
    // 数值差分在不同 t 处误差不同, 互相比对会被差分噪声卡住;
    // 与解析常数比对既更严格, 也直接检验了「是那个常数」
    const c = helix(1, 0.3)
    const kWant = 1 / (1 + 0.09)
    const tWant = 0.3 / (1 + 0.09)
    for (const t of [0.2, 1.5, 3, 5]) {
      expect(curvature(c, t)).toBeCloseTo(kWant, 6)
      expect(torsion(c, t)).toBeCloseTo(tWant, 5)
    }
  })

  it('平面圆: 曲率 1/r 且挠率为零', () => {
    for (const r of [1, 2.5]) {
      const c = circle(r)
      expect(curvature(c, 1)).toBeCloseTo(1 / r, 5)
      expect(Math.abs(torsion(c, 1))).toBeLessThan(1e-6)
    }
  })

  it('直线曲率为零', () => {
    expect(curvature(line, 1)).toBeLessThan(1e-6)
  })
})

describe('curve3d - Frenet 标架', () => {
  it('三向量两两正交', () => {
    for (const c of [helix(1, 0.3), helix(2, 1), circle(1.5)]) {
      for (const t of [0.3, 1.4, 2.9]) {
        expect(frenetOrthoError(c, t)).toBeLessThan(1e-9)
      }
    }
  })

  it('三向量都是单位长', () => {
    for (const c of [helix(1, 0.3), circle(2)]) {
      for (const t of [0.5, 2.1]) {
        expect(frenetUnitError(c, t)).toBeLessThan(1e-9)
      }
    }
  })

  it('T 指向切线方向', () => {
    const c = helix(1, 0.3)
    const { T } = frenet(c, 0.8)
    const v = unit3(d1(c, 0.8))
    for (let i = 0; i < 3; i++) expect(T[i]).toBeCloseTo(v[i], 6)
  })

  it('平面曲线的 B 恒为常向量(挠率零的几何含义)', () => {
    const c = circle(1)
    const b0 = frenet(c, 0.3).B
    for (const t of [1.2, 2.5, 4]) {
      const b = frenet(c, t).B
      for (let i = 0; i < 3; i++) expect(b[i]).toBeCloseTo(b0[i], 6)
    }
  })

  it('曲率为零处不产生 NaN(有占位兜底)', () => {
    const { T, N, B } = frenet(line, 1)
    for (const v of [T, N, B]) {
      expect(v.every(Number.isFinite)).toBe(true)
    }
    expect(frenetOrthoError(line, 1)).toBeLessThan(1e-9)
  })
})

describe('curve3d - 弧长与采样', () => {
  it('螺旋线弧长等于 √(a²+b²)·Δt', () => {
    for (const [a, b] of [[1, 0.3], [2, 1]]) {
      const got = arcLength(helix(a, b), 0, 2 * Math.PI)
      expect(got).toBeCloseTo(Math.sqrt(a * a + b * b) * 2 * Math.PI, 5)
    }
  })

  it('圆周长为 2πr', () => {
    expect(arcLength(circle(1.5), 0, 2 * Math.PI)).toBeCloseTo(2 * Math.PI * 1.5, 5)
  })

  it('闭合曲线的 closureGap 近零, 非闭合则明显非零', () => {
    expect(closureGap(circle(1), 0, 2 * Math.PI)).toBeLessThan(1e-12)
    // 螺旋线不闭合, z 方向差 2πb
    expect(closureGap(helix(1, 0.3), 0, 2 * Math.PI)).toBeCloseTo(0.3 * 2 * Math.PI, 6)
  })

  it('sample 返回 n+1 个点且覆盖端点', () => {
    const pts = sample(circle(1), 0, Math.PI, 10)
    expect(pts.length).toBe(11)
    expect(pts[0][0]).toBeCloseTo(1, 12)
    expect(pts[10][0]).toBeCloseTo(-1, 12)
  })
})
