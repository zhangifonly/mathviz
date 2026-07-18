/**
 * 单样本 z 检验核心算法（纯函数，便于测试）
 *
 * 已知总体标准差 sigma 时，用样本均值检验原假设 H0: mu = mu0。
 * 检验统计量 z = (mean - mu0) / (sigma / sqrt(n)) 在 H0 下近似标准正态。
 * p 值用标准正态 CDF 计算（双侧），再与显著性水平 alpha 比较决定是否拒绝。
 */

export interface TestResult {
  z: number       // 检验统计量
  p: number       // 双侧 p 值
  reject: boolean // 是否在给定 alpha 下拒绝 H0
  zCrit: number   // 双侧临界值
}

export interface Scenario {
  id: string
  name: string
  mu0: number
  sigma: number
  n: number
  mean: number
}

/** 检验统计量 z */
export function zStatistic(mean: number, mu0: number, sigma: number, n: number): number {
  if (sigma <= 0 || n <= 0) return 0
  return (mean - mu0) / (sigma / Math.sqrt(n))
}

/** 误差函数 erf 的数值近似（Abramowitz-Stegun 7.1.26，绝对误差 < 1.5e-7） */
export function erf(x: number): number {
  const sign = x < 0 ? -1 : 1
  const ax = Math.abs(x)
  const t = 1 / (1 + 0.3275911 * ax)
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t +
      0.254829592) *
      t *
      Math.exp(-ax * ax)
  return sign * y
}

/** 标准正态分布 CDF，用 erf 近似 */
export function normalCdf(x: number): number {
  return 0.5 * (1 + erf(x / Math.SQRT2))
}

/** 双侧 p 值：P(|Z| >= |z|) */
export function pValue(z: number): number {
  return 2 * (1 - normalCdf(Math.abs(z)))
}

/** 给定 alpha 求双侧临界值（用查表 + 线性插值近似分位数） */
export function zCritical(alpha: number): number {
  // 常用双侧临界值，覆盖 ALPHAS
  const table: Record<string, number> = { '0.05': 1.959964, '0.01': 2.575829 }
  const key = alpha.toString()
  if (table[key]) return table[key]
  // 兜底：二分求 CDF 反函数
  let lo = 0
  let hi = 6
  const target = 1 - alpha / 2
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2
    if (normalCdf(mid) < target) lo = mid
    else hi = mid
  }
  return (lo + hi) / 2
}

/** 完整单样本 z 检验 */
export function runTest(
  mean: number,
  mu0: number,
  sigma: number,
  n: number,
  alpha: number,
): TestResult {
  const z = zStatistic(mean, mu0, sigma, n)
  const p = pValue(z)
  const zCrit = zCritical(alpha)
  return { z, p, reject: Math.abs(z) >= zCrit, zCrit }
}

export const ALPHAS = [0.05, 0.01]

export const SCENARIOS: Scenario[] = [
  { id: 'drug', name: '新药疗效', mu0: 100, sigma: 15, n: 30, mean: 106 },
  { id: 'battery', name: '电池寿命', mu0: 500, sigma: 40, n: 25, mean: 512 },
  { id: 'coffee', name: '咖啡净含量', mu0: 250, sigma: 8, n: 36, mean: 248 },
]
