import { describe, it, expect } from 'vitest'
import {
  charToNum, numToChar, gcd, modInverse, det2x2,
  matModInverse2x2, applyMatrix, cleanText, encrypt, decrypt,
  KEY_MATRIX, SAMPLE, type Matrix2,
} from './hillCipher'

describe('希尔密码', () => {
  it('字母与数字互转', () => {
    expect(charToNum('A')).toBe(0)
    expect(charToNum('z')).toBe(25)
    expect(numToChar(0)).toBe('A')
    expect(numToChar(25)).toBe('Z')
    expect(numToChar(26)).toBe('A')
  })

  it('gcd 与模逆元', () => {
    expect(gcd(9, 26)).toBe(1)
    expect(gcd(13, 26)).toBe(13)
    expect(modInverse(9, 26)).toBe(3)
    expect(modInverse(13, 26)).toBeNull()
  })

  it('cleanText 去杂并补齐偶数长度', () => {
    expect(cleanText('He, llo!')).toBe('HELLO' + 'X')
    expect(cleanText('math')).toBe('MATH')
  })

  it('KEY_MATRIX 行列式与 26 互质且可逆', () => {
    expect(det2x2(KEY_MATRIX)).toBe(9)
    const inv = matModInverse2x2(KEY_MATRIX)
    expect(inv).not.toBeNull()
  })

  it('逆矩阵与原矩阵相乘模 26 得单位阵', () => {
    const inv = matModInverse2x2(KEY_MATRIX) as Matrix2
    const m = (v: number) => ((v % 26) + 26) % 26
    const a = m(KEY_MATRIX[0][0] * inv[0][0] + KEY_MATRIX[0][1] * inv[1][0])
    const d = m(KEY_MATRIX[1][0] * inv[0][1] + KEY_MATRIX[1][1] * inv[1][1])
    const b = m(KEY_MATRIX[0][0] * inv[0][1] + KEY_MATRIX[0][1] * inv[1][1])
    expect([a, b, d]).toEqual([1, 0, 1])
  })

  it('不可逆密钥无逆矩阵，解密返回空串', () => {
    const bad: Matrix2 = [[2, 4], [6, 8]]
    expect(matModInverse2x2(bad)).toBeNull()
    expect(decrypt('ABCD', bad)).toBe('')
  })

  it('加密后解密还原明文', () => {
    const c = encrypt(SAMPLE, KEY_MATRIX)
    expect(c).toMatch(/^[A-Z]+$/)
    expect(decrypt(c, KEY_MATRIX)).toBe(cleanText(SAMPLE))
  })

  it('applyMatrix 结果落在 0-25', () => {
    const r = applyMatrix(KEY_MATRIX, [7, 4])
    expect(r[0]).toBeGreaterThanOrEqual(0)
    expect(r[0]).toBeLessThan(26)
  })
})
