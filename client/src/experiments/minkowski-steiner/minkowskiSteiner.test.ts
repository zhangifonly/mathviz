import { describe, it, expect } from 'vitest'
import {
  makeCube, makeTetrahedron, makeOctahedron, solidOf, SOLIDS,
  faceNormal, faceCentroid,
  vertexBallVolume, steinerVolume, steinerTerms, steinerArea,
  totalEdgeLength, meanCurvatureFromEdges, support, supportOffset, width,
  distToCube, offsetVolumeNumeric, steinerResidual,
  CUBE_STEINER_COEFFS, PRESET_RADII,
} from './minkowskiSteiner'
import type { Vec3 } from '../../lib/proj3d'

describe('闵可夫斯基和 - 立体的基本量', () => {
  it('立方体 a=2: V=8, S=24', () => {
    const K = makeCube(2)
    expect(K.volume).toBeCloseTo(8, 12)
    expect(K.area).toBeCloseTo(24, 12)
    expect(K.vertices.length).toBe(8)
    expect(K.edges.length).toBe(12)
  })

  it('正四面体 a=2: V=a³/(6√2), S=√3a²', () => {
    const K = makeTetrahedron(2)
    expect(K.volume).toBeCloseTo(8 / (6 * Math.SQRT2), 10)
    expect(K.area).toBeCloseTo(4 * Math.sqrt(3), 10)
    expect(K.vertices.length).toBe(4)
    expect(K.edges.length).toBe(6)
  })

  it('正八面体 a=2: V=√2a³/3, S=2√3a²', () => {
    const K = makeOctahedron(2)
    expect(K.volume).toBeCloseTo((Math.SQRT2 / 3) * 8, 10)
    expect(K.area).toBeCloseTo(8 * Math.sqrt(3), 10)
    expect(K.vertices.length).toBe(6)
    expect(K.edges.length).toBe(12)
  })

  it('棱长总和正确', () => {
    expect(totalEdgeLength(makeCube(2))).toBeCloseTo(24, 9)
    expect(totalEdgeLength(makeTetrahedron(2))).toBeCloseTo(12, 9)
    expect(totalEdgeLength(makeOctahedron(2))).toBeCloseTo(24, 9)
  })

  it('二面角: 立方体 90°, 四面体 arccos(1/3), 八面体 arccos(−1/3)', () => {
    expect(makeCube().dihedral).toBeCloseTo(Math.PI / 2, 12)
    expect(makeTetrahedron().dihedral).toBeCloseTo(Math.acos(1 / 3), 12)
    expect(makeOctahedron().dihedral).toBeCloseTo(Math.acos(-1 / 3), 12)
  })

  it('平均曲率积分与棱长×外二面角一致', () => {
    for (const K of SOLIDS) {
      expect(meanCurvatureFromEdges(K)).toBeCloseTo(K.meanCurvature, 8)
    }
  })

  it('面数正确: 立方体 6, 四面体 4, 八面体 8', () => {
    expect(makeCube().faces.length).toBe(6)
    expect(makeTetrahedron().faces.length).toBe(4)
    expect(makeOctahedron().faces.length).toBe(8)
  })

  it('满足欧拉公式 V − E + F = 2', () => {
    for (const K of SOLIDS) {
      expect(K.vertices.length - K.edges.length + K.faces.length).toBe(2)
    }
  })

  it('面法向都朝外(与面形心同向)', () => {
    for (const K of SOLIDS) {
      for (const f of K.faces) {
        const n = faceNormal(K, f)
        const c = faceCentroid(K, f)
        // 形心在原点外侧, 法向应与它同向
        expect(n[0] * c[0] + n[1] * c[1] + n[2] * c[2]).toBeGreaterThan(0)
      }
    }
  })

  it('面法向是单位向量', () => {
    for (const K of SOLIDS) {
      for (const f of K.faces) {
        const n = faceNormal(K, f)
        expect(Math.hypot(n[0], n[1], n[2])).toBeCloseTo(1, 10)
      }
    }
  })

  it('立方体的面法向就是六个坐标轴方向', () => {
    const K = makeCube(2)
    const normals = K.faces.map((f) => faceNormal(K, f))
    // 每个法向都该是某个坐标轴的 ±1
    for (const n of normals) {
      const nonZero = n.filter((x) => Math.abs(x) > 1e-9)
      expect(nonZero.length).toBe(1)
      expect(Math.abs(nonZero[0])).toBeCloseTo(1, 10)
    }
    // 六个方向互不相同
    const keys = new Set(normals.map((n) => n.map((x) => Math.round(x)).join(',')))
    expect(keys.size).toBe(6)
  })

  it('面法向与棱中点方向不同 —— 正是面板画错的根因', () => {
    const K = makeCube(2)
    // 取一条棱, 它的中点方向是 (1,1,0)/√2, 与任一面法向都不平行
    const [i, j] = K.edges[0]
    const p = K.vertices[i]
    const q = K.vertices[j]
    const mid = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2, (p[2] + q[2]) / 2]
    const mlen = Math.hypot(mid[0], mid[1], mid[2])
    // 棱中点到原点的距离是 √2(半棱长为1时), 而面到原点距离是 1
    expect(mlen).toBeGreaterThan(1.2)
    // 沿棱中点方向推 r 会比沿面法向推 r 远
    expect(mlen).toBeCloseTo(Math.SQRT2, 6)
  })

  it('每条棱恰好被两个面共用', () => {
    for (const K of SOLIDS) {
      const count = new Map<string, number>()
      for (const f of K.faces) {
        for (let k = 0; k < f.length; k++) {
          const a = f[k]
          const b = f[(k + 1) % f.length]
          const key = a < b ? `${a}-${b}` : `${b}-${a}`
          count.set(key, (count.get(key) ?? 0) + 1)
        }
      }
      expect(count.size).toBe(K.edges.length)
      for (const c of count.values()) expect(c).toBe(2)
    }
  })

  it('solidOf 三种都能取到, 未知 id 兜底为立方体', () => {
    expect(solidOf('tetrahedron').id).toBe('tetrahedron')
    expect(solidOf('octahedron').id).toBe('octahedron')
    expect(solidOf('nope' as never).id).toBe('cube')
  })
})

