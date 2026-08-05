import { describe, it, expect } from 'vitest'
import {
  sub, dot, norm, dist, scale, add,
  planeNormal, planePoint, planeDistance, isEllipse,
  dandelinSpheres, tangencyPoint, foci, generatrixDir, cutPoint, cutCurve,
  tangentCircle, generatrixSegment, tangentPointOnGeneratrix,
  focalSum, focalSumSpread, tangentLengthGap, tangentLengthAnalytic,
  semiMajor, semiMinor, focalHalfDistance, eccentricity,
  eccentricityAnalytic, presetOf, PRESETS, PROOF_STEPS,
  type ConeCut,
} from './dandelin'

/** 所有构成椭圆的预设 */
const ELLIPSE_CUTS: ConeCut[] = PRESETS
  .map((p) => presetOf(p.id))
  .filter(isEllipse)

describe('Dandelin - 向量工具', () => {
  it('基本运算正确', () => {
    expect(sub([5, 5, 5], [1, 2, 3])).toEqual([4, 3, 2])
    expect(dot([1, 2, 3], [4, 5, 6])).toBe(32)
    expect(norm([3, 4, 0])).toBeCloseTo(5, 12)
    expect(dist([0, 0, 0], [3, 4, 0])).toBeCloseTo(5, 12)
    expect(scale([1, 2, 3], 2)).toEqual([2, 4, 6])
    expect(add([1, 1, 1], [2, 3, 4])).toEqual([3, 4, 5])
  })

  it('平面法向是单位向量', () => {
    for (const cut of ELLIPSE_CUTS) {
      expect(norm(planeNormal(cut))).toBeCloseTo(1, 12)
    }
  })

  it('θ=0 时法向是 z 轴', () => {
    const n = planeNormal({ alpha: 0.4, theta: 0, h: 3 })
    expect(n[0]).toBeCloseTo(0, 12)
    expect(n[2]).toBeCloseTo(1, 12)
  })

  it('平面上的点到平面距离为零', () => {
    for (const cut of ELLIPSE_CUTS) {
      expect(Math.abs(planeDistance(planePoint(cut), cut))).toBeLessThan(1e-12)
    }
  })

  it('椭圆条件：θ < π/2 − α', () => {
    expect(isEllipse({ alpha: 0.4, theta: 0.3, h: 3 })).toBe(true)
    // θ 恰好等于 π/2 − α 时是抛物线，不算椭圆
    expect(isEllipse({ alpha: 0.4, theta: Math.PI / 2 - 0.4, h: 3 })).toBe(false)
    expect(isEllipse({ alpha: 0.4, theta: 1.4, h: 3 })).toBe(false)
  })
})

describe('Dandelin - 双球的相切条件', () => {
  it('球与切平面相切：到平面距离 = 半径', () => {
    for (const cut of ELLIPSE_CUTS) {
      for (const s of dandelinSpheres(cut)) {
        expect(Math.abs(Math.abs(planeDistance(s.center, cut)) - s.radius))
          .toBeLessThan(1e-10)
      }
    }
  })

  it('球与锥面相切：半径 = 球心高 × sin α', () => {
    for (const cut of ELLIPSE_CUTS) {
      for (const s of dandelinSpheres(cut)) {
        expect(s.radius).toBeCloseTo(s.center[2] * Math.sin(cut.alpha), 10)
      }
    }
  })

  it('两球分列切平面两侧', () => {
    for (const cut of ELLIPSE_CUTS) {
      const [up, low] = dandelinSpheres(cut)
      const du = planeDistance(up.center, cut)
      const dl = planeDistance(low.center, cut)
      expect(Math.sign(du)).not.toBe(Math.sign(dl))
    }
  })

  it('上球在下球之上, 且半径更大', () => {
    for (const cut of ELLIPSE_CUTS) {
      const [up, low] = dandelinSpheres(cut)
      expect(up.center[2]).toBeGreaterThan(low.center[2])
      expect(up.radius).toBeGreaterThan(low.radius)
    }
  })

  it('球心都在 z 轴上', () => {
    for (const cut of ELLIPSE_CUTS) {
      for (const s of dandelinSpheres(cut)) {
        expect(Math.abs(s.center[0])).toBeLessThan(1e-12)
        expect(Math.abs(s.center[1])).toBeLessThan(1e-12)
      }
    }
  })

  it('切圆在锥面上：半径 = z·tan α', () => {
    for (const cut of ELLIPSE_CUTS) {
      for (const s of dandelinSpheres(cut)) {
        const tc = tangentCircle(s, cut.alpha)
        expect(tc.radius).toBeCloseTo(tc.z * Math.tan(cut.alpha), 10)
      }
    }
  })
})

