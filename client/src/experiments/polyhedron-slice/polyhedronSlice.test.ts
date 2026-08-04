import { describe, it, expect } from 'vitest'
import {
  dot, sub, add, scale, cross, norm, unit, signedDistance, edgeIntersection,
  sliceOf, sliceEdgeLengths, sliceRegularity, sliceArea, slicePerimeter,
  sliceAngles, isRegularSlice, baseSolid, maxSliceSides, extentAlong,
  presetOf, PRESETS, type Plane,
} from './polyhedronSlice'
import type { Vec3 } from '../../lib/proj3d'

const DEG = 180 / Math.PI

describe('多面体截面 - 平面与棱求交', () => {
  it('有向距离正确', () => {
    const plane: Plane = { n: [0, 0, 1], d: 0 }
    expect(signedDistance([0, 0, 1], plane)).toBeCloseTo(1, 12)
    expect(signedDistance([0, 0, -2], plane)).toBeCloseTo(-2, 12)
    expect(signedDistance([5, 5, 0], plane)).toBeCloseTo(0, 12)
  })

  it('异号两端才有交点', () => {
    const plane: Plane = { n: [0, 0, 1], d: 0 }
    const ip = edgeIntersection([0, 0, -1], [0, 0, 1], plane)
    expect(ip).not.toBeNull()
    expect(ip![2]).toBeCloseTo(0, 10)
    // 同号无交点
    expect(edgeIntersection([0, 0, 1], [0, 0, 2], plane)).toBeNull()
    expect(edgeIntersection([0, 0, -1], [0, 0, -2], plane)).toBeNull()
  })

  it('交点落在线段上且在平面上', () => {
    const plane: Plane = { n: unit([1, 1, 1]), d: 0.3 }
    const a: Vec3 = [-1, -1, -1]
    const b: Vec3 = [1, 1, 1]
    const ip = edgeIntersection(a, b, plane)!
    expect(Math.abs(signedDistance(ip, plane))).toBeLessThan(1e-10)
    // 在线段范围内
    const t = dot(sub(ip, a), sub(b, a)) / dot(sub(b, a), sub(b, a))
    expect(t).toBeGreaterThanOrEqual(-1e-9)
    expect(t).toBeLessThanOrEqual(1 + 1e-9)
  })

  it('平行于平面的棱不产生交点', () => {
    const plane: Plane = { n: [0, 0, 1], d: 1 }
    expect(edgeIntersection([0, 0, 0], [1, 1, 0], plane)).toBeNull()
  })

  it('向量工具正确', () => {
    expect(dot([1, 2, 3], [4, 5, 6])).toBe(32)
    expect(sub([5, 5, 5], [1, 2, 3])).toEqual([4, 3, 2])
    expect(add([1, 1, 1], [2, 3, 4])).toEqual([3, 4, 5])
    expect(scale([1, 2, 3], 2)).toEqual([2, 4, 6])
    expect(cross([1, 0, 0], [0, 1, 0])).toEqual([0, 0, 1])
    expect(norm([3, 4, 0])).toBeCloseTo(5, 12)
    expect(norm(unit([3, 4, 0]))).toBeCloseTo(1, 12)
  })
})

