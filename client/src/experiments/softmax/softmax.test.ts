import { describe, it, expect } from 'vitest'
import { softmax, probSum, argmax, entropy, SAMPLE_LOGITS, TEMPERATURES } from './softmax'

describe('Softmax 函数', () => {
  it('输出概率之和为 1，且全为正', () => {
    const p = softmax(SAMPLE_LOGITS, 1)
    expect(p.length).toBe(SAMPLE_LOGITS.length)
    expect(probSum(p)).toBeCloseTo(1, 10)
    for (const v of p) expect(v).toBeGreaterThan(0)
  })

  it('保序：logits 越大对应概率越大', () => {
    const p = softmax([1, 2, 3], 1)
    expect(p[0]).toBeLessThan(p[1])
    expect(p[1]).toBeLessThan(p[2])
    expect(argmax(p)).toBe(2)
  })

  it('相等 logits 得到均匀分布', () => {
    const p = softmax([5, 5, 5, 5], 1)
    for (const v of p) expect(v).toBeCloseTo(0.25, 10)
  })

  it('数值稳定：极大 logits 不溢出为 NaN', () => {
    const p = softmax([1000, 1001, 999], 1)
    expect(probSum(p)).toBeCloseTo(1, 10)
    for (const v of p) expect(Number.isFinite(v)).toBe(true)
  })

  it('温度越低分布越尖锐（熵越小）', () => {
    const cold = softmax(SAMPLE_LOGITS, 0.5)
    const hot = softmax(SAMPLE_LOGITS, 5)
    expect(entropy(cold)).toBeLessThan(entropy(hot))
    expect(Math.max(...cold)).toBeGreaterThan(Math.max(...hot))
  })

  it('所有预设温度都能产生合法分布', () => {
    for (const t of TEMPERATURES) {
      const p = softmax(SAMPLE_LOGITS, t)
      expect(probSum(p)).toBeCloseTo(1, 10)
    }
  })

  it('空输入返回空数组', () => {
    expect(softmax([], 1)).toEqual([])
  })
})
