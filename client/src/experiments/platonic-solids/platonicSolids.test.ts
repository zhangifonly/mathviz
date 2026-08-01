import { describe, it, expect } from 'vitest'
import {
  platonicOf, angleCondition, enumerateSolutions, angularDefect, infoOf,
  PLATONIC_KINDS, PLATONIC_INFO, PHI,
} from './platonicSolids'
import {
  eulerCount, isEquilateral, isSpherical, faceOutward, facePlanarityError,
  faceSizeHistogram, vertexDegrees, volumeOf, surfaceAreaOf, edgeLengths,
  dualOf,
} from '../../lib/polyhedron'

describe('柏拉图立体 - 数据自洽性', () => {
  it('五种立体全部覆盖', () => {
    expect(PLATONIC_KINDS.length).toBe(5)
    expect(PLATONIC_INFO.length).toBe(5)
  })

  it('V/E/F 与理论值一致', () => {
    for (const info of PLATONIC_INFO) {
      const c = eulerCount(platonicOf(info.kind))
      expect(c.V).toBe(info.V)
      expect(c.E).toBe(info.E)
      expect(c.F).toBe(info.F)
    }
  })

  it('欧拉公式 V−E+F=2 对五种都成立', () => {
    for (const kind of PLATONIC_KINDS) {
      expect(eulerCount(platonicOf(kind)).chi).toBe(2)
    }
  })

  it('五种都等棱', () => {
    for (const kind of PLATONIC_KINDS) {
      expect(isEquilateral(platonicOf(kind), 1e-9)).toBe(true)
    }
  })

  it('五种的顶点都共球', () => {
    for (const kind of PLATONIC_KINDS) {
      expect(isSpherical(platonicOf(kind), 1e-9)).toBe(true)
    }
  })

  it('所有面的法向都朝外(顶点顺序正确)', () => {
    for (const kind of PLATONIC_KINDS) {
      const p = platonicOf(kind)
      for (let i = 0; i < p.faces.length; i++) {
        expect(faceOutward(p, i)).toBe(true)
      }
    }
  })

  it('五边形面共面(十二面体最容易在这里出错)', () => {
    const p = platonicOf('dodecahedron')
    for (let i = 0; i < p.faces.length; i++) {
      expect(facePlanarityError(p, i)).toBeLessThan(1e-12)
    }
  })

  it('面的边数与 faceSides 标注一致', () => {
    for (const info of PLATONIC_INFO) {
      const h = faceSizeHistogram(platonicOf(info.kind))
      expect(Object.keys(h)).toEqual([String(info.faceSides)])
      expect(h[info.faceSides]).toBe(info.F)
    }
  })

  it('每个顶点的度数等于 vertexFaces', () => {
    for (const info of PLATONIC_INFO) {
      const degs = vertexDegrees(platonicOf(info.kind))
      expect(degs.every((d) => d === info.vertexFaces)).toBe(true)
    }
  })

  it('握手定理: 度数之和 = 2E', () => {
    for (const info of PLATONIC_INFO) {
      const sum = vertexDegrees(platonicOf(info.kind)).reduce((a, b) => a + b, 0)
      expect(sum).toBe(2 * info.E)
    }
  })

  it('面数×每面边数 = 2E(每条棱被两个面共享)', () => {
    for (const info of PLATONIC_INFO) {
      expect(info.F * info.faceSides).toBe(2 * info.E)
    }
  })
})

describe('柏拉图立体 - 为什么只有五种', () => {
  it('顶点角条件 (p−2)(q−2) < 4 恰好给出五组解', () => {
    const sols = enumerateSolutions(12)
    expect(sols.length).toBe(5)
    const want = [[3, 3], [3, 4], [3, 5], [4, 3], [5, 3]]
    for (const w of want) {
      expect(sols.some(([p, q]) => p === w[0] && q === w[1])).toBe(true)
    }
  })

  it('五组解与五种立体的 (p,q) 一一对应', () => {
    const sols = enumerateSolutions(12)
    for (const info of PLATONIC_INFO) {
      expect(sols.some(
        ([p, q]) => p === info.vertexFaces && q === info.faceSides,
      )).toBe(true)
    }
  })

  it('(3,6) 与 (4,4) 恰好等于 4, 被排除(对应平面镶嵌)', () => {
    expect(angleCondition(3, 6)).toBe(4)
    expect(angleCondition(4, 4)).toBe(4)
    // 角亏为零 → 铺满平面而非围成立体
    expect(angularDefect(3, 6)).toBeCloseTo(0, 10)
    expect(angularDefect(4, 4)).toBeCloseTo(0, 10)
  })

  it('五种立体的角亏都为正(才能围成立体角)', () => {
    for (const info of PLATONIC_INFO) {
      expect(angularDefect(info.vertexFaces, info.faceSides)).toBeGreaterThan(0)
    }
  })

  it('角亏总和为 720°(笛卡尔定理)', () => {
    for (const info of PLATONIC_INFO) {
      const total = info.V * angularDefect(info.vertexFaces, info.faceSides)
      expect(total).toBeCloseTo(720, 6)
    }
  })
})

