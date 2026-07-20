import { describe, it, expect } from 'vitest'
import {
  makePoints, fitLine, rss, rSquared,
  NOISE_LEVELS, TRUE_SLOPE, TRUE_INTERCEPT, type Point,
} from './leastSquares'

describe('最小二乘法', () => {
  it('makePoints 生成指定数量的点且可复现', () => {
    const a = makePoints(20, 18, 42)
    const b = makePoints(20, 18, 42)
    const c = makePoints(20, 18, 99)
    expect(a.length).toBe(20)
    expect(a).toEqual(b)
    expect(a).not.toEqual(c)
  })

  it('fitLine 对无噪声共线点精确还原斜率与截距', () => {
    const pts: Point[] = [0, 1, 2, 3, 4].map((x) => ({ x, y: 3 * x + 5 }))
    const line = fitLine(pts)
    expect(line.slope).toBeCloseTo(3, 10)
    expect(line.intercept).toBeCloseTo(5, 10)
  })

  it('fitLine 拟合噪声点应接近真实参数', () => {
    const line = fitLine(makePoints(200, 18, 7))
    expect(line.slope).toBeCloseTo(TRUE_SLOPE, 0)
    expect(line.intercept).toBeCloseTo(TRUE_INTERCEPT, -1)
  })

  it('rss 在完美拟合时为 0，最优线的 rss 最小', () => {
    const pts: Point[] = [0, 1, 2, 3].map((x) => ({ x, y: 2 * x + 1 }))
    const best = fitLine(pts)
    expect(rss(pts, best)).toBeCloseTo(0, 10)
    const worse = { slope: best.slope + 1, intercept: best.intercept }
    expect(rss(pts, worse)).toBeGreaterThan(rss(pts, best))
  })

  it('rSquared 完美拟合为 1，噪声拟合介于 0 与 1 之间', () => {
    const perfect: Point[] = [0, 1, 2, 3].map((x) => ({ x, y: -x + 4 }))
    expect(rSquared(perfect, fitLine(perfect))).toBeCloseTo(1, 10)
    const noisy = makePoints(60, 18, 3)
    const r2 = rSquared(noisy, fitLine(noisy))
    expect(r2).toBeGreaterThan(0)
    expect(r2).toBeLessThanOrEqual(1)
  })

  it('噪声越大 R² 越低（拟合优度下降）', () => {
    const low = makePoints(80, NOISE_LEVELS[0], 5)
    const high = makePoints(80, NOISE_LEVELS[2], 5)
    const r2Low = rSquared(low, fitLine(low))
    const r2High = rSquared(high, fitLine(high))
    expect(r2Low).toBeGreaterThan(r2High)
  })
})
