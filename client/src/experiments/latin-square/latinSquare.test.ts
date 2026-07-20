import { describe, it, expect } from 'vitest'
import {
  generateLatinSquare,
  isValidLatinSquare,
  areOrthogonal,
  generateOrthogonalPair,
  symbolColor,
  ORDERS,
} from './latinSquare'

describe('拉丁方', () => {
  it('generateLatinSquare 生成 n×n 方阵', () => {
    const g = generateLatinSquare(5)
    expect(g.length).toBe(5)
    for (const row of g) expect(row.length).toBe(5)
  })

  it('生成的方阵都是合法拉丁方', () => {
    for (const n of ORDERS) {
      expect(isValidLatinSquare(generateLatinSquare(n))).toBe(true)
    }
  })

  it('isValidLatinSquare 能识别非法方阵', () => {
    // 第一列出现重复符号
    const bad = [
      [0, 1, 2],
      [0, 2, 1],
      [1, 2, 0],
    ]
    expect(isValidLatinSquare(bad)).toBe(false)
    expect(isValidLatinSquare([])).toBe(false)
  })

  it('循环移位首行是 0..n-1', () => {
    const g = generateLatinSquare(6)
    expect(g[0]).toEqual([0, 1, 2, 3, 4, 5])
  })

  it('奇数阶循环移位可得正交拉丁方对（两方都合法）', () => {
    const [a5, b5] = generateOrthogonalPair(5)
    expect(isValidLatinSquare(a5)).toBe(true)
    expect(isValidLatinSquare(b5)).toBe(true)
    expect(areOrthogonal(a5, b5)).toBe(true)
  })

  it('6 阶移位 2 不与阶互质，第二个方阵已非拉丁方（欧拉36军官）', () => {
    const [, b6] = generateOrthogonalPair(6)
    expect(isValidLatinSquare(b6)).toBe(false)
  })

  it('symbolColor 返回合法十六进制颜色且可循环', () => {
    expect(symbolColor(0)).toMatch(/^#[0-9a-f]{6}$/i)
    expect(symbolColor(10)).toBe(symbolColor(0))
  })
})
