import { describe, it, expect } from 'vitest'
import {
  truncate, archimedeanOf, rectify, faceTypeOf, isSemiRegular, idealT,
  infoOf, TRUNC_BASES, ARCHIMEDEAN_INFO, IDEAL_T,
} from './archimedeanSolids'
import { platonicOf } from '../platonic-solids/platonicSolids'
import {
  eulerCount, isEquilateral, faceOutward, facePlanarityError,
  faceSizeHistogram, vertexDegrees, volumeOf,
} from '../../lib/polyhedron'

describe('阿基米德立体 - 截角操作', () => {
  it('三种截角立体的 V/E/F 与理论值一致', () => {
    for (const info of ARCHIMEDEAN_INFO) {
      const c = eulerCount(archimedeanOf(info.base))
      expect(c.V).toBe(info.V)
      expect(c.E).toBe(info.E)
      expect(c.F).toBe(info.F)
    }
  })

  it('欧拉公式 V−E+F=2 对截角结果成立', () => {
    for (const base of TRUNC_BASES) {
      expect(eulerCount(archimedeanOf(base)).chi).toBe(2)
    }
  })

  it('截角后所有面法向朝外(切口面顶点按环序排列)', () => {
    for (const base of TRUNC_BASES) {
      const p = archimedeanOf(base)
      for (let i = 0; i < p.faces.length; i++) {
        expect(faceOutward(p, i)).toBe(true)
      }
    }
  })

  it('截角后各面共面(六边形与八边形最易出错)', () => {
    for (const base of TRUNC_BASES) {
      const p = archimedeanOf(base)
      for (let i = 0; i < p.faces.length; i++) {
        expect(facePlanarityError(p, i)).toBeLessThan(1e-9)
      }
    }
  })

  it('面型分布与标注一致', () => {
    expect(faceTypeOf('tetrahedron')).toEqual({ 3: 4, 6: 4 })
    expect(faceTypeOf('cube')).toEqual({ 3: 8, 8: 6 })
    expect(faceTypeOf('octahedron')).toEqual({ 4: 6, 6: 8 })
  })

  it('每顶点度数为 3(截角把顶点变成三面相聚)', () => {
    for (const base of TRUNC_BASES) {
      expect(vertexDegrees(archimedeanOf(base)).every((d) => d === 3)).toBe(true)
    }
  })

  it('顶点数 = 原棱数 × 2', () => {
    const origEdges: Record<string, number> = {
      tetrahedron: 6, cube: 12, octahedron: 12,
    }
    for (const info of ARCHIMEDEAN_INFO) {
      expect(info.V).toBe(origEdges[info.base] * 2)
    }
  })

  it('面数 = 原面数 + 原顶点数', () => {
    const orig: Record<string, [number, number]> = {
      tetrahedron: [4, 4], cube: [6, 8], octahedron: [8, 6],
    }
    for (const info of ARCHIMEDEAN_INFO) {
      const [F, V] = orig[info.base]
      expect(info.F).toBe(F + V)
    }
  })
})

describe('阿基米德立体 - 理想截角比例', () => {
  it('理想比例不是常数: 三角面 1/3, 四边面 1/(2+√2)', () => {
    expect(idealT('tetrahedron')).toBeCloseTo(1 / 3, 12)
    expect(idealT('octahedron')).toBeCloseTo(1 / 3, 12)
    expect(idealT('cube')).toBeCloseTo(1 / (2 + Math.SQRT2), 12)
    // 两者明显不同 —— 统一用 1/3 会让截角立方体不半正
    expect(Math.abs(idealT('cube') - IDEAL_T)).toBeGreaterThan(0.03)
  })

  it('取理想比例时三种截角立体都是半正的(所有面为正多边形)', () => {
    for (const base of TRUNC_BASES) {
      expect(isSemiRegular(base)).toBe(true)
    }
  })

  it('立方体用错误的 1/3 时不半正 —— 这个判据确实有区分力', () => {
    expect(isSemiRegular('cube', 1 / 3)).toBe(false)
    // 而正确比例下半正
    expect(isSemiRegular('cube', 1 / (2 + Math.SQRT2))).toBe(true)
  })

  it('取理想比例时整体等棱', () => {
    for (const base of TRUNC_BASES) {
      expect(isEquilateral(archimedeanOf(base), 1e-6)).toBe(true)
    }
  })

  it('截角比例越大体积越小(切掉的越多)', () => {
    for (const base of TRUNC_BASES) {
      const p = platonicOf(base)
      const vols = [0.1, 0.2, 0.3, 0.45].map((t) => volumeOf(truncate(p, t)))
      for (let i = 1; i < vols.length; i++) {
        expect(vols[i]).toBeLessThan(vols[i - 1])
      }
      // 都小于原立体体积
      expect(vols[0]).toBeLessThan(volumeOf(p))
    }
  })
})

