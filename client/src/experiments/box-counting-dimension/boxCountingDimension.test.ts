import { describe, it, expect } from 'vitest'
import {
  makeSierpinski,
  countBoxes,
  linearFit,
  boxCountData,
  estimateDimension,
  EPSILONS,
} from './boxCountingDimension'

describe('盒维数', () => {
  it('makeSierpinski 生成的点都落在 [0,size] 范围内', () => {
    const pts = makeSierpinski(2000, 512, 1)
    expect(pts.length).toBeGreaterThan(1900)
    for (const p of pts) {
      expect(p.x).toBeGreaterThanOrEqual(0)
      expect(p.x).toBeLessThanOrEqual(512)
      expect(p.y).toBeGreaterThanOrEqual(0)
      expect(p.y).toBeLessThanOrEqual(512)
    }
  })

  it('makeSierpinski 同种子可复现', () => {
    expect(makeSierpinski(500, 512, 42)).toEqual(makeSierpinski(500, 512, 42))
  })

  it('countBoxes 网格越细非空格子越多（单调不减），且不超过点数', () => {
    const pts = makeSierpinski(3000, 512, 7)
    const coarse = countBoxes(pts, 64, 512)
    const fine = countBoxes(pts, 8, 512)
    expect(fine).toBeGreaterThanOrEqual(coarse)
    expect(coarse).toBeGreaterThan(0)
    expect(countBoxes(pts, 4, 512)).toBeLessThanOrEqual(pts.length)
  })

  it('countBoxes 单点在任意尺度只占 1 个格子', () => {
    expect(countBoxes([{ x: 10, y: 10 }], 32, 512)).toBe(1)
    expect(countBoxes([{ x: 10, y: 10 }], 4, 512)).toBe(1)
    expect(countBoxes([], 8, 512)).toBe(0)
  })

  it('linearFit 对完美直线拟合出正确斜率', () => {
    const xs = [0, 1, 2, 3]
    const ys = [1, 3, 5, 7] // y = 2x + 1
    const fit = linearFit(xs, ys)
    expect(fit.slope).toBeCloseTo(2, 6)
    expect(fit.intercept).toBeCloseTo(1, 6)
  })

  it('boxCountData 的 logN 与 logInvEps 与定义一致', () => {
    const pts = makeSierpinski(1000, 512, 3)
    const data = boxCountData(pts, [16, 8], 512)
    expect(data.length).toBe(2)
    expect(data[0].logInvEps).toBeCloseTo(Math.log(1 / 16), 6)
    expect(data[1].logN).toBeCloseTo(Math.log(data[1].count), 6)
  })

  it('谢尔宾斯基三角形估计维数接近 log3/log2 ≈ 1.585', () => {
    const pts = makeSierpinski(60000, 512, 1)
    const d = estimateDimension(pts, EPSILONS, 512)
    expect(d).toBeGreaterThan(1.4)
    expect(d).toBeLessThan(1.75)
  })

  it('EPSILONS 由大到小排列且均为正', () => {
    for (let i = 1; i < EPSILONS.length; i++) {
      expect(EPSILONS[i]).toBeLessThan(EPSILONS[i - 1])
      expect(EPSILONS[i]).toBeGreaterThan(0)
    }
  })
})
