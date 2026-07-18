import { describe, it, expect } from 'vitest'
import {
  encrypt, decrypt, letterFrequency, crack, chiSquared,
  ENGLISH_FREQ, SHIFTS, SAMPLE_TEXT,
} from './caesarCipher'

describe('凯撒密码', () => {
  it('encrypt 按移位量正确替换，绕回模 26', () => {
    expect(encrypt('abc', 3)).toBe('def')
    expect(encrypt('xyz', 3)).toBe('abc')
    expect(encrypt('ABC', 1)).toBe('BCD')
    expect(encrypt('Hello, World!', 3)).toBe('Khoor, Zruog!')
  })

  it('decrypt 是 encrypt 的逆运算', () => {
    for (const s of SHIFTS) {
      expect(decrypt(encrypt(SAMPLE_TEXT, s), s)).toBe(SAMPLE_TEXT)
    }
    expect(decrypt('def', 3)).toBe('abc')
  })

  it('非字母字符与空格保持不变', () => {
    expect(encrypt('a-b 1!', 5)).toBe('f-g 1!')
  })

  it('letterFrequency 返回百分比且总和约为 100', () => {
    const f = letterFrequency('aabbccc')
    expect(f.length).toBe(26)
    expect(f[0]).toBeCloseTo((2 / 7) * 100, 5)
    expect(f[2]).toBeCloseTo((3 / 7) * 100, 5)
    const total = f.reduce((a, b) => a + b, 0)
    expect(total).toBeCloseTo(100, 5)
  })

  it('letterFrequency 无字母时全为 0', () => {
    expect(letterFrequency('123 !!!').every((v) => v === 0)).toBe(true)
  })

  it('chiSquared 对标准英文频率自身最小(接近0)', () => {
    expect(chiSquared(ENGLISH_FREQ)).toBeCloseTo(0, 5)
    expect(chiSquared(ENGLISH_FREQ)).toBeLessThan(chiSquared(letterFrequency('zzzzzzz')))
  })

  it('crack 能通过频率分析还原移位', () => {
    for (const s of SHIFTS) {
      const cipher = encrypt(SAMPLE_TEXT, s)
      const res = crack(cipher)
      expect(res.shift).toBe(s)
      expect(res.plaintext).toBe(SAMPLE_TEXT)
    }
  })

  it('ENGLISH_FREQ 覆盖 26 个字母且总和接近 100', () => {
    expect(ENGLISH_FREQ.length).toBe(26)
    const total = ENGLISH_FREQ.reduce((a, b) => a + b, 0)
    expect(total).toBeGreaterThan(99)
    expect(total).toBeLessThan(101)
  })
})
