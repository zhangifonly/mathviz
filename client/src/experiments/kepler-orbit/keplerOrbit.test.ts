import { describe, it, expect } from 'vitest'
import {
  solveKepler,
  orbitPosition,
  focalRadius,
  positionAtTime,
  orbitPoints,
  sweptAreas,
  focusX,
  ECCENTRICITIES,
} from './keplerOrbit'

describe('开普勒轨道', () => {
  it('solveKepler 解满足开普勒方程 M = E - e*sinE', () => {
    for (const e of [0, 0.3, 0.6, 0.9]) {
      for (const M of [0.2, 1.0, 2.5, 5.0]) {
        const E = solveKepler(M, e)
        expect(E - e * Math.sin(E)).toBeCloseTo(M, 8)
      }
    }
  })

  it('圆轨道 (e=0) 时 E 等于平近点角 M', () => {
    expect(solveKepler(1.234, 0)).toBeCloseTo(1.234, 10)
  })

  it('focalRadius: 近日点(E=0)最小、远日点(E=π)最大', () => {
    const a = 1
    const e = 0.5
    const rPeri = focalRadius(a, e, 0)
    const rApo = focalRadius(a, e, Math.PI)
    expect(rPeri).toBeCloseTo(a * (1 - e), 10)
    expect(rApo).toBeCloseTo(a * (1 + e), 10)
    expect(rApo).toBeGreaterThan(rPeri)
  })

  it('orbitPosition 落在椭圆上，满足 (x/a)^2+(y/b)^2=1', () => {
    const a = 2
    const e = 0.4
    const b = a * Math.sqrt(1 - e * e)
    for (const E of [0.5, 1.5, 3.0, 4.5]) {
      const p = orbitPosition(a, e, E)
      expect((p.x * p.x) / (a * a) + (p.y * p.y) / (b * b)).toBeCloseTo(1, 10)
    }
  })

  it('orbitPoints 生成闭合轨道，首尾重合', () => {
    const pts = orbitPoints(1, 0.3, 64)
    expect(pts.length).toBe(65)
    expect(pts[0].x).toBeCloseTo(pts[64].x, 10)
    expect(pts[0].y).toBeCloseTo(pts[64].y, 10)
  })

  it('sweptAreas 验证第二定律：相等时间扫过近似相等面积', () => {
    for (const e of ECCENTRICITIES) {
      const areas = sweptAreas(1, e, 360)
      const max = Math.max(...areas)
      const min = Math.min(...areas)
      // 三角形近似扇形，误差随段数按 O(1/n^2) 缩小，段数够大时面积近似相等
      expect((max - min) / max).toBeLessThan(0.01)
    }
  })

  it('近日点走得快、远日点走得慢（等时步长下弧长不同）', () => {
    const a = 1
    const e = 0.7
    const near1 = positionAtTime(a, e, 0)
    const near2 = positionAtTime(a, e, 0.02)
    const far1 = positionAtTime(a, e, 0.5)
    const far2 = positionAtTime(a, e, 0.52)
    const dNear = Math.hypot(near2.x - near1.x, near2.y - near1.y)
    const dFar = Math.hypot(far2.x - far1.x, far2.y - far1.y)
    expect(dNear).toBeGreaterThan(dFar)
  })

  it('focusX = a*e，圆轨道时焦点在中心', () => {
    expect(focusX(2, 0)).toBe(0)
    expect(focusX(2, 0.5)).toBeCloseTo(1, 10)
  })
})
