/**
 * 维吉尼亚密码核心算法（纯函数，便于测试）
 *
 * 多表移位加密：把明文和密钥都看作 0-25 的字母序号，
 * 密钥循环对齐到明文，逐字母做模 26 的相加（加密）或相减（解密）。
 * 相比凯撒密码的单一固定偏移，这里每个位置的偏移由密钥决定，
 * 于是同一个明文字母会被加密成不同的密文字母，抵御频率分析。
 */

const A = 'A'.charCodeAt(0)

/** 只保留 A-Z 字母并转大写，其余字符丢弃 */
export function normalize(text: string): string {
  return text.toUpperCase().replace(/[^A-Z]/g, '')
}

/** 字母转 0-25 序号 */
export function toIndex(ch: string): number {
  return ch.charCodeAt(0) - A
}

/** 0-25 序号转字母 */
export function fromIndex(i: number): string {
  return String.fromCharCode(A + ((i % 26) + 26) % 26)
}

/** 把密钥循环对齐到长度 len，返回每个位置对应的密钥字母序号数组 */
export function keyStream(key: string, len: number): number[] {
  const k = normalize(key)
  if (k.length === 0) return new Array(len).fill(0)
  const out: number[] = []
  for (let i = 0; i < len; i++) out.push(toIndex(k[i % k.length]))
  return out
}

/** 加密：密文[i] = (明文[i] + 密钥[i]) mod 26 */
export function encrypt(text: string, key: string): string {
  const p = normalize(text)
  const ks = keyStream(key, p.length)
  let out = ''
  for (let i = 0; i < p.length; i++) out += fromIndex(toIndex(p[i]) + ks[i])
  return out
}

/** 解密：明文[i] = (密文[i] - 密钥[i]) mod 26 */
export function decrypt(text: string, key: string): string {
  const c = normalize(text)
  const ks = keyStream(key, c.length)
  let out = ''
  for (let i = 0; i < c.length; i++) out += fromIndex(toIndex(c[i]) - ks[i])
  return out
}

/** 生成 26x26 维吉尼亚方阵：row 行 col 列的格子 = (row + col) mod 26 的字母 */
export function tabulaRecta(): string[][] {
  const rows: string[][] = []
  for (let r = 0; r < 26; r++) {
    const row: string[] = []
    for (let c = 0; c < 26; c++) row.push(fromIndex(r + c))
    rows.push(row)
  }
  return rows
}

/** 对齐三行结果：明文、循环密钥、密文，均为等长字母数组，便于逐列展示 */
export function alignedRows(text: string, key: string): {
  plain: string[]
  key: string[]
  cipher: string[]
} {
  const p = normalize(text)
  const ks = keyStream(key, p.length)
  const cipher = encrypt(p, key)
  return {
    plain: p.split(''),
    key: ks.map(fromIndex),
    cipher: cipher.split(''),
  }
}

/** 经典示例：明文 ATTACKATDAWN + 密钥 LEMON => 密文 LXFOPVEFRNHR */
export const SAMPLE = { plaintext: 'ATTACKATDAWN', key: 'LEMON' }
