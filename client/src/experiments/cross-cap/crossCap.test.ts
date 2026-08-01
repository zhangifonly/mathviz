import { describe, it, expect } from 'vitest'
import {
  crossCap, periodGap, antipodalGap, selfIntersection, branchPoints,
  EULER_CHARACTERISTIC, ORIENTABLE, PRESETS, U_RANGE, V_RANGE,
} from './crossCap'

describe('交叉帽', () => {
  it('u 方向是 2π 周期的(曲面闭合的前提)', () => {
    for (const [u, v] of [[0.3, 0.4], [1.7, 1.1], [2.9, 1.5]]) {
      expect(periodGap(u, v)).toBeLessThan(1e-12)
    }
  })

  it('v=π/2 处 u 与 u+π 映到同一点(自交的来源)', () => {
    for (const u of [0, 0.4, 0.9, 1.3, 2.2]) {
      expect(antipodalGap(u)).toBeLessThan(1e-12)
    }
  })

  it('自交线落在 z 轴上(x=y=0)', () => {
    for (const p of selfIntersection(20)) {
      expect(Math.abs(p[0])).toBeLessThan(1e-12)
      expect(Math.abs(p[1])).toBeLessThan(1e-12)
    }
  })

  it('自交线段从 z=-height 走到 z=0', () => {
    for (const h of [0.6, 1, 1.8]) {
      const pts = selfIntersection(30, h)
      expect(pts[0][2]).toBeCloseTo(-h, 10)
      expect(pts[pts.length - 1][2]).toBeCloseTo(0, 10)
    }
  })

  it('两个分支点就是自交线段的两端', () => {
    const [a, b] = branchPoints(1.4)
    expect(a[2]).toBeCloseTo(-1.4, 10)
    expect(b[2]).toBeCloseTo(0, 10)
    expect(branchPoints().length).toBe(2)
  })

  it('v=0 整圈收缩成帽顶单点', () => {
    const top = crossCap(0, 0)
    for (const u of [1, 2, 4, 6]) {
      const p = crossCap(u, 0)
      expect(Math.hypot(p[0] - top[0], p[1] - top[1], p[2] - top[2])).toBeLessThan(1e-12)
    }
    expect(top[2]).toBeCloseTo(1, 10)
  })

  it('height 只线性缩放 z, 不动 x,y', () => {
    for (const [u, v] of [[0.5, 0.6], [2.1, 1.2]]) {
      const a = crossCap(u, v, 1)
      const b = crossCap(u, v, 2.5)
      expect(b[0]).toBeCloseTo(a[0], 12)
      expect(b[1]).toBeCloseTo(a[1], 12)
      expect(b[2]).toBeCloseTo(a[2] * 2.5, 12)
    }
  })

  it('赤道 v=π/4 上到 z 轴距离最大(sin2v 取到 1)', () => {
    const r = (v: number) => {
      const p = crossCap(0.7, v)
      return Math.hypot(p[0], p[1])
    }
    const mid = r(Math.PI / 4)
    for (const v of [0.2, 0.6, 1.0, 1.4]) {
      if (Math.abs(v - Math.PI / 4) > 0.05) expect(r(v)).toBeLessThan(mid + 1e-12)
    }
    expect(mid).toBeCloseTo(1, 10)
  })

  it('射影平面: 欧拉示性数为 1 且不可定向', () => {
    expect(EULER_CHARACTERISTIC).toBe(1)
    expect(ORIENTABLE).toBe(false)
    // 奇数示性数必然不可定向
    expect(EULER_CHARACTERISTIC % 2).toBe(1)
  })

  it('参数域内坐标全部有限', () => {
    for (const u of U_RANGE) {
      for (const v of V_RANGE) {
        expect(crossCap(u, v).every(Number.isFinite)).toBe(true)
      }
    }
  })

  it('PRESETS 的 height 递增且为正', () => {
    for (let i = 0; i < PRESETS.length; i++) {
      expect(PRESETS[i].height).toBeGreaterThan(0)
      if (i > 0) expect(PRESETS[i].height).toBeGreaterThan(PRESETS[i - 1].height)
    }
  })
})
