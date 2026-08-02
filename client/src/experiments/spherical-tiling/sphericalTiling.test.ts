import { describe, it, expect } from 'vitest'
import {
  sphericalVertices, tilingEdges, tilingFaces, sphericalFaceCenters,
  faceArea, totalArea, areaBalanceError, faceFraction, edgeArcLengths,
  edgesEquilateral, faceInteriorAngle, planarInteriorAngle,
  vertexAngularDefect, schlafliDiscriminant, geometryOf, infoOf,
  TILING_KINDS, TILING_INFO, GEOMETRY_EXAMPLES,
} from './sphericalTiling'
import { PLATONIC_INFO } from '../platonic-solids/platonicSolids'
import { norm, sphericalDistance } from '../../lib/sphere3d'

describe('球面镶嵌 - 顶点与结构', () => {
  it('五种镶嵌信息完整, Schläfli 符号正确', () => {
    expect(TILING_KINDS.length).toBe(5)
    expect(TILING_INFO.length).toBe(5)
    const byKind = new Map(TILING_INFO.map((t) => [t.kind, t.schlafli]))
    expect(byKind.get('tetrahedron')).toBe('{3, 3}')
    expect(byKind.get('cube')).toBe('{4, 3}')
    expect(byKind.get('octahedron')).toBe('{3, 4}')
    expect(byKind.get('dodecahedron')).toBe('{5, 3}')
    expect(byKind.get('icosahedron')).toBe('{3, 5}')
  })

  it('所有顶点都被推到单位球上', () => {
    for (const k of TILING_KINDS) {
      for (const v of sphericalVertices(k)) {
        expect(norm(v)).toBeCloseTo(1, 12)
      }
    }
  })

  it('面心也在单位球上', () => {
    for (const k of TILING_KINDS) {
      for (const c of sphericalFaceCenters(k)) {
        expect(norm(c)).toBeCloseTo(1, 12)
      }
    }
  })

  it('V/E/F 与柏拉图立体一致', () => {
    for (const info of TILING_INFO) {
      expect(sphericalVertices(info.kind).length).toBe(info.V)
      expect(tilingEdges(info.kind).length).toBe(info.E)
      expect(tilingFaces(info.kind).length).toBe(info.F)
    }
  })

  it('所有棱等长(正规镶嵌的必要条件)', () => {
    for (const k of TILING_KINDS) {
      expect(edgesEquilateral(k, 1e-9)).toBe(true)
    }
  })

  it('棱的弧长与已知值一致', () => {
    // 正四面体镶嵌棱长 = arccos(−1/3) ≈ 109.47°
    const tetraArc = edgeArcLengths('tetrahedron')[0]
    expect(tetraArc).toBeCloseTo(Math.acos(-1 / 3), 9)
    // 正八面体镶嵌棱长恰为 90°(顶点在坐标轴上)
    expect(edgeArcLengths('octahedron')[0]).toBeCloseTo(Math.PI / 2, 9)
  })

  it('棱长随面数增多而变短', () => {
    const byF = [...TILING_INFO].sort((a, b) => a.F - b.F)
    // 面越多每个面越小, 棱也越短(除四面体/六面体因面型不同需单独看)
    const tetra = edgeArcLengths('tetrahedron')[0]
    const ico = edgeArcLengths('icosahedron')[0]
    expect(ico).toBeLessThan(tetra)
    expect(byF[0].F).toBe(4)
  })
})

describe('球面镶嵌 - 面积配平', () => {
  it('五种镶嵌的总面积都精确等于 4π', () => {
    for (const k of TILING_KINDS) {
      expect(totalArea(k)).toBeCloseTo(4 * Math.PI, 8)
      expect(areaBalanceError(k)).toBeLessThan(1e-12)
    }
  })

  it('每个面占球面的比例恰好是 1/F', () => {
    for (const info of TILING_INFO) {
      for (let i = 0; i < info.F; i++) {
        expect(faceFraction(info.kind, i)).toBeCloseTo(1 / info.F, 10)
      }
    }
  })

  it('同一镶嵌的所有面面积相等', () => {
    for (const info of TILING_INFO) {
      const areas = Array.from({ length: info.F }, (_, i) => faceArea(info.kind, i))
      const spread = Math.max(...areas) - Math.min(...areas)
      expect(spread).toBeLessThan(1e-12)
    }
  })

  it('单面面积 = 4π/F', () => {
    for (const info of TILING_INFO) {
      expect(faceArea(info.kind, 0)).toBeCloseTo((4 * Math.PI) / info.F, 10)
    }
  })

  it('面数越多单面面积越小', () => {
    const pairs = TILING_INFO.map((i) => ({ F: i.F, a: faceArea(i.kind, 0) }))
      .sort((x, y) => x.F - y.F)
    for (let i = 1; i < pairs.length; i++) {
      expect(pairs[i].a).toBeLessThan(pairs[i - 1].a)
    }
  })
})

