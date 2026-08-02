import { describe, it, expect } from 'vitest'
import {
  triangleOf, presetTriangle, unifiedArea, areaFraction, edgeLengthSpread,
  angleSpread, euclideanAngleSum, angleSum, angularDefect, triangleArea,
  triangleAngles, triangleSides, MAX_TRIANGLE_AREA,
  TRIANGLE_PRESETS, GEOMETRY_COMPARISON,
} from './hyperbolicTriangle'
import { inDisk, hypot2 } from '../../lib/hyperbolic2d'

describe('双曲三角形 - 预设与结构', () => {
  it('四个预设覆盖从小到理想', () => {
    expect(TRIANGLE_PRESETS.length).toBe(4)
    for (let i = 1; i < TRIANGLE_PRESETS.length; i++) {
      expect(TRIANGLE_PRESETS[i].scale).toBeGreaterThan(TRIANGLE_PRESETS[i - 1].scale)
    }
  })

  it('所有预设的顶点都在开圆盘内', () => {
    for (const p of TRIANGLE_PRESETS) {
      const t = presetTriangle(p.id)
      for (const v of [t.A, t.B, t.C]) {
        expect(inDisk(v)).toBe(true)
        expect(hypot2(v)).toBeLessThan(1)
      }
    }
  })

  it('三顶点在同一欧氏半径上', () => {
    for (const s of [0.2, 0.5, 0.9]) {
      const t = triangleOf(s)
      const rs = [t.A, t.B, t.C].map(hypot2)
      expect(Math.max(...rs) - Math.min(...rs)).toBeLessThan(1e-12)
      expect(rs[0]).toBeCloseTo(s, 12)
    }
  })

  it('构造出的三角形是等边的(三边长相等)', () => {
    for (const s of [0.2, 0.5, 0.8, 0.95]) {
      expect(edgeLengthSpread(triangleOf(s))).toBeLessThan(1e-9)
    }
  })

  it('等边三角形的三个内角也相等', () => {
    for (const s of [0.2, 0.5, 0.8]) {
      expect(angleSpread(triangleOf(s))).toBeLessThan(1e-9)
    }
  })

  it('缩放参数被夹在合法范围内', () => {
    for (const v of [0, -1, 1, 2, 1e6]) {
      const t = triangleOf(v)
      for (const p of [t.A, t.B, t.C]) expect(hypot2(p)).toBeLessThan(1)
    }
  })
})

describe('双曲三角形 - 角亏就是面积', () => {
  it('内角和恒小于 π', () => {
    for (const p of TRIANGLE_PRESETS) {
      expect(angleSum(presetTriangle(p.id))).toBeLessThan(Math.PI)
    }
  })

  it('角亏恒为正且等于面积', () => {
    for (const p of TRIANGLE_PRESETS) {
      const t = presetTriangle(p.id)
      expect(angularDefect(t)).toBeGreaterThan(0)
      expect(triangleArea(t)).toBeCloseTo(angularDefect(t), 12)
    }
  })

  it('三角形越大内角和越小、面积越大', () => {
    const scales = [0.2, 0.4, 0.6, 0.8, 0.95]
    const sums = scales.map((s) => angleSum(triangleOf(s)))
    const areas = scales.map((s) => triangleArea(triangleOf(s)))
    for (let i = 1; i < scales.length; i++) {
      expect(sums[i]).toBeLessThan(sums[i - 1])
      expect(areas[i]).toBeGreaterThan(areas[i - 1])
    }
  })

  it('面积严格小于上界 π', () => {
    expect(MAX_TRIANGLE_AREA).toBeCloseTo(Math.PI, 12)
    for (const s of [0.5, 0.9, 0.99, 0.9999]) {
      expect(triangleArea(triangleOf(s))).toBeLessThan(Math.PI)
    }
  })

  it('理想三角形的面积逼近 π', () => {
    const t = presetTriangle('ideal')
    expect(areaFraction(t)).toBeGreaterThan(0.99)
    expect(areaFraction(t)).toBeLessThan(1)
  })

  it('小三角形趋近欧氏(内角和趋于 π, 面积趋于 0)', () => {
    const t = triangleOf(0.02)
    expect(angleSum(t)).toBeGreaterThan(Math.PI - 0.01)
    expect(triangleArea(t)).toBeLessThan(0.01)
  })

  it('欧氏对照: 把顶点当平面点时内角和恒为 π', () => {
    for (const s of [0.2, 0.5, 0.9]) {
      expect(euclideanAngleSum(triangleOf(s))).toBeCloseTo(Math.PI, 9)
    }
  })

  it('同一组顶点: 双曲内角和 < 欧氏内角和', () => {
    for (const s of [0.3, 0.6, 0.9]) {
      const t = triangleOf(s)
      expect(angleSum(t)).toBeLessThan(euclideanAngleSum(t))
    }
  })
})

describe('双曲三角形 - 三种几何统一', () => {
  it('三种几何的曲率与内角和标注自洽', () => {
    expect(GEOMETRY_COMPARISON.length).toBe(3)
    const sphere = GEOMETRY_COMPARISON.find((g) => g.name === '球面')!
    const euclid = GEOMETRY_COMPARISON.find((g) => g.name === '欧氏')!
    const hyper = GEOMETRY_COMPARISON.find((g) => g.name === '双曲')!
    expect(sphere.curvature).toBe(1)
    expect(euclid.curvature).toBe(0)
    expect(hyper.curvature).toBe(-1)
    expect(sphere.angleSum).toContain('>')
    expect(hyper.angleSum).toContain('<')
  })

  it('统一公式在双曲情形给出角亏', () => {
    for (const s of [0.3, 0.6, 0.9]) {
      const t = triangleOf(s)
      expect(unifiedArea(angleSum(t), -1)).toBeCloseTo(angularDefect(t), 10)
    }
  })

  it('统一公式在球面情形给出盈余', () => {
    // 球面上内角和 3π/2 的三角形(八分之一球面), 面积应为 π/2
    expect(unifiedArea((3 * Math.PI) / 2, 1)).toBeCloseTo(Math.PI / 2, 10)
  })

  it('K=0 时公式无定义(欧氏面积与角度无关)', () => {
    expect(Number.isNaN(unifiedArea(Math.PI, 0))).toBe(true)
  })

  it('曲率绝对值越大同样角亏对应面积越小', () => {
    const sum = Math.PI * 0.8
    expect(unifiedArea(sum, -1)).toBeGreaterThan(unifiedArea(sum, -2))
  })

  it('边长与角度: 边越长角越小(双曲的反直觉之处)', () => {
    const scales = [0.3, 0.6, 0.9]
    const sides = scales.map((s) => triangleSides(triangleOf(s))[0])
    const angles = scales.map((s) => triangleAngles(triangleOf(s))[0])
    for (let i = 1; i < scales.length; i++) {
      expect(sides[i]).toBeGreaterThan(sides[i - 1])
      expect(angles[i]).toBeLessThan(angles[i - 1])
    }
  })

  it('presetTriangle 对未知 id 有兜底', () => {
    const t = presetTriangle('nope' as never)
    for (const p of [t.A, t.B, t.C]) expect(hypot2(p)).toBeLessThan(1)
  })
})
