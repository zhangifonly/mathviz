import { describe, it, expect } from 'vitest'
import { makeRng, dropNeedle, simulate, piEstimate, NEEDLE_COUNTS } from './buffonNeedle'

describe('蒲丰投针', () => {
  it('makeRng 同种子可复现，不同种子不同', () => {
    const a = makeRng(42)
    const b = makeRng(42)
    const c = makeRng(99)
    expect(a()).toBe(b())
    expect(makeRng(42)()).not.toBe(c())
  })

  it('dropNeedle 端点关于中心对称，且落在指定范围', () => {
    const rand = makeRng(7)
    const nd = dropNeedle(rand, 600, 480, 60, 60)
    expect((nd.x1 + nd.x2) / 2).toBeCloseTo(nd.cx, 6)
    expect((nd.y1 + nd.y2) / 2).toBeCloseTo(nd.cy, 6)
    expect(nd.cx).toBeGreaterThanOrEqual(0)
    expect(nd.cx).toBeLessThanOrEqual(600)
    expect(nd.angle).toBeGreaterThanOrEqual(0)
    expect(nd.angle).toBeLessThanOrEqual(Math.PI)
  })

  it('相交判定：跨越网格线为真，同一带内为假', () => {
    // 竖直短针横跨 y=60 这条线
    expect(dropNeedle(() => 0.5, 120, 120, 60, 40).crosses).toBe(true)
    // 手工构造：中心在 (30,30)、水平针不跨线
    const flat = dropNeedle(makeSeq([30 / 120, 30 / 120, 0]), 120, 120, 60, 40)
    expect(flat.crosses).toBe(false)
  })

  it('simulate 返回针数与相交数一致，且相交数不超过总数', () => {
    const r = simulate(1000, 1)
    expect(r.total).toBe(1000)
    expect(r.needles.length).toBe(1000)
    expect(r.crossings).toBeGreaterThan(0)
    expect(r.crossings).toBeLessThanOrEqual(1000)
    expect(r.needles.filter((n) => n.crosses).length).toBe(r.crossings)
  })

  it('针长=线距时大样本估计接近 pi', () => {
    const r = simulate(20000, 12345, 600, 480, 60, 60)
    expect(r.piEstimate).toBeGreaterThan(2.9)
    expect(r.piEstimate).toBeLessThan(3.4)
  })

  it('piEstimate 公式正确，相交为 0 时返回 NaN', () => {
    // n=crossings 且 length=spacing 时 estimate=2
    expect(piEstimate(100, 100, 60, 60)).toBeCloseTo(2, 6)
    expect(Number.isNaN(piEstimate(100, 0))).toBe(true)
  })

  it('NEEDLE_COUNTS 各规模都能跑出结果', () => {
    for (const n of NEEDLE_COUNTS) {
      expect(simulate(n, 1).total).toBe(n)
    }
  })
})

/** 测试辅助：按序返回预设随机值 */
function makeSeq(vals: number[]): () => number {
  let i = 0
  return () => vals[i++ % vals.length]
}
