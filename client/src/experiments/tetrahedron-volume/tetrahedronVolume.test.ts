import { describe, it, expect } from 'vitest'
import {
  cross, dot, sub, norm, tripleProduct, determinant3, parallelepipedVolume,
  tetrahedronVolume, volumeOfTetrahedron, signedVolume, volumeByBaseHeight,
  volumeResidual, areCoplanar, pointsCoplanar, cyclicSymmetryError,
  swapAntisymmetryError, simplexDivisor, tetraFromEdges, presetOf,
  tetraFaces, tetraVertices, PRESETS, UNIT_CUBE_EDGES,
  TETRAHEDRA_PER_PARALLELEPIPED,
} from './tetrahedronVolume'
import type { Vec3 } from '../../lib/proj3d'

const TRIOS: Array<[Vec3, Vec3, Vec3]> = [
  [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
  [[1, 2, 3], [4, 5, 6], [7, 8, 10]],
  [[0.6, 0.2, 0.9], [-0.3, 0.7, 0.1], [0.4, -0.5, 0.8]],
]

describe('四面体体积 - 三重积就是行列式', () => {
  it('三重积与行列式展开完全一致', () => {
    for (const [a, b, c] of TRIOS) {
      expect(tripleProduct(a, b, c)).toBeCloseTo(determinant3(a, b, c), 12)
    }
  })

  it('单位正交基的三重积为 1', () => {
    const [i, j, k] = UNIT_CUBE_EDGES
    expect(tripleProduct(i, j, k)).toBe(1)
    expect(parallelepipedVolume(i, j, k)).toBe(1)
  })

  it('平行六面体切成 6 个四面体', () => {
    expect(TETRAHEDRA_PER_PARALLELEPIPED).toBe(6)
    for (const [a, b, c] of TRIOS) {
      expect(tetrahedronVolume(a, b, c) * 6)
        .toBeCloseTo(parallelepipedVolume(a, b, c), 12)
    }
  })

  it('单位立方体的四面体体积恰为 1/6', () => {
    const [i, j, k] = UNIT_CUBE_EDGES
    expect(tetrahedronVolume(i, j, k)).toBeCloseTo(1 / 6, 12)
  })

  it('那个 6 就是 3!（n 维单纯形除数是 n!）', () => {
    expect(simplexDivisor(3)).toBe(6)
    expect(simplexDivisor(1)).toBe(1)
    expect(simplexDivisor(2)).toBe(2)
    expect(simplexDivisor(4)).toBe(24)
    expect(simplexDivisor(5)).toBe(120)
    expect(simplexDivisor(3)).toBe(TETRAHEDRA_PER_PARALLELEPIPED)
  })

  it('叉积与点积的基本性质', () => {
    expect(cross([1, 0, 0], [0, 1, 0])).toEqual([0, 0, 1])
    expect(dot([1, 2, 3], [4, 5, 6])).toBe(32)
    expect(sub([5, 5, 5], [1, 2, 3])).toEqual([4, 3, 2])
    expect(norm([3, 4, 0])).toBeCloseTo(5, 12)
  })
})

describe('四面体体积 - 两种算法交叉验证', () => {
  it('三重积法与「底面积×高/3」结果一致', () => {
    for (const p of PRESETS) {
      expect(volumeResidual(tetraFromEdges(p.a, p.b, p.c))).toBeLessThan(1e-12)
    }
  })

  it('对随机四面体也一致', () => {
    // 确定性伪随机
    let s = 12345
    const rnd = () => {
      s = (s * 1103515245 + 12345) & 0x7fffffff
      return (s / 0x7fffffff) * 2 - 1
    }
    for (let i = 0; i < 30; i++) {
      const t = tetraFromEdges(
        [rnd(), rnd(), rnd()], [rnd(), rnd(), rnd()], [rnd(), rnd(), rnd()],
      )
      // 退化情形两种算法都给 0, 跳过
      if (volumeOfTetrahedron(t) < 1e-9) continue
      expect(volumeResidual(t)).toBeLessThan(1e-10)
    }
  })

  it('底面积×高/3 在共面时给 0', () => {
    const t = tetraFromEdges([1, 0, 0], [0, 1, 0], [0.5, 0.5, 0])
    expect(volumeByBaseHeight(t)).toBeCloseTo(0, 12)
    expect(volumeOfTetrahedron(t)).toBeCloseTo(0, 12)
  })

  it('体积恒非负, 带符号体积可正可负', () => {
    for (const p of PRESETS) {
      const t = tetraFromEdges(p.a, p.b, p.c)
      expect(volumeOfTetrahedron(t)).toBeGreaterThanOrEqual(0)
      expect(Math.abs(signedVolume(t))).toBeCloseTo(volumeOfTetrahedron(t), 12)
    }
  })

  it('反定向预设的带符号体积为负, 绝对值不变', () => {
    const pos = tetraFromEdges(...Object.values(presetOf('unit')) as [Vec3, Vec3, Vec3])
    const neg = tetraFromEdges(...Object.values(presetOf('negative')) as [Vec3, Vec3, Vec3])
    expect(signedVolume(pos)).toBeGreaterThan(0)
    expect(signedVolume(neg)).toBeLessThan(0)
    expect(Math.abs(signedVolume(neg))).toBeCloseTo(Math.abs(signedVolume(pos)), 12)
  })
})

describe('四面体体积 - 三重积的三条性质', () => {
  it('循环对称: a·(b×c) = b·(c×a) = c·(a×b)', () => {
    for (const [a, b, c] of TRIOS) {
      expect(cyclicSymmetryError(a, b, c)).toBeLessThan(1e-12)
    }
  })

  it('交换任意两个向量则符号翻转', () => {
    for (const [a, b, c] of TRIOS) {
      expect(swapAntisymmetryError(a, b, c)).toBeLessThan(1e-12)
    }
  })

  it('交换两次回到原值(偶置换不变号)', () => {
    for (const [a, b, c] of TRIOS) {
      // (a,b,c) → (b,a,c) → (b,c,a): 两次交换
      expect(tripleProduct(b, c, a)).toBeCloseTo(tripleProduct(a, b, c), 12)
    }
  })

  it('共面判据: 三重积为零 ⟺ 三向量共面', () => {
    // 第三个向量落在前两个张成的平面内
    expect(areCoplanar([1, 0, 0], [0, 1, 0], [0.5, 0.5, 0])).toBe(true)
    expect(areCoplanar([1, 0, 0], [0, 1, 0], [3, -2, 0])).toBe(true)
    // 有 z 分量就不共面
    expect(areCoplanar([1, 0, 0], [0, 1, 0], [0.5, 0.5, 0.1])).toBe(false)
  })

  it('任一向量为零时必然共面', () => {
    expect(areCoplanar([0, 0, 0], [0, 1, 0], [0, 0, 1])).toBe(true)
    expect(areCoplanar([1, 0, 0], [0, 0, 0], [0, 0, 1])).toBe(true)
  })

  it('两向量平行时必然共面', () => {
    expect(areCoplanar([1, 2, 3], [2, 4, 6], [0, 0, 1])).toBe(true)
  })

  it('四点共面判据与三向量版本一致', () => {
    const flat = tetraFromEdges([1, 0, 0], [0, 1, 0], [0.5, 0.5, 0])
    expect(pointsCoplanar(flat)).toBe(true)
    const solid = tetraFromEdges([1, 0, 0], [0, 1, 0], [0, 0, 1])
    expect(pointsCoplanar(solid)).toBe(false)
  })

  it('共面时体积为零, 反之亦然', () => {
    for (const p of PRESETS) {
      const t = tetraFromEdges(p.a, p.b, p.c)
      const coplanar = pointsCoplanar(t)
      const vol = volumeOfTetrahedron(t)
      expect(coplanar).toBe(vol < 1e-9)
    }
  })
})

describe('四面体体积 - 预设与几何数据', () => {
  it('五个预设覆盖正交/倾斜/近共面/共面/反定向', () => {
    expect(PRESETS.length).toBe(5)
    const ids = PRESETS.map((p) => p.id)
    expect(ids).toContain('unit')
    expect(ids).toContain('coplanar')
    expect(ids).toContain('negative')
  })

  it('倾斜预设的体积小于正交预设(同样棱长下正交最大)', () => {
    const u = volumeOfTetrahedron(tetraFromEdges(
      ...Object.values(presetOf('unit')) as [Vec3, Vec3, Vec3],
    ))
    const s = volumeOfTetrahedron(tetraFromEdges(
      ...Object.values(presetOf('skew')) as [Vec3, Vec3, Vec3],
    ))
    expect(s).toBeLessThan(u)
  })

  it('近共面预设的体积很小但非零', () => {
    const t = tetraFromEdges(...Object.values(presetOf('flat')) as [Vec3, Vec3, Vec3])
    const v = volumeOfTetrahedron(t)
    expect(v).toBeGreaterThan(0)
    expect(v).toBeLessThan(0.01)
  })

  it('四面体有 4 个三角面、4 个顶点', () => {
    expect(tetraFaces().length).toBe(4)
    for (const f of tetraFaces()) expect(f.length).toBe(3)
    const t = tetraFromEdges([1, 0, 0], [0, 1, 0], [0, 0, 1])
    expect(tetraVertices(t).length).toBe(4)
  })

  it('面表覆盖每个顶点各 3 次(每顶点连 3 个面)', () => {
    const count = [0, 0, 0, 0]
    for (const f of tetraFaces()) for (const v of f) count[v]++
    expect(count).toEqual([3, 3, 3, 3])
  })

  it('presetOf 对未知 id 有兜底', () => {
    const p = presetOf('nope' as never)
    expect(p.a).toBeDefined()
    expect(tripleProduct(p.a, p.b, p.c)).not.toBe(0)
  })
})
