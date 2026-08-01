import { describe, it, expect } from 'vitest'
import {
  SURFACES, SURFACE_INFO, heightFn, domainRange, surfacePoint, derivatives,
  gaussianCurvature, meanCurvature, principalCurvatures, pointType, infoOf,
  type SurfaceKind,
} from './gaussianCurvature'

/** 在参数域内均匀采样, 收集有限的曲率值 */
function sampleK(kind: SurfaceKind, n = 11): number[] {
  const [a, b] = domainRange(kind)
  const out: number[] = []
  for (let i = 1; i < n; i++) {
    for (let j = 1; j < n; j++) {
      const x = a + ((b - a) * i) / n
      const y = a + ((b - a) * j) / n
      const k = gaussianCurvature(kind, x, y)
      if (Number.isFinite(k) && Math.abs(k) < 1e6) out.push(k)
    }
  }
  return out
}

describe('高斯曲率', () => {
  it('六种曲面信息完整', () => {
    expect(SURFACES.length).toBe(6)
    expect(SURFACE_INFO.length).toBe(6)
    for (const s of SURFACE_INFO) expect(s.sign.length).toBeGreaterThan(3)
  })

  it('球冠: K 恒等于 1/R² = 1/2.56', () => {
    for (const [x, y] of [[0, 0], [0.5, 0.3], [-0.8, 0.6]]) {
      expect(gaussianCurvature('sphere', x, y)).toBeCloseTo(1 / 2.56, 4)
    }
  })

  it('球冠: 处处为椭圆点(K > 0)', () => {
    const ks = sampleK('sphere')
    expect(ks.filter((k) => k < -1e-3).length).toBe(0)
    // 按比例断言而非硬编码个数, 免得改采样密度就失效
    expect(ks.filter((k) => k > 1e-3).length / ks.length).toBeGreaterThan(0.9)
  })

  it('鞍面: 处处为双曲点(K < 0)', () => {
    const ks = sampleK('saddle')
    expect(ks.every((k) => k < 0)).toBe(true)
    expect(pointType('saddle', 0.4, 0.5)).toBe('双曲点')
  })

  it('柱面: K 精确为零(一个主曲率为零)', () => {
    for (const [x, y] of [[0, 0], [0.5, 0.7], [-0.6, -0.4]]) {
      expect(Math.abs(gaussianCurvature('cylinder', x, y))).toBeLessThan(1e-6)
      expect(pointType('cylinder', x, y)).toBe('抛物点')
    }
  })

  it('柱面: 两个主曲率一个为零一个非零', () => {
    const [k1, k2] = principalCurvatures('cylinder', 0.3, 0.5)
    const mn = Math.min(Math.abs(k1), Math.abs(k2))
    const mx = Math.max(Math.abs(k1), Math.abs(k2))
    expect(mn).toBeLessThan(1e-3)
    expect(mx).toBeGreaterThan(0.1)
  })

  it('环面: K 变号(外侧正内侧负)', () => {
    const ks = sampleK('torus')
    expect(ks.filter((k) => k > 1e-3).length).toBeGreaterThan(10)
    expect(ks.filter((k) => k < -1e-3).length).toBeGreaterThan(10)
  })

  it('火山口: K 变号', () => {
    const ks = sampleK('volcano')
    expect(ks.filter((k) => k > 1e-3).length).toBeGreaterThan(10)
    expect(ks.filter((k) => k < -1e-3).length).toBeGreaterThan(10)
  })

  it('蛋形: K 处处为正但不均匀', () => {
    const ks = sampleK('egg').filter((k) => Math.abs(k) > 1e-3)
    expect(ks.every((k) => k > 0)).toBe(true)
    // 不均匀: 最大最小相差明显
    expect(Math.max(...ks) / Math.min(...ks)).toBeGreaterThan(1.5)
  })

  it('K = κ₁·κ₂ 恒成立(主曲率的定义)', () => {
    for (const kind of SURFACES) {
      const [a, b] = domainRange(kind)
      for (const t of [0.3, 0.6]) {
        const x = a + (b - a) * t
        const y = a + (b - a) * (1 - t)
        const K = gaussianCurvature(kind, x, y)
        const [k1, k2] = principalCurvatures(kind, x, y)
        if (Number.isFinite(K) && Math.abs(K) < 100) {
          expect(k1 * k2).toBeCloseTo(K, 3)
        }
      }
    }
  })

  it('H = (κ₁+κ₂)/2 恒成立', () => {
    for (const kind of SURFACES) {
      const [a, b] = domainRange(kind)
      const x = a + (b - a) * 0.4
      const y = a + (b - a) * 0.55
      const H = meanCurvature(kind, x, y)
      const [k1, k2] = principalCurvatures(kind, x, y)
      if (Number.isFinite(H) && Math.abs(H) < 100) {
        expect((k1 + k2) / 2).toBeCloseTo(H, 3)
      }
    }
  })

  it('鞍面导数与解析式一致: f=0.6(x²−y²)', () => {
    const d = derivatives('saddle', 0.5, 0.3)
    expect(d.fx).toBeCloseTo(1.2 * 0.5, 4)
    expect(d.fy).toBeCloseTo(-1.2 * 0.3, 4)
    expect(d.fxx).toBeCloseTo(1.2, 3)
    expect(d.fyy).toBeCloseTo(-1.2, 3)
    expect(Math.abs(d.fxy)).toBeLessThan(1e-3)
  })

  it('surfacePoint 的 x,y 就是输入值', () => {
    for (const kind of SURFACES) {
      const p = surfacePoint(kind, 0.4, -0.3)
      expect(p[0]).toBe(0.4)
      expect(p[1]).toBe(-0.3)
      expect(p[2]).toBeCloseTo(heightFn(kind, 0.4, -0.3), 12)
    }
  })

  it('所有曲面在参数域内高度有限', () => {
    for (const kind of SURFACES) {
      const [a, b] = domainRange(kind)
      for (const x of [a, 0, b]) {
        for (const y of [a, 0, b]) {
          expect(Number.isFinite(heightFn(kind, x, y))).toBe(true)
        }
      }
    }
  })

  it('infoOf 能查到每种曲面, 未知类型有兜底', () => {
    for (const kind of SURFACES) expect(infoOf(kind).kind).toBe(kind)
    expect(infoOf('nope' as SurfaceKind).kind).toBe('sphere')
  })
})
