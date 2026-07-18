import { describe, it, expect } from 'vitest'
import {
  josephusSurvivor,
  josephusOrder,
  josephusEliminated,
  SAMPLES,
} from './josephusProblem'

describe('约瑟夫问题', () => {
  it('经典 n=7,k=3 幸存者为 4', () => {
    // 出局顺序 3,6,2,7,5,1，幸存者 4（1 基）
    expect(josephusSurvivor(7, 3)).toBe(4)
    expect(josephusOrder(7, 3)).toEqual([3, 6, 2, 7, 5, 1, 4])
  })

  it('k=1 时按顺序出局，幸存者为 n', () => {
    for (const n of [1, 2, 5, 10]) {
      expect(josephusSurvivor(n, 1)).toBe(n)
    }
    expect(josephusOrder(5, 1)).toEqual([1, 2, 3, 4, 5])
  })

  it('n=1 幸存者必为 1', () => {
    expect(josephusSurvivor(1, 3)).toBe(1)
    expect(josephusOrder(1, 3)).toEqual([1])
  })

  it('递推公式与模拟法结果一致', () => {
    for (let n = 1; n <= 30; n++) {
      for (const k of [2, 3, 4, 7]) {
        const order = josephusOrder(n, k)
        expect(order[order.length - 1]).toBe(josephusSurvivor(n, k))
      }
    }
  })

  it('josephusOrder 是 1..n 的一个排列，长度为 n', () => {
    const order = josephusOrder(20, 5)
    expect(order.length).toBe(20)
    expect([...order].sort((a, b) => a - b)).toEqual(
      Array.from({ length: 20 }, (_, i) => i + 1),
    )
  })

  it('josephusEliminated 去掉幸存者，长度为 n-1', () => {
    const elim = josephusEliminated(7, 3)
    expect(elim.length).toBe(6)
    expect(elim).not.toContain(josephusSurvivor(7, 3))
  })

  it('SAMPLES 都能算出合法幸存者位置', () => {
    for (const { n, k } of SAMPLES) {
      const s = josephusSurvivor(n, k)
      expect(s).toBeGreaterThanOrEqual(1)
      expect(s).toBeLessThanOrEqual(n)
    }
  })
})