describe('斯坦纳公式 - 四项分解', () => {
  it('r=0 时退化为原体积', () => {
    for (const K of SOLIDS) {
      expect(steinerVolume(K, 0)).toBeCloseTo(K.volume, 12)
    }
  })

  it('立方体系数为 8 + 24r + 6πr² + (4π/3)r³', () => {
    const K = makeCube(2)
    expect(K.volume).toBeCloseTo(CUBE_STEINER_COEFFS.body, 10)
    expect(K.area).toBeCloseTo(CUBE_STEINER_COEFFS.face, 10)
    expect(K.meanCurvature).toBeCloseTo(CUBE_STEINER_COEFFS.edge, 10)
    expect(vertexBallVolume(1)).toBeCloseTo(CUBE_STEINER_COEFFS.vertex, 10)
  })

  it('四项之和等于总体积', () => {
    for (const K of SOLIDS) {
      for (const r of [0.2, 0.5, 1.3]) {
        const t = steinerTerms(K, r)
        expect(t.body + t.faces + t.edges + t.vertices).toBeCloseTo(t.total, 10)
        expect(t.total).toBeCloseTo(steinerVolume(K, r), 10)
      }
    }
  })

  it('顶点项恒为一整个球, 与是哪个多面体无关', () => {
    for (const r of [0.3, 0.7, 1.1]) {
      const ball = (4 / 3) * Math.PI * r ** 3
      for (const K of SOLIDS) {
        expect(steinerTerms(K, r).vertices).toBeCloseTo(ball, 10)
      }
    }
  })

  it('顶点项与顶点个数无关(4/6/8 个顶点都一样)', () => {
    const r = 0.6
    const vs = SOLIDS.map((K) => steinerTerms(K, r).vertices)
    expect(new Set(SOLIDS.map((K) => K.vertices.length)).size).toBe(3)
    for (const v of vs) expect(v).toBeCloseTo(vs[0], 12)
  })

  it('体积随 r 严格递增', () => {
    for (const K of SOLIDS) {
      const vs = [0, 0.2, 0.5, 1.0, 2.0].map((r) => steinerVolume(K, r))
      for (let i = 1; i < vs.length; i++) expect(vs[i]).toBeGreaterThan(vs[i - 1])
    }
  })

  it('大 r 时球项主导(趋近于纯球)', () => {
    const K = makeCube(2)
    const r = 500
    expect(steinerTerms(K, r).vertices / steinerVolume(K, r)).toBeGreaterThan(0.99)
  })

  it('表面积公式是体积公式的导数', () => {
    const K = makeCube(2)
    const h = 1e-6
    for (const r of [0.3, 0.8]) {
      const numeric = (steinerVolume(K, r + h) - steinerVolume(K, r - h)) / (2 * h)
      expect(numeric).toBeCloseTo(steinerArea(K, r), 4)
    }
  })

  it('表面积 r=0 退化为原表面积', () => {
    for (const K of SOLIDS) {
      expect(steinerArea(K, 0)).toBeCloseTo(K.area, 12)
    }
  })
})