describe('多面体截面 - 五个经典切法', () => {
  it('立方体沿体对角线过中心切出正六边形', () => {
    const ring = sliceOf(baseSolid('cube'), { n: unit([1, 1, 1]), d: 0 })
    expect(ring.length).toBe(6)
    expect(isRegularSlice(ring)).toBe(true)
    expect(sliceRegularity(ring)).toBeLessThan(1e-9)
    for (const a of sliceAngles(ring)) expect(a * DEG).toBeCloseTo(120, 6)
  })

  it('六边形截面的面积是 √3(单位外接球立方体)', () => {
    const ring = sliceOf(baseSolid('cube'), { n: unit([1, 1, 1]), d: 0 })
    expect(sliceArea(ring)).toBeCloseTo(Math.sqrt(3), 6)
  })

  it('立方体平行于面切出正方形', () => {
    const ring = sliceOf(baseSolid('cube'), { n: [0, 0, 1], d: 0 })
    expect(ring.length).toBe(4)
    expect(isRegularSlice(ring)).toBe(true)
    for (const a of sliceAngles(ring)) expect(a * DEG).toBeCloseTo(90, 6)
  })

  it('立方体沿体对角线切一角得正三角形', () => {
    const ring = sliceOf(baseSolid('cube'), { n: unit([1, 1, 1]), d: 0.75 })
    expect(ring.length).toBe(3)
    expect(isRegularSlice(ring)).toBe(true)
    for (const a of sliceAngles(ring)) expect(a * DEG).toBeCloseTo(60, 6)
  })

  it('正四面体能切出正方形 —— 四个三角面切出四边形', () => {
    const ring = sliceOf(baseSolid('tetrahedron'), { n: [0, 0, 1], d: 0 })
    expect(ring.length).toBe(4)
    expect(isRegularSlice(ring)).toBe(true)
    for (const a of sliceAngles(ring)) expect(a * DEG).toBeCloseTo(90, 5)
  })

  it('正八面体沿三重轴切出正六边形', () => {
    const ring = sliceOf(baseSolid('octahedron'), { n: unit([1, 1, 1]), d: 0 })
    expect(ring.length).toBe(6)
    expect(isRegularSlice(ring)).toBe(true)
  })

  it('五个预设都给出预期的边数', () => {
    const want: Record<string, number> = {
      'cube-hex': 6, 'cube-square': 4, 'cube-tri': 3,
      'tetra-square': 4, 'octa-hex': 6,
    }
    for (const ps of PRESETS) {
      const ring = sliceOf(baseSolid(ps.solid), { n: unit(ps.n), d: ps.d })
      expect(ring.length).toBe(want[ps.id])
      expect(isRegularSlice(ring)).toBe(true)
    }
  })

  it('presetOf 能取到, 未知兜底为第一个', () => {
    expect(presetOf('cube-tri').id).toBe('cube-tri')
    expect(presetOf('nope').id).toBe(PRESETS[0].id)
  })
})

describe('多面体截面 - 扫过时的变化', () => {
  const cube = baseSolid('cube')
  const n = unit([1, 1, 1])

  it('沿体对角线的跨度对称', () => {
    const [lo, hi] = extentAlong(cube, n)
    expect(lo).toBeCloseTo(-hi, 9)
    expect(hi).toBeCloseTo(1, 6)
  })

  it('边数序列: 3 → 6 → 3', () => {
    const [lo, hi] = extentAlong(cube, n)
    const sides = [0.1, 0.25, 0.5, 0.75, 0.9].map((f) =>
      sliceOf(cube, { n, d: lo + (hi - lo) * f }).length)
    expect(sides[0]).toBe(3)
    expect(sides[1]).toBe(3)
    expect(sides[2]).toBe(6)
    expect(sides[3]).toBe(3)
    expect(sides[4]).toBe(3)
  })

  it('面积在中心处最大', () => {
    const [lo, hi] = extentAlong(cube, n)
    const areas = [0.2, 0.35, 0.5, 0.65, 0.8].map((f) =>
      sliceArea(sliceOf(cube, { n, d: lo + (hi - lo) * f })))
    const mid = areas[2]
    for (const a of areas) expect(a).toBeLessThanOrEqual(mid + 1e-9)
  })

  it('面积关于中心对称', () => {
    const [lo, hi] = extentAlong(cube, n)
    for (const f of [0.2, 0.3, 0.4]) {
      const a = sliceArea(sliceOf(cube, { n, d: lo + (hi - lo) * f }))
      const b = sliceArea(sliceOf(cube, { n, d: lo + (hi - lo) * (1 - f) }))
      expect(a).toBeCloseTo(b, 8)
    }
  })

  it('只有中心那一刀是正六边形, 两侧不是', () => {
    const [lo, hi] = extentAlong(cube, n)
    expect(isRegularSlice(sliceOf(cube, { n, d: 0 }))).toBe(true)
    for (const f of [0.4, 0.6]) {
      const ring = sliceOf(cube, { n, d: lo + (hi - lo) * f })
      expect(ring.length).toBe(6)
      expect(isRegularSlice(ring)).toBe(false)
    }
  })

  it('切到立体之外时无截面', () => {
    expect(sliceOf(cube, { n, d: 5 })).toEqual([])
    expect(sliceOf(cube, { n, d: -5 })).toEqual([])
  })
})

