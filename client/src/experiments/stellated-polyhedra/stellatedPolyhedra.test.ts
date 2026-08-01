import { describe, it, expect } from 'vitest'
import {
  stellate, stellatedOf, predictCounts, spikeCount, spikeRadius,
  isDegenerate, infoOf, STELLATE_BASES, STELLATE_INFO, KEPLER_POINSOT,
} from './stellatedPolyhedra'
import { platonicOf, PLATONIC_INFO } from '../platonic-solids/platonicSolids'
import {
  eulerCount, faceOutward, faceSizeHistogram, volumeOf, circumradius,
  centroidOf,
} from '../../lib/polyhedron'

describe('星形多面体 - 星化操作', () => {
  const heights = [0.3, 0.6, 1.2]

  it('五种基础立体全部覆盖', () => {
    expect(STELLATE_BASES.length).toBe(5)
    expect(STELLATE_INFO.length).toBe(5)
  })

  it('V/E/F 与推导公式 (V+F, 3E, 2E) 一致', () => {
    for (const base of PLATONIC_INFO) {
      const pred = predictCounts(base.V, base.E, base.F)
      for (const h of heights) {
        const c = eulerCount(stellatedOf(base.kind, h))
        expect(c.V).toBe(pred.V)
        expect(c.E).toBe(pred.E)
        expect(c.F).toBe(pred.F)
      }
    }
  })

  it('星化改变形状但不改变拓扑: χ 恒为 2', () => {
    for (const base of STELLATE_BASES) {
      for (const h of heights) {
        expect(eulerCount(stellatedOf(base, h)).chi).toBe(2)
      }
    }
  })

  it('推导公式自身满足 χ 不变: (V+F) − 3E + 2E = V − E + F', () => {
    for (const base of PLATONIC_INFO) {
      const pred = predictCounts(base.V, base.E, base.F)
      expect(pred.chi).toBe(base.V - base.E + base.F)
      expect(pred.chi).toBe(2)
    }
  })

  it('星化后全是三角面', () => {
    for (const base of STELLATE_BASES) {
      const h = faceSizeHistogram(stellatedOf(base, 0.6))
      expect(Object.keys(h)).toEqual(['3'])
    }
  })

  it('三角面数 = 2E(每条原棱贡献两个)', () => {
    for (const base of PLATONIC_INFO) {
      const h = faceSizeHistogram(stellatedOf(base.kind, 0.6))
      expect(h[3]).toBe(2 * base.E)
    }
  })

  it('所有面法向朝外(保持了原面绕向)', () => {
    for (const base of STELLATE_BASES) {
      for (const h of heights) {
        const p = stellatedOf(base, h)
        for (let i = 0; i < p.faces.length; i++) {
          expect(faceOutward(p, i)).toBe(true)
        }
      }
    }
  })

  it('顶点数 = 原顶点数 + 原面数(每面一个尖顶)', () => {
    for (const base of PLATONIC_INFO) {
      expect(eulerCount(stellatedOf(base.kind, 0.6)).V).toBe(base.V + base.F)
    }
  })

  it('尖刺个数等于原面数', () => {
    for (const base of PLATONIC_INFO) {
      expect(spikeCount(base.kind)).toBe(base.F)
    }
  })
})

describe('星形多面体 - 高度参数', () => {
  it('h = 0 时尖顶落在面心上(退化)', () => {
    expect(isDegenerate(0)).toBe(true)
    expect(isDegenerate(0.6)).toBe(false)
    const p = platonicOf('cube')
    const s = stellate(p, 0)
    // 尖顶应等于面心, 到形心距离等于面心到形心距离
    const c = centroidOf(p)
    const apexIdx = p.vertices.length
    const d = Math.hypot(...s.vertices[apexIdx].map((v, i) => v - c[i]))
    expect(d).toBeCloseTo(1, 10)
  })

  it('h 越大尖刺越长, 外接半径越大', () => {
    for (const base of STELLATE_BASES) {
      const rs = [0, 0.3, 0.6, 1.2].map((h) => circumradius(stellatedOf(base, h)))
      for (let i = 1; i < rs.length; i++) {
        expect(rs[i]).toBeGreaterThanOrEqual(rs[i - 1])
      }
    }
  })

  it('h 越大体积越大(向外拉出锥体)', () => {
    for (const base of STELLATE_BASES) {
      const vs = [0.1, 0.4, 0.8, 1.5].map((h) => volumeOf(stellatedOf(base, h)))
      for (let i = 1; i < vs.length; i++) {
        expect(vs[i]).toBeGreaterThan(vs[i - 1])
      }
    }
  })

  it('h > 0 时体积大于原多面体', () => {
    for (const base of PLATONIC_INFO) {
      const orig = volumeOf(platonicOf(base.kind))
      expect(volumeOf(stellatedOf(base.kind, 0.5))).toBeGreaterThan(orig)
    }
  })

  it('尖顶到形心距离 = 面心距离 × (1+h)', () => {
    for (const base of STELLATE_BASES) {
      for (const h of [0.3, 0.9]) {
        const r = spikeRadius(base, h)
        const r0 = spikeRadius(base, 0)
        expect(r).toBeCloseTo(r0 * (1 + h), 10)
      }
    }
  })
})

describe('星形多面体 - 与开普勒-普安索立体的区别', () => {
  it('真正的开普勒-普安索立体有四种', () => {
    expect(KEPLER_POINSOT.length).toBe(4)
  })

  it('它们的 χ 不全为 2 —— 面是自相交的五角星', () => {
    const chis = KEPLER_POINSOT.map((k) => k.chi)
    // 小星形十二面体与大十二面体的 χ = −6
    expect(chis).toContain(-6)
    expect(KEPLER_POINSOT.filter((k) => k.chi === -6).length).toBe(2)
  })

  it('本实验的面锥星化仍是球面拓扑(χ=2), 与它们不同', () => {
    const mine = eulerCount(stellatedOf('dodecahedron', 0.6))
    expect(mine.chi).toBe(2)
    const kepler = KEPLER_POINSOT.find((k) => k.name === '小星形十二面体')!
    expect(kepler.chi).toBe(-6)
    expect(mine.chi).not.toBe(kepler.chi)
  })

  it('四种开普勒-普安索立体都有 30 条棱', () => {
    for (const k of KEPLER_POINSOT) expect(k.E).toBe(30)
  })

  it('它们各自满足自己的 V−E+F', () => {
    for (const k of KEPLER_POINSOT) {
      expect(k.V - k.E + k.F).toBe(k.chi)
    }
  })

  it('infoOf 能查到每种, 未知有兜底', () => {
    for (const base of STELLATE_BASES) expect(infoOf(base).base).toBe(base)
    expect(infoOf('nope' as never).base).toBe('tetrahedron')
  })
})
