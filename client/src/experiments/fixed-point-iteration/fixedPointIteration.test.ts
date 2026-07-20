import { describe, it, expect } from 'vitest'
import {
  iterate,
  derivative,
  isContractive,
  findFunc,
  FUNCTIONS,
} from './fixedPointIteration'

describe('不动点迭代', () => {
  it('iterate 返回长度为 steps+1 的序列，首项为 x0', () => {
    const seq = iterate((x) => (x + 2) / 2, 5, 10)
    expect(seq.length).toBe(11)
    expect(seq[0]).toBe(5)
  })

  it('收敛例子 g(x)=(x+2)/2 迭代逼近不动点 2', () => {
    const seq = iterate((x) => (x + 2) / 2, 5, 40)
    expect(seq[seq.length - 1]).toBeCloseTo(2, 6)
  })

  it('g(x)=cos x 收敛到 Dottie 数约 0.739', () => {
    const seq = iterate((x) => Math.cos(x), 1, 80)
    expect(seq[seq.length - 1]).toBeCloseTo(0.7390851332, 4)
  })

  it('不动点是迭代的固定点：g(x*)≈x*', () => {
    for (const f of FUNCTIONS) {
      expect(f.g(f.fixed)).toBeCloseTo(f.fixed, 4)
    }
  })

  it('derivative 中心差分近似正确', () => {
    expect(derivative((x) => x * x, 3)).toBeCloseTo(6, 4)
    expect(derivative((x) => Math.sin(x), 0)).toBeCloseTo(1, 4)
  })

  it('isContractive 正确区分收敛与发散例子', () => {
    // (x+2)/2 的导数恒为 0.5 < 1，收敛
    expect(isContractive((x) => (x + 2) / 2, 2)).toBe(true)
    // x^2 在不动点 1 处导数 2 > 1，发散
    expect(isContractive((x) => x * x, 1)).toBe(false)
  })

  it('发散例子 g(x)=x² 从 1.2 起迅速远离', () => {
    const seq = iterate((x) => x * x, 1.2, 30)
    const last = seq[seq.length - 1]
    expect(last > 100 || !Number.isFinite(last)).toBe(true)
  })

  it('findFunc 能按 key 查找，未知 key 回退首个', () => {
    expect(findFunc('cos').key).toBe('cos')
    expect(findFunc('square').key).toBe('square')
    expect(findFunc('nope').key).toBe(FUNCTIONS[0].key)
  })
})
