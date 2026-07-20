import { describe, it, expect } from 'vitest'
import { toBase, fromBase, toBaseString, BASES, MAX_BASE } from './numberBases'

describe('进制转换', () => {
  it('toBase 常见换算正确，高位在前', () => {
    expect(toBase(13, 2)).toEqual([1, 1, 0, 1])
    expect(toBase(255, 16)).toEqual([15, 15])
    expect(toBase(8, 8)).toEqual([1, 0])
    expect(toBase(0, 10)).toEqual([0])
    expect(toBase(42, 10)).toEqual([4, 2])
  })

  it('fromBase 是 toBase 的逆运算', () => {
    for (const base of BASES) {
      for (const n of [0, 1, 7, 42, 255, 1000]) {
        expect(fromBase(toBase(n, base), base)).toBe(n)
      }
    }
  })

  it('toBaseString 字母用大写十六进制', () => {
    expect(toBaseString(255, 16)).toBe('FF')
    expect(toBaseString(2748, 16)).toBe('ABC')
    expect(toBaseString(13, 2)).toBe('1101')
    expect(toBaseString(0, 2)).toBe('0')
  })

  it('位值展开：每位 digit×base^power 之和等于原数', () => {
    const n = 173
    const base = 2
    const digits = toBase(n, base)
    let sum = 0
    digits.forEach((d, i) => {
      const power = digits.length - 1 - i
      sum += d * base ** power
    })
    expect(sum).toBe(n)
  })

  it('非法输入抛错', () => {
    expect(() => toBase(-1, 2)).toThrow()
    expect(() => toBase(10, 1)).toThrow()
    expect(() => toBase(10, MAX_BASE + 1)).toThrow()
    expect(() => fromBase([2, 0], 2)).toThrow()
  })

  it('BASES 常量为二八十十六', () => {
    expect(BASES).toEqual([2, 8, 10, 16])
  })
})
