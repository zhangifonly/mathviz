import { describe, it, expect } from 'vitest'
import { lookAndSaySay, sequence, lengthRatio, CONWAY_CONSTANT, TERMS } from './lookAndSay'

describe('外观数列', () => {
  it('lookAndSaySay 逐项读出正确', () => {
    expect(lookAndSaySay('1')).toBe('11')
    expect(lookAndSaySay('11')).toBe('21')
    expect(lookAndSaySay('21')).toBe('1211')
    expect(lookAndSaySay('1211')).toBe('111221')
    expect(lookAndSaySay('111221')).toBe('312211')
  })

  it('lookAndSaySay 处理游程与空串', () => {
    expect(lookAndSaySay('')).toBe('')
    expect(lookAndSaySay('222')).toBe('32')
    expect(lookAndSaySay('11122233')).toBe('313223')
  })

  it('sequence 生成前 n 项，首项为种子', () => {
    const seq = sequence(5)
    expect(seq.length).toBe(5)
    expect(seq[0]).toBe('1')
    expect(seq[4]).toBe('111221')
    expect(seq[1]).toBe(lookAndSaySay(seq[0]))
  })

  it('sequence 长度严格不减且最终增长', () => {
    const seq = sequence(TERMS)
    for (let i = 0; i + 1 < seq.length; i++) {
      expect(seq[i + 1].length).toBeGreaterThanOrEqual(seq[i].length)
    }
    expect(seq[TERMS - 1].length).toBeGreaterThan(seq[0].length)
  })

  it('数列只含数字 1/2/3（康威定理，从 1 起）', () => {
    const seq = sequence(12)
    for (const t of seq) {
      expect(t).toMatch(/^[123]+$/)
    }
  })

  it('lengthRatio 长期趋近康威常数', () => {
    const seq = sequence(40)
    const r = lengthRatio(seq)
    const last = r[r.length - 1]
    expect(Math.abs(last - CONWAY_CONSTANT)).toBeLessThan(0.02)
  })
})
