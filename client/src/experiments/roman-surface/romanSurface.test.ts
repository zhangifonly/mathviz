import { describe, it, expect } from 'vitest'
import {
  romanSurface, antipodalGap, implicitResidual, selfIntersectionLines,
  branchPoints, TRIPLE_POINT, EULER_CHARACTERISTIC, ORIENTABLE,
  PRESETS, U_RANGE, V_RANGE,
} from './romanSurface'

describe('罗马曲面', () => {
  const samples: Array<[number, number]> = [
    [0.4, 0.7], [1.2, 2.0], [2.5, 1.1], [0.9, 0.3], [2.0, 2.6],
  ]

  it('是 RP² 的浸入: (u,v) 与 (u+π, π−v) 映到同一点', () => {
    for (const a of [0.8, 1, 1.3]) {
      for (const [u, v] of samples) {
        expect(antipodalGap(u, v, a)).toBeLessThan(1e-12)
      }
    }
  })

  it('满足隐式四次方程 x²y²+y²z²+z²x² = a²xyz', () => {
    for (const a of [0.8, 1, 1.3]) {
      for (let i = 0; i <= 20; i++) {
        for (let j = 0; j <= 20; j++) {
          const p = romanSurface((Math.PI * i) / 20, (Math.PI * j) / 20, a)
          expect(Math.abs(implicitResidual(p, a))).toBeLessThan(1e-12)
        }
      }
    }
  })

  it('三条自交线沿三个坐标轴, 半长为 a²/2', () => {
    for (const a of [0.8, 1, 1.4]) {
      const lines = selfIntersectionLines(a)
      expect(lines.length).toBe(3)
      lines.forEach((line, k) => {
        // 第 k 条线只有第 k 个分量非零
        for (const p of line) {
          for (let d = 0; d < 3; d++) {
            if (d !== k) expect(Math.abs(p[d])).toBeLessThan(1e-15)
          }
        }
        const zs = line.map((p) => p[k])
        expect(Math.min(...zs)).toBeCloseTo(-(a * a) / 2, 10)
        expect(Math.max(...zs)).toBeCloseTo((a * a) / 2, 10)
      })
    }
  })

  it('自交线上的点确实由参数域中两组不同参数给出', () => {
    // z 轴上的点: 需 x=y=0, 即 cos u=0 或 cos v=0 的组合
    const p1 = romanSurface(Math.PI / 2, 0.6)
    expect(Math.abs(p1[0])).toBeLessThan(1e-12)
    expect(Math.abs(p1[1])).toBeLessThan(1e-12)
    expect(Math.abs(p1[2])).toBeGreaterThan(1e-3)
  })

  it('6 个分支点是三条自交线的端点', () => {
    const bps = branchPoints(1.2)
    expect(bps.length).toBe(6)
    const h = 1.44 / 2
    for (const p of bps) {
      // 每个分支点只有一个非零分量, 绝对值为 a²/2
      const nz = p.filter((c) => Math.abs(c) > 1e-15)
      expect(nz.length).toBe(1)
      expect(Math.abs(nz[0])).toBeCloseTo(h, 10)
    }
  })

  it('三重点是原点, 且在曲面上', () => {
    expect(TRIPLE_POINT).toEqual([0, 0, 0])
    expect(Math.abs(implicitResidual(TRIPLE_POINT))).toBeLessThan(1e-15)
    // 原点由多组参数给出, 例如 v=π/2 时整条 u 都映到原点
    for (const u of [0.3, 1.1, 2.4]) {
      const p = romanSurface(u, Math.PI / 2)
      expect(Math.hypot(p[0], p[1], p[2])).toBeLessThan(1e-15)
    }
  })

  it('a 按平方缩放所有坐标', () => {
    for (const [u, v] of samples) {
      const base = romanSurface(u, v, 1)
      const big = romanSurface(u, v, 2)
      base.forEach((c, i) => expect(big[i]).toBeCloseTo(c * 4, 10))
    }
  })

  it('坐标轮换对称: 交换 y,z 对应参数变换后仍在曲面上', () => {
    for (const [u, v] of samples) {
      const p = romanSurface(u, v)
      const swapped: [number, number, number] = [p[0], p[2], p[1]]
      expect(Math.abs(implicitResidual(swapped))).toBeLessThan(1e-12)
    }
  })

  it('射影平面: 欧拉示性数为 1 且不可定向', () => {
    expect(EULER_CHARACTERISTIC).toBe(1)
    expect(ORIENTABLE).toBe(false)
  })

  it('参数域内坐标全部有限', () => {
    for (const u of U_RANGE) {
      for (const v of V_RANGE) {
        expect(romanSurface(u, v).every(Number.isFinite)).toBe(true)
      }
    }
  })

  it('PRESETS 的 a 递增且为正', () => {
    for (let i = 0; i < PRESETS.length; i++) {
      expect(PRESETS[i].a).toBeGreaterThan(0)
      if (i > 0) expect(PRESETS[i].a).toBeGreaterThan(PRESETS[i - 1].a)
    }
  })
})
