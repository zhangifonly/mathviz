import { describe, it, expect } from 'vitest'
import {
  toBytes, toText, xorBytes, encrypt, decrypt,
  generateKey, keyForTarget, bitsOf, reuseLeak, SAMPLE,
} from './oneTimePad'

describe('一次一密', () => {
  it('toBytes/toText 互为逆运算', () => {
    expect(toText(toBytes('HELLO'))).toBe('HELLO')
    expect(toBytes('A')).toEqual([65])
  })

  it('加密后解密还原明文（异或对合）', () => {
    const plain = toBytes('SECRET')
    const key = generateKey(plain.length, 7)
    const cipher = encrypt(plain, key)
    expect(cipher).not.toEqual(plain)
    expect(toText(decrypt(cipher, key))).toBe('SECRET')
  })

  it('xorBytes 自反：a XOR b XOR b = a', () => {
    const a = [12, 200, 33]
    const b = [255, 1, 128]
    expect(xorBytes(xorBytes(a, b), b)).toEqual(a)
  })

  it('generateKey 同种子可复现、长度正确、取值在字节范围', () => {
    const k1 = generateKey(16, 42)
    const k2 = generateKey(16, 42)
    const k3 = generateKey(16, 99)
    expect(k1).toEqual(k2)
    expect(k1).not.toEqual(k3)
    expect(k1.length).toBe(16)
    for (const b of k1) {
      expect(b).toBeGreaterThanOrEqual(0)
      expect(b).toBeLessThanOrEqual(255)
    }
  })

  it('完美保密：同一密文可用特制密钥解出任意目标明文', () => {
    const plain = toBytes('HELLO')
    const key = generateKey(plain.length, 3)
    const cipher = encrypt(plain, key)
    const target = toBytes('WORLD')
    const fakeKey = keyForTarget(cipher, target)
    expect(toText(decrypt(cipher, fakeKey))).toBe('WORLD')
    expect(toText(decrypt(cipher, key))).toBe('HELLO')
  })

  it('密钥重用泄露：两密文异或等于两明文异或', () => {
    const p1 = toBytes('HELLO')
    const p2 = toBytes('WORLD')
    const key = generateKey(5, 11)
    const c1 = encrypt(p1, key)
    const c2 = encrypt(p2, key)
    expect(reuseLeak(c1, c2)).toEqual(xorBytes(p1, p2))
  })

  it('bitsOf 返回 8 位高位在前', () => {
    expect(bitsOf(1)).toEqual([0, 0, 0, 0, 0, 0, 0, 1])
    expect(bitsOf(0xff)).toEqual([1, 1, 1, 1, 1, 1, 1, 1])
    expect(bitsOf(0xa5)).toEqual([1, 0, 1, 0, 0, 1, 0, 1])
  })

  it('SAMPLE 明文与密钥等长', () => {
    expect(SAMPLE.key.length).toBe(SAMPLE.plain.length)
  })
})
