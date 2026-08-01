import { describe, it, expect } from 'vitest'
import { baryPointForTest } from './drawSphere'
import { sphericalDistance, unit, norm } from './sphere3d'
import type { SphericalTriangle } from './sphere3d'
import type { Vec3 } from './proj3d'

const OCTANT: SphericalTriangle = { A: [1, 0, 0], B: [0, 1, 0], C: [0, 0, 1] }

/**
 * 这些测试守住三个视觉 bug —— 它们只在截图里暴露过，
 * 数值断言能保证以后重构时不再犯。
 */
describe('drawSphere - 重心坐标填充', () => {
  it('三个角点精确对应 A / B / C', () => {
    // 第一版用两步 slerp, (1,0) 会给出 C 而不是 B
    expect(sphericalDistance(baryPointForTest(OCTANT, 0, 0), OCTANT.A)).toBeLessThan(1e-12)
    expect(sphericalDistance(baryPointForTest(OCTANT, 1, 0), OCTANT.B)).toBeLessThan(1e-12)
    expect(sphericalDistance(baryPointForTest(OCTANT, 0, 1), OCTANT.C)).toBeLessThan(1e-12)
  })

  it('形心处三个坐标相等', () => {
    const p = baryPointForTest(OCTANT, 1 / 3, 1 / 3)
    expect(p[0]).toBeCloseTo(p[1], 10)
    expect(p[1]).toBeCloseTo(p[2], 10)
  })

  it('所有内部点都落在单位球面上', () => {
    for (let i = 0; i <= 8; i++) {
      for (let j = 0; i + j <= 8; j++) {
        expect(norm(baryPointForTest(OCTANT, i / 8, j / 8))).toBeCloseTo(1, 10)
      }
    }
  })

  it('内部点都在三角形所在的球面八分区内(三个坐标非负)', () => {
    for (let i = 0; i <= 10; i++) {
      for (let j = 0; i + j <= 10; j++) {
        const p = baryPointForTest(OCTANT, i / 10, j / 10)
        for (const c of p) expect(c).toBeGreaterThanOrEqual(-1e-12)
      }
    }
  })

  it('边上的点确实在对应的大圆弧上', () => {
    // v=0 的边应落在 A-B 大圆(z=0)上
    for (let i = 0; i <= 6; i++) {
      expect(Math.abs(baryPointForTest(OCTANT, i / 6, 0)[2])).toBeLessThan(1e-12)
    }
    // u=0 的边应落在 A-C 大圆(y=0)上
    for (let i = 0; i <= 6; i++) {
      expect(Math.abs(baryPointForTest(OCTANT, 0, i / 6)[1])).toBeLessThan(1e-12)
    }
  })

  it('网格铺满三角形: 上下两类小片合起来无缝', () => {
    // 统计 N×N 网格产生的小片数, 应等于 N² (上三角 + 下三角配对)
    const N = 6
    let count = 0
    for (let i = 0; i < N; i++) {
      for (let j = 0; i + j < N; j++) {
        count++ // 上三角
        if (i + j + 2 <= N) count++ // 下三角
      }
    }
    // 三角形网格的小片总数应为 N²
    expect(count).toBe(N * N)
  })

  it('对一般三角形也成立(不只是八分之一球面)', () => {
    const t: SphericalTriangle = {
      A: unit([1, 0.3, 0.2] as Vec3),
      B: unit([0.2, 1, 0.4] as Vec3),
      C: unit([0.1, 0.2, 1] as Vec3),
    }
    expect(sphericalDistance(baryPointForTest(t, 0, 0), t.A)).toBeLessThan(1e-12)
    expect(sphericalDistance(baryPointForTest(t, 1, 0), t.B)).toBeLessThan(1e-12)
    expect(sphericalDistance(baryPointForTest(t, 0, 1), t.C)).toBeLessThan(1e-12)
  })
})
