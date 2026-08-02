import { describe, it, expect } from 'vitest'
import {
  project, isDefined, tissot, areaDistortion, hkProduct, gridSkew,
  angleDistortion, isConformal, isEqualArea, sampleLatLon,
  mercatorAreaInflation, apparentArea, infoOf,
  PROJECTIONS, PROJECTION_INFO, REGIONS,
} from './mapProjections'

const RAD = Math.PI / 180

describe('地图投影 - 基本性质', () => {
  it('六种投影信息完整', () => {
    expect(PROJECTIONS.length).toBe(6)
    expect(PROJECTION_INFO.length).toBe(6)
    for (const p of PROJECTION_INFO) {
      expect(p.preserves.length).toBeGreaterThan(2)
      expect(p.note.length).toBeGreaterThan(5)
    }
  })

  it('赤道上原点投影到原点', () => {
    for (const k of PROJECTIONS) {
      const p = project(k, 0, 0)
      expect(Math.abs(p.x)).toBeLessThan(1e-9)
      // 方位等距以北极为中心, 赤道原点在 y=−π/2 处
      if (k !== 'azimuthalEquidistant') {
        expect(Math.abs(p.y)).toBeLessThan(1e-9)
      }
    }
  })

  it('投影结果都是有限数(在定义域内)', () => {
    for (const k of PROJECTIONS) {
      for (const [lat, lon] of sampleLatLon()) {
        if (!isDefined(k, lat, lon)) continue
        const p = project(k, lat, lon)
        expect(Number.isFinite(p.x)).toBe(true)
        expect(Number.isFinite(p.y)).toBe(true)
      }
    }
  })

  it('墨卡托在极点无定义, 正交只覆盖半球', () => {
    expect(isDefined('mercator', Math.PI / 2, 0)).toBe(false)
    expect(isDefined('mercator', 60 * RAD, 0)).toBe(true)
    // 正交: 背面不可见
    expect(isDefined('orthographic', 0, Math.PI)).toBe(false)
    expect(isDefined('orthographic', 0, 0)).toBe(true)
  })

  it('圆柱投影的 x 只依赖经度', () => {
    for (const k of ['mercator', 'equirectangular', 'lambertCylindrical'] as const) {
      for (const lat of [-40 * RAD, 0, 50 * RAD]) {
        expect(project(k, lat, 1.2).x).toBeCloseTo(1.2, 12)
      }
    }
  })

  it('等距圆柱是最简单的恒等映射', () => {
    for (const [lat, lon] of sampleLatLon()) {
      const p = project('equirectangular', lat, lon)
      expect(p.x).toBeCloseTo(lon, 12)
      expect(p.y).toBeCloseTo(lat, 12)
    }
  })
})

describe('地图投影 - 等角判据', () => {
  it('只有墨卡托是等角的', () => {
    expect(isConformal('mercator')).toBe(true)
    for (const k of PROJECTIONS.filter((p) => p !== 'mercator')) {
      expect(isConformal(k)).toBe(false)
    }
  })

  it('等角 ⟺ h = k', () => {
    for (const [lat, lon] of sampleLatLon()) {
      const { h, k } = tissot('mercator', lat, lon)
      expect(h).toBeCloseTo(k, 6)
      expect(angleDistortion('mercator', lat, lon)).toBeLessThan(1e-6)
    }
  })

  it('墨卡托的 h 与 k 都等于 1/cos φ', () => {
    for (const latDeg of [0, 30, 45, 60]) {
      const lat = latDeg * RAD
      const { h, k } = tissot('mercator', lat, 0.5)
      const want = 1 / Math.cos(lat)
      expect(h).toBeCloseTo(want, 5)
      expect(k).toBeCloseTo(want, 5)
    }
  })

  it('兰伯特的角度失真在高纬很大', () => {
    expect(angleDistortion('lambertCylindrical', 60 * RAD, 0)).toBeCloseTo(0.6, 4)
    // 赤道上不失真
    expect(angleDistortion('lambertCylindrical', 0, 0)).toBeLessThan(1e-6)
  })

  it('PROJECTION_INFO 标注等角的只有墨卡托, 与判据一致', () => {
    for (const info of PROJECTION_INFO) {
      expect(isConformal(info.kind)).toBe(info.type === '等角')
    }
  })
})

