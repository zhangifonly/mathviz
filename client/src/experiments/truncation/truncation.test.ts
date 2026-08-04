import { describe, it, expect } from 'vitest'
import {
  lerp, norm, sub, dot, truncate, vertexRing, standardT, standardTOf,
  predictedCounts, baseSolid, faceProfile, edgeLengthsOf, edgeUniformity,
  STANDARD_T, RECTIFY_T, SOLID_IDS, TRUNCATION_NAMES, SOCCER_BALL,
} from './truncation'
import { eulerCount, edgesOf, vertexDegrees } from '../../lib/polyhedron'

describe('截角变换 - 顶点环', () => {
  it('环长等于顶点度数', () => {
    for (const id of SOLID_IDS) {
      const p = baseSolid(id)
      const deg = vertexDegrees(p)
      for (let v = 0; v < p.vertices.length; v++) {
        expect(vertexRing(p, v).length).toBe(deg[v])
      }
    }
  })

  it('环里的邻居互不重复', () => {
    for (const id of SOLID_IDS) {
      const p = baseSolid(id)
      for (let v = 0; v < p.vertices.length; v++) {
        const r = vertexRing(p, v)
        expect(new Set(r).size).toBe(r.length)
      }
    }
  })

  it('环里每个都是真邻居(有棱相连)', () => {
    for (const id of SOLID_IDS) {
      const p = baseSolid(id)
      const es = new Set(edgesOf(p).map(([a, b]) => `${a}-${b}`))
      for (let v = 0; v < p.vertices.length; v++) {
        for (const nb of vertexRing(p, v)) {
          const key = v < nb ? `${v}-${nb}` : `${nb}-${v}`
          expect(es.has(key)).toBe(true)
        }
      }
    }
  })

  it('孤立顶点返回空环', () => {
    expect(vertexRing({ name: 'x', vertices: [[0, 0, 0]], faces: [] }, 0))
      .toEqual([])
  })
})

describe('截角变换 - 标准截角参数', () => {
  it('三角面给 1/3', () => {
    expect(standardT(3)).toBeCloseTo(1 / 3, 12)
    expect(STANDARD_T).toBeCloseTo(1 / 3, 12)
  })

  it('四边面给 0.2929, 五边面给 0.2764 —— 不是 1/3', () => {
    expect(standardT(4)).toBeCloseTo(0.292893, 5)
    expect(standardT(5)).toBeCloseTo(0.276393, 5)
    expect(standardT(4)).not.toBeCloseTo(1 / 3, 3)
  })

  it('边数越多 t 越小', () => {
    const ts = [3, 4, 5, 6, 8].map(standardT)
    for (let i = 1; i < ts.length; i++) {
      expect(ts[i]).toBeLessThan(ts[i - 1])
    }
  })

  it('standardTOf 按面型取值', () => {
    expect(standardTOf(baseSolid('tetrahedron'))).toBeCloseTo(standardT(3), 12)
    expect(standardTOf(baseSolid('cube'))).toBeCloseTo(standardT(4), 12)
    expect(standardTOf(baseSolid('dodecahedron'))).toBeCloseTo(standardT(5), 12)
  })
})

describe('截角变换 - 标准截角得到阿基米德立体', () => {
  it('(V, E, F) 与理论预测一致', () => {
    for (const id of SOLID_IDS) {
      const p = baseSolid(id)
      const t = standardTOf(p)
      const q = truncate(p, t)
      const { V, E, F } = eulerCount(q)
      const pred = predictedCounts(p, t)
      expect([V, E, F]).toEqual([pred.V, pred.E, pred.F])
    }
  })

  it('V\' = 2E, E\' = 3E, F\' = F + V', () => {
    for (const id of SOLID_IDS) {
      const p = baseSolid(id)
      const before = eulerCount(p)
      const after = eulerCount(truncate(p, standardTOf(p)))
      expect(after.V).toBe(2 * before.E)
      expect(after.E).toBe(3 * before.E)
      expect(after.F).toBe(before.F + before.V)
    }
  })

  it('拓扑不变: 截角后 χ 仍是 2', () => {
    for (const id of SOLID_IDS) {
      expect(eulerCount(truncate(baseSolid(id), standardTOf(baseSolid(id)))).chi)
        .toBe(2)
    }
  })

  it('所有棱等长 —— 这才算阿基米德立体', () => {
    for (const id of SOLID_IDS) {
      const p = baseSolid(id)
      expect(edgeUniformity(truncate(p, standardTOf(p)))).toBeLessThan(1e-9)
    }
  })

  it('用错的 t(一律 1/3) 会让非三角面立体棱长不齐', () => {
    // 这条守住我踩过的坑：立方体用 1/3 截角，棱长极差高达 0.29
    const cube = baseSolid('cube')
    expect(edgeUniformity(truncate(cube, 1 / 3))).toBeGreaterThan(0.2)
    expect(edgeUniformity(truncate(cube, standardTOf(cube)))).toBeLessThan(1e-9)
  })

  it('面型正确: 截角四面体 4 三角 + 4 六边', () => {
    const p = baseSolid('tetrahedron')
    expect(faceProfile(truncate(p, standardTOf(p)))).toEqual({ 3: 4, 6: 4 })
  })

  it('截角立方体 8 三角 + 6 八边', () => {
    const p = baseSolid('cube')
    expect(faceProfile(truncate(p, standardTOf(p)))).toEqual({ 3: 8, 8: 6 })
  })

  it('截角八面体 6 四边 + 8 六边', () => {
    const p = baseSolid('octahedron')
    expect(faceProfile(truncate(p, standardTOf(p)))).toEqual({ 4: 6, 6: 8 })
  })

  it('足球是截角二十面体: 12 五边形 + 20 六边形', () => {
    const ico = baseSolid(SOCCER_BALL.base)
    const ball = truncate(ico, standardTOf(ico))
    const prof = faceProfile(ball)
    expect(prof[5]).toBe(SOCCER_BALL.pentagons)
    expect(prof[6]).toBe(SOCCER_BALL.hexagons)
    const { V, E, F } = eulerCount(ball)
    expect([V, E, F]).toEqual([60, 90, 32])
  })

  it('截角十二面体 20 三角 + 12 十边', () => {
    const p = baseSolid('dodecahedron')
    expect(faceProfile(truncate(p, standardTOf(p)))).toEqual({ 3: 20, 10: 12 })
  })
})

