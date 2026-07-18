/**
 * 希尔密码核心算法（纯函数，便于测试）
 *
 * 希尔密码把明文按每 2 个字母切成向量，与一个 2x2 密钥矩阵相乘，
 * 结果对 26 取模得到密文。解密时用密钥矩阵的模 26 逆矩阵还原。
 * 要求密钥矩阵的行列式与 26 互质，否则不可逆、无法解密。
 */

export type Matrix2 = [[number, number], [number, number]]

/** 字母转 0-25（仅处理 A-Z，其余归 0） */
export function charToNum(c: string): number {
  const code = c.toUpperCase().charCodeAt(0) - 65
  return code >= 0 && code < 26 ? code : 0
}

/** 0-25 转大写字母 */
export function numToChar(n: number): string {
  return String.fromCharCode(((n % 26) + 26) % 26 + 65)
}

/** 最大公约数 */
export function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) {
    ;[a, b] = [b, a % b]
  }
  return a
}

/** 求 a 在模 m 下的乘法逆元，不存在返回 null */
export function modInverse(a: number, m: number): number | null {
  a = ((a % m) + m) % m
  for (let x = 1; x < m; x++) {
    if ((a * x) % m === 1) return x
  }
  return null
}

/** 2x2 矩阵行列式对 26 取模 */
export function det2x2(k: Matrix2): number {
  const d = k[0][0] * k[1][1] - k[0][1] * k[1][0]
  return ((d % 26) + 26) % 26
}

/** 求 2x2 密钥矩阵的模 26 逆矩阵，不可逆返回 null */
export function matModInverse2x2(k: Matrix2): Matrix2 | null {
  const det = det2x2(k)
  if (gcd(det, 26) !== 1) return null
  const inv = modInverse(det, 26)
  if (inv === null) return null
  const m = (v: number) => (((v % 26) + 26) % 26)
  return [
    [m(inv * k[1][1]), m(-inv * k[0][1])],
    [m(-inv * k[1][0]), m(inv * k[0][0])],
  ]
}

/** 密钥矩阵作用于一个二维向量，结果对 26 取模 */
export function applyMatrix(k: Matrix2, v: [number, number]): [number, number] {
  return [
    (k[0][0] * v[0] + k[0][1] * v[1]) % 26,
    (k[1][0] * v[0] + k[1][1] * v[1]) % 26,
  ]
}

/** 只保留 A-Z，转大写；奇数长度补 X */
export function cleanText(text: string): string {
  let s = text.toUpperCase().replace(/[^A-Z]/g, '')
  if (s.length % 2 === 1) s += 'X'
  return s
}

/** 加密：每两字母作向量乘密钥矩阵模 26 */
export function encrypt(text: string, key: Matrix2): string {
  const s = cleanText(text)
  let out = ''
  for (let i = 0; i < s.length; i += 2) {
    const v: [number, number] = [charToNum(s[i]), charToNum(s[i + 1])]
    const r = applyMatrix(key, v)
    out += numToChar(r[0]) + numToChar(r[1])
  }
  return out
}

/** 解密：用逆矩阵还原，密钥不可逆返回空串 */
export function decrypt(cipher: string, key: Matrix2): string {
  const inv = matModInverse2x2(key)
  if (!inv) return ''
  return encrypt(cipher, inv)
}

export const KEY_MATRIX: Matrix2 = [[3, 3], [2, 5]]
export const SAMPLE = 'HELLO'
