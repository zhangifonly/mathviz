import { describe, it, expect } from 'vitest'
import { mobius, kleinBottle, torus, antOnMobius, buildSurface, SURFACE_INFO } from './surfaces'

describe('拓扑曲面参数方程', () => {
  it('mobius 生成正确尺寸的网格且全为有限值', () => {
    const s = mobius(40, 10)
    expect(s.x.length).toBe(41)
    expect(s.x[0].length).toBe(11)
    for (const row of s.z) for (const z of row) expect(Number.isFinite(z)).toBe(true)
  })

  it('mobius 中线 (v=0) 是单位圆：到原点距离恒为 1', () => {
    const s = mobius(60, 2, 0.4) // v 取 -0.4, 0, 0.4，中间一列是 v=0
    const mid = 1
    for (let i = 0; i < s.x.length; i++) {
      const r = Math.hypot(s.x[i][mid], s.y[i][mid])
      expect(r).toBeCloseTo(1, 6)
    }
  })

  it('mobius 起点与终点 (u=0 vs u=2π) 中线重合', () => {
    const s = mobius(60, 2)
    const mid = 1
    expect(s.x[0][mid]).toBeCloseTo(s.x[60][mid], 6)
    expect(s.y[0][mid]).toBeCloseTo(s.y[60][mid], 6)
  })

  it('kleinBottle 与 torus 网格全为有限值', () => {
    for (const s of [kleinBottle(30, 30), torus(30, 20)]) {
      for (const row of s.z) for (const z of row) expect(Number.isFinite(z)).toBe(true)
    }
  })

  it('antOnMobius: 走两圈(t=1)回到起点，走一圈(t=0.5)在另一面', () => {
    const start = antOnMobius(0)
    const half = antOnMobius(0.5)
    const full = antOnMobius(1)
    expect(Math.hypot(full[0] - start[0], full[1] - start[1], full[2] - start[2])).toBeCloseTo(0, 4)
    const distHalf = Math.hypot(half[0] - start[0], half[1] - start[1], half[2] - start[2])
    expect(distHalf).toBeGreaterThan(0.05)
  })

  it('buildSurface 按 kind 分发，SURFACE_INFO 覆盖全部三种', () => {
    expect(buildSurface('mobius').x.length).toBeGreaterThan(0)
    expect(buildSurface('klein').x.length).toBeGreaterThan(0)
    expect(buildSurface('torus').x.length).toBeGreaterThan(0)
    expect(SURFACE_INFO.map(s => s.kind).sort()).toEqual(['klein', 'mobius', 'torus'])
  })
})
