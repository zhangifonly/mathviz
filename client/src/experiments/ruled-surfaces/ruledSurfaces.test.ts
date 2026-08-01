import { describe, it, expect } from 'vitest'
import {
  RULED_KINDS, RULED_INFO, baseCurve, direction, ruledSurface,
  collinearityError, developabilityDet, infoOf, vRange, U_RANGE,
  type RuledKind,
} from './ruledSurfaces'

describe('直纹曲面', () => {
  it('五种直纹面全部覆盖', () => {
    expect(RULED_KINDS.length).toBe(5)
    expect(RULED_INFO.length).toBe(5)
  })

  it('定义性质: 固定 u 变 v 一定得到直线', () => {
    for (const kind of RULED_KINDS) {
      for (let i = 0; i < 24; i++) {
        expect(collinearityError(kind, (2 * Math.PI * i) / 24)).toBeLessThan(1e-12)
      }
    }
  })

  it('参数方程就是 base(u) + v·dir(u)', () => {
    for (const kind of RULED_KINDS) {
      for (const u of [0.4, 2.1, 5.0]) {
        for (const v of [-0.6, 0, 0.8]) {
          const b = baseCurve(kind, u)
          const d = direction(kind, u)
          const s = ruledSurface(kind, u, v)
          for (let k = 0; k < 3; k++) {
            expect(s[k]).toBeCloseTo(b[k] + v * d[k], 12)
          }
        }
      }
    }
  })

  it('可展判据与标注一致: 圆柱圆锥可展, 其余不可展', () => {
    for (const info of RULED_INFO) {
      const dets = [0, 1, 2, 3, 4.5].map((u) => Math.abs(developabilityDet(info.kind, u)))
      const maxDet = Math.max(...dets)
      if (info.developable) {
        expect(maxDet).toBeLessThan(1e-6)
      } else {
        expect(maxDet).toBeGreaterThan(1e-3)
      }
    }
  })

  it('恰有两种可展曲面', () => {
    const dev = RULED_INFO.filter((r) => r.developable).map((r) => r.kind)
    expect(dev.sort()).toEqual(['cone', 'cylinder'])
  })

  it('直纹不等于可展 —— 三种直纹面摊不平', () => {
    const notDev = RULED_INFO.filter((r) => !r.developable)
    expect(notDev.length).toBe(3)
    expect(notDev.map((r) => r.kind)).toContain('helicoid')
    expect(notDev.map((r) => r.kind)).toContain('hyperboloid')
  })

  it('圆柱面: 方向恒为 z 轴, 半径恒为 1', () => {
    for (const u of [0, 1.5, 4.2]) {
      expect(direction('cylinder', u)).toEqual([0, 0, 1])
      const p = ruledSurface('cylinder', u, 0.7)
      expect(Math.hypot(p[0], p[1])).toBeCloseTo(1, 12)
    }
  })

  it('圆锥面: 所有直线过同一顶点 (0,0,1)', () => {
    for (const u of [0, 2.2, 5.5]) {
      const apex = ruledSurface('cone', u, 0)
      expect(apex).toEqual([0, 0, 1])
    }
  })

  it('螺旋面: 方向水平, 准线沿 z 轴上升', () => {
    for (const u of [0.5, 3.0]) {
      expect(direction('helicoid', u)[2]).toBeCloseTo(0, 12)
      expect(baseCurve('helicoid', u)[2]).toBeCloseTo(u / 3, 12)
    }
  })

  it('莫比乌斯带: 绕行一周方向翻转半圈(与出发反向)', () => {
    const d0 = direction('mobius', 0)
    const d1 = direction('mobius', 2 * Math.PI)
    // u/2 走了 π, cos(π)=-1 sin(π)=0, 故方向反号
    for (let k = 0; k < 3; k++) expect(d1[k]).toBeCloseTo(-d0[k], 10)
  })

  it('莫比乌斯带绕两周才回到原方向(单侧曲面的根源)', () => {
    const d0 = direction('mobius', 0)
    const d2 = direction('mobius', 4 * Math.PI)
    for (let k = 0; k < 3; k++) expect(d2[k]).toBeCloseTo(d0[k], 10)
  })

  it('单叶双曲面: 准线在单位圆上, 方向含竖直分量', () => {
    for (const u of [0.3, 2.8]) {
      const b = baseCurve('hyperboloid', u)
      expect(Math.hypot(b[0], b[1])).toBeCloseTo(1, 12)
      expect(direction('hyperboloid', u)[2]).toBe(1)
    }
  })

  it('各曲面的 v 范围合理且非退化', () => {
    for (const kind of RULED_KINDS) {
      const [lo, hi] = vRange(kind)
      expect(hi).toBeGreaterThan(lo)
    }
  })

  it('参数域内坐标全部有限', () => {
    for (const kind of RULED_KINDS) {
      const [v0, v1] = vRange(kind)
      for (const u of U_RANGE) {
        for (const v of [v0, (v0 + v1) / 2, v1]) {
          expect(ruledSurface(kind, u, v).every(Number.isFinite)).toBe(true)
        }
      }
    }
  })

  it('infoOf 能查到每种曲面, 未知类型有兜底', () => {
    for (const kind of RULED_KINDS) expect(infoOf(kind).kind).toBe(kind)
    expect(infoOf('nope' as RuledKind).kind).toBe('cylinder')
  })
})
