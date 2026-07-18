/**
 * 韦达定理核心算法（纯函数，便于测试）
 *
 * 根与系数的对称关系：一个 n 次多项式的系数，
 * 恰好由它的 n 个根的初等对称多项式决定。
 * 这里从根还原多项式系数（展开乘积），并验证韦达关系。
 */

/** 一组示例根，用于二次/三次演示 */
export const SAMPLE_ROOTS: number[][] = [
  [1, 3],
  [-2, 4],
  [-1, 1, 2],
  [-3, 0, 3],
]

/**
 * 由根还原多项式系数（首项系数固定为 1）。
 * 返回按升幂排列的系数数组 [a0, a1, ..., an]，
 * 即多项式 = a0 + a1 x + ... + an x^n。
 * 展开乘积 (x - r0)(x - r1)...(x - r_{n-1})。
 */
export function rootsToCoeffs(roots: number[]): number[] {
  let coeffs = [1] // 从常数多项式 1 开始（升幂）
  for (const r of roots) {
    // 乘以 (x - r)：新系数[i] = 旧[i-1] - r * 旧[i]
    const next = new Array(coeffs.length + 1).fill(0)
    for (let i = 0; i < coeffs.length; i++) {
      next[i + 1] += coeffs[i]
      next[i] += -r * coeffs[i]
    }
    coeffs = next
  }
  return coeffs
}

/**
 * 第 k 个初等对称多项式 e_k(roots)，k 从 0 开始。
 * e_0 = 1，e_1 = 求和，e_2 = 两两乘积之和，... e_n = 全体乘积。
 */
export function elementarySymmetric(roots: number[], k: number): number {
  const n = roots.length
  if (k < 0 || k > n) return 0
  // dp[j] = 前若干个根中取 j 个的乘积之和
  const dp = new Array(n + 1).fill(0)
  dp[0] = 1
  for (const r of roots) {
    for (let j = Math.min(n, k); j >= 1; j--) {
      dp[j] += dp[j - 1] * r
    }
  }
  return dp[k]
}

export interface VietaResult {
  sum: number // 根之和
  product: number // 根之积
  sumFromCoeffs: number // -a_{n-1}/a_n
  productFromCoeffs: number // (-1)^n a_0/a_n
  sumMatches: boolean
  productMatches: boolean
}

/**
 * 验证韦达定理：
 * 根之和 = -a_{n-1}/a_n，根之积 = (-1)^n a_0/a_n。
 */
export function vietaCheck(roots: number[]): VietaResult {
  const n = roots.length
  const coeffs = rootsToCoeffs(roots) // 升幂 [a0..an]
  const an = coeffs[n]
  const aPrev = coeffs[n - 1]
  const a0 = coeffs[0]
  const sum = roots.reduce((s, r) => s + r, 0)
  const product = roots.reduce((p, r) => p * r, 1)
  const sumFromCoeffs = -aPrev / an
  const productFromCoeffs = (n % 2 === 0 ? 1 : -1) * (a0 / an)
  const eps = 1e-9
  return {
    sum,
    product,
    sumFromCoeffs,
    productFromCoeffs,
    sumMatches: Math.abs(sum - sumFromCoeffs) < eps,
    productMatches: Math.abs(product - productFromCoeffs) < eps,
  }
}

/** 计算多项式在 x 处的值（升幂系数，霍纳法） */
export function evalPoly(coeffs: number[], x: number): number {
  let v = 0
  for (let i = coeffs.length - 1; i >= 0; i--) {
    v = v * x + coeffs[i]
  }
  return v
}
