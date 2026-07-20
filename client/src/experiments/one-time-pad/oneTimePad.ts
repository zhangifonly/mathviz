/**
 * 一次一密（One-Time Pad）核心算法（纯函数，便于测试）
 *
 * 用一条与明文等长的真随机密钥，对明文逐位做异或（XOR）得到密文。
 * 异或运算是对合的：对密文再异或同一密钥，即还原明文。
 * 当密钥真随机、等长、且只用一次时，可证明达到完美保密。
 */

/** 文本转字节数组（按字符码，ASCII 友好） */
export function toBytes(text: string): number[] {
  const out: number[] = []
  for (let i = 0; i < text.length; i++) out.push(text.charCodeAt(i) & 0xff)
  return out
}

/** 字节数组转文本 */
export function toText(bytes: number[]): string {
  return bytes.map((b) => String.fromCharCode(b)).join('')
}

/** 逐字节异或，长度取两者较短 */
export function xorBytes(a: number[], b: number[]): number[] {
  const n = Math.min(a.length, b.length)
  const out: number[] = []
  for (let i = 0; i < n; i++) out.push((a[i] ^ b[i]) & 0xff)
  return out
}

/** 加密：明文异或密钥 */
export function encrypt(plain: number[], key: number[]): number[] {
  return xorBytes(plain, key)
}

/** 解密：密文异或同一密钥（异或对合，与加密同一运算） */
export function decrypt(cipher: number[], key: number[]): number[] {
  return xorBytes(cipher, key)
}

/** 生成 len 字节的伪随机密钥（线性同余，seed 保证可复现测试） */
export function generateKey(len: number, seed = 1): number[] {
  let s = seed & 0x7fffffff
  const out: number[] = []
  for (let i = 0; i < len; i++) {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    out.push((s >>> 16) & 0xff)
  }
  return out
}

/**
 * 完美保密的核心：给定密文，想让它"解出"任意目标明文，
 * 只需选一把对应密钥 k' = 密文 XOR 目标明文。
 * 于是同一段密文可以对应任何等长明文，攻击者一无所获。
 */
export function keyForTarget(cipher: number[], target: number[]): number[] {
  return xorBytes(cipher, target)
}

/** 取一个字节的 8 位（高位在前） */
export function bitsOf(byte: number): number[] {
  const bits: number[] = []
  for (let i = 7; i >= 0; i--) bits.push((byte >> i) & 1)
  return bits
}

/** 密钥重用的危险：两条密文异或 = 两条明文异或（密钥被抵消） */
export function reuseLeak(cipher1: number[], cipher2: number[]): number[] {
  return xorBytes(cipher1, cipher2)
}

export const SAMPLE = {
  plain: toBytes('HELLO'),
  plain2: toBytes('WORLD'),
  key: generateKey(5, 20260718),
}

export const DEMO_MESSAGES = ['HELLO', 'HI', 'ATTACK']
