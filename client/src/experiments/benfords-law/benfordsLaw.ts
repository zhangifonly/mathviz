/**
 * 本福特定律核心算法（纯函数，便于测试）
 *
 * 本福特定律：在很多真实数据集中，首位数字为 d 的概率并非 1/9，
 * 而是 log10(1 + 1/d)。于是首位为 1 的概率约 30.1%，逐位递减，
 * 首位为 9 的概率仅约 4.6%。这里提供理论概率、取首位、
 * 数据集生成与首位分布统计等纯函数。
 */

export type DatasetType = 'powers2' | 'fibonacci' | 'random'

export const DATASETS: DatasetType[] = ['powers2', 'fibonacci', 'random']

/** 首位为 d(1..9) 的本福特理论概率 = log10(1 + 1/d) */
export function benfordProb(d: number): number {
  if (d < 1 || d > 9) return 0
  return Math.log10(1 + 1 / d)
}

/** 取正数 n 的首位有效数字（1..9），0 返回 0 */
export function leadingDigit(n: number): number {
  let x = Math.abs(n)
  if (x === 0) return 0
  while (x >= 10) x /= 10
  while (x < 1) x *= 10
  return Math.floor(x)
}

/** 生成指定数据集的数值序列 */
export function generateDataset(type: DatasetType, count: number): number[] {
  const out: number[] = []
  if (type === 'powers2') {
    let v = 1
    for (let i = 0; i < count; i++) {
      out.push(v)
      v *= 2
    }
  } else if (type === 'fibonacci') {
    let a = 1
    let b = 1
    for (let i = 0; i < count; i++) {
      out.push(a)
      const next = a + b
      a = b
      b = next
    }
  } else {
    // 均匀随机整数：作为反例，首位分布接近平均，不服从本福特
    let s = 123457
    for (let i = 0; i < count; i++) {
      s = (s * 1103515245 + 12345) & 0x7fffffff
      out.push(1 + Math.floor((s / 0x7fffffff) * 999999))
    }
  }
  return out
}

/** 统计一组数的首位分布，返回 9 个频率(1..9)，和为 1 */
export function digitDistribution(nums: number[]): number[] {
  const counts = new Array(9).fill(0)
  let total = 0
  for (const n of nums) {
    const d = leadingDigit(n)
    if (d >= 1 && d <= 9) {
      counts[d - 1]++
      total++
    }
  }
  if (total === 0) return counts
  return counts.map((c) => c / total)
}

export const SAMPLE_COUNT = 60
