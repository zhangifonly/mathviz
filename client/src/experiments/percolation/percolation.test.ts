import { describe, it, expect } from 'vitest'
import {
  createRng,
  generateLattice,
  labelClusters,
  largestClusterSize,
  spanningClusterId,
  percolates,
  analyze,
  P_OPTIONS,
  P_C_SITE_SQUARE,
} from './percolation'

describe('渗流模型内核', () => {
  it('全开放点阵是一个簇且必然渗流', () => {
    const n = 6
    const grid = Array.from({ length: n }, () => Array.from({ length: n }, () => true))
    const res = labelClusters(grid)
    expect(res.count).toBe(1)
    expect(largestClusterSize(res)).toBe(n * n)
    expect(percolates(res)).toBe(true)
  })

  it('全关闭点阵没有簇也不渗流', () => {
    const n = 5
    const grid = Array.from({ length: n }, () => Array.from({ length: n }, () => false))
    const res = labelClusters(grid)
    expect(res.count).toBe(0)
    expect(largestClusterSize(res)).toBe(0)
    expect(percolates(res)).toBe(false)
    expect(spanningClusterId(res)).toBe(0)
  })

  it('四连通：对角相邻不算同一簇', () => {
    // 棋盘对角开放，应得到两个独立单点簇
    const grid = [
      [true, false],
      [false, true],
    ]
    const res = labelClusters(grid)
    expect(res.count).toBe(2)
    expect(largestClusterSize(res)).toBe(1)
    expect(percolates(res)).toBe(false)
  })

  it('单列贯穿：一整列开放即发生渗流', () => {
    const n = 4
    const grid = Array.from({ length: n }, () => Array.from({ length: n }, () => false))
    for (let i = 0; i < n; i++) grid[i][0] = true
    const res = labelClusters(grid)
    expect(res.count).toBe(1)
    expect(largestClusterSize(res)).toBe(n)
    expect(percolates(res)).toBe(true)
  })

  it('簇大小之和等于开放格点数', () => {
    const rng = createRng(12345)
    const grid = generateLattice(20, 0.6, rng)
    const res = labelClusters(grid)
    let openCount = 0
    for (const row of grid) for (const v of row) if (v) openCount++
    const sum = res.sizes.reduce((a, b) => a + b, 0)
    expect(sum).toBe(openCount)
  })

  it('createRng 相同种子可复现', () => {
    const a = createRng(999)
    const b = createRng(999)
    for (let i = 0; i < 50; i++) expect(a()).toBe(b())
  })

  it('generateLattice 的开放比例在概率 p 附近', () => {
    const rng = createRng(2026)
    const grid = generateLattice(60, 0.3, rng)
    let open = 0
    for (const row of grid) for (const v of row) if (v) open++
    const frac = open / (60 * 60)
    expect(Math.abs(frac - 0.3)).toBeLessThan(0.05)
  })

  it('analyze 汇总字段自洽', () => {
    const rng = createRng(7)
    const grid = generateLattice(30, 0.7, rng)
    const stats = analyze(grid, 0.7)
    expect(stats.size).toBe(30)
    expect(stats.openFraction).toBeCloseTo(stats.openCount / 900, 10)
    expect(stats.largest).toBeLessThanOrEqual(stats.openCount)
    expect(stats.percolates).toBe(stats.spanning > 0)
  })

  it('相变趋势：高 p 的最大簇占比远大于低 p', () => {
    const lowRng = createRng(101)
    const highRng = createRng(101)
    const low = analyze(generateLattice(50, 0.4, lowRng), 0.4)
    const high = analyze(generateLattice(50, 0.75, highRng), 0.75)
    expect(high.largestFraction).toBeGreaterThan(low.largestFraction)
    expect(high.percolates).toBe(true)
  })

  it('临界概率常量落在已知范围', () => {
    expect(P_C_SITE_SQUARE).toBeGreaterThan(0.59)
    expect(P_C_SITE_SQUARE).toBeLessThan(0.60)
  })

  it('P_OPTIONS 均为合法概率且递增', () => {
    expect(P_OPTIONS.length).toBeGreaterThanOrEqual(4)
    for (const o of P_OPTIONS) {
      expect(o.p).toBeGreaterThan(0)
      expect(o.p).toBeLessThan(1)
      expect(o.label.length).toBeGreaterThan(0)
    }
    for (let i = 1; i < P_OPTIONS.length; i++) {
      expect(P_OPTIONS[i].p).toBeGreaterThan(P_OPTIONS[i - 1].p)
    }
  })
})
