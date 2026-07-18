/**
 * 置信区间核心算法（纯函数，便于测试）
 *
 * 从正态总体 N(mu, sigma^2) 抽样，用样本均值估计未知均值，
 * 并构造置信区间 [mean - z*se, mean + z*se]，其中 se = sigma/sqrt(n)。
 * 模拟多次抽样，统计有多少区间真正覆盖了真值（理论上应接近置信水平）。
 */

export interface Interval {
  lower: number
  upper: number
  mean: number
  covers: boolean
}

/** 支持的置信水平 */
export const CONF_LEVELS = [0.90, 0.95, 0.99]

/** 各置信水平对应的标准正态临界值 z（双侧） */
export const Z_TABLE: Record<string, number> = {
  '0.9': 1.645,
  '0.95': 1.96,
  '0.99': 2.576,
}

/** 由置信水平取 z 临界值 */
export function zForLevel(level: number): number {
  return Z_TABLE[String(level)] ?? 1.96
}

/** 线性同余伪随机，保证可复现 */
function makeRand(seed: number): () => number {
  let s = (seed & 0x7fffffff) || 1
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

/** Box-Muller：把两个均匀随机数转成一个标准正态随机数 */
export function boxMuller(u1: number, u2: number): number {
  const clamped = u1 < 1e-12 ? 1e-12 : u1
  return Math.sqrt(-2 * Math.log(clamped)) * Math.cos(2 * Math.PI * u2)
}

/** 从 N(mu, sigma^2) 抽取 n 个样本 */
export function sampleNormal(mu: number, sigma: number, n: number, seed = 1): number[] {
  const rand = makeRand(seed)
  const out: number[] = []
  for (let i = 0; i < n; i++) {
    out.push(mu + sigma * boxMuller(rand(), rand()))
  }
  return out
}

/** 样本均值 */
export function sampleMean(data: number[]): number {
  if (data.length === 0) return 0
  return data.reduce((a, b) => a + b, 0) / data.length
}

/** 标准误 se = sigma / sqrt(n)（sigma 已知时） */
export function standardError(sigma: number, n: number): number {
  return sigma / Math.sqrt(n)
}

/** 构造一次置信区间；trueMu 用于判定是否覆盖 */
export function buildInterval(
  mean: number,
  sigma: number,
  n: number,
  level: number,
  trueMu: number,
): Interval {
  const se = standardError(sigma, n)
  const half = zForLevel(level) * se
  const lower = mean - half
  const upper = mean + half
  return { lower, upper, mean, covers: trueMu >= lower && trueMu <= upper }
}

/** 模拟多次抽样，返回每次的区间与总覆盖率 */
export function manyIntervals(
  trueMu: number,
  sigma: number,
  n: number,
  trials: number,
  level: number,
  seed = 1,
): { intervals: Interval[]; coverage: number } {
  const intervals: Interval[] = []
  let covered = 0
  for (let t = 0; t < trials; t++) {
    const data = sampleNormal(trueMu, sigma, n, seed + t * 7919)
    const iv = buildInterval(sampleMean(data), sigma, n, level, trueMu)
    if (iv.covers) covered++
    intervals.push(iv)
  }
  return { intervals, coverage: trials === 0 ? 0 : covered / trials }
}