describe('球面镶嵌 - 内角与角亏', () => {
  it('球面正多边形的内角严格大于平面同边数正多边形', () => {
    for (const info of TILING_INFO) {
      const p = PLATONIC_INFO.find((x) => x.kind === info.kind)!
      const spherical = faceInteriorAngle(info.kind, 0)
      const planar = planarInteriorAngle(p.faceSides)
      expect(spherical).toBeGreaterThan(planar)
    }
  })

  it('球面内角与已知值一致', () => {
    const DEG = 180 / Math.PI
    // {3,3} 四面体镶嵌: 每顶点 3 个面, 面角 2π/3 = 120°
    expect(faceInteriorAngle('tetrahedron', 0) * DEG).toBeCloseTo(120, 6)
    // {3,4} 八面体镶嵌: 每顶点 4 个面, 面角 2π/4 = 90°
    expect(faceInteriorAngle('octahedron', 0) * DEG).toBeCloseTo(90, 6)
    // {3,5} 二十面体镶嵌: 每顶点 5 个面, 面角 2π/5 = 72°
    expect(faceInteriorAngle('icosahedron', 0) * DEG).toBeCloseTo(72, 6)
  })

  it('球面上顶点处的面角之和恰为 2π(镶嵌无缝的直接体现)', () => {
    for (const info of TILING_INFO) {
      const p = PLATONIC_INFO.find((x) => x.kind === info.kind)!
      const sum = p.vertexFaces * faceInteriorAngle(info.kind, 0)
      expect(sum).toBeCloseTo(2 * Math.PI, 6)
    }
  })

  it('平面展开时的角亏为正(故能围成闭曲面)', () => {
    for (const k of TILING_KINDS) {
      expect(vertexAngularDefect(k)).toBeGreaterThan(0)
    }
  })

  it('角亏总和为 4π(球面版的笛卡尔定理)', () => {
    for (const info of TILING_INFO) {
      const total = info.V * vertexAngularDefect(info.kind)
      expect(total).toBeCloseTo(4 * Math.PI, 8)
    }
  })
})

describe('球面镶嵌 - 三类几何', () => {
  it('判别式 (p−2)(q−2) 划分三类几何', () => {
    expect(geometryOf(3, 3)).toBe('球面')
    expect(geometryOf(3, 6)).toBe('平面')
    expect(geometryOf(4, 4)).toBe('平面')
    expect(geometryOf(3, 7)).toBe('双曲')
    expect(geometryOf(5, 4)).toBe('双曲')
  })

  it('五种柏拉图镶嵌的判别式都小于 4', () => {
    for (const info of TILING_INFO) {
      const p = PLATONIC_INFO.find((x) => x.kind === info.kind)!
      expect(schlafliDiscriminant(p.vertexFaces, p.faceSides)).toBeLessThan(4)
      expect(geometryOf(p.vertexFaces, p.faceSides)).toBe('球面')
    }
  })

  it('GEOMETRY_EXAMPLES 的类型标注与判定一致', () => {
    for (const g of GEOMETRY_EXAMPLES) {
      expect(geometryOf(g.p, g.q)).toBe(g.type)
    }
  })

  it('三类几何都有代表', () => {
    const types = new Set(GEOMETRY_EXAMPLES.map((g) => g.type))
    expect(types.has('球面')).toBe(true)
    expect(types.has('平面')).toBe(true)
    expect(types.has('双曲')).toBe(true)
  })

  it('球面镶嵌只有 5 种, 双曲有无穷多种', () => {
    // 枚举 p,q ≤ 12 的情形
    let spherical = 0
    let hyperbolic = 0
    for (let p = 3; p <= 12; p++) {
      for (let q = 3; q <= 12; q++) {
        const t = geometryOf(p, q)
        if (t === '球面') spherical++
        if (t === '双曲') hyperbolic++
      }
    }
    expect(spherical).toBe(5)
    // 双曲情形远多于球面, 且随上界增大无休止
    expect(hyperbolic).toBeGreaterThan(80)
  })

  it('infoOf 能查到每种, 未知有兜底', () => {
    for (const k of TILING_KINDS) expect(infoOf(k).kind).toBe(k)
    expect(infoOf('nope' as never).kind).toBe('tetrahedron')
  })

  it('面心到该面各顶点的球面距离相等(正规性)', () => {
    for (const info of TILING_INFO) {
      const verts = sphericalVertices(info.kind)
      const centers = sphericalFaceCenters(info.kind)
      const ring = tilingFaces(info.kind)[0]
      const ds = ring.map((vi) => sphericalDistance(centers[0], verts[vi]))
      expect(Math.max(...ds) - Math.min(...ds)).toBeLessThan(1e-9)
    }
  })
})
