/**
 * 格雷码核心算法（纯函数，便于测试）
 *
 * 格雷码是一种二进制编码，相邻两个数的编码只相差一位（汉明距离为 1）。
 * 标准反射格雷码由异或运算得到：gray(n) = n ^ (n >> 1)。
 */

/** 二进制转格雷码：gray = n ^ (n >> 1) */
export function binaryToGray(n: number): number {
  return n ^ (n >> 1)
}

/** 格雷码转二进制：逐位异或前缀 */
export function grayToBinary(g: number): number {
  let b = g
  let shift = g >> 1
  while (shift !== 0) {
    b ^= shift
    shift >>= 1
  }
  return b
}

/** 把整数按固定位宽转成 0/1 数组（高位在前） */
export function toBits(value: number, bits: number): number[] {
  const out: number[] = []
  for (let i = bits - 1; i >= 0; i--) {
    out.push((value >> i) & 1)
  }
  return out
}

/** 生成 bits 位的完整格雷码序列（长度 2^bits），每项为位数组 */
export function grayCodeSequence(bits: number): number[][] {
  const total = 1 << bits
  const seq: number[][] = []
  for (let i = 0; i < total; i++) {
    seq.push(toBits(binaryToGray(i), bits))
  }
  return seq
}

/** 两个等长位数组的汉明距离（不同位的个数） */
export function hammingDistance(a: number[], b: number[]): number {
  let d = 0
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) d++
  }
  return d
}

/** 找出两个位数组第一个不同位的索引，全同返回 -1 */
export function changedBitIndex(a: number[], b: number[]): number {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return i
  }
  return -1
}

export const BITS = [3, 4]
