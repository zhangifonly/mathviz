import { describe, it, expect } from 'vitest'
import {
  reuleauxVertices,
  reuleauxArcs,
  boundaryPoints,
  widthAlong,
  reuleauxArea,
  reuleauxPerimeter,
  circumRadius,
  SIDES,
} from './reuleaux'

describe('等宽曲线 勒洛多边形', () => {
  it('SIDES 全为奇数且 reuleauxArcs 段数等于边数', () => {
    for (const n of SIDES) {
      expect(n % 2).toBe(1)
      expect(reuleauxArcs(n, 0, 0, 100).length).toBe(n)
    }
  })

  it('reuleauxVertices 顶点数正确且都在外接圆上', () => {
    const rc = circumRadius(5, 200)
    const v = reuleauxVertices(5, 10, 20, 200)
    expect(v.length).toBe(5)
    for (const p of v) {
      const d = Math.hypot(p.x - 10, p.y - 20)
      expect(d).toBeCloseTo(rc, 6)
    }
  })

  it('每段圆弧半径恰为宽度 width', () => {
    for (const arc of reuleauxArcs(7, 0, 0, 150)) {
      expect(arc.r).toBe(150)
    }
  })

  it('等宽性: 各方向投影宽度都等于 width', () => {
    for (const n of SIDES) {
      const pts = boundaryPoints(n, 0, 0, 120, 60)
      for (let i = 0; i < 24; i++) {
        const theta = (Math.PI * i) / 24
        expect(widthAlong(pts, theta)).toBeCloseTo(120, 1)
      }
    }
  })

  it('勒洛三角形面积公式正确', () => {
    // A = (PI - sqrt(3)) / 2 * w^2
    const w = 2
    expect(reuleauxArea(3, w)).toBeCloseTo(((Math.PI - Math.sqrt(3)) / 2) * w * w, 6)
  })

  it('巴比尔定理: 周长恒为 PI*width，与边数无关', () => {
    expect(reuleauxPerimeter(10)).toBeCloseTo(Math.PI * 10, 6)
    // 面积随边数增多趋近同宽圆 (PI/4 w^2 ≈ 0.785 w^2)
    const circle = (Math.PI / 4) * 100
    expect(reuleauxArea(3, 10)).toBeLessThan(circle)
    expect(reuleauxArea(7, 10)).toBeGreaterThan(reuleauxArea(3, 10))
  })
})
