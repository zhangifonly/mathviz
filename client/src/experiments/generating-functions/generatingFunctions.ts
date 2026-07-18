/**
 * 生成函数核心算法（纯函数，便于测试）
 *
 * 把一个数列 a0, a1, a2, ... 编码成幂级数 a0 + a1·x + a2·x^2 + ...
 * 这个多项式/幂级数就是数列的“生成函数”。
 * 两个生成函数相乘，系数做的是卷积——恰好对应组合计数里的“配对求和”。
 */

/** 用系数数组表示多项式/截断幂级数，下标 i 即 x^i 的系数 */
export type Poly = number[]

/** 多项式乘法 = 系数卷积：(a·b)_k = Σ a_i · b_{k-i} */
export function multiply(a: Poly, b: Poly): Poly {
  if (a.length === 0 || b.length === 0) return []
  const r = new Array(a.length + b.length - 1).fill(0)
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      r[i + j] += a[i] * b[j]
    }
  }
  return r
}

/** 幂级数的整数次幂：a^n，反复卷积 */
export function power(a: Poly, n: number): Poly {
  let result: Poly = [1]
  for (let k = 0; k < n; k++) {
    result = multiply(result, a)
  }
  return result
}

/** 单颗骰子的生成函数 x + x^2 + ... + x^6，下标 1..6 系数为 1 */
export const DIE: Poly = [0, 1, 1, 1, 1, 1, 1]

/**
 * n 颗骰子点数之和的分布 = 单骰生成函数的 n 次幂。
 * 返回系数数组，下标 s 处的值 = 和恰为 s 的方案数。
 */
export function diceSumDistribution(numDice: number): Poly {
  return power(DIE, numDice)
}

/**
 * 斐波那契数列 F_0..F_n，来自生成函数 x / (1 - x - x^2) 的系数。
 * 分母对应递推 (1 - x - x^2)·G = x，展开即 F_k = F_{k-1} + F_{k-2}。
 */
export function fibonacciCoeffs(n: number): Poly {
  const f: Poly = []
  for (let i = 0; i <= n; i++) {
    if (i === 0) f.push(0)
    else if (i === 1) f.push(1)
    else f.push(f[i - 1] + f[i - 2])
  }
  return f
}

/** 系数序列之和（组合计数里常用于总方案数校验） */
export function coeffSum(a: Poly): number {
  return a.reduce((s, v) => s + v, 0)
}

/** 一个可展示的例子：标签 + 系数序列 */
export interface Example {
  id: string
  label: string
  coeffs: Poly
}

/** 预置示例：两/三颗骰子之和分布、斐波那契数列 */
export const EXAMPLES: Example[] = [
  { id: 'dice2', label: '两骰子之和 (x+…+x⁶)²', coeffs: diceSumDistribution(2) },
  { id: 'dice3', label: '三骰子之和 (x+…+x⁶)³', coeffs: diceSumDistribution(3) },
  { id: 'fib', label: '斐波那契 x/(1−x−x²)', coeffs: fibonacciCoeffs(11) },
]
