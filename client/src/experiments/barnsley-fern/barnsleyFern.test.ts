import { describe, it, expect } from 'vitest'
import {
  FERN_TRANSFORMS,
  applyTransform,
  pickTransform,
  generateFern,
  POINT_COUNTS,
} from './barnsleyFern'

describe('巴恩斯利蕨', () => {
  it('4 个变换的概率之和为 1', () => {
    const sum = FERN_TRANSFORMS.reduce((acc, t) => acc + t.p, 0)
    expect(sum).toBeCloseTo(1, 10)
  })

  it('applyTransform: 茎变换把点压到 y 轴上', () => {
    const stem = FERN_TRANSFORMS[0]
    const r = applyTransform(stem, 3, 5)
    expect(r.x).toBe(0)
    expect(r.y).toBeCloseTo(0.16 * 5, 10)
  })

  it('pickTransform: rand=0 选中第 0 个，rand≈1 选中最后一个', () => {
    expect(pickTransform(FERN_TRANSFORMS, 0)).toBe(0)
    expect(pickTransform(FERN_TRANSFORMS, 0.999999)).toBe(3)
    // 0.01 落入主叶 (0.01..0.86)
    expect(pickTransform(FERN_TRANSFORMS, 0.5)).toBe(1)
  })

  it('generateFern 生成指定数量的点，且落在蕨类包围盒内', () => {
    const pts = generateFern(10000, 1)
    expect(pts.length).toBe(10000)
    for (const p of pts) {
      expect(p.x).toBeGreaterThanOrEqual(-3)
      expect(p.x).toBeLessThanOrEqual(3)
      expect(p.y).toBeGreaterThanOrEqual(0)
      expect(p.y).toBeLessThanOrEqual(11)
      expect(p.kind).toBeGreaterThanOrEqual(0)
      expect(p.kind).toBeLessThanOrEqual(3)
    }
  })

  it('generateFern 同种子可复现，不同种子不同', () => {
    const a = generateFern(500, 42)
    const b = generateFern(500, 42)
    const c = generateFern(500, 99)
    expect(a).toEqual(b)
    expect(a).not.toEqual(c)
  })

  it('POINT_COUNTS 都能正常生成', () => {
    for (const n of POINT_COUNTS) {
      expect(generateFern(n, 1).length).toBe(n)
    }
  })
})
