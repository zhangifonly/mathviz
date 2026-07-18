import { describe, it, expect } from 'vitest'
import {
  logNormalPdf,
  logLikelihood,
  mleMu,
  likelihoodCurve,
  gridSearchMle,
  DATASETS,
} from './maxLikelihood'

describe('最大似然估计', () => {
  it('logNormalPdf 在均值处密度最大', () => {
    const atMean = logNormalPdf(5, 5, 1)
    const offMean = logNormalPdf(7, 5, 1)
    expect(atMean).toBeGreaterThan(offMean)
  })

  it('logNormalPdf 关于均值对称', () => {
    const left = logNormalPdf(3, 5, 1.5)
    const right = logNormalPdf(7, 5, 1.5)
    expect(left).toBeCloseTo(right, 10)
  })

  it('mleMu 等于样本均值', () => {
    const data = [2, 4, 6, 8]
    expect(mleMu(data)).toBeCloseTo(5, 10)
    expect(mleMu([])).toBe(0)
  })

  it('logLikelihood 在样本均值处取得最大（对比其他 mu）', () => {
    const data = DATASETS[0].values
    const best = mleMu(data)
    const llBest = logLikelihood(data, best, 1)
    expect(logLikelihood(data, best - 1, 1)).toBeLessThan(llBest)
    expect(logLikelihood(data, best + 1, 1)).toBeLessThan(llBest)
  })

  it('gridSearchMle 逼近闭式解样本均值', () => {
    for (const ds of DATASETS) {
      const closed = mleMu(ds.values)
      const grid = gridSearchMle(ds.values, 1, closed - 3, closed + 3, 600)
      expect(grid).toBeCloseTo(closed, 1)
    }
  })

  it('likelihoodCurve 长度与端点正确', () => {
    const curve = likelihoodCurve([1, 2, 3], 1, 0, 4, 40)
    expect(curve.length).toBe(41)
    expect(curve[0].mu).toBeCloseTo(0, 10)
    expect(curve[curve.length - 1].mu).toBeCloseTo(4, 10)
  })

  it('曲线峰值出现在样本均值附近', () => {
    const data = DATASETS[1].values
    const mean = mleMu(data)
    const curve = likelihoodCurve(data, 1, mean - 3, mean + 3, 300)
    let peak = curve[0]
    for (const p of curve) if (p.ll > peak.ll) peak = p
    expect(peak.mu).toBeCloseTo(mean, 1)
  })
})
