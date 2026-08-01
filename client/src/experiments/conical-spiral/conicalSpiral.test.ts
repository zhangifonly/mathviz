import { describe, it, expect } from 'vitest'
import {
  conicalSpiral, conicalSpiralAlpha, radiusAt, coneResidual, projectionRadius,
  generatorAngle, growthPerTurn, apexLimit, CLASSIC, T_RANGE, PRESETS,
} from './conicalSpiral'
import { arcLength, curvature } from '../../lib/curve3d'

describe('圆锥螺线', () => {
  const alphas = [Math.PI / 7, Math.PI / 5, Math.PI / 3.5]

  it('落在圆锥面上: x²+y² = (z·tanα)²', () => {
    for (const alpha of alphas) {
      const p = { ...CLASSIC, alpha }
      for (let i = 0; i <= 100; i++) {
        expect(Math.abs(coneResidual((T_RANGE[1] * i) / 100, p))).toBeLessThan(1e-12)
      }
    }
  })

  it('底面投影半径就是对数螺线 r₀e^(kt)', () => {
    for (const alpha of alphas) {
      const p = { ...CLASSIC, alpha }
      for (let i = 0; i <= 60; i++) {
        const t = (T_RANGE[1] * i) / 60
        expect(projectionRadius(t, p)).toBeCloseTo(radiusAt(t, p), 10)
      }
    }
  })

  it('等角性: 与母线的夹角处处恒定', () => {
    for (const alpha of alphas) {
      const p = { ...CLASSIC, alpha }
      const angs = [2, 6, 12, 20].map((t) => generatorAngle(t, p))
      for (const a of angs) expect(a).toBeCloseTo(angs[0], 8)
    }
  })

  it('夹角随半顶角变化(不同锥给出不同角)', () => {
    const angs = alphas.map((alpha) => generatorAngle(5, { ...CLASSIC, alpha }))
    // 三个值应互不相同
    expect(Math.abs(angs[0] - angs[1])).toBeGreaterThan(0.01)
    expect(Math.abs(angs[1] - angs[2])).toBeGreaterThan(0.01)
  })

  it('每绕一圈半径放大 e^(2πk)', () => {
    const want = Math.exp(2 * Math.PI * CLASSIC.k)
    expect(growthPerTurn()).toBeCloseTo(want, 12)
    for (const t of [1, 5, 12]) {
      expect(radiusAt(t + 2 * Math.PI) / radiusAt(t)).toBeCloseTo(want, 10)
    }
  })

  it('半径按指数单调增长', () => {
    const rs = [0, 5, 10, 20].map((t) => radiusAt(t))
    for (let i = 1; i < rs.length; i++) expect(rs[i]).toBeGreaterThan(rs[i - 1])
  })

  it('t → −∞ 时趋于顶点(原点)', () => {
    expect(apexLimit()).toBeLessThan(1e-50)
    expect(apexLimit()).toBeGreaterThanOrEqual(0)
  })

  it('z 与 r 成正比, 比例为 1/tanα', () => {
    for (const alpha of alphas) {
      const p = { ...CLASSIC, alpha }
      const c = conicalSpiral(p)
      for (const t of [3, 9, 15]) {
        const [x, y, z] = c(t)
        expect(z).toBeCloseTo(Math.hypot(x, y) / Math.tan(alpha), 10)
      }
    }
  })

  it('半顶角越小锥越尖, 同半径处 z 越大', () => {
    const zs = alphas.map((alpha) => conicalSpiral({ ...CLASSIC, alpha })(10)[2])
    for (let i = 1; i < zs.length; i++) expect(zs[i]).toBeLessThan(zs[i - 1])
  })

  it('conicalSpiralAlpha 只改半顶角', () => {
    const a = conicalSpiralAlpha(0.5)(4)
    const b = conicalSpiral({ ...CLASSIC, alpha: 0.5 })(4)
    for (let i = 0; i < 3; i++) expect(a[i]).toBeCloseTo(b[i], 12)
  })

  it('曲率处处为正且随 t 增大而减小(螺线越往外越平缓)', () => {
    const c = conicalSpiral()
    const ks = [4, 10, 18, 24].map((t) => curvature(c, t))
    for (const k of ks) expect(k).toBeGreaterThan(0)
    for (let i = 1; i < ks.length; i++) expect(ks[i]).toBeLessThan(ks[i - 1])
  })

  it('弧长为有限正值', () => {
    const l = arcLength(conicalSpiral(), 0, T_RANGE[1], 800)
    expect(l).toBeGreaterThan(0)
    expect(Number.isFinite(l)).toBe(true)
  })

  it('参数域内坐标全部有限', () => {
    const c = conicalSpiral()
    for (const t of [T_RANGE[0], T_RANGE[1] / 2, T_RANGE[1]]) {
      expect(c(t).every(Number.isFinite)).toBe(true)
    }
  })

  it('PRESETS 的半顶角递增且都在 (0, π/2) 内', () => {
    for (let i = 0; i < PRESETS.length; i++) {
      expect(PRESETS[i].alpha).toBeGreaterThan(0)
      expect(PRESETS[i].alpha).toBeLessThan(Math.PI / 2)
      if (i > 0) expect(PRESETS[i].alpha).toBeGreaterThan(PRESETS[i - 1].alpha)
    }
  })
})
