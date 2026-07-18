/**
 * 反常积分核心算法（纯函数，便于测试）
 *
 * 反常积分 = 积分区间无穷 或 被积函数无界。
 * 我们用数值积分（复合辛普森法）计算 ∫ 从 a 到 T 的定积分，
 * 随上限 T 逐步增大，得到面积序列，观察 T→∞ 时是否收敛到有限值。
 */

export type Fn = (x: number) => number

/** 复合辛普森法求 ∫ 从 a 到 b 的定积分，n 为偶数子区间数 */
export function integrate(fn: Fn, a: number, b: number, n = 2000): number {
  if (b <= a) return 0
  const m = n % 2 === 0 ? n : n + 1
  const h = (b - a) / m
  let sum = fn(a) + fn(b)
  for (let i = 1; i < m; i++) {
    const x = a + i * h
    sum += (i % 2 === 1 ? 4 : 2) * fn(x)
  }
  return (h / 3) * sum
}

/**
 * 计算 ∫ 从 a 到每个上限 T 的定积分值序列。
 * @returns 与 upperLimits 一一对应的面积数组
 */
export function improperIntegral(fn: Fn, a: number, upperLimits: number[]): number[] {
  return upperLimits.map((T) => integrate(fn, a, T, 2000))
}

/** 生成从 a 到 maxT 的一组递增上限（steps 个） */
export function makeUpperLimits(a: number, maxT: number, steps: number): number[] {
  const out: number[] = []
  for (let i = 1; i <= steps; i++) {
    out.push(a + ((maxT - a) * i) / steps)
  }
  return out
}

/** 判断面积序列是否趋于收敛：末段增量足够小则视为收敛 */
export function isConverging(values: number[], eps = 1e-2): boolean {
  if (values.length < 3) return false
  const last = values[values.length - 1]
  const prev = values[values.length - 2]
  return Math.abs(last - prev) < eps
}

export interface FnInfo {
  key: string
  label: string
  fn: Fn
  converges: boolean
  value: number | null
}

/** 经典反常积分示例，起点 a=1（1/x、1/x² 均在 x=1 起积到无穷） */
export const FUNCTIONS: FnInfo[] = [
  { key: 'inv-sq', label: '1/x²', fn: (x) => 1 / (x * x), converges: true, value: 1 },
  { key: 'inv-x', label: '1/x', fn: (x) => 1 / x, converges: false, value: null },
  { key: 'exp-neg', label: 'e^(-x)', fn: (x) => Math.exp(-x), converges: true, value: Math.exp(-1) },
]

export const START_A = 1
export const MAX_T = 40
