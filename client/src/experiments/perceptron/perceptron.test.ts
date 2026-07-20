import { describe, it, expect } from 'vitest'
import {
  generateDataset,
  predict,
  perceptronStep,
  trainPerceptron,
  accuracy,
  LEARNING_RATE,
  DATASETS,
  type Boundary,
} from './perceptron'

describe('感知机', () => {
  it('generateDataset 生成指定数量的两类点，坐标在范围内', () => {
    const pts = generateDataset(40, 5)
    expect(pts.length).toBe(40)
    for (const p of pts) {
      expect(p.x).toBeGreaterThanOrEqual(0)
      expect(p.x).toBeLessThanOrEqual(1)
      expect(p.y).toBeGreaterThanOrEqual(0)
      expect(p.y).toBeLessThanOrEqual(1)
      expect([1, -1]).toContain(p.label)
    }
    // 两类都存在
    expect(pts.some((p) => p.label === 1)).toBe(true)
    expect(pts.some((p) => p.label === -1)).toBe(true)
  })

  it('generateDataset 同种子可复现，不同种子不同', () => {
    expect(generateDataset(20, 42)).toEqual(generateDataset(20, 42))
    expect(generateDataset(20, 42)).not.toEqual(generateDataset(20, 99))
  })

  it('perceptronStep 对误分类点更新权重，对正确点不动', () => {
    const b: Boundary = { w0: 0, w1: 0, b: 0 }
    // 激活为 0，label=1 时 label*act<=0 视为误分类，应更新
    const wrong = perceptronStep(b, { x: 0.5, y: 0.5, label: 1 })
    expect(wrong.updated).toBe(true)
    expect(wrong.boundary.w0).toBeCloseTo(LEARNING_RATE * 0.5)
    expect(wrong.boundary.b).toBeCloseTo(LEARNING_RATE)
    // 已正确分类的点不再更新
    const right = perceptronStep(wrong.boundary, { x: 0.5, y: 0.5, label: 1 })
    expect(right.updated).toBe(false)
    expect(right.boundary).toEqual(wrong.boundary)
  })

  it('predict 依据符号返回 +1/-1', () => {
    const b: Boundary = { w0: 1, w1: 0, b: -0.5 }
    expect(predict(b, { x: 1, y: 0, label: 1 })).toBe(1)
    expect(predict(b, { x: 0, y: 0, label: -1 })).toBe(-1)
  })

  it('trainPerceptron 在线性可分数据上收敛到 100% 正确率', () => {
    const pts = generateDataset(40, 7)
    const history = trainPerceptron(pts)
    expect(history.length).toBeGreaterThan(1)
    const final = history[history.length - 1]
    expect(accuracy(final, pts)).toBe(1)
  })

  it('DATASETS 每个预设都能训练收敛', () => {
    for (const d of DATASETS) {
      const pts = generateDataset(d.count, d.seed)
      const history = trainPerceptron(pts)
      expect(accuracy(history[history.length - 1], pts)).toBe(1)
    }
  })
})
