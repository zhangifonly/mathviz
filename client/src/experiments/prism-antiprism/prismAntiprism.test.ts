import { describe, it, expect } from 'vitest'
import {
  prism, antiprism, solidOf, predictCounts, prismHeight, antiprismHeight,
  sideFaceCount, baseEdge, isCubeCase, isOctahedronCase, infoOf,
  SOLID_KINDS, SOLID_INFO,
} from './prismAntiprism'
import { platonicOf } from '../platonic-solids/platonicSolids'
import {
  eulerCount, isEquilateral, isSpherical, faceOutward, faceSizeHistogram,
  vertexDegrees, volumeOf, edgeLengths,
} from '../../lib/polyhedron'

describe('棱柱与反棱柱 - 计数', () => {
  const ns = [3, 4, 5, 6, 8, 10]

  it('两个无穷族都覆盖', () => {
    expect(SOLID_KINDS.length).toBe(2)
    expect(SOLID_INFO.length).toBe(2)
  })

  it('棱柱 V/E/F = 2n / 3n / n+2', () => {
    for (const n of ns) {
      const c = eulerCount(prism(n))
      expect(c.V).toBe(2 * n)
      expect(c.E).toBe(3 * n)
      expect(c.F).toBe(n + 2)
    }
  })

  it('反棱柱 V/E/F = 2n / 4n / 2n+2', () => {
    for (const n of ns) {
      const c = eulerCount(antiprism(n))
      expect(c.V).toBe(2 * n)
      expect(c.E).toBe(4 * n)
      expect(c.F).toBe(2 * n + 2)
    }
  })

  it('欧拉公式对两族任意 n 都成立', () => {
    for (const kind of SOLID_KINDS) {
      for (const n of ns) {
        expect(eulerCount(solidOf(kind, n)).chi).toBe(2)
        expect(predictCounts(kind, n).chi).toBe(2)
      }
    }
  })

  it('实际计数与解析预测一致', () => {
    for (const kind of SOLID_KINDS) {
      for (const n of ns) {
        const c = eulerCount(solidOf(kind, n))
        const pred = predictCounts(kind, n)
        expect(c.V).toBe(pred.V)
        expect(c.E).toBe(pred.E)
        expect(c.F).toBe(pred.F)
      }
    }
  })

  it('侧面数: 棱柱 n 个, 反棱柱 2n 个', () => {
    for (const n of ns) {
      expect(sideFaceCount('prism', n)).toBe(n)
      expect(sideFaceCount('antiprism', n)).toBe(2 * n)
    }
  })

  it('面型分布: 棱柱 n 个四边形 + 2 个 n 边形', () => {
    for (const n of [5, 6, 8]) {
      const h = faceSizeHistogram(prism(n))
      expect(h[4]).toBe(n)
      expect(h[n]).toBe(2)
    }
  })

  it('面型分布: 反棱柱 2n 个三角形 + 2 个 n 边形', () => {
    for (const n of [5, 6, 8]) {
      const h = faceSizeHistogram(antiprism(n))
      expect(h[3]).toBe(2 * n)
      expect(h[n]).toBe(2)
    }
  })

  it('顶点度数: 棱柱恒为 3, 反棱柱恒为 4', () => {
    for (const n of [5, 6, 8]) {
      expect(vertexDegrees(prism(n)).every((d) => d === 3)).toBe(true)
      expect(vertexDegrees(antiprism(n)).every((d) => d === 4)).toBe(true)
    }
  })
})

