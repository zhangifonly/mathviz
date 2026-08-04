import { describe, it, expect } from 'vitest'
import {
  dot, cross, norm, scale, sub, add,
  makeTetrahedron, makeCube, makeOctahedron, makeIcosahedron, makeDodecahedron,
  edgesOf, faceCentroid, faceNormal, faceDistance, polarVertex, dualOf,
  eulerCharacteristic, midsphereRadius, midsphereSpread, edgePerpendicularity,
  solidOf, dualName, vef, PLATONIC, DUAL_PAIRS,
} from './dualPolyhedra'
import type { Vec3 } from '../../lib/proj3d'

const SOLIDS = [
  makeTetrahedron(), makeCube(), makeOctahedron(),
  makeIcosahedron(), makeDodecahedron(),
]

describe('对偶多面体 - 五种立体的结构', () => {
  it('(V,E,F) 与教科书一致', () => {
    expect(vef(makeTetrahedron())).toEqual([4, 6, 4])
    expect(vef(makeCube())).toEqual([8, 12, 6])
    expect(vef(makeOctahedron())).toEqual([6, 12, 8])
    expect(vef(makeIcosahedron())).toEqual([12, 30, 20])
    expect(vef(makeDodecahedron())).toEqual([20, 30, 12])
  })

  it('欧拉示性数都是 2', () => {
    for (const P of SOLIDS) expect(eulerCharacteristic(P)).toBe(2)
  })

  it('每条棱恰属两个面', () => {
    for (const P of SOLIDS) {
      const count = new Map<string, number>()
      for (const f of P.faces) {
        for (let k = 0; k < f.length; k++) {
          const a = f[k]
          const b = f[(k + 1) % f.length]
          const key = a < b ? `${a}-${b}` : `${b}-${a}`
          count.set(key, (count.get(key) ?? 0) + 1)
        }
      }
      expect(count.size).toBe(edgesOf(P).length)
      for (const c of count.values()) expect(c).toBe(2)
    }
  })

  it('所有顶点到原点等距(正多面体的外接球)', () => {
    for (const P of SOLIDS) {
      const rs = P.vertices.map(norm)
      expect(Math.max(...rs) - Math.min(...rs)).toBeLessThan(1e-9)
    }
  })

  it('所有面到原点等距(内切球)', () => {
    for (const P of SOLIDS) {
      const ds = P.faces.map((f) => faceDistance(P, f))
      expect(Math.max(...ds) - Math.min(...ds)).toBeLessThan(1e-9)
    }
  })

  it('中球存在: 所有棱中点到原点等距', () => {
    for (const P of SOLIDS) {
      expect(midsphereSpread(P)).toBeLessThan(1e-9)
      expect(midsphereRadius(P)).toBeGreaterThan(0)
    }
  })

  it('面法向都朝外', () => {
    for (const P of SOLIDS) {
      for (const f of P.faces) {
        expect(dot(faceNormal(P, f), faceCentroid(P, f))).toBeGreaterThan(0)
      }
    }
  })

  it('面法向是单位向量', () => {
    for (const P of SOLIDS) {
      for (const f of P.faces) expect(norm(faceNormal(P, f))).toBeCloseTo(1, 10)
    }
  })

  it('向量工具正确', () => {
    expect(cross([1, 0, 0], [0, 1, 0])).toEqual([0, 0, 1])
    expect(dot([1, 2, 3], [4, 5, 6])).toBe(32)
    expect(norm([3, 4, 0])).toBeCloseTo(5, 12)
    expect(scale([1, 2, 3], 2)).toEqual([2, 4, 6])
    expect(sub([5, 5, 5], [1, 2, 3])).toEqual([4, 3, 2])
    expect(add([1, 1, 1], [2, 3, 4])).toEqual([3, 4, 5])
  })
})

