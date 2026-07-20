/**
 * 二项式定理核心算法（纯函数，便于测试）
 *
 * (a+b)^n 展开后，各项系数恰好是帕斯卡三角（杨辉三角）第 n 行。
 * 用递推 C(n,k)=C(n-1,k-1)+C(n-1,k) 生成，避免阶乘直接相乘导致的溢出。
 */

/** 帕斯卡三角第 n 行：[C(n,0), C(n,1), ..., C(n,n)]，用逐项递推生成 */
export function pascalRow(n: number): number[] {
  const row: number[] = [1]
  for (let k = 1; k <= n; k++) {
    // C(n,k) = C(n,k-1) * (n-k+1) / k，整数除法在组合数下必然整除
    row.push((row[k - 1] * (n - k + 1)) / k)
  }
  return row
}

/** 组合数 C(n,k)：用杨辉三角逐行递推，纯整数加法，绝不溢出到小数 */
export function binomialCoeff(n: number, k: number): number {
  if (k < 0 || k > n) return 0
  let prev: number[] = [1]
  for (let i = 1; i <= n; i++) {
    const cur: number[] = [1]
    for (let j = 1; j < i; j++) {
      cur.push(prev[j - 1] + prev[j])
    }
    cur.push(1)
    prev = cur
  }
  return prev[k]
}

export interface Term {
  coeff: number
  aPow: number
  bPow: number
}

/** (a+b)^n 各项：coeff·a^(n-k)·b^k，k 从 0 到 n */
export function expandTerms(n: number): Term[] {
  const coeffs = pascalRow(n)
  const terms: Term[] = []
  for (let k = 0; k <= n; k++) {
    terms.push({ coeff: coeffs[k], aPow: n - k, bPow: k })
  }
  return terms
}

export const EXPONENTS = [2, 3, 4, 5]
