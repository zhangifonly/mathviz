import { describe, it, expect } from 'vitest'
import {
  sub, dot, norm, faceAngleAt, angleSumAt, defectAt, allDefects,
  totalDefect, defectResidual, eulerFromDefect, totalFaceAngleAnalytic,
  totalFaceAngleNumeric, faceSideSum, defectSpread, defectFractions,
  solidOf, SOLID_IDS, PLATONIC_DEFECTS, GAUSS_BONNET_FACES,
} from './descartesDefect'
import { eulerCount, edgesOf } from '../../lib/polyhedron'

const DEG = 180 / Math.PI
const FOUR_PI = 4 * Math.PI

describe('Descartes 角亏 - 定理本身', () => {
  it('五种立体的角亏总和都是 4π', () => {
    for (const id of SOLID_IDS) {
      expect(totalDefect(solidOf(id))).toBeCloseTo(FOUR_PI, 10)
      expect(defectResidual(solidOf(id))).toBeLessThan(1e-10)
    }
  })

  it('与顶点个数无关 —— 4 到 20 个顶点结果相同', () => {
    const counts = SOLID_IDS.map((id) => solidOf(id).vertices.length)
    expect(new Set(counts).size).toBeGreaterThan(3)
    const totals = SOLID_IDS.map((id) => totalDefect(solidOf(id)))
    for (const t of totals) expect(t).toBeCloseTo(totals[0], 9)
  })

  it('每顶点角亏与理论值一致', () => {
    for (const id of SOLID_IDS) {
      const p = solidOf(id)
      const theory = PLATONIC_DEFECTS[id]
      expect(p.vertices.length).toBe(theory.count)
      for (const d of allDefects(p)) {
        expect(d).toBeCloseTo(theory.perVertex, 8)
      }
    }
  })

  it('立方体每顶点 90°, 四面体 180°, 十二面体 36°', () => {
    expect(defectAt(solidOf('cube'), 0) * DEG).toBeCloseTo(90, 6)
    expect(defectAt(solidOf('tetrahedron'), 0) * DEG).toBeCloseTo(180, 6)
    expect(defectAt(solidOf('dodecahedron'), 0) * DEG).toBeCloseTo(36, 6)
  })

  it('角亏处处相等(正多面体的顶点传递性)', () => {
    for (const id of SOLID_IDS) {
      expect(defectSpread(solidOf(id))).toBeLessThan(1e-9)
    }
  })

  it('每个顶点的角亏都为正(凸多面体)', () => {
    for (const id of SOLID_IDS) {
      for (const d of allDefects(solidOf(id))) expect(d).toBeGreaterThan(0)
    }
  })

  it('顶点处的面角和恒小于 2π —— 这正是角亏为正的含义', () => {
    for (const id of SOLID_IDS) {
      const p = solidOf(id)
      for (let i = 0; i < p.vertices.length; i++) {
        expect(angleSumAt(p, i)).toBeLessThan(2 * Math.PI)
      }
    }
  })

  it('角亏占比之和为 1', () => {
    for (const id of SOLID_IDS) {
      const fs = defectFractions(solidOf(id))
      expect(fs.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 10)
    }
  })
})

describe('Descartes 角亏 - 与欧拉公式等价', () => {
  it('Σδ/(2π) 恰好等于欧拉数 χ', () => {
    for (const id of SOLID_IDS) {
      const p = solidOf(id)
      expect(eulerFromDefect(p)).toBeCloseTo(eulerCount(p).chi, 9)
      expect(eulerFromDefect(p)).toBeCloseTo(2, 9)
    }
  })

  it('面角总和的解析式与数值累加一致', () => {
    for (const id of SOLID_IDS) {
      const p = solidOf(id)
      expect(totalFaceAngleNumeric(p))
        .toBeCloseTo(totalFaceAngleAnalytic(p), 8)
    }
  })

  it('握手关系 Σ面的边数 = 2E', () => {
    for (const id of SOLID_IDS) {
      const p = solidOf(id)
      expect(faceSideSum(p)).toBe(2 * edgesOf(p).length)
    }
  })

  it('推导链完整: Σδ = 2πV − Σ(nᵢ−2)π = 2π(V−E+F)', () => {
    for (const id of SOLID_IDS) {
      const p = solidOf(id)
      const { V, E, F } = eulerCount(p)
      const lhs = 2 * Math.PI * V - totalFaceAngleAnalytic(p)
      const rhs = 2 * Math.PI * (V - E + F)
      expect(lhs).toBeCloseTo(rhs, 8)
      expect(lhs).toBeCloseTo(totalDefect(p), 8)
    }
  })

  it('面角总和公式 Σ(nᵢ−2)π 对不同面型都对', () => {
    // 立方体全是四边形: 6 × 2π = 12π
    expect(totalFaceAngleAnalytic(solidOf('cube')))
      .toBeCloseTo(6 * 2 * Math.PI, 10)
    // 四面体全是三角形: 4 × π = 4π
    expect(totalFaceAngleAnalytic(solidOf('tetrahedron')))
      .toBeCloseTo(4 * Math.PI, 10)
    // 十二面体全是五边形: 12 × 3π = 36π
    expect(totalFaceAngleAnalytic(solidOf('dodecahedron')))
      .toBeCloseTo(12 * 3 * Math.PI, 10)
  })
})