describe('柏拉图立体 - 对偶与黄金比', () => {
  it('对偶关系: 交换 (p,q) 得到对偶多面体的 (q,p)', () => {
    for (const info of PLATONIC_INFO) {
      const dual = infoOf(info.dual)
      expect(dual.faceSides).toBe(info.vertexFaces)
      expect(dual.vertexFaces).toBe(info.faceSides)
    }
  })

  it('对偶交换 V 与 F, 保持 E 不变', () => {
    for (const info of PLATONIC_INFO) {
      const dual = infoOf(info.dual)
      expect(dual.V).toBe(info.F)
      expect(dual.F).toBe(info.V)
      expect(dual.E).toBe(info.E)
    }
  })

  it('四面体自对偶', () => {
    expect(infoOf('tetrahedron').dual).toBe('tetrahedron')
  })

  it('对偶是对合的(取两次回到自身)', () => {
    for (const info of PLATONIC_INFO) {
      expect(infoOf(infoOf(info.dual).dual).kind).toBe(info.kind)
    }
  })

  it('dualOf 实际算出的对偶交换 V 与 F 且保持 E', () => {
    for (const info of PLATONIC_INFO) {
      const d = dualOf(platonicOf(info.kind))
      const c = eulerCount(d)
      expect(c.V).toBe(info.F)
      expect(c.F).toBe(info.V)
      expect(c.E).toBe(info.E)
      expect(c.chi).toBe(2)
    }
  })

  it('对偶多面体也等棱, 且所有面法向朝外', () => {
    // 新面的顶点必须按绕原顶点的环序排列, 顺序错了多边形会自交
    for (const info of PLATONIC_INFO) {
      const d = dualOf(platonicOf(info.kind))
      expect(isEquilateral(d, 1e-6)).toBe(true)
      for (let i = 0; i < d.faces.length; i++) {
        expect(faceOutward(d, i)).toBe(true)
      }
    }
  })

  it('取两次对偶回到原多面体的 V/E/F', () => {
    for (const info of PLATONIC_INFO) {
      const dd = eulerCount(dualOf(dualOf(platonicOf(info.kind))))
      expect(dd.V).toBe(info.V)
      expect(dd.E).toBe(info.E)
      expect(dd.F).toBe(info.F)
    }
  })

  it('黄金比 φ 满足 φ² = φ + 1', () => {
    expect(PHI * PHI).toBeCloseTo(PHI + 1, 12)
    expect(PHI).toBeCloseTo(1.6180339887, 9)
  })

  it('十二面体与二十面体的坐标含 φ', () => {
    // 二十面体顶点 (0,±1,±φ), 故最大坐标绝对值应为 φ
    const ico = platonicOf('icosahedron')
    const maxCoord = Math.max(...ico.vertices.flat().map(Math.abs))
    expect(maxCoord).toBeCloseTo(PHI, 12)
  })
})

describe('柏拉图立体 - 体积与表面积', () => {
  it('体积与表面积都是有限正数', () => {
    for (const kind of PLATONIC_KINDS) {
      const p = platonicOf(kind)
      expect(volumeOf(p)).toBeGreaterThan(0)
      expect(surfaceAreaOf(p)).toBeGreaterThan(0)
      expect(Number.isFinite(volumeOf(p))).toBe(true)
    }
  })

  it('立方体体积为 8(边长 2)', () => {
    expect(volumeOf(platonicOf('cube'))).toBeCloseTo(8, 8)
  })

  it('正八面体体积为 4/3(顶点在单位轴上)', () => {
    // 边长 √2 的正八面体, V = √2/3 · a³ = √2/3 · 2√2 = 4/3
    expect(volumeOf(platonicOf('octahedron'))).toBeCloseTo(4 / 3, 8)
  })

  it('外接球归一后的体积与已知解析值一致', () => {
    // ⚠️ 这些值**不随面数单调递增**: 六面体 1.540 > 八面体 1.333,
    // 十二面体 2.785 > 二十面体 2.536。原因是外接球半径由最远顶点决定,
    // 顶点少而分散的立体(六面体 8 个顶点撑满立方体的角)占球比例反而更高。
    // 我一开始想当然写了「面数越多体积越大」, 是数值检验推翻的。
    const want: Record<string, number> = {
      tetrahedron: 0.51320,
      cube: 1.53960,
      octahedron: 1.33333,
      dodecahedron: 2.78516,
      icosahedron: 2.53615,
    }
    for (const kind of PLATONIC_KINDS) {
      const p = platonicOf(kind)
      const r = Math.max(...p.vertices.map((v) => Math.hypot(...v)))
      const vol = volumeOf({
        ...p,
        vertices: p.vertices.map(
          ([x, y, z]) => [x / r, y / r, z / r] as [number, number, number],
        ),
      })
      expect(vol).toBeCloseTo(want[kind], 4)
      // 都小于单位球体积
      expect(vol).toBeLessThan((4 / 3) * Math.PI)
    }
  })

  it('棱长表长度等于 E', () => {
    for (const info of PLATONIC_INFO) {
      expect(edgeLengths(platonicOf(info.kind)).length).toBe(info.E)
    }
  })

  it('infoOf 能查到每种, 未知有兜底', () => {
    for (const kind of PLATONIC_KINDS) expect(infoOf(kind).kind).toBe(kind)
    expect(infoOf('nope' as never).kind).toBe('tetrahedron')
  })
})
