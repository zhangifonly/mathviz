import { describe, it, expect } from 'vitest'
import {
  sigmoid, dsigmoid, forward, loss, trainStep,
  NETWORK, LEARNING_RATE, XOR_SAMPLES,
} from './backpropagation'

describe('反向传播', () => {
  it('sigmoid 与其导数取值正确', () => {
    expect(sigmoid(0)).toBeCloseTo(0.5, 6)
    expect(sigmoid(100)).toBeCloseTo(1, 6)
    expect(sigmoid(-100)).toBeCloseTo(0, 6)
    expect(dsigmoid(0.5)).toBeCloseTo(0.25, 6)
  })

  it('forward 输出落在 (0,1) 且结构完整', () => {
    const f = forward(NETWORK, [0, 1])
    expect(f.a1.length).toBe(2)
    expect(f.a2).toBeGreaterThan(0)
    expect(f.a2).toBeLessThan(1)
    for (let j = 0; j < 2; j++) {
      expect(f.a1[j]).toBeCloseTo(sigmoid(f.z1[j]), 6)
    }
  })

  it('loss 非负，命中目标时为 0', () => {
    expect(loss(1, 1)).toBe(0)
    expect(loss(0.5, 1)).toBeCloseTo(0.125, 6)
    expect(loss(0.2, 0.9)).toBeGreaterThan(0)
  })

  it('trainStep 更新后损失下降（同一样本）', () => {
    let net = NETWORK
    const s = XOR_SAMPLES[1]
    const first = trainStep(net, s.input, s.target, LEARNING_RATE).loss
    for (let k = 0; k < 200; k++) {
      net = trainStep(net, s.input, s.target, LEARNING_RATE).next
    }
    const after = loss(forward(net, s.input).a2, s.target)
    expect(after).toBeLessThan(first)
  })

  it('解析梯度与数值梯度一致（校验链式法则）', () => {
    const s = XOR_SAMPLES[2]
    const { grads } = trainStep(NETWORK, s.input, s.target, 0)
    const eps = 1e-5
    const base = { ...NETWORK, w2: [...NETWORK.w2] }
    const up = { ...base, w2: [base.w2[0] + eps, base.w2[1]] }
    const dn = { ...base, w2: [base.w2[0] - eps, base.w2[1]] }
    const num = (loss(forward(up, s.input).a2, s.target) - loss(forward(dn, s.input).a2, s.target)) / (2 * eps)
    expect(grads.dw2[0]).toBeCloseTo(num, 4)
  })

  it('全量训练 XOR 若干轮后总损失明显下降', () => {
    let net = NETWORK
    const total = () => XOR_SAMPLES.reduce((s, x) => s + loss(forward(net, x.input).a2, x.target), 0)
    const before = total()
    for (let epoch = 0; epoch < 3000; epoch++) {
      for (const x of XOR_SAMPLES) net = trainStep(net, x.input, x.target, LEARNING_RATE).next
    }
    expect(total()).toBeLessThan(before)
  })
})
