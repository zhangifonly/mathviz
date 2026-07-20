/**
 * Logistic 分岔图核心算法（纯函数，便于测试）
 *
 * logistic 映射：x_{n+1} = r * x_n * (1 - x_n)
 * 随着参数 r 增大，系统从单一不动点，经历倍周期分岔
 * （周期 1 -> 2 -> 4 -> 8 ...），最终进入混沌。
 * 本模块提供迭代、稳态采样与周期检测的纯函数。
 */

/** 单步 logistic 映射 */
export function logisticStep(r: number, x: number): number {
  return r * x * (1 - x)
}

/**
 * 迭代 logistic 映射：先弃暂态 warmup 步，再返回随后的稳态采样值。
 * @param r      控制参数
 * @param x0     初始值 (0,1)
 * @param warmup 丢弃的暂态步数
 * @param sample 采样步数（返回长度）
 */
export function iterateSteady(
  r: number,
  x0 = 0.5,
  warmup = 300,
  sample = 200,
): number[] {
  let x = x0
  for (let i = 0; i < warmup; i++) x = logisticStep(r, x)
  const out: number[] = []
  for (let i = 0; i < sample; i++) {
    x = logisticStep(r, x)
    out.push(x)
  }
  return out
}

export interface BifurcationColumn {
  r: number
  values: number[]
}

/**
 * 生成分岔数据：在 [rMin, rMax] 上取 steps 个 r，
 * 每个 r 迭代取稳态值集合。
 */
export function bifurcationData(
  rMin: number,
  rMax: number,
  steps: number,
  warmup = 300,
  sample = 200,
): BifurcationColumn[] {
  const cols: BifurcationColumn[] = []
  const span = rMax - rMin
  for (let i = 0; i < steps; i++) {
    const r = rMin + (span * i) / (steps - 1)
    cols.push({ r, values: iterateSteady(r, 0.5, warmup, sample) })
  }
  return cols
}

/**
 * 检测周期：在稳态值里数出不同值的个数（按精度归并）。
 * 返回 0 表示混沌（不同值超过 maxPeriod）。
 */
export function detectPeriod(
  r: number,
  maxPeriod = 16,
  eps = 1e-4,
): number {
  const vals = iterateSteady(r, 0.5, 1000, maxPeriod * 4)
  const uniq: number[] = []
  for (const v of vals) {
    if (!uniq.some((u) => Math.abs(u - v) < eps)) uniq.push(v)
    if (uniq.length > maxPeriod) return 0
  }
  return uniq.length
}

/** r 的显示范围（横轴）：3..4 是倍周期到混沌的经典窗口 */
export const R_RANGE = [3, 4] as const

/** 预设放大窗口，用于交互展示自相似 */
export const R_WINDOWS: Array<[number, number]> = [
  [3.0, 4.0],
  [3.4, 3.6],
  [3.54, 3.58],
]
