import { describe, it, expect } from 'vitest'
import {
  DIHEDRAL_ANGLES, edgeFitCount, fitsAroundEdge, gapAngle, maxFitCount,
  planarInteriorAngle, tilesPlane, enumeratePlanarTilings,
  FCC_SPHERE_DENSITY, FILL_DENSITY, infoOf, FILL_KINDS, FILL_INFO,
} from './spaceFillingSolids'
import { fillCell } from './draw'
import {
  eulerCount, isEquilateral, faceOutward, facePlanarityError,
  faceSizeHistogram, edgeLengths,
} from '../../lib/polyhedron'

describe('空间填充 - 二面角', () => {
  it('五种柏拉图立体的二面角与解析值一致', () => {
    expect(DIHEDRAL_ANGLES.tetrahedron).toBeCloseTo(70.5288, 3)
    expect(DIHEDRAL_ANGLES.cube).toBe(90)
    expect(DIHEDRAL_ANGLES.octahedron).toBeCloseTo(109.4712, 3)
    expect(DIHEDRAL_ANGLES.dodecahedron).toBeCloseTo(116.5651, 3)
    expect(DIHEDRAL_ANGLES.icosahedron).toBeCloseTo(138.1897, 3)
  })

  it('二面角随面数递增', () => {
    const order = [
      DIHEDRAL_ANGLES.tetrahedron, DIHEDRAL_ANGLES.cube,
      DIHEDRAL_ANGLES.octahedron, DIHEDRAL_ANGLES.dodecahedron,
      DIHEDRAL_ANGLES.icosahedron,
    ]
    for (let i = 1; i < order.length; i++) {
      expect(order[i]).toBeGreaterThan(order[i - 1])
    }
  })

  it('只有立方体的二面角整除 360°', () => {
    expect(fitsAroundEdge(DIHEDRAL_ANGLES.cube)).toBe(true)
    expect(edgeFitCount(DIHEDRAL_ANGLES.cube)).toBeCloseTo(4, 12)
    for (const k of ['tetrahedron', 'octahedron', 'dodecahedron', 'icosahedron'] as const) {
      expect(fitsAroundEdge(DIHEDRAL_ANGLES[k])).toBe(false)
    }
  })

  it('正四面体堆 5 个剩 7.356° 缝 —— 亚里士多德错了 1800 年', () => {
    const d = DIHEDRAL_ANGLES.tetrahedron
    expect(maxFitCount(d)).toBe(5)
    expect(gapAngle(d, 5)).toBeCloseTo(7.3561, 3)
    // 缝隙明显不为零, 所以正四面体填不满空间
    expect(Math.abs(gapAngle(d, 5))).toBeGreaterThan(1)
  })

  it('立方体堆 4 个缝隙精确为零', () => {
    expect(maxFitCount(90)).toBe(4)
    expect(gapAngle(90, 4)).toBe(0)
  })

  it('其余三种柏拉图立体的缝隙都明显不为零', () => {
    const cases: Array<[number, number]> = [
      [DIHEDRAL_ANGLES.octahedron, 3],
      [DIHEDRAL_ANGLES.dodecahedron, 3],
      [DIHEDRAL_ANGLES.icosahedron, 2],
    ]
    for (const [d, n] of cases) {
      expect(maxFitCount(d)).toBe(n)
      expect(Math.abs(gapAngle(d, n))).toBeGreaterThan(5)
    }
  })

  it('二面角越大绕棱能堆的越少', () => {
    const counts = [
      maxFitCount(DIHEDRAL_ANGLES.tetrahedron),
      maxFitCount(DIHEDRAL_ANGLES.cube),
      maxFitCount(DIHEDRAL_ANGLES.octahedron),
      maxFitCount(DIHEDRAL_ANGLES.icosahedron),
    ]
    for (let i = 1; i < counts.length; i++) {
      expect(counts[i]).toBeLessThanOrEqual(counts[i - 1])
    }
  })
})

describe('空间填充 - 平面镶嵌对照', () => {
  it('正 n 边形内角公式', () => {
    expect(planarInteriorAngle(3)).toBeCloseTo(60, 10)
    expect(planarInteriorAngle(4)).toBe(90)
    expect(planarInteriorAngle(6)).toBeCloseTo(120, 10)
  })

  it('只有 n=3,4,6 能镶嵌平面', () => {
    expect(enumeratePlanarTilings(20)).toEqual([3, 4, 6])
  })

  it('n=5 与 n=7 都不能镶嵌', () => {
    expect(tilesPlane(5)).toBe(false)
    expect(tilesPlane(7)).toBe(false)
    expect(tilesPlane(8)).toBe(false)
  })

  it('镶嵌数: 三角形 6 个, 正方形 4 个, 六边形 3 个', () => {
    expect(360 / planarInteriorAngle(3)).toBeCloseTo(6, 8)
    expect(360 / planarInteriorAngle(4)).toBeCloseTo(4, 12)
    expect(360 / planarInteriorAngle(6)).toBeCloseTo(3, 8)
  })

  it('平面有三种、空间只有一种 —— 维度升高反而更受限', () => {
    const planar = enumeratePlanarTilings(20).length
    const spatial = (['tetrahedron', 'cube', 'octahedron', 'dodecahedron', 'icosahedron'] as const)
      .filter((k) => fitsAroundEdge(DIHEDRAL_ANGLES[k])).length
    expect(planar).toBe(3)
    expect(spatial).toBe(1)
    expect(spatial).toBeLessThan(planar)
  })
})