describe('地图投影 - 等积判据必须用 Jacobian', () => {
  it('两种等积投影都通过判据', () => {
    expect(isEqualArea('lambertCylindrical')).toBe(true)
    expect(isEqualArea('sinusoidal')).toBe(true)
  })

  it('非等积投影都不通过', () => {
    for (const k of ['mercator', 'equirectangular', 'azimuthalEquidistant',
      'orthographic'] as const) {
      expect(isEqualArea(k)).toBe(false)
    }
  })

  it('PROJECTION_INFO 标注等积的与判据一致', () => {
    for (const info of PROJECTION_INFO) {
      expect(isEqualArea(info.kind)).toBe(info.type === '等积')
    }
  })

  it('正弦投影的网格是斜的, 故 h·k ≠ 面积因子', () => {
    // 这是「必须用 Jacobian」的直接证据
    const lat = 60 * RAD
    expect(gridSkew('sinusoidal', lat, 0.5)).toBeGreaterThan(0.05)
    // 真实面积因子为 1, 但 h·k 明显大于 1
    expect(areaDistortion('sinusoidal', lat, 0.5)).toBeCloseTo(1, 6)
    expect(hkProduct('sinusoidal', lat, 0.5)).toBeGreaterThan(1.05)
  })

  it('圆柱投影的网格是正交的, 此时 h·k 才等于面积因子', () => {
    for (const k of ['mercator', 'equirectangular', 'lambertCylindrical'] as const) {
      const lat = 45 * RAD
      expect(gridSkew(k, lat, 0.5)).toBeLessThan(1e-6)
      expect(hkProduct(k, lat, 0.5)).toBeCloseTo(areaDistortion(k, lat, 0.5), 5)
    }
  })

  it('兰伯特的 h·k 精确为 1(它网格正交且等积)', () => {
    for (const [lat, lon] of sampleLatLon()) {
      expect(hkProduct('lambertCylindrical', lat, lon)).toBeCloseTo(1, 5)
    }
  })
})

describe('地图投影 - 墨卡托的面积失真', () => {
  it('面积失真精确等于 1/cos²φ', () => {
    for (const latDeg of [0, 30, 45, 60, 72, 80]) {
      const lat = latDeg * RAD
      expect(areaDistortion('mercator', lat, 0))
        .toBeCloseTo(mercatorAreaInflation(lat), 5)
    }
  })

  it('赤道不失真, 纬度越高失真越剧烈', () => {
    expect(mercatorAreaInflation(0)).toBeCloseTo(1, 12)
    const infl = [0, 30, 45, 60, 75].map((d) => mercatorAreaInflation(d * RAD))
    for (let i = 1; i < infl.length; i++) {
      expect(infl[i]).toBeGreaterThan(infl[i - 1])
    }
  })

  it('45° 放大 2 倍, 60° 放大 4 倍', () => {
    expect(mercatorAreaInflation(45 * RAD)).toBeCloseTo(2, 10)
    expect(mercatorAreaInflation(60 * RAD)).toBeCloseTo(4, 10)
  })

  it('格陵兰放大约 10.5 倍', () => {
    const g = REGIONS.find((r) => r.name === '格陵兰')!
    expect(apparentArea(g.lat)).toBeGreaterThan(10)
    expect(apparentArea(g.lat)).toBeLessThan(11)
  })

  it('格陵兰视觉面积接近非洲 —— 墨卡托最有名的误导', () => {
    const g = REGIONS.find((r) => r.name === '格陵兰')!
    const africa = REGIONS.find((r) => r.name === '非洲')!
    // 真实面积差 14 倍
    expect(africa.realAreaMkm2 / g.realAreaMkm2).toBeGreaterThan(13)
    // 视觉面积却接近
    const gApparent = g.realAreaMkm2 * apparentArea(g.lat)
    const aApparent = africa.realAreaMkm2 * apparentArea(africa.lat)
    expect(aApparent / gApparent).toBeLessThan(1.5)
  })

  it('赤道附近地区几乎不失真', () => {
    for (const name of ['非洲', '巴西']) {
      const r = REGIONS.find((x) => x.name === name)!
      expect(apparentArea(r.lat)).toBeLessThan(1.1)
    }
  })

  it('四个地区数据完整', () => {
    expect(REGIONS.length).toBe(4)
    for (const r of REGIONS) {
      expect(r.realAreaMkm2).toBeGreaterThan(0)
      expect(Math.abs(r.lat)).toBeLessThan(90)
    }
  })

  it('infoOf 能查到每种, 未知有兜底', () => {
    for (const k of PROJECTIONS) expect(infoOf(k).kind).toBe(k)
    expect(infoOf('nope' as never).kind).toBe('mercator')
  })

  it('高斯绝妙定理的推论: 没有投影同时等角且等积', () => {
    for (const k of PROJECTIONS) {
      expect(isConformal(k) && isEqualArea(k)).toBe(false)
    }
  })
})
