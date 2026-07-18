import { describe, it, expect } from 'vitest'
import {
  sigmoid,
  relu,
  applyActivation,
  weightedSum,
  forward,
  layerSizes,
  NETWORK,
  INPUT_PRESETS,
} from './neuralNetworkForward'

describe('神经网络前向传播', () => {
  it('sigmoid 值域在 (0,1) 且在 0 处为 0.5', () => {
    expect(sigmoid(0)).toBeCloseTo(0.5, 10)
    expect(sigmoid(100)).toBeGreaterThan(0.99)
    expect(sigmoid(-100)).toBeLessThan(0.01)
  })

  it('relu 负数归零，正数保留', () => {
    expect(relu(-3)).toBe(0)
    expect(relu(2.5)).toBe(2.5)
    expect(applyActivation(-1, 'relu')).toBe(0)
    expect(applyActivation(0, 'sigmoid')).toBeCloseTo(0.5, 10)
  })

  it('weightedSum 计算 w·x + b', () => {
    expect(weightedSum([2, 3], [1, -1], 0.5)).toBeCloseTo(2 - 3 + 0.5, 10)
    expect(weightedSum([0, 0], [5, 9], 1)).toBe(1)
  })

  it('forward 返回层数正确且各层维度匹配', () => {
    const acts = forward([1, 0], NETWORK)
    expect(acts.length).toBe(NETWORK.length + 1)
    expect(acts[0]).toEqual([1, 0])
    expect(acts[1].length).toBe(3)
    expect(acts[2].length).toBe(2)
  })

  it('forward sigmoid 输出全部落在 (0,1)', () => {
    for (const input of INPUT_PRESETS) {
      const acts = forward(input, NETWORK)
      for (let k = 1; k < acts.length; k++) {
        for (const v of acts[k]) {
          expect(v).toBeGreaterThan(0)
          expect(v).toBeLessThan(1)
        }
      }
    }
  })

  it('forward 手算校验单层结果', () => {
    const layer = [
      { weights: [[1, 1]], biases: [0], activation: 'relu' as const },
    ]
    const acts = forward([2, 3], layer)
    expect(acts[1][0]).toBe(5)
  })

  it('layerSizes 反映 2-3-2 结构', () => {
    expect(layerSizes([1, 0], NETWORK)).toEqual([2, 3, 2])
  })
})
