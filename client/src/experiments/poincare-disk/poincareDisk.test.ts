import { describe, it, expect } from 'vitest'
import {
  geodesic,
  hyperbolicDistance,
  tilingVertices,
  radialGeodesics,
  TILINGS,
} from './poincareDisk'

describe('庞加莱圆盘', () => {
  it('过圆心的两点测地线是直径（直线）', () => {
    const g = geodesic({ x: -0.5, y: 0 }, { x: 0.5, y: 0 })
    expect(g.kind).toBe('line')
  })

  it('不共线两点测地线是垂直单位圆的圆弧', () => {
    const g = geodesic({ x: 0.5, y: 0 }, { x: 0, y: 0.5 })
    expect(g.kind).toBe('arc')
    // 垂直条件：cx^2 + cy^2 = r^2 + 1
    const lhs = g.cx! * g.cx! + g.cy! * g.cy!
    expect(lhs).toBeCloseTo(g.r! * g.r! + 1, 6)
  })

  it('测地线圆弧确实经过两个端点', () => {
    const p1 = { x: 0.3, y: 0.1 }
    const p2 = { x: -0.2, y: 0.6 }
    const g = geodesic(p1, p2)
    const d1 = Math.hypot(p1.x - g.cx!, p1.y - g.cy!)
    const d2 = Math.hypot(p2.x - g.cx!, p2.y - g.cy!)
    expect(d1).toBeCloseTo(g.r!, 6)
    expect(d2).toBeCloseTo(g.r!, 6)
  })

  it('双曲距离：同点为0、对称、随接近边界发散', () => {
    const p = { x: 0.2, y: 0.3 }
    expect(hyperbolicDistance(p, p)).toBeCloseTo(0, 9)
    const a = { x: 0, y: 0 }
    const b = { x: 0.5, y: 0 }
    expect(hyperbolicDistance(a, b)).toBeCloseTo(hyperbolicDistance(b, a), 9)
    const far = hyperbolicDistance(a, { x: 0.99, y: 0 })
    const near = hyperbolicDistance(a, { x: 0.5, y: 0 })
    expect(far).toBeGreaterThan(near)
    expect(far).toBeGreaterThan(5)
  })

  it('{7,3} 镶嵌生成 7 个顶点且都在圆盘内', () => {
    const v = tilingVertices(7, 3)
    expect(v.length).toBe(7)
    for (const pt of v) {
      expect(Math.hypot(pt.x, pt.y)).toBeLessThan(1)
    }
  })

  it('radialGeodesics 生成 n 条过原点的直径', () => {
    const gs = radialGeodesics(5)
    expect(gs.length).toBe(5)
    for (const g of gs) expect(g.kind).toBe('line')
  })

  it('所有预设镶嵌满足双曲条件 1/p + 1/q < 1/2', () => {
    for (const { p, q } of TILINGS) {
      expect(1 / p + 1 / q).toBeLessThan(0.5)
      expect(tilingVertices(p, q).length).toBe(p)
    }
  })
})
