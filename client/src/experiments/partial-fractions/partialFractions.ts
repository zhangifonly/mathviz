/**
 * 部分分式分解核心算法（纯函数，便于测试）
 *
 * 对分母为若干个不同一次因式乘积的真分式
 *   P(x) / [(x-r_1)(x-r_2)...(x-r_n)]
 * 做部分分式分解，写成
 *   A_1/(x-r_1) + A_2/(x-r_2) + ... + A_n/(x-r_n)
 *
 * 用留数法(cover-up)求系数：A_i = P(r_i) / Q'(r_i)，
 * 其中 Q(x) 为分母，Q'(r_i) = ∏_{j≠i} (r_i - r_j)。
 *
 * 多项式一律用升幂系数数组表示：coeffs[k] 是 x^k 的系数。
 */

export interface FractionTerm {
  root: number   // 一次因式的根 r_i
  coeff: number  // 对应分式的系数 A_i
}

/** 升幂多项式求值：coeffs[0] + coeffs[1]x + coeffs[2]x^2 + ... */
export function polyEval(coeffs: number[], x: number): number {
  let acc = 0
  for (let k = coeffs.length - 1; k >= 0; k--) {
    acc = acc * x + coeffs[k]
  }
  return acc
}

/** 分母对某根 r_i 求导后的取值 Q'(r_i) = ∏_{j≠i}(r_i - r_j) */
export function denomDerivAtRoot(roots: number[], i: number): number {
  let prod = 1
  for (let j = 0; j < roots.length; j++) {
    if (j !== i) prod *= roots[i] - roots[j]
  }
  return prod
}

/**
 * 部分分式分解：返回每个一次因式对应的 {root, coeff}。
 * 要求 roots 互不相同（否则某个 Q'(r_i)=0）。
 */
export function decompose(numerCoeffs: number[], roots: number[]): FractionTerm[] {
  return roots.map((r, i) => ({
    root: r,
    coeff: polyEval(numerCoeffs, r) / denomDerivAtRoot(roots, i),
  }))
}

/** 原有理式求值：P(x) / ∏(x - r_j) */
export function evalRational(numerCoeffs: number[], roots: number[], x: number): number {
  let denom = 1
  for (const r of roots) denom *= x - r
  return polyEval(numerCoeffs, x) / denom
}

/** 分解后各简单分式之和求值：Σ A_i/(x - r_i) */
export function evalDecomposition(terms: FractionTerm[], x: number): number {
  let sum = 0
  for (const t of terms) sum += t.coeff / (x - t.root)
  return sum
}

export interface Sample {
  label: string
  numer: number[] // 分子（升幂系数）
  roots: number[] // 分母的各不同根
}

/** 若干组例子：分子系数 + 分母根 */
export const SAMPLES: Sample[] = [
  { label: '(3x+1)/[(x-1)(x+2)]', numer: [1, 3], roots: [1, -2] },
  { label: '5/[(x-2)(x+3)]', numer: [5], roots: [2, -3] },
  { label: '(x^2+1)/[(x)(x-2)(x+2)]', numer: [1, 0, 1], roots: [0, 2, -2] },
  { label: '(2x-4)/[(x-1)(x-3)]', numer: [-4, 2], roots: [1, 3] },
]