describe('Dandelin - 切口在锥面与平面上', () => {
  it('切口点同时满足锥面与平面方程', () => {
    for (const cut of ELLIPSE_CUTS) {
      for (const phi of [0, 0.9, 2.1, 3.7, 5.5]) {
        const p = cutPoint(cut, phi)
        expect(p).not.toBeNull()
        // 锥面：√(x²+y²) = z·tan α
        expect(Math.hypot(p![0], p![1]))
          .toBeCloseTo(p![2] * Math.tan(cut.alpha), 9)
        // 平面
        expect(Math.abs(planeDistance(p!, cut))).toBeLessThan(1e-9)
      }
    }
  })

  it('母线方向是单位向量且倾角为 α', () => {
    for (const phi of [0, 1, 2.5]) {
      const d = generatrixDir(0.42, phi)
      expect(norm(d)).toBeCloseTo(1, 12)
      // 与 z 轴夹角
      expect(Math.acos(d[2])).toBeCloseTo(0.42, 10)
    }
  })

  it('曲线采样点数正确且都在锥上', () => {
    const cut = presetOf('mild')
    const curve = cutCurve(cut, 60)
    expect(curve.length).toBe(60)
    for (const p of curve) {
      expect(Math.hypot(p[0], p[1]))
        .toBeCloseTo(p[2] * Math.tan(cut.alpha), 9)
    }
  })

  it('θ=0 时切口是圆（到 z 轴距离恒定）', () => {
    const cut: ConeCut = { alpha: 0.42, theta: 0, h: 3 }
    const curve = cutCurve(cut, 48)
    const rs = curve.map((p) => Math.hypot(p[0], p[1]))
    expect(Math.max(...rs) - Math.min(...rs)).toBeLessThan(1e-12)
  })
})

describe('Dandelin - 证明第一步：切线段等长', () => {
  it('从切口点到球的两条切线段等长（PF = PT）', () => {
    for (const cut of ELLIPSE_CUTS) {
      for (const phi of [0, 1.2, 2.5, 4.0, 5.8]) {
        expect(tangentLengthGap(cut, phi, true)).toBeLessThan(1e-9)
        expect(tangentLengthGap(cut, phi, false)).toBeLessThan(1e-9)
      }
    }
  })

  it('切线段长与解析式 √(|PO|²−r²) 一致', () => {
    for (const cut of ELLIPSE_CUTS) {
      const [up, low] = dandelinSpheres(cut)
      for (const phi of [0.4, 2.2, 4.9]) {
        const p = cutPoint(cut, phi)!
        for (const s of [up, low]) {
          const f = tangencyPoint(s, cut)
          expect(dist(p, f)).toBeCloseTo(tangentLengthAnalytic(p, s), 9)
        }
      }
    }
  })

  it('切点落在球面上', () => {
    for (const cut of ELLIPSE_CUTS) {
      for (const s of dandelinSpheres(cut)) {
        // 与平面的切点
        expect(dist(tangencyPoint(s, cut), s.center)).toBeCloseTo(s.radius, 9)
        // 与锥面的切点
        for (const phi of [0, 1.5, 3.3]) {
          expect(dist(tangentPointOnGeneratrix(s, cut.alpha, phi), s.center))
            .toBeCloseTo(s.radius, 9)
        }
      }
    }
  })
})

describe('Dandelin - 证明的结论：焦距和恒定', () => {
  it('PF₁ + PF₂ 与点的位置无关', () => {
    for (const cut of ELLIPSE_CUTS) {
      expect(focalSumSpread(cut, 240)).toBeLessThan(1e-9)
    }
  })

  it('PF₁ + PF₂ 恰等于母线上被两切圆截出的段 T₁T₂', () => {
    for (const cut of ELLIPSE_CUTS) {
      const seg = generatrixSegment(cut)
      for (const phi of [0, 1.1, 2.8, 4.5, 6.0]) {
        expect(focalSum(cut, phi)).toBeCloseTo(seg, 9)
      }
    }
  })

  it('T₁T₂ 与方位角无关（每条母线都等长）', () => {
    // T₁T₂ 的定义只用到球心高度，本身与 φ 无关；
    // 这里验证由它算出的焦距和在各 φ 上确实一致
    for (const cut of ELLIPSE_CUTS) {
      const sums = [0, 1, 2, 3, 4, 5, 6].map((phi) => focalSum(cut, phi))
      for (const s of sums) expect(s).toBeCloseTo(sums[0], 9)
    }
  })

  it('长半轴 a = T₁T₂ / 2', () => {
    for (const cut of ELLIPSE_CUTS) {
      expect(semiMajor(cut) * 2).toBeCloseTo(generatrixSegment(cut), 10)
      // 也等于焦距和的一半
      expect(semiMajor(cut) * 2).toBeCloseTo(focalSum(cut, 1.0), 9)
    }
  })

  it('焦点在切平面上', () => {
    for (const cut of ELLIPSE_CUTS) {
      for (const f of foci(cut)) {
        expect(Math.abs(planeDistance(f, cut))).toBeLessThan(1e-10)
      }
    }
  })

  it('圆的情形两焦点重合', () => {
    const cut: ConeCut = { alpha: 0.42, theta: 0, h: 3 }
    const [f1, f2] = foci(cut)
    expect(dist(f1, f2)).toBeLessThan(1e-12)
    expect(focalHalfDistance(cut)).toBeLessThan(1e-12)
  })
})

