import { describe, it, expect } from 'vitest'
import {
  centroid, circumcenter, incenter, orthocenter,
  circumradius, inradius, distance, PRESET_TRIANGLES,
  type Triangle,
} from './triangleCenters'

// 3-4-5 直角三角形，直角在原点，便于验算
const right: Triangle = [
  { x: 0, y: 0 },
  { x: 3, y: 0 },
  { x: 0, y: 4 },
]

function near(a: number, b: number, eps = 1e-9) {
  return Math.abs(a - b) < eps
}

describe('三角形四心', () => {
  it('重心为三顶点平均', () => {
    const g = centroid(right)
    expect(near(g.x, 1)).toBe(true)
    expect(near(g.y, 4 / 3)).toBe(true)
  })

  it('直角三角形外心在斜边中点', () => {
    const o = circumcenter(right)
    expect(near(o.x, 1.5)).toBe(true)
    expect(near(o.y, 2)).toBe(true)
    // 外接圆半径 = 斜边一半 = 2.5
    expect(near(circumradius(right), 2.5)).toBe(true)
  })

  it('直角三角形垂心在直角顶点', () => {
    const h = orthocenter(right)
    expect(near(h.x, 0)).toBe(true)
    expect(near(h.y, 0)).toBe(true)
  })

  it('内心到三边等距，内切圆半径正确', () => {
    // 3-4-5 内切圆半径 r = (a+b-c)/2 = (3+4-5)/2 = 1
    expect(near(inradius(right), 1)).toBe(true)
    const i = incenter(right)
    expect(near(i.x, 1)).toBe(true)
    expect(near(i.y, 1)).toBe(true)
  })

  it('外心到三顶点等距', () => {
    for (const t of PRESET_TRIANGLES) {
      const o = circumcenter(t)
      const d0 = distance(o, t[0])
      expect(near(distance(o, t[1]), d0, 1e-6)).toBe(true)
      expect(near(distance(o, t[2]), d0, 1e-6)).toBe(true)
    }
  })

  it('欧拉线：重心分外心垂心为 1:2', () => {
    for (const t of PRESET_TRIANGLES) {
      const g = centroid(t)
      const o = circumcenter(t)
      const h = orthocenter(t)
      // G = (2O + H)/3  ->  重心落在 OH 上且 OG:GH = 1:2
      expect(near(g.x, (2 * o.x + h.x) / 3, 1e-6)).toBe(true)
      expect(near(g.y, (2 * o.y + h.y) / 3, 1e-6)).toBe(true)
    }
  })

  it('预设三角形均为有效非退化三角形', () => {
    expect(PRESET_TRIANGLES.length).toBe(3)
    for (const t of PRESET_TRIANGLES) {
      expect(inradius(t)).toBeGreaterThan(0)
      expect(circumradius(t)).toBeGreaterThan(0)
    }
  })
})
