/**
 * 快速幂核心算法（纯函数，便于测试）
 *
 * 平方-乘（二进制）快速幂：把指数写成二进制，
 * 从低位到高位扫描。底数每步平方一次，遇到为 1 的位就把
 * 当前底数乘进结果。乘法次数从朴素法的 exp-1 次降到 O(log exp)。
 * 全程用 BigInt 取模，保证大数正确。
 */

export interface PowStep {
  bit: number        // 当前处理的二进制位（0 或 1）
  bitIndex: number   // 位序（从低位 0 开始）
  base: string       // 本步开始时的底数（模后，十进制字符串）
  multiplied: boolean // 本步是否把底数乘进结果
  result: string     // 本步结束后的累乘结果
}

export interface PowTrace {
  steps: PowStep[]
  result: string       // 最终 base^exp mod m
  bits: number[]       // 指数的二进制位，低位在前
  fastMults: number    // 快速幂实际乘法次数
  naiveMults: number   // 朴素法乘法次数 = exp-1
}

/** 把指数拆成二进制位数组，低位在前 */
export function toBits(exp: number): number[] {
  if (exp < 0) throw new Error('exp must be >= 0')
  const bits: number[] = []
  let e = exp
  while (e > 0) {
    bits.push(e & 1)
    e = Math.floor(e / 2)
  }
  return bits.length ? bits : [0]
}

/**
 * 平方-乘快速幂，记录每一步。mod<=0 表示不取模。
 */
export function fastPow(base: number, exp: number, mod = 0): PowTrace {
  if (exp < 0) throw new Error('exp must be >= 0')
  const m = BigInt(mod)
  const useMod = mod > 0
  const reduce = (v: bigint) => (useMod ? ((v % m) + m) % m : v)

  let b = reduce(BigInt(base))
  let result = reduce(1n)
  let fastMults = 0
  const bits = toBits(exp)
  const steps: PowStep[] = []

  for (let i = 0; i < bits.length; i++) {
    const stepBase = b
    const bit = bits[i]
    if (bit === 1) {
      result = reduce(result * b)
      fastMults++
    }
    steps.push({
      bit,
      bitIndex: i,
      base: stepBase.toString(),
      multiplied: bit === 1,
      result: result.toString(),
    })
    // 为下一位准备：底数平方（最后一位后无需再算）
    if (i < bits.length - 1) {
      b = reduce(b * b)
      fastMults++
    }
  }

  return {
    steps,
    result: result.toString(),
    bits,
    fastMults,
    naiveMults: exp > 0 ? exp - 1 : 0,
  }
}

export const SAMPLES: { base: number; exp: number; mod: number }[] = [
  { base: 2, exp: 100, mod: 1000000007 },
  { base: 3, exp: 13, mod: 0 },
  { base: 7, exp: 45, mod: 1000 },
]