describe('多面体截面 - 几何量与上界', () => {
  it('截面边数不超过面数', () => {
    for (const id of ['tetrahedron', 'cube', 'octahedron'] as const) {
      const p = baseSolid(id)
      const bound = maxSliceSides(p)
      // 扫一遍各个方向与位置
      for (const nn of [[1, 0, 0], [1, 1, 0], [1, 1, 1], [2, 1, 3]] as Vec3[]) {
        const u = unit(nn)
        const [lo, hi] = extentAlong(p, u)
        for (let k = 1; k < 8; k++) {
          const ring = sliceOf(p, { n: u, d: lo + ((hi - lo) * k) / 8 })
          expect(ring.length).toBeLessThanOrEqual(bound)
        }
      }
    }
  })

  it('切平面过顶点时不产生重复点', () => {
    // 四面体在 n=(1,1,0) 中点处，切平面恰好过两个顶点。
    // 若不去重，该点会被相邻两面各算一次，环长虚高到 5（超过面数 4）。
    const p = baseSolid('tetrahedron')
    const u = unit([1, 1, 0])
    const [lo, hi] = extentAlong(p, u)
    const ring = sliceOf(p, { n: u, d: lo + (hi - lo) * 0.5 })
    expect(ring.length).toBeLessThanOrEqual(maxSliceSides(p))
    // 环里两两不重合
    for (let i = 0; i < ring.length; i++) {
      for (let j = i + 1; j < ring.length; j++) {
        expect(norm(sub(ring[i], ring[j]))).toBeGreaterThan(1e-6)
      }
    }
  })

  it('截面顶点都在切平面上', () => {
    const p = baseSolid('icosahedron')
    const plane: Plane = { n: unit([1, 2, 3]), d: 0.2 }
    for (const v of sliceOf(p, plane)) {
      expect(Math.abs(signedDistance(v, plane))).toBeLessThan(1e-9)
    }
  })

  it('周长等于各边之和', () => {
    const ring = sliceOf(baseSolid('cube'), { n: unit([1, 1, 1]), d: 0 })
    const ls = sliceEdgeLengths(ring)
    expect(slicePerimeter(ring)).toBeCloseTo(ls.reduce((a, b) => a + b, 0), 12)
    expect(ls.length).toBe(ring.length)
  })

  it('正六边形周长 = 6 × 边长', () => {
    const ring = sliceOf(baseSolid('cube'), { n: unit([1, 1, 1]), d: 0 })
    const ls = sliceEdgeLengths(ring)
    expect(slicePerimeter(ring)).toBeCloseTo(6 * ls[0], 8)
  })

  it('少于三点时面积与周长为零', () => {
    expect(sliceArea([])).toBe(0)
    expect(sliceArea([[0, 0, 0], [1, 0, 0]])).toBe(0)
    expect(slicePerimeter([])).toBe(0)
    expect(isRegularSlice([])).toBe(false)
  })

  it('对五种立体的任意方向都能切出闭合环', () => {
    for (const id of ['tetrahedron', 'cube', 'octahedron',
      'dodecahedron', 'icosahedron'] as const) {
      const p = baseSolid(id)
      const u = unit([0.3, 0.7, 0.5])
      const ring = sliceOf(p, { n: u, d: 0 })
      expect(ring.length).toBeGreaterThanOrEqual(3)
      // 环闭合：首尾不重复
      expect(norm(sub(ring[0], ring[ring.length - 1]))).toBeGreaterThan(1e-6)
    }
  })
})
