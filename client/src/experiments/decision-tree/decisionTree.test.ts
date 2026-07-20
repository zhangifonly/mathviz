import { describe, it, expect } from 'vitest'
import { entropy, infoGain, buildTree, classify, DATASET, MAX_DEPTH, type Point } from './decisionTree'

describe('决策树', () => {
  it('纯净集合熵为 0，均匀二分熵为 1', () => {
    expect(entropy([1, 1, 1])).toBe(0)
    expect(entropy([])).toBe(0)
    expect(entropy([0, 1])).toBeCloseTo(1, 6)
    expect(entropy([0, 0, 1, 1])).toBeCloseTo(1, 6)
  })

  it('完美分裂的信息增益等于父熵', () => {
    const pts: Point[] = [
      { x: 0, y: 0, label: 0 },
      { x: 0.1, y: 0, label: 0 },
      { x: 1, y: 0, label: 1 },
      { x: 0.9, y: 0, label: 1 },
    ]
    expect(infoGain(pts, 0, 0.5)).toBeCloseTo(1, 6)
  })

  it('无法分开时信息增益为 0', () => {
    const pts: Point[] = [
      { x: 0, y: 0, label: 0 },
      { x: 1, y: 0, label: 1 },
    ]
    // 阈值把两点分到同一侧 -> 无有效分裂
    expect(infoGain(pts, 0, 2)).toBe(0)
    expect(infoGain(pts, 1, 0.5)).toBe(0)
  })

  it('buildTree 对可分数据能完全分类正确', () => {
    const pts: Point[] = [
      { x: 0.1, y: 0.1, label: 0 },
      { x: 0.2, y: 0.15, label: 0 },
      { x: 0.9, y: 0.9, label: 1 },
      { x: 0.85, y: 0.8, label: 1 },
    ]
    const tree = buildTree(pts, 4)
    for (const p of pts) expect(classify(tree, p.x, p.y)).toBe(p.label)
  })

  it('maxDepth=0 直接得到多数类叶子', () => {
    const pts: Point[] = [
      { x: 0, y: 0, label: 0 },
      { x: 1, y: 1, label: 0 },
      { x: 0.5, y: 0.5, label: 1 },
    ]
    const tree = buildTree(pts, 0)
    expect(tree.leaf).toBe(true)
    if (tree.leaf) expect(tree.label).toBe(0)
  })

  it('DATASET 训练精度随深度增加而不下降', () => {
    const acc = (d: number) => {
      const t = buildTree(DATASET, d)
      const ok = DATASET.filter((p) => classify(t, p.x, p.y) === p.label).length
      return ok / DATASET.length
    }
    expect(DATASET.length).toBe(64)
    expect(MAX_DEPTH).toBe(4)
    expect(acc(1)).toBeGreaterThanOrEqual(0.5)
    expect(acc(4)).toBeGreaterThanOrEqual(acc(1))
  })
})
