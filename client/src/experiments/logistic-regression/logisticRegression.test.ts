import { describe, it, expect } from 'vitest'
import {
  sigmoid, predict, logLoss, train,
  DATASET, LEARNING_RATE, EPOCH_STOPS, type Weights,
} from './logisticRegression'

describe('逻辑回归', () => {
  it('sigmoid: 0 处为 0.5，两端趋于 0 和 1，单调递增', () => {
    expect(sigmoid(0)).toBeCloseTo(0.5, 10)
    expect(sigmoid(-20)).toBeLessThan(0.001)
    expect(sigmoid(20)).toBeGreaterThan(0.999)
    expect(sigmoid(1)).toBeGreaterThan(sigmoid(-1))
  })

  it('predict: 权重全 0 时任意点概率为 0.5', () => {
    const w: Weights = [0, 0, 0]
    expect(predict(w, { x: 3, y: -2 })).toBeCloseTo(0.5, 10)
  })

  it('DATASET 两类各 10 个，标签只含 0 和 1', () => {
    expect(DATASET.points.length).toBe(20)
    expect(DATASET.labels.length).toBe(20)
    expect(DATASET.labels.filter((l) => l === 1).length).toBe(10)
    expect(DATASET.labels.every((l) => l === 0 || l === 1)).toBe(true)
  })

  it('logLoss: 权重全 0 时损失约为 ln2', () => {
    const loss = logLoss([0, 0, 0], DATASET.points, DATASET.labels)
    expect(loss).toBeCloseTo(Math.log(2), 3)
  })

  it('train: 返回 epochs+1 步，损失整体下降', () => {
    const h = train(DATASET.points, DATASET.labels, LEARNING_RATE, 150)
    expect(h.length).toBe(151)
    expect(h[h.length - 1].loss).toBeLessThan(h[0].loss)
    expect(h[h.length - 1].loss).toBeLessThan(0.1)
  })

  it('train: 训练后能正确分开两类（概率越过 0.5）', () => {
    const h = train(DATASET.points, DATASET.labels, LEARNING_RATE, 150)
    const w = h[h.length - 1].weights
    expect(predict(w, { x: -3, y: -3 })).toBeLessThan(0.5)
    expect(predict(w, { x: 3, y: 3 })).toBeGreaterThan(0.5)
  })

  it('EPOCH_STOPS 均为非负整数且递增', () => {
    for (let i = 1; i < EPOCH_STOPS.length; i++) {
      expect(EPOCH_STOPS[i]).toBeGreaterThan(EPOCH_STOPS[i - 1])
      expect(Number.isInteger(EPOCH_STOPS[i])).toBe(true)
    }
  })
})