describe('空间填充 - 能填充的多面体', () => {
  it('四种填充体信息完整', () => {
    expect(FILL_KINDS.length).toBe(4)
    expect(FILL_INFO.length).toBe(4)
    for (const f of FILL_INFO) expect(f.fills).toBe(true)
  })

  it('每种都满足欧拉公式 V−E+F=2', () => {
    for (const f of FILL_INFO) {
      expect(f.V - f.E + f.F).toBe(2)
    }
  })

  it('截角八面体是 24/36/14, 与 D3 的截角实现一致', () => {
    const to = FILL_INFO.find((f) => f.kind === 'truncatedOctahedron')!
    expect([to.V, to.E, to.F]).toEqual([24, 36, 14])
  })

  it('菱形十二面体是 14/24/12', () => {
    const rd = FILL_INFO.find((f) => f.kind === 'rhombicDodecahedron')!
    expect([rd.V, rd.E, rd.F]).toEqual([14, 24, 12])
  })

  it('六棱柱的计数与棱柱公式 2n/3n/n+2 一致', () => {
    const hp = FILL_INFO.find((f) => f.kind === 'hexPrism')!
    const n = 6
    expect(hp.V).toBe(2 * n)
    expect(hp.E).toBe(3 * n)
    expect(hp.F).toBe(n + 2)
  })

  it('填充密度恒为 1, 明显高于球堆积', () => {
    expect(FILL_DENSITY).toBe(1)
    expect(FCC_SPHERE_DENSITY).toBeCloseTo(0.740480, 6)
    expect(FILL_DENSITY).toBeGreaterThan(FCC_SPHERE_DENSITY)
  })

  it('FCC 密度就是开普勒猜想的答案 π/(3√2)', () => {
    expect(FCC_SPHERE_DENSITY).toBeCloseTo(Math.PI / (3 * Math.SQRT2), 12)
    // 约 74%, 剩下 26% 是球之间的空隙
    expect(FCC_SPHERE_DENSITY).toBeGreaterThan(0.74)
    expect(FCC_SPHERE_DENSITY).toBeLessThan(0.75)
  })

  it('infoOf 能查到每种, 未知有兜底', () => {
    for (const k of FILL_KINDS) expect(infoOf(k).kind).toBe(k)
    expect(infoOf('nope' as never).kind).toBe('cube')
  })
})

describe('空间填充 - 填充胞的几何数据', () => {
  it('四种胞的 V/E/F 与 FILL_INFO 标注一致', () => {
    for (const info of FILL_INFO) {
      const c = eulerCount(fillCell(info.kind).poly)
      expect(c.V).toBe(info.V)
      expect(c.E).toBe(info.E)
      expect(c.F).toBe(info.F)
      expect(c.chi).toBe(2)
    }
  })

  it('四种胞都等棱, 面法向全朝外', () => {
    for (const k of FILL_KINDS) {
      const { poly } = fillCell(k)
      expect(isEquilateral(poly, 1e-6)).toBe(true)
      for (let i = 0; i < poly.faces.length; i++) {
        expect(faceOutward(poly, i)).toBe(true)
      }
    }
  })

  it('菱形十二面体: 12 个菱形面且共面(手写数据, 需长期守住)', () => {
    const { poly } = fillCell('rhombicDodecahedron')
    expect(faceSizeHistogram(poly)).toEqual({ 4: 12 })
    for (let i = 0; i < poly.faces.length; i++) {
      expect(facePlanarityError(poly, i)).toBeLessThan(1e-9)
    }
    // 棱长应为 √3(立方体顶点到面心顶点的距离)
    for (const l of edgeLengths(poly)) expect(l).toBeCloseTo(Math.sqrt(3), 9)
  })

  it('截角八面体是 6 个四边形 + 8 个六边形', () => {
    expect(faceSizeHistogram(fillCell('truncatedOctahedron').poly))
      .toEqual({ 4: 6, 6: 8 })
  })

  it('每种胞都有三个独立平移向量(三维格)', () => {
    for (const k of FILL_KINDS) {
      expect(fillCell(k).shifts.length).toBe(3)
    }
  })
})
