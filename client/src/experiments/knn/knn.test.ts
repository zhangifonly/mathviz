import { describe, it, expect } from 'vitest'
import {
  dist2,
  nearestK,
  classify,
  makeDataset,
  K_VALUES,
  DATASETS,
  type LabeledPoint,
} from './knn'

describe('K 近邻分类', () => {
  const simple: LabeledPoint[] = [
    { x: 0, y: 0, label: 0 },
    { x: 1, y: 0, label: 0 },
    { x: 10, y: 0, label: 1 },
    { x: 11, y: 0, label: 1 },
  ]

  it('dist2 计算平方欧氏距离', () => {
    expect(dist2(0, 0, 3, 4)).toBe(25)
    expect(dist2(2, 2, 2, 2)).toBe(0)
  })

  it('nearestK 返回最近的 k 个下标且按距离升序', () => {
    const idx = nearestK(simple, 0.2, 0, 2)
    expect(idx.length).toBe(2)
    expect(idx[0]).toBe(0)
    expect(idx).toContain(1)
  })

  it('nearestK 的 k 超过样本数时被截断', () => {
    expect(nearestK(simple, 0, 0, 99).length).toBe(4)
  })

  it('classify 把靠近某簇的点判为该簇类别', () => {
    expect(classify(simple, 0.5, 0, 3)).toBe(0)
    expect(classify(simple, 10.5, 0, 3)).toBe(1)
  })

  it('classify k=1 时等于最近邻的类别', () => {
    expect(classify(simple, 9.6, 0, 1)).toBe(1)
    expect(classify(simple, 1.2, 0, 1)).toBe(0)
  })

  it('makeDataset 生成正确数量且 label 在范围内，可复现', () => {
    const a = makeDataset(3, 12, 600, 480, 5)
    const b = makeDataset(3, 12, 600, 480, 5)
    expect(a.length).toBe(36)
    expect(a).toEqual(b)
    for (const p of a) {
      expect(p.label).toBeGreaterThanOrEqual(0)
      expect(p.label).toBeLessThan(3)
    }
  })

  it('K_VALUES 与 DATASETS 常量可用', () => {
    expect(K_VALUES).toContain(3)
    for (const d of DATASETS) {
      const pts = makeDataset(d.classes, d.perClass, 600, 480, 1)
      expect(pts.length).toBe(d.classes * d.perClass)
    }
  })
})
