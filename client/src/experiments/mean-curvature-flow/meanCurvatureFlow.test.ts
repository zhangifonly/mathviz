import { describe, it, expect } from 'vitest'
import {
  sphereRadius, sphereExtinctionTime, cylinderRadius, cylinderCollapseTime,
  sphereMeanCurvature, cylinderMeanCurvature, stepProfile, initialProfile,
  profileVolume, profileArea, INITIAL_SHAPES, SHAPE_INFO, infoOf,
  PROFILE_POINTS, type ShapeKind,
} from './meanCurvatureFlow'

describe('平均曲率流 - 解析解', () => {
  it('球面半径 R(t) = √(R₀²−4t)', () => {
    for (const r0 of [1, 1.5, 2]) {
      expect(sphereRadius(0, r0)).toBeCloseTo(r0, 12)
      expect(sphereRadius(0.05, r0)).toBeCloseTo(Math.sqrt(r0 * r0 - 0.2), 12)
    }
  })

  it('球面在 t* = R₀²/4 收缩成点', () => {
    for (const r0 of [1, 1.5, 2]) {
      const ts = sphereExtinctionTime(r0)
      expect(ts).toBeCloseTo((r0 * r0) / 4, 12)
      expect(sphereRadius(ts, r0)).toBe(0)
      // 超过消失时刻仍返回 0, 不产生 NaN
      expect(sphereRadius(ts + 1, r0)).toBe(0)
    }
  })

  it('球面满足 dR/dt = −H, 其中 H = 2/R', () => {
    const h = 1e-6
    for (const r0 of [1, 1.5]) {
      const t = 0.05
      const dR = (sphereRadius(t + h, r0) - sphereRadius(t - h, r0)) / (2 * h)
      expect(dR).toBeCloseTo(-sphereMeanCurvature(sphereRadius(t, r0)), 4)
    }
  })

  it('圆柱半径 R(t) = √(R₀²−2t), 满足 dR/dt = −1/R', () => {
    const h = 1e-6
    for (const r0 of [1, 1.5]) {
      const t = 0.05
      expect(cylinderRadius(t, r0)).toBeCloseTo(Math.sqrt(r0 * r0 - 2 * t), 12)
      const dR = (cylinderRadius(t + h, r0) - cylinderRadius(t - h, r0)) / (2 * h)
      expect(dR).toBeCloseTo(-cylinderMeanCurvature(cylinderRadius(t, r0)), 4)
    }
  })

  it('圆柱在 t* = R₀²/2 坍塌, 比同半径球面晚一倍', () => {
    for (const r0 of [1, 1.5]) {
      expect(cylinderCollapseTime(r0)).toBeCloseTo((r0 * r0) / 2, 12)
      expect(cylinderCollapseTime(r0)).toBeCloseTo(2 * sphereExtinctionTime(r0), 12)
    }
  })

  it('平均曲率: 球面 2/R, 圆柱 1/R', () => {
    expect(sphereMeanCurvature(2)).toBe(1)
    expect(cylinderMeanCurvature(2)).toBe(0.5)
    // 半径归零时约定返回 Infinity, 不产生 NaN
    expect(sphereMeanCurvature(0)).toBe(Infinity)
  })
})