describe('对偶多面体 - 极反演', () => {
  it('F 与 V 互换, E 不变', () => {
    for (const P of SOLIDS) {
      const [V, E, F] = vef(P)
      const [dv, de, df] = vef(dualOf(P, midsphereRadius(P)))
      expect(dv).toBe(F)
      expect(de).toBe(E)
      expect(df).toBe(V)
    }
  })

  it('对偶的欧拉示性数也是 2', () => {
    for (const P of SOLIDS) {
      expect(eulerCharacteristic(dualOf(P, midsphereRadius(P)))).toBe(2)
    }
  })

  it('立方体的对偶是正八面体(顶点落在坐标轴上)', () => {
    const D = dualOf(makeCube(), midsphereRadius(makeCube()))
    expect(D.vertices.length).toBe(6)
    // 每个顶点只有一个非零分量
    for (const v of D.vertices) {
      const nz = v.filter((x) => Math.abs(x) > 1e-9)
      expect(nz.length).toBe(1)
    }
  })

  it('对偶的对偶回到自己(顶点位置精确复原)', () => {
    for (const P of SOLIDS) {
      const R = midsphereRadius(P)
      const DD = dualOf(dualOf(P, R), R)
      expect(DD.vertices.length).toBe(P.vertices.length)
      for (let i = 0; i < P.vertices.length; i++) {
        const d = norm(sub(DD.vertices[i], P.vertices[i]))
        expect(d / norm(P.vertices[i])).toBeLessThan(1e-9)
      }
    }
  })

  it('对偶棱与原棱垂直', () => {
    for (const P of SOLIDS) {
      expect(edgePerpendicularity(P, midsphereRadius(P))).toBeLessThan(1e-9)
    }
  })

  it('极点距离满足 d × |极点| = R²', () => {
    for (const P of SOLIDS) {
      const R = midsphereRadius(P)
      for (const f of P.faces) {
        const d = faceDistance(P, f)
        const p = polarVertex(P, f, R)
        expect(d * norm(p)).toBeCloseTo(R * R, 8)
      }
    }
  })

  it('面离原点越近, 对偶顶点越远', () => {
    // 人工造一个面近一面远的情形: 把立方体沿 z 压扁
    const P = makeCube()
    const squashed = {
      ...P,
      vertices: P.vertices.map((v) => [v[0], v[1], v[2] * 0.5] as Vec3),
    }
    const near = squashed.faces
      .map((f) => ({ d: faceDistance(squashed, f), p: norm(polarVertex(squashed, f, 1)) }))
      .sort((a, b) => a.d - b.d)
    // 最近的面对应最远的极点
    expect(near[0].p).toBeGreaterThan(near[near.length - 1].p)
  })

  it('R 只影响缩放, 不影响形状', () => {
    const P = makeCube()
    const d1 = dualOf(P, 1)
    const d2 = dualOf(P, 2)
    for (let i = 0; i < d1.vertices.length; i++) {
      // R 翻倍 → 极点距离变 4 倍
      expect(norm(d2.vertices[i]) / norm(d1.vertices[i])).toBeCloseTo(4, 8)
    }
  })

  it('对偶的面环是排好序的(相邻顶点确实相邻)', () => {
    // 若面环乱序, 相邻顶点间距会忽大忽小
    for (const P of SOLIDS) {
      const D = dualOf(P, midsphereRadius(P))
      for (const f of D.faces) {
        const gaps: number[] = []
        for (let k = 0; k < f.length; k++) {
          gaps.push(norm(sub(D.vertices[f[(k + 1) % f.length]], D.vertices[f[k]])))
        }
        // 正多面体的对偶也是正的, 各边应等长
        expect(Math.max(...gaps) - Math.min(...gaps)).toBeLessThan(1e-8)
      }
    }
  })
})

describe('对偶多面体 - 配对关系', () => {
  it('三对配对正确', () => {
    expect(dualName('cube')).toBe('octahedron')
    expect(dualName('octahedron')).toBe('cube')
    expect(dualName('dodecahedron')).toBe('icosahedron')
    expect(dualName('icosahedron')).toBe('dodecahedron')
  })

  it('正四面体自对偶', () => {
    expect(dualName('tetrahedron')).toBe('tetrahedron')
    const T = makeTetrahedron()
    const [V, E, F] = vef(T)
    const [dv, de, df] = vef(dualOf(T, midsphereRadius(T)))
    expect([dv, de, df]).toEqual([F, E, V])
    expect(V).toBe(F)
  })

  it('配对双方的 (V,F) 恰好互换', () => {
    for (const [a, b] of DUAL_PAIRS) {
      const [va, ea, fa] = vef(solidOf(a))
      const [vb, eb, fb] = vef(solidOf(b))
      expect(va).toBe(fb)
      expect(fa).toBe(vb)
      expect(ea).toBe(eb)
    }
  })

  it('PLATONIC 收录五种', () => {
    expect(PLATONIC.length).toBe(5)
    const ids = PLATONIC.map((p) => p.id)
    expect(new Set(ids).size).toBe(5)
  })

  it('solidOf 五种都能取到, 未知兜底为四面体', () => {
    for (const id of ['cube', 'octahedron', 'dodecahedron', 'icosahedron'] as const) {
      expect(solidOf(id).id).toBe(id)
    }
    expect(solidOf('nope' as never).id).toBe('tetrahedron')
  })

  it('十二面体与二十面体的中球半径相同(互为对偶)', () => {
    expect(midsphereRadius(makeDodecahedron()))
      .toBeCloseTo(midsphereRadius(makeIcosahedron()), 8)
  })
})
