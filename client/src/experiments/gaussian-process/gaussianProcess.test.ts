import { describe, it, expect } from 'vitest'
import {
  rbfKernel,
  covarianceMatrix,
  cholesky,
  gpPosterior,
  KERNEL_OPTIONS,
  type KernelOptions,
} from './gaussianProcess'

const OPT: KernelOptions = { lengthScale: 1, signalVar: 1 }

describe('高斯过程回归', () => {
  it('RBF 核：同点取到 signalVar，距离越大值越小', () => {
    expect(rbfKernel(2, 2, OPT)).toBeCloseTo(1, 10)
    expect(rbfKernel(0, 1, OPT)).toBeLessThan(rbfKernel(0, 0.5, OPT))
    expect(rbfKernel(0, 5, OPT)).toBeGreaterThan(0)
  })

  it('协方差矩阵对称且对角为 signalVar', () => {
    const K = covarianceMatrix([0, 1, 2], { lengthScale: 1.2, signalVar: 2 })
    for (let i = 0; i < 3; i++) {
      expect(K[i][i]).toBeCloseTo(2, 10)
      for (let j = 0; j < 3; j++) expect(K[i][j]).toBeCloseTo(K[j][i], 12)
    }
  })

  it('Cholesky 分解满足 L·Lᵀ = A', () => {
    const A = covarianceMatrix([0, 1, 2, 3], OPT).map((r, i) =>
      r.map((v, j) => (i === j ? v + 1e-6 : v)),
    )
    const L = cholesky(A)
    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 4; j++) {
        let s = 0
        for (let k = 0; k < 4; k++) s += L[i][k] * L[j][k]
        expect(s).toBeCloseTo(A[i][j], 8)
      }
    // L 是下三角：上三角部分为 0
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) expect(L[i][j]).toBe(0)
  })

  it('后验在训练点处（近似）插值到观测值', () => {
    const xt = [-2, 0, 2]
    const yt = [1, -1, 0.5]
    const post = gpPosterior(xt, yt, xt, OPT, 1e-8)
    for (let i = 0; i < xt.length; i++) expect(post.mean[i]).toBeCloseTo(yt[i], 3)
  })

  it('训练点处方差趋近 0，远处方差趋近先验 signalVar', () => {
    const post = gpPosterior([0], [1], [0, 100], OPT, 1e-8)
    expect(post.variance[0]).toBeCloseTo(0, 4)
    expect(post.variance[1]).toBeCloseTo(OPT.signalVar, 4)
    expect(post.variance[0]).toBeGreaterThanOrEqual(0)
    expect(post.variance[1]).toBeGreaterThanOrEqual(0)
  })

  it('无训练数据时后验退化为先验', () => {
    const post = gpPosterior([], [], [-1, 0, 1], { lengthScale: 1, signalVar: 3 })
    expect(post.mean).toEqual([0, 0, 0])
    for (const v of post.variance) expect(v).toBeCloseTo(3, 10)
  })

  it('KERNEL_OPTIONS 参数均有效且能产出有限后验', () => {
    for (const opt of KERNEL_OPTIONS) {
      expect(opt.lengthScale).toBeGreaterThan(0)
      expect(opt.signalVar).toBeGreaterThan(0)
      const post = gpPosterior([-1, 1], [0.5, -0.5], [-1, 0, 1], opt)
      for (const m of post.mean) expect(Number.isFinite(m)).toBe(true)
      for (const v of post.variance) expect(v).toBeGreaterThanOrEqual(0)
    }
  })
})
