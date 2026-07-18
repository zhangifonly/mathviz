import { describe, it, expect } from 'vitest'
import {
  binaryToGray,
  grayToBinary,
  toBits,
  grayCodeSequence,
  hammingDistance,
  changedBitIndex,
  BITS,
} from './grayCode'

describe('格雷码', () => {
  it('binaryToGray 与已知值吻合', () => {
    // 0,1,2,3,4,5,6,7 -> 0,1,3,2,6,7,5,4
    const expected = [0, 1, 3, 2, 6, 7, 5, 4]
    for (let n = 0; n < 8; n++) {
      expect(binaryToGray(n)).toBe(expected[n])
    }
  })

  it('grayToBinary 是 binaryToGray 的逆运算', () => {
    for (let n = 0; n < 256; n++) {
      expect(grayToBinary(binaryToGray(n))).toBe(n)
    }
  })

  it('toBits 按位宽正确展开高位在前', () => {
    expect(toBits(6, 3)).toEqual([1, 1, 0])
    expect(toBits(1, 4)).toEqual([0, 0, 0, 1])
  })

  it('grayCodeSequence 长度为 2^bits 且首项全零', () => {
    for (const b of BITS) {
      const seq = grayCodeSequence(b)
      expect(seq.length).toBe(1 << b)
      expect(seq[0]).toEqual(new Array(b).fill(0))
    }
  })

  it('相邻码汉明距离恒为 1', () => {
    for (const b of BITS) {
      const seq = grayCodeSequence(b)
      for (let i = 1; i < seq.length; i++) {
        expect(hammingDistance(seq[i - 1], seq[i])).toBe(1)
        expect(changedBitIndex(seq[i - 1], seq[i])).toBeGreaterThanOrEqual(0)
      }
    }
  })

  it('序列首尾相接也只差一位（循环格雷码）', () => {
    const seq = grayCodeSequence(4)
    expect(hammingDistance(seq[seq.length - 1], seq[0])).toBe(1)
  })

  it('序列覆盖所有取值且无重复', () => {
    const seq = grayCodeSequence(3)
    const nums = seq.map((bits) => parseInt(bits.join(''), 2))
    expect(new Set(nums).size).toBe(8)
  })
})