describe('Descartes 角亏 - 面角计算', () => {
  it('立方体的面角都是 90°', () => {
    const p = solidOf('cube')
    for (const f of p.faces) {
      for (const vi of f) {
        expect(faceAngleAt(p, f, vi) * DEG).toBeCloseTo(90, 6)
      }
    }
  })

  it('三角面的面角都是 60°(正三角形)', () => {
    for (const id of ['tetrahedron', 'octahedron', 'icosahedron'] as const) {
      const p = solidOf(id)
      for (const f of p.faces) {
        for (const vi of f) {
          expect(faceAngleAt(p, f, vi) * DEG).toBeCloseTo(60, 5)
        }
      }
    }
  })

  it('五边形面的面角是 108°', () => {
    const p = solidOf('dodecahedron')
    for (const f of p.faces) {
      for (const vi of f) {
        expect(faceAngleAt(p, f, vi) * DEG).toBeCloseTo(108, 4)
      }
    }
  })

  it('顶点不在面上时面角为 0', () => {
    const p = solidOf('cube')
    // 找一个不含顶点 0 的面
    const f = p.faces.find((face) => !face.includes(0))!
    expect(faceAngleAt(p, f, 0)).toBe(0)
  })

  it('每个面的内角和等于 (n−2)π', () => {
    for (const id of SOLID_IDS) {
      const p = solidOf(id)
      for (const f of p.faces) {
        const s = f.reduce((acc, vi) => acc + faceAngleAt(p, f, vi), 0)
        expect(s).toBeCloseTo((f.length - 2) * Math.PI, 7)
      }
    }
  })

  it('向量工具正确', () => {
    expect(sub([5, 5, 5], [1, 2, 3])).toEqual([4, 3, 2])
    expect(dot([1, 2, 3], [4, 5, 6])).toBe(32)
    expect(norm([3, 4, 0])).toBeCloseTo(5, 12)
  })
})

describe('Descartes 角亏 - 高斯–博内的三种面孔', () => {
  it('三种几何的对照表完整', () => {
    expect(GAUSS_BONNET_FACES.length).toBe(3)
    expect(GAUSS_BONNET_FACES.some((g) => g.where.includes('多面体'))).toBe(true)
    expect(GAUSS_BONNET_FACES.some((g) => g.where.includes('球面'))).toBe(true)
    expect(GAUSS_BONNET_FACES.some((g) => g.where.includes('双曲'))).toBe(true)
  })

  it('4π 正是单位球的总曲率', () => {
    // 球面上处处曲率为 1，总曲率 = 面积 = 4π
    expect(FOUR_PI).toBeCloseTo(4 * Math.PI, 12)
    for (const id of SOLID_IDS) {
      expect(totalDefect(solidOf(id))).toBeCloseTo(FOUR_PI, 9)
    }
  })

  it('顶点越多每个角亏越小, 但总和不变', () => {
    const perVertex = SOLID_IDS.map((id) => ({
      n: solidOf(id).vertices.length,
      d: defectAt(solidOf(id), 0),
    }))
    perVertex.sort((a, b) => a.n - b.n)
    for (let i = 1; i < perVertex.length; i++) {
      expect(perVertex[i].d).toBeLessThanOrEqual(perVertex[i - 1].d + 1e-9)
    }
    // 但 n × d 恒为 4π
    for (const { n, d } of perVertex) {
      expect(n * d).toBeCloseTo(FOUR_PI, 8)
    }
  })

  it('solidOf 返回归一化到单位球的立体', () => {
    for (const id of SOLID_IDS) {
      for (const v of solidOf(id).vertices) {
        expect(norm(v)).toBeCloseTo(1, 9)
      }
    }
  })
})
