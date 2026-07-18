import { describe, it, expect } from 'vitest'
import {
  simulateArrivals,
  countProcess,
  factorial,
  poissonPmf,
  RATES,
} from './poissonProcess'

describe('泊松过程', () => {
  it('simulateArrivals 返回升序且不超过 T 的到达时刻', () => {
    const arr = simulateArrivals(2, 20, 7)
    expect(arr.length).toBeGreaterThan(0)
    for (let i = 0; i < arr.length; i++) {
      expect(arr[i]).toBeLessThanOrEqual(20)
      if (i > 0) expect(arr[i]).toBeGreaterThanOrEqual(arr[i - 1])
    }
  })

  it('simulateArrivals 同种子可复现，非法参数返回空', () => {
    expect(simulateArrivals(1, 30, 42)).toEqual(simulateArrivals(1, 30, 42))
    expect(simulateArrivals(0, 30, 1)).toEqual([])
    expect(simulateArrivals(1, 0, 1)).toEqual([])
  })

  it('速率越大平均到达数越多', () => {
    const slow = simulateArrivals(0.5, 100, 3).length
    const fast = simulateArrivals(2, 100, 3).length
    expect(fast).toBeGreaterThan(slow)
  })

  it('countProcess 是单调不减的阶梯函数', () => {
    const arr = [1, 3, 3.5, 8]
    expect(countProcess(arr, 0)).toBe(0)
    expect(countProcess(arr, 1)).toBe(1)
    expect(countProcess(arr, 3.4)).toBe(2)
    expect(countProcess(arr, 100)).toBe(4)
    let prev = 0
    for (let t = 0; t <= 10; t++) {
      const c = countProcess(arr, t)
      expect(c).toBeGreaterThanOrEqual(prev)
      prev = c
    }
  })

  it('factorial 与 poissonPmf 计算正确', () => {
    expect(factorial(0)).toBe(1)
    expect(factorial(4)).toBe(24)
    expect(poissonPmf(0, 2)).toBeCloseTo(Math.exp(-2), 6)
    expect(poissonPmf(2, 2)).toBeCloseTo((Math.exp(-2) * 4) / 2, 6)
    expect(poissonPmf(-1, 2)).toBe(0)
  })

  it('poissonPmf 在 k 上求和接近 1', () => {
    let sum = 0
    for (let k = 0; k <= 40; k++) sum += poissonPmf(k, 5)
    expect(sum).toBeCloseTo(1, 4)
  })

  it('RATES 每个速率都能模拟出有限到达序列', () => {
    for (const r of RATES) {
      const arr = simulateArrivals(r, 50, 5)
      expect(Array.isArray(arr)).toBe(true)
      expect(arr.length).toBeLessThan(100000)
    }
  })
})
