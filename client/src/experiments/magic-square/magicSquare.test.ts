import { describe, it, expect } from 'vitest'
import {
  siameseMagicSquare,
  magicConstant,
  verifyMagic,
  lineCells,
  ORDERS,
} from './magicSquare'

describe('幻方', () => {
  it('magicConstant 公式正确', () => {
    expect(magicConstant(3)).toBe(15)
    expect(magicConstant(5)).toBe(65)
    expect(magicConstant(7)).toBe(175)
  })

  it('siameseMagicSquare(3) 生成经典 3 阶幻方', () => {
    const sq = siameseMagicSquare(3)
    expect(sq).toEqual([
      [8, 1, 6],
      [3, 5, 7],
      [4, 9, 2],
    ])
  })

  it('生成的方阵包含 1..n² 每个数恰好一次', () => {
    for (const n of ORDERS) {
      const flat = siameseMagicSquare(n).flat().sort((a, b) => a - b)
      const expected = Array.from({ length: n * n }, (_, i) => i + 1)
      expect(flat).toEqual(expected)
    }
  })

  it('所有奇数阶幻方都通过校验', () => {
    for (const n of ORDERS) {
      expect(verifyMagic(siameseMagicSquare(n))).toBe(true)
    }
  })

  it('偶数阶抛错', () => {
    expect(() => siameseMagicSquare(4)).toThrow()
  })

  it('verifyMagic 对被破坏的方阵返回 false', () => {
    const sq = siameseMagicSquare(3)
    sq[0][0] += 1
    expect(verifyMagic(sq)).toBe(false)
    expect(verifyMagic([])).toBe(false)
  })

  it('lineCells 返回正确坐标', () => {
    expect(lineCells(3, 'row', 1)).toEqual([[1, 0], [1, 1], [1, 2]])
    expect(lineCells(3, 'col', 2)).toEqual([[0, 2], [1, 2], [2, 2]])
    expect(lineCells(3, 'diag')).toEqual([[0, 0], [1, 1], [2, 2]])
    expect(lineCells(3, 'anti')).toEqual([[0, 2], [1, 1], [2, 0]])
  })
})
