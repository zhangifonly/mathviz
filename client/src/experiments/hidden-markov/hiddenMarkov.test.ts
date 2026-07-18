import { describe, it, expect } from 'vitest'
import {
  generateSequence,
  viterbi,
  sampleIndex,
  MODELS,
  SEQ_LENGTHS,
  type HMMModel,
} from './hiddenMarkov'

const model = MODELS[0]

describe('隐马尔可夫模型', () => {
  it('sampleIndex 按分布落到正确区间', () => {
    const probs = [0.2, 0.5, 0.3]
    expect(sampleIndex(probs, 0)).toBe(0)
    expect(sampleIndex(probs, 0.3)).toBe(1)
    expect(sampleIndex(probs, 0.8)).toBe(2)
    expect(sampleIndex(probs, 0.999)).toBe(2)
  })

  it('generateSequence 长度正确且索引合法', () => {
    const seq = generateSequence(model, 20, 3)
    expect(seq.hidden.length).toBe(20)
    expect(seq.observed.length).toBe(20)
    for (const h of seq.hidden) expect(h).toBeGreaterThanOrEqual(0)
    for (const h of seq.hidden) expect(h).toBeLessThan(model.states.length)
    for (const o of seq.observed) expect(o).toBeLessThan(model.symbols.length)
  })

  it('generateSequence 同种子可复现，不同种子不同', () => {
    const a = generateSequence(model, 15, 42)
    const b = generateSequence(model, 15, 42)
    const c = generateSequence(model, 15, 7)
    expect(a).toEqual(b)
    expect(a).not.toEqual(c)
  })

  it('viterbi 空序列返回空', () => {
    expect(viterbi([], model)).toEqual([])
  })

  it('viterbi 路径长度与观测一致，索引合法', () => {
    const seq = generateSequence(model, 25, 11)
    const path = viterbi(seq.observed, model)
    expect(path.length).toBe(25)
    for (const s of path) {
      expect(s).toBeGreaterThanOrEqual(0)
      expect(s).toBeLessThan(model.states.length)
    }
  })

  it('viterbi 对确定性模型精确还原隐状态', () => {
    // 两状态各只发射自己的独有符号，转移无歧义，解码应与真实完全一致
    const det: HMMModel = {
      name: 't',
      states: ['A', 'B'],
      symbols: ['a', 'b'],
      initial: [1, 0],
      transition: [[0.5, 0.5], [0.5, 0.5]],
      emission: [[1, 0], [0, 1]],
    }
    // 观测 a b a b -> 隐状态必为 A B A B
    expect(viterbi([0, 1, 0, 1], det)).toEqual([0, 1, 0, 1])
  })

  it('SEQ_LENGTHS 都能生成并解码', () => {
    for (const n of SEQ_LENGTHS) {
      const seq = generateSequence(model, n, 1)
      expect(viterbi(seq.observed, model).length).toBe(n)
    }
  })
})