describe('斯坦纳公式 - 数值积分独立校验', () => {
  it('距离函数正确', () => {
    expect(distToCube([0, 0, 0], 2)).toBe(0)
    expect(distToCube([1, 0, 0], 2)).toBeCloseTo(0, 12)
    expect(distToCube([2, 0, 0], 2)).toBeCloseTo(1, 12)
    expect(distToCube([2, 2, 0], 2)).toBeCloseTo(Math.SQRT2, 12)
  })

  it('网格积分与公式一致(误差 < 3%)', () => {
    for (const r of [0.3, 0.6]) {
      expect(steinerResidual(r, 100)).toBeLessThan(0.03)
    }
  })

  it('r=0 时积分给出立方体体积', () => {
    expect(offsetVolumeNumeric(0, 2, 80)).toBeCloseTo(8, 0)
  })

  it('细化网格后误差下降', () => {
    const coarse = steinerResidual(0.5, 40)
    const fine = steinerResidual(0.5, 110)
    expect(fine).toBeLessThan(coarse + 1e-9)
  })
})

describe('支持函数 - 闵可夫斯基和变成加法', () => {
  it('立方体的支持函数在坐标方向给 h=1', () => {
    const K = makeCube(2)
    expect(support(K, [1, 0, 0])).toBeCloseTo(1, 12)
    expect(support(K, [0, -1, 0])).toBeCloseTo(1, 12)
  })

  it('对角方向给 √3(顶点)', () => {
    const K = makeCube(2)
    const u: Vec3 = [1 / Math.sqrt(3), 1 / Math.sqrt(3), 1 / Math.sqrt(3)]
    expect(support(K, u)).toBeCloseTo(Math.sqrt(3), 10)
  })

  it('圆角体的支持函数恰好加 r', () => {
    const K = makeCube(2)
    for (const r of [0.2, 0.9]) {
      for (const u of [[1, 0, 0], [0, 1, 1], [1, 1, 1]] as Vec3[]) {
        const n = Math.hypot(u[0], u[1], u[2])
        const un: Vec3 = [u[0] / n, u[1] / n, u[2] / n]
        expect(supportOffset(K, u, r)).toBeCloseTo(support(K, un) + r, 10)
      }
    }
  })

  it('零向量方向兜底为 r', () => {
    expect(supportOffset(makeCube(), [0, 0, 0], 0.5)).toBeCloseTo(0.5, 12)
  })

  it('宽度 w(u) = h(u) + h(−u), 立方体坐标方向为棱长', () => {
    const K = makeCube(2)
    expect(width(K, [1, 0, 0])).toBeCloseTo(2, 10)
    expect(width(K, [0, 0, 1])).toBeCloseTo(2, 10)
  })

  it('立方体对角宽度为 2√3', () => {
    const K = makeCube(2)
    const u: Vec3 = [1, 1, 1]
    const n = Math.sqrt(3)
    expect(width(K, [u[0] / n, u[1] / n, u[2] / n])).toBeCloseTo(2 * Math.sqrt(3), 9)
  })

  it('预设半径覆盖 0 与若干正值', () => {
    expect(PRESET_RADII[0]).toBe(0)
    expect(PRESET_RADII.length).toBe(4)
    expect(PRESET_RADII.every((r) => r >= 0)).toBe(true)
  })
})
