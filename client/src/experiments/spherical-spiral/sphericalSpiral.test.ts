import { describe, it, expect } from 'vitest'
import {
  loxodrome, archimedeanSpiral, sphericalSpiral, sphereResidual, meridianAngle,
  meridianAngleAnalytic, loxodromeLength, windingDivergence, infoOf,
  SPIRAL_KINDS, SPIRAL_INFO, THETA_RANGE, PRESETS, R, type SpiralKind,
} from './sphericalSpiral'
import { arcLength } from '../../lib/curve3d'

describe('球面螺线 - 落在球面上', () => {
  it('两种螺线的点都在单位球面上', () => {
    for (const [kind, param] of [['loxodrome', 1.2], ['archimedean', 6]] as Array<[SpiralKind, number]>) {
      for (let i = 1; i < 60; i++) {
        const th = THETA_RANGE[0] + ((THETA_RANGE[1] - THETA_RANGE[0]) * i) / 60
        expect(Math.abs(sphereResidual(kind, param, th))).toBeLessThan(1e-12)
      }
    }
  })

  it('球半径常量为 1', () => {
    expect(R).toBe(1)
    const p = loxodrome(1.2)(1.0)
    expect(Math.hypot(p[0], p[1], p[2])).toBeCloseTo(1, 12)
  })

  it('极角两端留了余量(ln tan 在极点发散)', () => {
    expect(THETA_RANGE[0]).toBeGreaterThan(0)
    expect(THETA_RANGE[1]).toBeLessThan(Math.PI)
    for (const th of THETA_RANGE) {
      expect(loxodrome(1.2)(th).every(Number.isFinite)).toBe(true)
    }
  })
})

describe('球面螺线 - 等角性的严格区分', () => {
  it('等角航线: 与经线的夹角处处恒定', () => {
    for (const beta of [1.0, 1.2, 1.4]) {
      const angs = [0.3, 0.9, 1.57, 2.3, 2.9].map(
        (th) => meridianAngle('loxodrome', beta, th),
      )
      for (const a of angs) expect(a).toBeCloseTo(angs[0], 6)
    }
  })

  it('等角航线的夹角等于 π/2 − β(β 是与纬线的夹角, 别搞反)', () => {
    for (const beta of [0.6, 1.0, 1.2, 1.4]) {
      expect(meridianAngle('loxodrome', beta, 1.0))
        .toBeCloseTo(meridianAngleAnalytic(beta), 5)
    }
  })

  it('阿基米德螺线: 夹角随纬度明显变化', () => {
    for (const c of [4, 6, 10]) {
      const angs = [0.3, 0.9, 1.57, 2.3, 2.9].map(
        (th) => meridianAngle('archimedean', c, th),
      )
      const spread = (Math.max(...angs) - Math.min(...angs)) * (180 / Math.PI)
      expect(spread).toBeGreaterThan(10)
    }
  })

  it('两者的等角性标注与实测一致', () => {
    for (const info of SPIRAL_INFO) {
      const param = info.kind === 'loxodrome' ? 1.2 : 6
      const angs = [0.5, 1.57, 2.6].map((th) => meridianAngle(info.kind, param, th))
      const spread = Math.max(...angs) - Math.min(...angs)
      if (info.equiangular) expect(spread).toBeLessThan(1e-6)
      else expect(spread).toBeGreaterThan(0.05)
    }
  })

  it('只有等角航线被标为 equiangular', () => {
    expect(SPIRAL_INFO.filter((s) => s.equiangular).map((s) => s.kind))
      .toEqual(['loxodrome'])
  })
})

describe('球面螺线 - 弧长与绕圈', () => {
  it('等角航线的总弧长等于 πR/sin β', () => {
    for (const beta of [1.0, 1.2, 1.4]) {
      const numeric = arcLength(loxodrome(beta), 1e-4, Math.PI - 1e-4, 2000)
      expect(numeric).toBeCloseTo(loxodromeLength(beta), 2)
    }
  })

  it('弧长有限, 尽管绕无穷多圈 —— 最反直觉的性质', () => {
    for (const beta of [1.0, 1.4]) {
      // 弧长有限
      expect(Number.isFinite(loxodromeLength(beta))).toBe(true)
      expect(loxodromeLength(beta)).toBeLessThan(10)
      // 绕圈量随 θ→0 单调发散。只检验趋势, 不拍具体阈值 ——
      // 它按 |ln tan(θ/2)| 增长, 慢得很(θ=1e-100 时也才 39.8),
      // 硬编码「大于 50」这种断言纯属自找麻烦。
      const winds = [1e-3, 1e-6, 1e-12, 1e-30, 1e-100].map(
        (th) => windingDivergence(beta, th),
      )
      for (let i = 1; i < winds.length; i++) {
        expect(winds[i]).toBeGreaterThan(winds[i - 1])
      }
    }
  })

  it('β 越大弧长越短(越贴近经线走)', () => {
    const ls = [0.8, 1.0, 1.3, 1.5].map((b) => loxodromeLength(b))
    for (let i = 1; i < ls.length; i++) expect(ls[i]).toBeLessThan(ls[i - 1])
  })

  it('弧长下界是 πR(沿经线直接走)', () => {
    expect(loxodromeLength(Math.PI / 2)).toBeCloseTo(Math.PI, 10)
    for (const b of [1.0, 1.3]) {
      expect(loxodromeLength(b)).toBeGreaterThan(Math.PI)
    }
  })
})

describe('球面螺线 - 接口', () => {
  it('sphericalSpiral 按类型分派正确', () => {
    const th = 1.1
    const a = sphericalSpiral('loxodrome', 1.2)(th)
    const b = loxodrome(1.2)(th)
    for (let i = 0; i < 3; i++) expect(a[i]).toBeCloseTo(b[i], 12)
    const c = sphericalSpiral('archimedean', 6)(th)
    const d = archimedeanSpiral(6)(th)
    for (let i = 0; i < 3; i++) expect(c[i]).toBeCloseTo(d[i], 12)
  })

  it('阿基米德螺线的方位角与极角成正比', () => {
    for (const c of [4, 6]) {
      for (const th of [0.5, 1.5, 2.5]) {
        const p = archimedeanSpiral(c)(th)
        const phi = Math.atan2(p[1], p[0])
        // c·θ 可能超出 atan2 的主值范围, 比对模 2π
        const diff = Math.abs(((c * th - phi) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI))
        expect(Math.min(diff, 2 * Math.PI - diff)).toBeLessThan(1e-9)
      }
    }
  })

  it('两种类型都被覆盖', () => {
    expect(SPIRAL_KINDS.length).toBe(2)
    for (const k of SPIRAL_KINDS) expect(infoOf(k).kind).toBe(k)
    expect(infoOf('nope' as SpiralKind).kind).toBe('loxodrome')
  })

  it('PRESETS 含两种类型, 标签角度与 π/2−β 一致', () => {
    expect(PRESETS.some((p) => p.kind === 'loxodrome')).toBe(true)
    expect(PRESETS.some((p) => p.kind === 'archimedean')).toBe(true)
    const lox = PRESETS.filter((p) => p.kind === 'loxodrome')
    for (const p of lox) {
      const deg = (meridianAngleAnalytic(p.param) * 180) / Math.PI
      expect(p.label).toContain(deg.toFixed(1))
    }
  })
})
