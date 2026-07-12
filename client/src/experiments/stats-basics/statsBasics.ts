/**
 * 统计初步（纯函数，便于测试）
 *
 * 一组数据的集中趋势（平均数、中位数、众数）与
 * 离散程度（极差、方差、标准差）的基本计算。
 * 全部为无 DOM 的纯函数。
 */

/** 算术平均数：所有数之和除以个数 */
export function mean(data: number[]): number {
  if (data.length === 0) return 0
  return data.reduce((s, v) => s + v, 0) / data.length
}

/** 中位数：排序后正中间的数；偶数个时取中间两数的平均 */
export function median(data: number[]): number {
  if (data.length === 0) return 0
  const s = [...data].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 === 0 ? (s[m - 1] + s[m]) / 2 : s[m]
}

/** 众数：出现次数最多的数（可能有多个），按数值升序返回 */
export function mode(data: number[]): number[] {
  if (data.length === 0) return []
  const counts = new Map<number, number>()
  for (const v of data) counts.set(v, (counts.get(v) ?? 0) + 1)
  let max = 0
  for (const c of counts.values()) if (c > max) max = c
  const result: number[] = []
  for (const [v, c] of counts) if (c === max) result.push(v)
  return result.sort((a, b) => a - b)
}

/** 极差：最大值减最小值 */
export function range(data: number[]): number {
  if (data.length === 0) return 0
  return Math.max(...data) - Math.min(...data)
}

/** 总体方差：各数与平均数之差的平方的平均 */
export function variance(data: number[]): number {
  if (data.length === 0) return 0
  const m = mean(data)
  return data.reduce((s, v) => s + (v - m) * (v - m), 0) / data.length
}

/** 标准差：方差的算术平方根 */
export function stdDev(data: number[]): number {
  return Math.sqrt(variance(data))
}

export interface StatsSummary {
  mean: number
  median: number
  mode: number[]
  range: number
  variance: number
  stdDev: number
}

/** 一次性算出全部统计量 */
export function summarize(data: number[]): StatsSummary {
  return {
    mean: mean(data),
    median: median(data),
    mode: mode(data),
    range: range(data),
    variance: variance(data),
    stdDev: stdDev(data),
  }
}

export interface DatasetOption {
  key: string
  label: string
  data: number[]
  note: string
}

export const DATASET_OPTIONS: DatasetOption[] = [
  { key: 'scores', label: '班级考试成绩', data: [70, 75, 80, 80, 85, 90, 95], note: '较集中，标准差偏小' },
  { key: 'heights', label: '身高样本(cm)', data: [150, 155, 160, 160, 165, 170, 180], note: '含一个偏高值' },
  { key: 'spread', label: '两极分化数据', data: [10, 20, 30, 50, 80, 90, 100], note: '离散大，标准差大' },
]