describe('平均曲率流 - 数值演化', () => {
  const dz = 2 / (PROFILE_POINTS - 1)
  const dt = 1e-5

  it('数值演化圆柱与解析解吻合', () => {
    let prof = initialProfile('cylinder')
    const r0 = prof[0]
    for (let k = 0; k < 10000; k++) prof = stepProfile(prof, dz, dt)
    const t = 10000 * dt
    // 取中点避开边界效应
    expect(prof[Math.floor(PROFILE_POINTS / 2)]).toBeCloseTo(cylinderRadius(t, r0), 3)
  })

  it('体积单调减少', () => {
    for (const kind of INITIAL_SHAPES) {
      let prof = initialProfile(kind)
      const v0 = profileVolume(prof, dz)
      for (let k = 0; k < 2000; k++) prof = stepProfile(prof, dz, dt)
      expect(profileVolume(prof, dz)).toBeLessThan(v0)
    }
  })

  it('面积单调减少(流的定义性质)', () => {
    for (const kind of ['cylinder', 'peanut'] as ShapeKind[]) {
      let prof = initialProfile(kind)
      const a0 = profileArea(prof, dz)
      for (let k = 0; k < 2000; k++) prof = stepProfile(prof, dz, dt)
      expect(profileArea(prof, dz)).toBeLessThan(a0)
    }
  })

  it('半径始终非负, 不产生 NaN', () => {
    for (const kind of INITIAL_SHAPES) {
      let prof = initialProfile(kind)
      for (let k = 0; k < 5000; k++) prof = stepProfile(prof, dz, dt)
      for (const r of prof) {
        expect(r).toBeGreaterThanOrEqual(0)
        expect(Number.isFinite(r)).toBe(true)
      }
    }
  })

  it('哑铃的细腰收缩快于两端(奇点先在腰部形成)', () => {
    let prof = initialProfile('dumbbell')
    const mid = Math.floor(PROFILE_POINTS / 2)
    const waist0 = prof[mid]
    const end0 = prof[2]
    for (let k = 0; k < 1500; k++) prof = stepProfile(prof, dz, dt)
    const waistDrop = waist0 - prof[mid]
    const endDrop = end0 - prof[2]
    expect(waistDrop).toBeGreaterThan(endDrop)
  })

  it('花生形的腰部逐渐变圆(趋于球形)', () => {
    let prof = initialProfile('peanut')
    const mid = Math.floor(PROFILE_POINTS / 2)
    // 初始腰部比两端细
    expect(prof[mid]).toBeLessThan(prof[2])
    const gap0 = prof[2] - prof[mid]
    for (let k = 0; k < 2000; k++) prof = stepProfile(prof, dz, dt)
    // 演化后腰部与端部的差距缩小
    expect(prof[2] - prof[mid]).toBeLessThan(gap0)
  })
})

describe('平均曲率流 - 初始形状', () => {
  it('四种初始形状信息完整', () => {
    expect(INITIAL_SHAPES.length).toBe(4)
    expect(SHAPE_INFO.length).toBe(4)
    for (const s of SHAPE_INFO) expect(s.note.length).toBeGreaterThan(3)
  })

  it('球面母线两端归零, 中点为 1', () => {
    const p = initialProfile('sphere')
    expect(p[0]).toBeCloseTo(0, 6)
    expect(p[p.length - 1]).toBeCloseTo(0, 6)
    expect(p[Math.floor(p.length / 2)]).toBeCloseTo(1, 1)
  })

  it('圆柱母线处处相等', () => {
    const p = initialProfile('cylinder')
    for (const r of p) expect(r).toBeCloseTo(p[0], 12)
  })

  it('哑铃母线中间细两端粗', () => {
    const p = initialProfile('dumbbell')
    const mid = Math.floor(p.length / 2)
    expect(p[mid]).toBeLessThan(p[0])
    expect(p[mid]).toBeLessThan(p[p.length - 1])
  })

  it('体积与面积都是有限正数', () => {
    const dz = 2 / (PROFILE_POINTS - 1)
    for (const kind of INITIAL_SHAPES) {
      const p = initialProfile(kind)
      expect(profileVolume(p, dz)).toBeGreaterThan(0)
      expect(profileArea(p, dz)).toBeGreaterThan(0)
    }
  })

  it('infoOf 能查到每种形状, 未知类型有兜底', () => {
    for (const kind of INITIAL_SHAPES) expect(infoOf(kind).kind).toBe(kind)
    expect(infoOf('nope' as ShapeKind).kind).toBe('sphere')
  })
})
