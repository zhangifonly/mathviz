import { describe, it, expect } from 'vitest'
import {
  escapeTime,
  normEscape,
  VIEW_REGIONS,
  MAX_ITERS,
  ESCAPE_R2,
} from './burningShip'

describe('燃烧船分形', () => {
  it('原点 c=0 永不逃逸，返回 maxIter', () => {
    // z 始终为 0，绝对值平方仍是 0，不会逃逸
    expect(escapeTime(0, 0, 100)).toBe(100)
  })

  it('远处的点很快逃逸，迭代数较小', () => {
    const t = escapeTime(3, 3, 100)
    expect(t).toBeGreaterThanOrEqual(0)
    expect(t).toBeLessThan(5)
  })

  it('逃逸时间落在 [0, maxIter] 区间内', () => {
    const maxIter = 80
    for (let gx = -2; gx <= 1; gx += 0.5) {
      for (let gy = -2; gy <= 1; gy += 0.5) {
        const t = escapeTime(gx, gy, maxIter)
        expect(t).toBeGreaterThanOrEqual(0)
        expect(t).toBeLessThanOrEqual(maxIter)
      }
    }
  })

  it('绝对值变体：对称点 (cx, cy) 与 (cx, -cy) 逃逸时间可不同', () => {
    // 取绝对值破坏了关于实轴的对称性，与曼德博不同
    const a = escapeTime(-1.75, 0.05, 200)
    const b = escapeTime(-1.75, -0.05, 200)
    expect(typeof a).toBe('number')
    expect(typeof b).toBe('number')
    // 至少验证公式确实在跑（其一在集合内、其一逃逸，通常不相等）
    expect(a === b && a < 200).toBe(false)
  })

  it('normEscape 归一化到 [0,1]，达到 maxIter 记为 1', () => {
    expect(normEscape(200, 200)).toBe(1)
    expect(normEscape(0, 200)).toBe(0)
    expect(normEscape(100, 200)).toBeCloseTo(0.5, 5)
  })

  it('VIEW_REGIONS 与 MAX_ITERS 常量结构正确', () => {
    expect(ESCAPE_R2).toBe(4)
    expect(VIEW_REGIONS.length).toBeGreaterThanOrEqual(2)
    for (const r of VIEW_REGIONS) {
      expect(typeof r.name).toBe('string')
      expect(r.scale).toBeGreaterThan(0)
    }
    expect(MAX_ITERS.every((m) => m > 0)).toBe(true)
  })
})
