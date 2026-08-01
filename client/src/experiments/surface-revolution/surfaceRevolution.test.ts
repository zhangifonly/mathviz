import { describe, it, expect } from 'vitest'
import {
  PROFILES, PROFILE_INFO, profile, profileRange, revolve, derivative,
  lateralArea, revolvedVolume, infoOf, U_RANGE, type ProfileKind,
} from './surfaceRevolution'

describe('旋转曲面', () => {
  it('七种母线全部覆盖且信息完整', () => {
    expect(PROFILES.length).toBe(7)
    expect(PROFILE_INFO.length).toBe(7)
    for (const p of PROFILE_INFO) {
      expect(p.curve.length).toBeGreaterThan(5)
      expect(p.label.length).toBeGreaterThan(1)
    }
  })

  it('旋转面性质: 到 z 轴距离只由母线参数决定', () => {
    for (const kind of PROFILES) {
      const [t0, t1] = profileRange(kind)
      const t = (t0 + t1) / 2
      const want = Math.abs(profile(kind, t).r)
      for (const u of [0, 1.2, 3.0, 5.1]) {
        const p = revolve(kind, u, t)
        expect(Math.hypot(p[0], p[1])).toBeCloseTo(want, 10)
      }
    }
  })

  it('z 坐标与绕轴角度无关', () => {
    for (const kind of PROFILES) {
      const [t0, t1] = profileRange(kind)
      const t = t0 + (t1 - t0) * 0.4
      const z0 = revolve(kind, 0, t)[2]
      for (const u of [1, 2.5, 4.4]) {
        expect(revolve(kind, u, t)[2]).toBeCloseTo(z0, 12)
      }
    }
  })

  it('Pappus 侧面积: 单位球面得 4π', () => {
    expect(lateralArea('sphere')).toBeCloseTo(4 * Math.PI, 4)
  })

  it('Pappus 侧面积: 环面得 4π²Ra', () => {
    expect(lateralArea('torus')).toBeCloseTo(4 * Math.PI * Math.PI * 1 * 0.4, 4)
  })

  it('Pappus 体积: 单位球得 4π/3', () => {
    expect(revolvedVolume('sphere')).toBeCloseTo((4 * Math.PI) / 3, 4)
  })

  it('Pappus 体积: 环面得 2π²Ra²', () => {
    expect(revolvedVolume('torus')).toBeCloseTo(2 * Math.PI * Math.PI * 1 * 0.16, 4)
  })

  it('Pappus 体积: 抛物面 t∈[0,1.4] 得 π·t⁴/2', () => {
    expect(revolvedVolume('paraboloid')).toBeCloseTo((Math.PI * 1.4 ** 4) / 2, 4)
  })

  it('所有面积与体积都是有限正数', () => {
    for (const kind of PROFILES) {
      const a = lateralArea(kind, 800)
      const v = revolvedVolume(kind, 800)
      expect(a).toBeGreaterThan(0)
      expect(Number.isFinite(a)).toBe(true)
      expect(v).toBeGreaterThanOrEqual(0)
      expect(Number.isFinite(v)).toBe(true)
    }
  })

  it('球面母线: r=sin t 在两端收缩为极点', () => {
    expect(profile('sphere', 0).r).toBeCloseTo(0, 12)
    expect(profile('sphere', Math.PI).r).toBeCloseTo(0, 12)
    expect(profile('sphere', Math.PI / 2).r).toBeCloseTo(1, 12)
  })

  it('环面母线: 径向距离在 [R−a, R+a] 内振荡', () => {
    for (let i = 0; i <= 40; i++) {
      const r = profile('torus', (2 * Math.PI * i) / 40).r
      expect(r).toBeGreaterThanOrEqual(0.6 - 1e-12)
      expect(r).toBeLessThanOrEqual(1.4 + 1e-12)
    }
  })

  it('数值导数与解析导数一致(以球面为例)', () => {
    for (const t of [0.4, 1.2, 2.5]) {
      const d = derivative('sphere', t)
      expect(d.r).toBeCloseTo(Math.cos(t), 5)
      expect(d.z).toBeCloseTo(-Math.sin(t), 5)
    }
  })

  it('花瓶母线说明任意母线都能用', () => {
    // r = 1 + 0.3 sin 3t 有三个凸起
    const rs = Array.from({ length: 60 }, (_, i) => profile('vase', (2 * Math.PI * i) / 60).r)
    expect(Math.max(...rs)).toBeCloseTo(1.3, 1)
    expect(Math.min(...rs)).toBeCloseTo(0.7, 1)
  })

  it('参数域内坐标全部有限', () => {
    for (const kind of PROFILES) {
      const [t0, t1] = profileRange(kind)
      for (const u of U_RANGE) {
        for (const t of [t0, (t0 + t1) / 2, t1]) {
          expect(revolve(kind, u, t).every(Number.isFinite)).toBe(true)
        }
      }
    }
  })

  it('infoOf 能查到每种母线, 未知类型有兜底', () => {
    for (const kind of PROFILES) expect(infoOf(kind).kind).toBe(kind)
    expect(infoOf('nope' as ProfileKind).kind).toBe('sphere')
  })
})
