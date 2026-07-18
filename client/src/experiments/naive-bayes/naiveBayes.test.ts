import { describe, it, expect } from 'vitest'
import { makeDataset, gaussianPdf, fit, classify, DATASETS } from './naiveBayes'

describe('高斯朴素贝叶斯', () => {
  it('makeDataset 生成两类各 n 个点，标签为 0/1', () => {
    const data = makeDataset(30, 1)
    expect(data.length).toBe(60)
    expect(data.filter((p) => p.label === 0).length).toBe(30)
    expect(data.filter((p) => p.label === 1).length).toBe(30)
    for (const p of data) {
      expect(p.label === 0 || p.label === 1).toBe(true)
      expect(Number.isFinite(p.x)).toBe(true)
      expect(Number.isFinite(p.y)).toBe(true)
    }
  })

  it('makeDataset 同种子可复现，不同种子不同', () => {
    expect(makeDataset(20, 42)).toEqual(makeDataset(20, 42))
    expect(makeDataset(20, 42)).not.toEqual(makeDataset(20, 7))
  })

  it('gaussianPdf 在均值处取峰值，且非负', () => {
    const peak = gaussianPdf(0, 0, 1)
    expect(peak).toBeGreaterThan(gaussianPdf(1, 0, 1))
    expect(peak).toBeGreaterThan(gaussianPdf(-2, 0, 1))
    expect(gaussianPdf(3, 0, 1)).toBeGreaterThanOrEqual(0)
    // 标准正态峰值 ≈ 0.3989
    expect(peak).toBeCloseTo(1 / Math.sqrt(2 * Math.PI), 4)
  })

  it('fit 估计两类模型，先验之和为 1，方差为正', () => {
    const models = fit(makeDataset(40, 3))
    expect(models.length).toBe(2)
    expect(models[0].prior + models[1].prior).toBeCloseTo(1, 6)
    for (const m of models) {
      expect(m.varX).toBeGreaterThan(0)
      expect(m.varY).toBeGreaterThan(0)
    }
    // 类 0 中心应低于类 1 中心
    expect(models[0].meanX).toBeLessThan(models[1].meanX)
  })

  it('classify 对靠近各类中心的点分类正确', () => {
    const train = makeDataset(80, 5)
    expect(classify(train, 2.2, 2.4)).toBe(0)
    expect(classify(train, 3.8, 3.6)).toBe(1)
  })

  it('DATASETS 每个规模都能训练并分类', () => {
    for (const n of DATASETS) {
      const train = makeDataset(n, 1)
      expect(train.length).toBe(n * 2)
      const label = classify(train, 3, 3)
      expect(label === 0 || label === 1).toBe(true)
    }
  })
})
