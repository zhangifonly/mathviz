/**
 * 数字根与弃九验算核心算法（纯函数，便于测试）
 *
 * 数字根：反复把一个数各位数字相加，直到只剩一位数。
 * 它等价于模 9 的结果（0 映射为 9，0 本身除外）。
 * 弃九验算：用两边算式的数字根是否一致来快速检查加法/乘法。
 */

/** 求各位数字之和 */
export function digitSum(n: number): number {
  let s = 0
  let x = Math.abs(Math.trunc(n))
  while (x > 0) {
    s += x % 10
    x = Math.floor(x / 10)
  }
  return s
}

/** 反复各位求和，返回每一步的数值（含起点，末项为一位数） */
export function digitalRootSteps(n: number): number[] {
  const steps: number[] = [Math.abs(Math.trunc(n))]
  let x = steps[0]
  while (x >= 10) {
    x = digitSum(x)
    steps.push(x)
  }
  return steps
}

/** 数字根的闭式：1 + (n - 1) % 9；n 为 0 时返回 0 */
export function digitalRoot(n: number): number {
  const x = Math.abs(Math.trunc(n))
  if (x === 0) return 0
  return 1 + (x - 1) % 9
}

export type CastOp = 'add' | 'mul'

export interface CastResult {
  a: number
  b: number
  op: CastOp
  result: number
  rootA: number
  rootB: number
  rootResult: number
  rootCombined: number
  valid: boolean
}

/** 弃九验算：比较两边数字根是否一致 */
export function castingOutNines(a: number, b: number, op: CastOp): CastResult {
  const result = op === 'add' ? a + b : a * b
  const rootA = digitalRoot(a)
  const rootB = digitalRoot(b)
  const rootResult = digitalRoot(result)
  const combined = op === 'add' ? rootA + rootB : rootA * rootB
  const rootCombined = digitalRoot(combined)
  return {
    a, b, op, result,
    rootA, rootB, rootResult, rootCombined,
    valid: rootCombined === rootResult,
  }
}

export const SAMPLES = [12345, 98765, 88888, 100, 9]