describe('截角变换 - 整流', () => {
  it('t=1/2 时每条棱缩成一个点', () => {
    for (const id of SOLID_IDS) {
      const p = baseSolid(id)
      const before = eulerCount(p)
      const after = eulerCount(truncate(p, RECTIFY_T))
      expect(after.V).toBe(before.E)
      expect(after.E).toBe(2 * before.E)
      expect(after.F).toBe(before.F + before.V)
    }
  })

  it('整流后拓扑仍是球面(χ=2) —— 切点必须合并才对', () => {
    // 这条守住我踩过的坑：t=0.5 时若按有向棱建两个点，χ 会变成负数
    for (const id of SOLID_IDS) {
      expect(eulerCount(truncate(baseSolid(id), RECTIFY_T)).chi).toBe(2)
    }
  })

  it('立方体与八面体整流到同一个立方八面体', () => {
    const a = truncate(baseSolid('cube'), RECTIFY_T)
    const b = truncate(baseSolid('octahedron'), RECTIFY_T)
    expect(faceProfile(a)).toEqual(faceProfile(b))
    expect(faceProfile(a)).toEqual({ 3: 8, 4: 6 })
    const ca = eulerCount(a)
    const cb = eulerCount(b)
    expect([ca.V, ca.E, ca.F]).toEqual([cb.V, cb.E, cb.F])
  })

  it('十二面体与二十面体整流到同一个', () => {
    const a = truncate(baseSolid('dodecahedron'), RECTIFY_T)
    const b = truncate(baseSolid('icosahedron'), RECTIFY_T)
    expect(faceProfile(a)).toEqual(faceProfile(b))
    expect(faceProfile(a)).toEqual({ 3: 20, 5: 12 })
  })

  it('正四面体整流得到正八面体(8 个三角面)', () => {
    const q = truncate(baseSolid('tetrahedron'), RECTIFY_T)
    expect(faceProfile(q)).toEqual({ 3: 8 })
    const { V, E, F } = eulerCount(q)
    expect([V, E, F]).toEqual([6, 12, 8])
  })
})

describe('截角变换 - 边界与工具', () => {
  it('t=0 返回原立体', () => {
    for (const id of SOLID_IDS) {
      const p = baseSolid(id)
      const q = truncate(p, 0)
      expect(q.vertices.length).toBe(p.vertices.length)
      expect(q.faces.length).toBe(p.faces.length)
    }
  })

  it('t 被夹在 [0, 0.5]', () => {
    const p = baseSolid('cube')
    const a = truncate(p, 0.8)
    const b = truncate(p, RECTIFY_T)
    expect(eulerCount(a).V).toBe(eulerCount(b).V)
    expect(eulerCount(truncate(p, -1)).V).toBe(p.vertices.length)
  })

  it('中间 t 值也保持 χ=2', () => {
    for (const t of [0.1, 0.2, 0.25, 0.4, 0.45]) {
      for (const id of SOLID_IDS) {
        expect(eulerCount(truncate(baseSolid(id), t)).chi).toBe(2)
      }
    }
  })

  it('截角后所有顶点都在原立体的棱上', () => {
    const p = baseSolid('cube')
    const q = truncate(p, 0.3)
    const es = edgesOf(p)
    for (const v of q.vertices) {
      // 至少落在某条棱的线段上
      const onSome = es.some(([a, b]) => {
        const pa = p.vertices[a]
        const pb = p.vertices[b]
        const ab = sub(pb, pa)
        const av = sub(v, pa)
        const t = dot(av, ab) / dot(ab, ab)
        if (t < -1e-9 || t > 1 + 1e-9) return false
        return norm(sub(av, [ab[0] * t, ab[1] * t, ab[2] * t])) < 1e-9
      })
      expect(onSome).toBe(true)
    }
  })

  it('TRUNCATION_NAMES 覆盖五种且标注对偶归一', () => {
    for (const id of SOLID_IDS) {
      expect(TRUNCATION_NAMES[id].std.length).toBeGreaterThan(2)
    }
    // 立方体与八面体整流到同名立体
    expect(TRUNCATION_NAMES.cube.rect).toBe(TRUNCATION_NAMES.octahedron.rect)
    expect(TRUNCATION_NAMES.dodecahedron.rect)
      .toBe(TRUNCATION_NAMES.icosahedron.rect)
  })

  it('向量工具正确', () => {
    expect(lerp([0, 0, 0], [2, 4, 6], 0.5)).toEqual([1, 2, 3])
    expect(norm([3, 4, 0])).toBeCloseTo(5, 12)
    expect(sub([5, 5, 5], [1, 2, 3])).toEqual([4, 3, 2])
    expect(dot([1, 2, 3], [4, 5, 6])).toBe(32)
  })

  it('棱长表长度等于棱数', () => {
    for (const id of SOLID_IDS) {
      const p = baseSolid(id)
      const q = truncate(p, standardTOf(p))
      expect(edgeLengthsOf(q).length).toBe(edgesOf(q).length)
    }
  })
})
