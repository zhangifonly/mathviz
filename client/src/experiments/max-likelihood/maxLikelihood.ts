/**
 * 最大似然估计核心算法（纯函数，便于测试）
 *
 * 给定一批正态分布的观测数据，我们想找出最可能生成这些数据的均值参数 mu。
 * 对数似然函数把每个数据点的概率密度取对数后相加；使它最大的 mu 就是 MLE。
 * 对正态分布而言，mu 的最大似然估计恰好等于样本均值（有闭式解）。
 */

const LOG_2PI = Math.log(2 * Math.PI)

/** 正态分布的对数概率密度 log N(x; mu, sigma) */
export function logNormalPdf(x: number, mu: number, sigma: number): number {
  const z = (x - mu) / sigma
  return -0.5 * LOG_2PI - Math.log(sigma) - 0.5 * z * z
}

/** 给定数据与参数，计算对数似然（各点对数密度之和） */
export function logLikelihood(data: number[], mu: number, sigma: number): number {
  let sum = 0
  for (const x of data) sum += logNormalPdf(x, mu, sigma)
  return sum
}

/** 正态分布 mu 的最大似然估计 = 样本均值（闭式解） */
export function mleMu(data: number[]): number {
  if (data.length === 0) return 0
  let s = 0
  for (const x of data) s += x
  return s / data.length
}

/** 在 [lo, hi] 上等距取 steps 个 mu，返回 (mu, 对数似然) 序列 */
export function likelihoodCurve(
  data: number[],
  sigma: number,
  lo: number,
  hi: number,
  steps = 120,
): { mu: number; ll: number }[] {
  const out: { mu: number; ll: number }[] = []
  for (let i = 0; i <= steps; i++) {
    const mu = lo + ((hi - lo) * i) / steps
    out.push({ mu, ll: logLikelihood(data, mu, sigma) })
  }
  return out
}

/** 网格搜索找到使对数似然最大的 mu（应逼近样本均值） */
export function gridSearchMle(
  data: number[],
  sigma: number,
  lo: number,
  hi: number,
  steps = 400,
): number {
  let bestMu = lo
  let bestLl = -Infinity
  for (let i = 0; i <= steps; i++) {
    const mu = lo + ((hi - lo) * i) / steps
    const ll = logLikelihood(data, mu, sigma)
    if (ll > bestLl) {
      bestLl = ll
      bestMu = mu
    }
  }
  return bestMu
}

export interface Dataset {
  name: string
  values: number[]
}

/** 三组预置的正态观测样本（真实数字，均值各不相同） */
export const DATASETS: Dataset[] = [
  { name: '样本 A', values: [4.8, 5.2, 4.6, 5.5, 5.0, 4.9, 5.3, 4.7] },
  { name: '样本 B', values: [7.1, 6.5, 7.8, 6.9, 7.4, 7.0, 6.7, 7.6, 7.2] },
  { name: '样本 C', values: [2.1, 3.4, 2.8, 3.0, 2.5, 3.2, 2.9, 2.6, 3.1, 2.7] },
]
