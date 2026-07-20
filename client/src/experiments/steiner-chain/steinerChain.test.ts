import { describe, it, expect } from 'vitest'
import {
  concentricChain,
  steinerChain,
  chainRatio,
  invertCircle,
  areTangent,
  CHAIN_COUNTS,
} from './steinerChain'

describe('斯坦纳链', () => {
  it('concentricChain 生成 n 个圆，内圆半径符合闭合条件', () => {
    const n = 6
    const chain = concentricChain(n, 1)
    expect(chain.circles.length).toBe(n)
    const s = Math.sin(Math.PI / n)
    expect(chain.inner.r).toBeCloseTo((1 - s) / (1 + s), 10)
    expect(chain.outer.r).toBe(1)
  })

  it('同心链每个链圆都同时内切外圆、外切内圆', () => {
    const chain = concentricChain(8, 1)
    for (const c of chain.circles) {
      const dOuter = Math.hypot(c.x, c.y)
      const dInner = Math.hypot(c.x, c.y)
      expect(dOuter + c.r).toBeCloseTo(chain.outer.r, 8) // 内切外圆
      expect(dInner - c.r).toBeCloseTo(chain.inner.r, 8) // 外切内圆
    }
  })

  it('同心链相邻圆两两外切（首尾闭合）', () => {
    const n = 5
    const chain = concentricChain(n, 1)
    for (let i = 0; i < n; i++) {
      expect(areTangent(chain.circles[i], chain.circles[(i + 1) % n], 1e-6)).toBe(true)
    }
  })

  it('chainRatio 随 n 增大而增大且落在 (0,1)', () => {
    const r5 = chainRatio(5)
    const r8 = chainRatio(8)
    expect(r5).toBeGreaterThan(0)
    expect(r8).toBeLessThan(1)
    expect(r8).toBeGreaterThan(r5)
  })

  it('invertCircle 自反：反演两次回到原圆', () => {
    const c = { x: 3, y: 1, r: 0.5 }
    const once = invertCircle(c, 5, 0, 2)
    const twice = invertCircle(once, 5, 0, 2)
    expect(twice.x).toBeCloseTo(c.x, 6)
    expect(twice.y).toBeCloseTo(c.y, 6)
    expect(twice.r).toBeCloseTo(c.r, 6)
  })

  it('steinerChain 反演后仍保持相邻相切（斯坦纳定理）', () => {
    const n = 6
    const chain = steinerChain(n, 0.7)
    expect(chain.circles.length).toBe(n)
    for (let i = 0; i < n; i++) {
      const a = chain.circles[i]
      const b = chain.circles[(i + 1) % n]
      const d = Math.hypot(a.x - b.x, a.y - b.y)
      expect(Math.abs(d - (a.r + b.r))).toBeLessThan(1e-4 * (a.r + b.r))
    }
  })

  it('CHAIN_COUNTS 都能生成有效链', () => {
    for (const n of CHAIN_COUNTS) {
      expect(concentricChain(n, 1).circles.length).toBe(n)
      expect(steinerChain(n, 0).circles.length).toBe(n)
    }
  })
})
