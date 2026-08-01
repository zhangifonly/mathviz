import { describe, it, expect } from 'vitest'
import {
  aizawaField, aizawaFieldF, complexForm, complexFormError,
  rotationEquivarianceError, analyticDivergence, axisDistance,
  CLASSIC, START, PRESETS,
} from './aizawaAttractor'
import { lyapunovExponent, divergence, orbit, orbitExtent } from '../../lib/attractor3d'
import type { Vec3 } from '../../lib/proj3d'

describe('相泽吸引子', () => {
  const samples: Vec3[] = [[0.5, 0.3, 0.8], [-1.2, 0.7, -0.4], [0.1, -0.9, 1.3]]

  it('前两个方程可合成复数形式 dw/dt = ((z−b)+i·d)·w', () => {
    for (const q of samples) {
      expect(complexFormError(q)).toBeLessThan(1e-15)
    }
  })

  it('复数形式的实部控制胀缩, 虚部控制旋转', () => {
    // z > b 时实部为正, 径向膨胀; z < b 时收缩
    const [re1] = complexForm(1, 0, CLASSIC.b + 0.5)
    expect(re1).toBeGreaterThan(0)
    const [re2] = complexForm(1, 0, CLASSIC.b - 0.5)
    expect(re2).toBeLessThan(0)
    // y=0,x=1 时虚部恰为 d(旋转速率)
    const [, im] = complexForm(1, 0, CLASSIC.b)
    expect(im).toBeCloseTo(CLASSIC.d, 12)
  })

  it('f=0 时严格轴对称(绕 z 轴旋转等变)', () => {
    for (const phi of [0.4, 1.2, 2.5]) {
      for (const q of samples) {
        expect(rotationEquivarianceError(q, phi, { ...CLASSIC, f: 0 }))
          .toBeLessThan(1e-12)
      }
    }
  })

  it('f≠0 时轴对称被打破 —— f 是唯一破坏对称的项', () => {
    for (const f of [0.1, 0.25]) {
      const err = Math.max(...samples.map(
        (q) => rotationEquivarianceError(q, 0.7, { ...CLASSIC, f }),
      ))
      expect(err).toBeGreaterThan(1e-3)
    }
  })

  it('f 越大对称破坏越严重', () => {
    const errs = [0.05, 0.1, 0.25].map(
      (f) => rotationEquivarianceError([0.6, 0.4, 0.5], 0.7, { ...CLASSIC, f }),
    )
    for (let i = 1; i < errs.length; i++) {
      expect(errs[i]).toBeGreaterThan(errs[i - 1])
    }
  })

  it('散度与解析式一致', () => {
    for (const q of samples) {
      expect(divergence(aizawaField(), q)).toBeCloseTo(analyticDivergence(q), 4)
    }
  })

  it('散度解析式含 f·x³ 项(f=0 时该项消失)', () => {
    const q: Vec3 = [2, 0.5, 0.3]
    const withF = analyticDivergence(q, { ...CLASSIC, f: 0.1 })
    const noF = analyticDivergence(q, { ...CLASSIC, f: 0 })
    expect(withF - noF).toBeCloseTo(0.1 * 8, 10)
  })

  it('标准参数下混沌(λ₁ > 0)', () => {
    expect(lyapunovExponent(aizawaField(), START, 0.005, 20000)).toBeGreaterThan(0.01)
  })

  it('轨道有界且在 z 轴附近缠绕', () => {
    const pts = orbit(aizawaField(), { start: START, dt: 0.005, steps: 12000, skip: 3000 })
    expect(pts.length).toBe(12000)
    expect(orbitExtent(pts)).toBeLessThan(15)
    // 到 z 轴的距离应有变化(缠绕而非固定半径)
    const rs = pts.map(axisDistance)
    expect(Math.max(...rs) - Math.min(...rs)).toBeGreaterThan(0.2)
  })

  it('aizawaFieldF 只改 f 保留其余参数', () => {
    const q: Vec3 = [0.7, 0.4, 0.9]
    const a = aizawaFieldF(0.3)(q)
    const b = aizawaField({ ...CLASSIC, f: 0.3 })(q)
    for (let i = 0; i < 3; i++) expect(a[i]).toBeCloseTo(b[i], 12)
  })

  it('原点处 dz = c(纯强迫项)', () => {
    const d = aizawaField()([0, 0, 0])
    // (0−b)·0 得 −0, 而 toBe(0) 判 −0 !== 0, 故用 toBeCloseTo
    expect(d[0]).toBeCloseTo(0, 12)
    expect(d[1]).toBeCloseTo(0, 12)
    expect(d[2]).toBeCloseTo(CLASSIC.c, 12)
  })

  it('PRESETS 含 f=0 的轴对称对照', () => {
    expect(PRESETS.some((p) => p.f === 0)).toBe(true)
    for (let i = 1; i < PRESETS.length; i++) {
      expect(PRESETS[i].f).toBeGreaterThan(PRESETS[i - 1].f)
    }
  })
})
