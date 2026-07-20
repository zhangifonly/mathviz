import { describe, it, expect } from 'vitest'
import { riemannSum, trueIntegral, FUNCTIONS, MODES, N_VALUES } from './riemannSum'

const square = FUNCTIONS[0]

describe('黎曼和', () => {
  it('riemannSum 生成 n 个矩形，宽度均匀且铺满区间', () => {
    const { rects } = riemannSum(square.fn, 0, 2, 8, 'left')
    expect(rects.length).toBe(8)
    for (const r of rects) expect(r.w).toBeCloseTo(0.25, 12)
    expect(rects[0].x).toBeCloseTo(0, 12)
    expect(rects[7].x + rects[7].w).toBeCloseTo(2, 12)
  })

  it('n<=0 时返回空结果', () => {
    const res = riemannSum(square.fn, 0, 2, 0, 'mid')
    expect(res.sum).toBe(0)
    expect(res.rects.length).toBe(0)
  })

  it('三种取样点位置正确 (对 y=x² 在 [0,2] 取 n=2)', () => {
    // 段宽=1，两段左端点=0,1；右端点=1,2；中点=0.5,1.5
    expect(riemannSum(square.fn, 0, 2, 2, 'left').rects[0].h).toBe(0)
    expect(riemannSum(square.fn, 0, 2, 2, 'right').rects[0].h).toBe(1)
    expect(riemannSum(square.fn, 0, 2, 2, 'mid').rects[0].h).toBeCloseTo(0.25, 12)
  })

  it('左和低估、右和高估递增函数 (真实=8/3)', () => {
    const truth = 8 / 3
    const left = riemannSum(square.fn, 0, 2, 16, 'left').sum
    const right = riemannSum(square.fn, 0, 2, 16, 'right').sum
    expect(left).toBeLessThan(truth)
    expect(right).toBeGreaterThan(truth)
  })

  it('n 越大误差越小，逼近真实定积分', () => {
    const truth = trueIntegral(square, 0, 2)
    const eSmall = Math.abs(riemannSum(square.fn, 0, 2, 4, 'mid').sum - truth)
    const eLarge = Math.abs(riemannSum(square.fn, 0, 2, 64, 'mid').sum - truth)
    expect(eLarge).toBeLessThan(eSmall)
    expect(eLarge).toBeLessThan(1e-2)
  })

  it('trueIntegral 解析值正确', () => {
    expect(trueIntegral(square, 0, 2)).toBeCloseTo(8 / 3, 10)
    expect(trueIntegral(FUNCTIONS[1], 0, Math.PI)).toBeCloseTo(2, 10)
    expect(trueIntegral(FUNCTIONS[2], 0, 4)).toBeCloseTo(16 / 3, 10)
  })

  it('常量数组完整', () => {
    expect(MODES).toEqual(['left', 'right', 'mid'])
    expect(FUNCTIONS.length).toBeGreaterThanOrEqual(3)
    expect(N_VALUES).toContain(16)
  })
})