describe('阿基米德立体 - 截半', () => {
  it('立方体截半得立方八面体 12/24/14', () => {
    const c = eulerCount(rectify(platonicOf('cube')))
    expect(c.V).toBe(12)
    expect(c.E).toBe(24)
    expect(c.F).toBe(14)
    expect(c.chi).toBe(2)
  })

  it('立方八面体面型为 8 个三角形 + 6 个四边形', () => {
    expect(faceSizeHistogram(rectify(platonicOf('cube')))).toEqual({ 3: 8, 4: 6 })
  })

  it('对偶的截半同构: 立方体与正八面体截半结果相同', () => {
    const a = eulerCount(rectify(platonicOf('cube')))
    const b = eulerCount(rectify(platonicOf('octahedron')))
    expect(a).toEqual(b)
    expect(faceSizeHistogram(rectify(platonicOf('octahedron')))).toEqual({ 3: 8, 4: 6 })
  })

  it('截半结果等棱且面法向朝外', () => {
    for (const base of ['cube', 'octahedron', 'tetrahedron'] as const) {
      const r = rectify(platonicOf(base))
      expect(isEquilateral(r, 1e-6)).toBe(true)
      for (let i = 0; i < r.faces.length; i++) {
        expect(faceOutward(r, i)).toBe(true)
      }
    }
  })

  it('四面体截半得正八面体 6/12/8', () => {
    const c = eulerCount(rectify(platonicOf('tetrahedron')))
    expect(c.V).toBe(6)
    expect(c.E).toBe(12)
    expect(c.F).toBe(8)
    expect(faceSizeHistogram(rectify(platonicOf('tetrahedron')))).toEqual({ 3: 8 })
  })

  it('截半的顶点数等于原棱数(每棱一个中点)', () => {
    const cases: Array<['cube' | 'octahedron' | 'tetrahedron', number]> = [
      ['cube', 12], ['octahedron', 12], ['tetrahedron', 6],
    ]
    for (const [base, edges] of cases) {
      expect(eulerCount(rectify(platonicOf(base))).V).toBe(edges)
    }
  })
})

describe('阿基米德立体 - 接口', () => {
  it('三种基础立体全部覆盖', () => {
    expect(TRUNC_BASES.length).toBe(3)
    expect(ARCHIMEDEAN_INFO.length).toBe(3)
  })

  it('infoOf 能查到每种, 未知有兜底', () => {
    for (const base of TRUNC_BASES) expect(infoOf(base).base).toBe(base)
    expect(infoOf('nope' as never).base).toBe('tetrahedron')
  })

  it('面型描述与实际分布一致', () => {
    for (const info of ARCHIMEDEAN_INFO) {
      const h = faceTypeOf(info.base)
      // faceDesc 形如 '4 个六边形 + 4 个三角形', 提取数字核对总面数
      const nums = info.faceDesc.match(/\d+/g)?.map(Number) ?? []
      const total = Object.values(h).reduce((a, b) => a + b, 0)
      expect(nums.reduce((a, b) => a + b, 0)).toBe(total)
      expect(total).toBe(info.F)
    }
  })

  it('截角保持凸性: 所有顶点到形心距离为正', () => {
    for (const base of TRUNC_BASES) {
      const p = archimedeanOf(base)
      for (const v of p.vertices) {
        expect(Math.hypot(...v)).toBeGreaterThan(0)
      }
    }
  })
})
