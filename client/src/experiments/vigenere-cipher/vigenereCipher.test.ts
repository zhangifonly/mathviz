import { describe, it, expect } from 'vitest'
import {
  encrypt, decrypt, normalize, keyStream,
  tabulaRecta, alignedRows, fromIndex, SAMPLE,
} from './vigenereCipher'

describe('维吉尼亚密码', () => {
  it('经典示例 ATTACKATDAWN + LEMON => LXFOPVEFRNHR', () => {
    expect(encrypt(SAMPLE.plaintext, SAMPLE.key)).toBe('LXFOPVEFRNHR')
  })

  it('加解密互逆', () => {
    const msg = 'THEQUICKBROWNFOX'
    const key = 'MATH'
    expect(decrypt(encrypt(msg, key), key)).toBe(msg)
  })

  it('normalize 只保留大写字母', () => {
    expect(normalize('Hello, World! 123')).toBe('HELLOWORLD')
  })

  it('空密钥退化为原文（偏移全 0）', () => {
    expect(encrypt('ABCXYZ', '')).toBe('ABCXYZ')
  })

  it('keyStream 循环对齐', () => {
    expect(keyStream('LEMON', 7).map(fromIndex).join('')).toBe('LEMONLE')
  })

  it('单字母密钥等价于凯撒密码', () => {
    // 密钥 D = 偏移 3，等价 ROT-3
    expect(encrypt('ABC', 'D')).toBe('DEF')
  })

  it('tabulaRecta 是 26x26 且对角规律正确', () => {
    const t = tabulaRecta()
    expect(t.length).toBe(26)
    expect(t[0].length).toBe(26)
    expect(t[0][0]).toBe('A')
    expect(t[1][0]).toBe('B')
    expect(t[2][3]).toBe(fromIndex(5)) // (2+3) mod 26 = F
    expect(t[25][25]).toBe('Y') // (25+25) mod 26 = 24 = Y
  })

  it('alignedRows 三行等长且密文与 encrypt 一致', () => {
    const r = alignedRows(SAMPLE.plaintext, SAMPLE.key)
    expect(r.plain.length).toBe(r.cipher.length)
    expect(r.key.length).toBe(r.cipher.length)
    expect(r.cipher.join('')).toBe(encrypt(SAMPLE.plaintext, SAMPLE.key))
    expect(r.key.join('')).toBe('LEMONLEMONLE'.slice(0, r.key.length))
  })
})