describe('Dandelin - 椭圆参数与离心率', () => {
  it('满足 a² = b² + c²', () => {
    for (const cut of ELLIPSE_CUTS) {
      const a = semiMajor(cut)
      const b = semiMinor(cut)
      const c = focalHalfDistance(cut)
      expect(a * a).toBeCloseTo(b * b + c * c, 9)
    }
  })

  it('离心率与解析式 sin θ / cos α 一致', () => {
    for (const cut of ELLIPSE_CUTS) {
      expect(eccentricity(cut)).toBeCloseTo(eccentricityAnalytic(cut), 9)
    }
  })

  it('θ=0 给 e=0（圆）', () => {
    const cut: ConeCut = { alpha: 0.42, theta: 0, h: 3 }
    expect(eccentricity(cut)).toBeLessThan(1e-12)
    expect(semiMajor(cut)).toBeCloseTo(semiMinor(cut), 9)
  })

  it('θ 增大则 e 增大（越扁）', () => {
    const es = [0, 0.2, 0.5, 0.8, 1.0].map(
      (theta) => eccentricity({ alpha: 0.42, theta, h: 3 }),
    )
    for (let i = 1; i < es.length; i++) {
      expect(es[i]).toBeGreaterThan(es[i - 1])
    }
  })

  it('e 始终在 [0, 1) 内', () => {
    for (const cut of ELLIPSE_CUTS) {
      const e = eccentricity(cut)
      expect(e).toBeGreaterThanOrEqual(0)
      expect(e).toBeLessThan(1)
    }
  })

  it('θ → π/2 − α 时 e → 1（抛物线临界）', () => {
    const alpha = 0.42
    const critical = Math.PI / 2 - alpha
    const e = eccentricityAnalytic({ alpha, theta: critical - 1e-9, h: 3 })
    expect(e).toBeCloseTo(1, 6)
  })

  it('短半轴恒不超过长半轴', () => {
    for (const cut of ELLIPSE_CUTS) {
      expect(semiMinor(cut)).toBeLessThanOrEqual(semiMajor(cut) + 1e-12)
    }
  })
})

describe('Dandelin - 预设与证明步骤', () => {
  it('六个预设都有完整参数', () => {
    expect(PRESETS.length).toBe(6)
    for (const p of PRESETS) {
      expect(p.alpha).toBeGreaterThan(0)
      expect(p.alpha).toBeLessThan(Math.PI / 2)
      expect(p.theta).toBeGreaterThanOrEqual(0)
      expect(p.h).toBeGreaterThan(0)
      expect(p.label.length).toBeGreaterThan(2)
    }
  })

  it('presetOf 对未知 id 兜底', () => {
    const cut = presetOf('nope' as never)
    expect(isEllipse(cut)).toBe(true)
  })

  it('窄锥与宽锥在相近 θ 下 e 不同', () => {
    const narrow = presetOf('narrow')
    const wide = presetOf('wide')
    // e = sinθ/cosα，α 越大 cosα 越小 → e 越大
    expect(eccentricityAnalytic({ ...narrow, theta: 0.5 }))
      .toBeLessThan(eccentricityAnalytic({ ...wide, theta: 0.5 }))
  })

  it('证明三步都有内容且编号连续', () => {
    expect(PROOF_STEPS.length).toBe(3)
    PROOF_STEPS.forEach((s, i) => {
      expect(s.step).toBe(i + 1)
      expect(s.claim.length).toBeGreaterThan(5)
      expect(s.detail.length).toBeGreaterThan(10)
    })
  })
})
