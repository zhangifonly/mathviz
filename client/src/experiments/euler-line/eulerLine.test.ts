import { describe, it, expect } from 'vitest'
import {
  centroid,
  circumcenter,
  orthocenter,
  collinear,
  dist,
  eulerLineEndpoints,
  PRESET_TRIANGLES,
} from './eulerLine'

describe('欧拉线', () => {
  it('重心是三顶点坐标的平均', () => {
    const g = centroid({ x: 0, y: 0 }, { x: 6, y: 0 }, { x: 0, y: 9 })
    expect(g.x).toBeCloseTo(2)
    expect(g.y).toBeCloseTo(3)
  })

  it('外心到三顶点等距（外接圆半径）', () => {
    const A = { x: 0, y: 0 }
    const B = { x: 8, y: 0 }
    const C = { x: 0, y: 6 }
    const O = circumcenter(A, B, C)
    // 直角三角形外心在斜边中点
    expect(O.x).toBeCloseTo(4)
    expect(O.y).toBeCloseTo(3)
    expect(dist(O, A)).toBeCloseTo(dist(O, B))
    expect(dist(O, B)).toBeCloseTo(dist(O, C))
  })

  it('直角三角形垂心在直角顶点', () => {
    const A = { x: 0, y: 0 }
    const B = { x: 8, y: 0 }
    const C = { x: 0, y: 6 }
    const Hc = orthocenter(A, B, C)
    expect(Hc.x).toBeCloseTo(0)
    expect(Hc.y).toBeCloseTo(0)
  })

  it('三心共线，且重心分外心到垂心为 1:2', () => {
    for (const { A, B, C } of PRESET_TRIANGLES) {
      const G = centroid(A, B, C)
      const O = circumcenter(A, B, C)
      const Hc = orthocenter(A, B, C)
      expect(collinear(O, G, Hc, 1e-3)).toBe(true)
      // OG:GH = 1:2  =>  GH = 2*OG
      expect(dist(G, Hc)).toBeCloseTo(2 * dist(O, G), 3)
    }
  })

  it('collinear 对明显不共线的点返回 false', () => {
    expect(collinear({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 })).toBe(false)
    expect(collinear({ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 })).toBe(true)
  })

  it('eulerLineEndpoints 返回的两端点与三心共线', () => {
    const { A, B, C } = PRESET_TRIANGLES[0]
    const [p, q] = eulerLineEndpoints(A, B, C)
    const G = centroid(A, B, C)
    expect(collinear(p, q, G, 1e-2)).toBe(true)
  })
})
