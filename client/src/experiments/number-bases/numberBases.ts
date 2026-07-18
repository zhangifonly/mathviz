/**
 * 进制转换核心算法（纯函数，便于测试）
 *
 * 位值制：一个数在 base 进制下写成若干位，
 * 每一位的权重是 base 的幂，第 k 位（从右起，0 计）代表 digit×base^k。
 * 十进制逢十进一，二进制逢二进一，本质都是同一套位值规则。
 */

/** 支持的进制上限：0-9A-F 共 16 个字符 */
export const MAX_BASE = 16

/** 字符表，索引即数值：0..9,A..F */
const DIGIT_CHARS = '0123456789ABCDEF'

/**
 * 把非负整数 n 转成 base 进制的数字数组，高位在前。
 * 例：toBase(13, 2) = [1,1,0,1]；toBase(0, 10) = [0]
 */
export function toBase(n: number, base: number): number[] {
  if (!Number.isInteger(n) || n < 0) throw new Error('n 必须是非负整数')
  if (!Number.isInteger(base) || base < 2 || base > MAX_BASE) {
    throw new Error('base 必须是 2..16 的整数')
  }
  if (n === 0) return [0]
  const digits: number[] = []
  let cur = n
  while (cur > 0) {
    digits.unshift(cur % base)
    cur = Math.floor(cur / base)
  }
  return digits
}

/**
 * 把 base 进制的数字数组（高位在前）还原成十进制整数。
 * 例：fromBase([1,1,0,1], 2) = 13
 */
export function fromBase(digits: number[], base: number): number {
  if (!Number.isInteger(base) || base < 2 || base > MAX_BASE) {
    throw new Error('base 必须是 2..16 的整数')
  }
  let value = 0
  for (const d of digits) {
    if (!Number.isInteger(d) || d < 0 || d >= base) {
      throw new Error('数字超出该进制范围')
    }
    value = value * base + d
  }
  return value
}

/**
 * 把非负整数 n 转成 base 进制字符串，字母用大写。
 * 例：toBaseString(255, 16) = 'FF'
 */
export function toBaseString(n: number, base: number): string {
  return toBase(n, base)
    .map((d) => DIGIT_CHARS[d])
    .join('')
}

/** 常用进制：二/八/十/十六 */
export const BASES = [2, 8, 10, 16]