describe('棱柱与反棱柱 - 几何正确性', () => {
  const ns = [3, 4, 5, 6, 8]

  it('两族在任意 n 下都等棱(所有面是正多边形的前提)', () => {
    for (const kind of SOLID_KINDS) {
      for (const n of ns) {
        expect(isEquilateral(solidOf(kind, n), 1e-9)).toBe(true)
      }
    }
  })

  it('两族的顶点都共球', () => {
    for (const kind of SOLID_KINDS) {
      for (const n of ns) {
        expect(isSpherical(solidOf(kind, n), 1e-9)).toBe(true)
      }
    }
  })

  it('所有面法向朝外(底面顶点顺序需逆序)', () => {
    for (const kind of SOLID_KINDS) {
      for (const n of ns) {
        const p = solidOf(kind, n)
        for (let i = 0; i < p.faces.length; i++) {
          expect(faceOutward(p, i)).toBe(true)
        }
      }
    }
  })

  it('棱柱高度 = 底面边长(侧面为正方形)', () => {
    for (const n of ns) {
      expect(prismHeight(n)).toBeCloseTo(baseEdge(n), 12)
    }
  })

  it('反棱柱高度使侧面三角形等边', () => {
    for (const n of ns) {
      const s = baseEdge(n)
      const d = 2 * Math.sin(Math.PI / (2 * n))
      expect(antiprismHeight(n)).toBeCloseTo(Math.sqrt(s * s - d * d), 12)
      // 高度必须为正
      expect(antiprismHeight(n)).toBeGreaterThan(0)
    }
  })

  it('反棱柱的棱长全等于底面边长', () => {
    for (const n of ns) {
      const ls = edgeLengths(antiprism(n))
      for (const l of ls) expect(l).toBeCloseTo(baseEdge(n), 9)
    }
  })

  it('体积在 n=4 处最大, 之后递减趋于零(不是单调递增)', () => {
    // ⚠️ 外接圆半径固定时, n 越大底面积越趋于 π, 但高度 2sin(π/n) 越小,
    // 两者相乘在 n=4 达到峰值 2.83, 此后压成薄片趋于 0。
    // 我一开始想当然写了「n 越大体积越大」, 是数值检验推翻的。
    const vols = new Map([3, 4, 5, 6, 8, 16, 32].map((n) => [n, volumeOf(prism(n))]))
    expect(vols.get(4)!).toBeGreaterThan(vols.get(3)!)
    expect(vols.get(4)!).toBeGreaterThan(vols.get(5)!)
    // n≥4 之后单调递减
    for (const [a, b] of [[4, 5], [5, 6], [6, 8], [8, 16], [16, 32]]) {
      expect(vols.get(b)!).toBeLessThan(vols.get(a)!)
    }
    // 峰值约 2.83 = 边长为 √2 的立方体
    expect(vols.get(4)!).toBeCloseTo(Math.SQRT2 ** 3, 6)
  })

  it('底面积随 n 单调趋于 π(圆的面积)', () => {
    // 分离出「底面积」这一项, 它才是单调的
    const areas = [3, 5, 8, 16, 32, 100].map((n) => (n / 2) * Math.sin((2 * Math.PI) / n))
    for (let i = 1; i < areas.length; i++) {
      expect(areas[i]).toBeGreaterThan(areas[i - 1])
    }
    expect(areas[areas.length - 1]).toBeCloseTo(Math.PI, 2)
  })
})

describe('棱柱与反棱柱 - 两个退化情形', () => {
  it('n=4 的棱柱就是立方体: V/E/F 与面型都一致', () => {
    expect(isCubeCase(4)).toBe(true)
    const c = eulerCount(prism(4))
    const cube = eulerCount(platonicOf('cube'))
    expect(c).toEqual(cube)
    expect(faceSizeHistogram(prism(4))).toEqual({ 4: 6 })
  })

  it('n=4 棱柱的体积与同棱长立方体一致', () => {
    const p = prism(4)
    const s = baseEdge(4)
    expect(volumeOf(p)).toBeCloseTo(s ** 3, 8)
  })

  it('n=3 的反棱柱就是正八面体: V/E/F 与面型都一致', () => {
    expect(isOctahedronCase(3)).toBe(true)
    const c = eulerCount(antiprism(3))
    const oct = eulerCount(platonicOf('octahedron'))
    expect(c).toEqual(oct)
    expect(faceSizeHistogram(antiprism(3))).toEqual({ 3: 8 })
  })

  it('n=3 反棱柱的顶点度数为 4, 与正八面体相同', () => {
    expect(vertexDegrees(antiprism(3)).every((d) => d === 4)).toBe(true)
    expect(vertexDegrees(platonicOf('octahedron')).every((d) => d === 4)).toBe(true)
  })

  it('其他 n 不构成柏拉图立体(面型不单一)', () => {
    for (const n of [5, 6, 8]) {
      expect(Object.keys(faceSizeHistogram(prism(n))).length).toBeGreaterThan(1)
      expect(Object.keys(faceSizeHistogram(antiprism(n))).length).toBeGreaterThan(1)
    }
  })

  it('infoOf 能查到两族, 未知有兜底', () => {
    for (const kind of SOLID_KINDS) expect(infoOf(kind).kind).toBe(kind)
    expect(infoOf('nope' as never).kind).toBe('prism')
  })
})
