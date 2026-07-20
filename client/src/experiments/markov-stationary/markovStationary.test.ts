import { describe, it, expect } from 'vitest'
import {
  step,
  iterate,
  stationary,
  TRANSITION_MATRIX,
  INITIAL_DISTS,
} from './markovStationary'

function sum(v: number[]): number {
  return v.reduce((a, b) => a + b, 0)
}

describe('马氏链稳态', () => {
  it('TRANSITION_MATRIX 每行之和为 1（行随机）', () => {
    for (const row of TRANSITION_MATRIX) {
      expect(sum(row)).toBeCloseTo(1, 10)
    }
  })

  it('step 保持概率归一，且非负', () => {
    const next = step(TRANSITION_MATRIX, [1, 0, 0])
    expect(sum(next)).toBeCloseTo(1, 10)
    for (const p of next) expect(p).toBeGreaterThanOrEqual(0)
  })

  it('step 一步结果等于对应行', () => {
    // 从纯晴态出发，一步后就是矩阵第 0 行
    expect(step(TRANSITION_MATRIX, [1, 0, 0])).toEqual(TRANSITION_MATRIX[0])
  })

  it('iterate 返回 steps+1 个分布，首个为初始分布', () => {
    const hist = iterate(TRANSITION_MATRIX, [1, 0, 0], 5)
    expect(hist.length).toBe(6)
    expect(hist[0]).toEqual([1, 0, 0])
    for (const d of hist) expect(sum(d)).toBeCloseTo(1, 10)
  })

  it('stationary 满足 pi = pi P（不动点）', () => {
    const pi = stationary(TRANSITION_MATRIX)
    const next = step(TRANSITION_MATRIX, pi)
    for (let i = 0; i < pi.length; i++) {
      expect(next[i]).toBeCloseTo(pi[i], 8)
    }
    expect(sum(pi)).toBeCloseTo(1, 8)
  })

  it('不同初始分布都收敛到同一稳态', () => {
    const pi = stationary(TRANSITION_MATRIX)
    for (const init of INITIAL_DISTS) {
      const end = iterate(TRANSITION_MATRIX, init, 100).at(-1)!
      for (let i = 0; i < pi.length; i++) {
        expect(end[i]).toBeCloseTo(pi[i], 6)
      }
    }
  })
})
