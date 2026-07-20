import { describe, it, expect } from 'vitest'
import {
  gaussianPdf, makeData, initParams, logLikelihood, emStep, fitEM,
  COMPONENTS, SEEDS,
} from './gaussianMixture'

describe('高斯混合模型 EM', () => {
  it('gaussianPdf 在均值处取峰值且积分归一', () => {
    expect(gaussianPdf(0, 0, 1)).toBeCloseTo(1 / Math.sqrt(2 * Math.PI), 6)
    expect(gaussianPdf(1, 0, 1)).toBeLessThan(gaussianPdf(0, 0, 1))
    let area = 0
    for (let x = -6; x <= 6; x += 0.01) area += gaussianPdf(x, 0, 1) * 0.01
    expect(area).toBeCloseTo(1, 2)
  })

  it('makeData 同种子可复现，数量正确', () => {
    const a = makeData(200, 42)
    const b = makeData(200, 42)
    const c = makeData(200, 99)
    expect(a.length).toBe(200)
    expect(a).toEqual(b)
    expect(a).not.toEqual(c)
  })

  it('initParams 生成 k 个分量，权重和为 1', () => {
    const p = initParams(makeData(100, 1), 3)
    expect(p.length).toBe(3)
    const wsum = p.reduce((s, c) => s + c.weight, 0)
    expect(wsum).toBeCloseTo(1, 6)
  })

  it('emStep 保持权重归一且不改变分量数', () => {
    const data = makeData(300, 7)
    const p0 = initParams(data, 3)
    const p1 = emStep(data, p0)
    expect(p1.length).toBe(3)
    const wsum = p1.reduce((s, c) => s + c.weight, 0)
    expect(wsum).toBeCloseTo(1, 6)
    for (const c of p1) expect(c.sigma).toBeGreaterThan(0)
  })

  it('EM 迭代使对数似然单调不减', () => {
    const data = makeData(400, 42)
    const hist = fitEM(data, 3)
    for (let i = 1; i < hist.length; i++) {
      expect(logLikelihood(data, hist[i])).toBeGreaterThanOrEqual(
        logLikelihood(data, hist[i - 1]) - 1e-6,
      )
    }
  })

  it('EM 能恢复三个真实簇的均值', () => {
    const data = makeData(1200, 42)
    const hist = fitEM(data, 3)
    const fitted = hist[hist.length - 1].map((c) => c.mu).sort((a, b) => a - b)
    const truth = COMPONENTS.map((c) => c.mu).sort((a, b) => a - b)
    for (let i = 0; i < 3; i++) expect(Math.abs(fitted[i] - truth[i])).toBeLessThan(1.0)
  })

  it('SEEDS 每个种子都能拟合出结果历史', () => {
    for (const s of SEEDS) {
      const hist = fitEM(makeData(200, s), 3)
      expect(hist.length).toBeGreaterThan(1)
    }
  })
})
