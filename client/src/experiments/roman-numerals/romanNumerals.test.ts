import { describe, it, expect } from 'vitest'
import {
  toRoman,
  fromRoman,
  decompose,
  isValidRoman,
  NUMERALS,
  ROMAN_OPTIONS,
} from './romanNumerals'

describe('罗马数字转换', () => {
  it('已知小数字转换正确', () => {
    expect(toRoman(1)).toBe('I')
    expect(toRoman(4)).toBe('IV')
    expect(toRoman(9)).toBe('IX')
    expect(toRoman(14)).toBe('XIV')
    expect(toRoman(40)).toBe('XL')
    expect(toRoman(49)).toBe('XLIX')
    expect(toRoman(90)).toBe('XC')
    expect(toRoman(400)).toBe('CD')
    expect(toRoman(900)).toBe('CM')
  })

  it('典型大数字转换正确', () => {
    expect(toRoman(2024)).toBe('MMXXIV')
    expect(toRoman(3888)).toBe('MMMDCCCLXXXVIII')
    expect(toRoman(3999)).toBe('MMMCMXCIX')
  })

  it('边界处理：越界抛错', () => {
    expect(() => toRoman(0)).toThrow()
    expect(() => toRoman(4000)).toThrow()
    expect(() => toRoman(1.5)).toThrow()
    expect(() => toRoman(-3)).toThrow()
  })

  it('往返恒等式：1..3999 每个数 toRoman 后 fromRoman 还原', () => {
    for (let n = 1; n <= 3999; n++) {
      expect(fromRoman(toRoman(n))).toBe(n)
    }
  })

  it('decompose 的符号数值之和等于原数', () => {
    for (const n of [4, 49, 2024, 3888]) {
      const b = decompose(n)
      const sum = b.steps.reduce((acc, s) => acc + s.value, 0)
      expect(sum).toBe(n)
      expect(b.roman).toBe(toRoman(n))
    }
  })

  it('isValidRoman 识别规范与非规范写法', () => {
    expect(isValidRoman('IV')).toBe(true)
    expect(isValidRoman('MMXXIV')).toBe(true)
    expect(isValidRoman('IIII')).toBe(false) // 4 应写 IV
    expect(isValidRoman('IL')).toBe(false) // 49 应写 XLIX
    expect(isValidRoman('ABC')).toBe(false)
    expect(isValidRoman('')).toBe(false)
  })

  it('NUMERALS 从大到小严格递减', () => {
    for (let i = 1; i < NUMERALS.length; i++) {
      expect(NUMERALS[i].value).toBeLessThan(NUMERALS[i - 1].value)
    }
  })

  it('ROMAN_OPTIONS 均在有效范围且可转换', () => {
    for (const opt of ROMAN_OPTIONS) {
      expect(opt.value).toBeGreaterThanOrEqual(1)
      expect(opt.value).toBeLessThanOrEqual(3999)
      expect(fromRoman(toRoman(opt.value))).toBe(opt.value)
    }
  })
})
