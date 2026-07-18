/**
 * 割线法核心算法（纯函数，便于测试）
 *
 * 割线法是牛顿法的"免导数"版本：用最近两点连线（割线）
 * 与 x 轴的交点作为新的根估计，反复迭代逼近方程 f(x)=0 的根。
 * 迭代公式：x_{n+1} = x_n - f(x_n) * (x_n - x_{n-1}) / (f(x_n) - f(x_{n-1}))
 * 收敛阶约为黄金比例 1.618（超线性），无需计算导数。
 */

export type Fn = (x: number) => number

/** 一步割线迭代的记录：两点及其割线与 x 轴的交点 */
export interface SecantStep {
  x0: number
  y0: number
  x1: number
  y1: number
  xNext: number
}

/** 可选函数集合 */
export interface FnEntry {
  key: string
  label: string
  fn: Fn
  x0: number
  x1: number
  root: number
}

export const FUNCTIONS: FnEntry[] = [
  { key: 'cubic', label: 'x³ - x - 2', fn: (x) => x * x * x - x - 2, x0: 1, x1: 2, root: 1.5214 },
  { key: 'cos', label: 'cos(x) - x', fn: (x) => Math.cos(x) - x, x0: 0, x1: 1, root: 0.7391 },
  { key: 'quad', label: 'x² - 3', fn: (x) => x * x - 3, x0: 1, x1: 2, root: 1.7320 },
]

/**
 * 执行割线法迭代，返回每一步的记录。
 * @param fn 目标函数
 * @param x0 初始点 0
 * @param x1 初始点 1
 * @param steps 迭代步数
 */
export function secant(fn: Fn, x0: number, x1: number, steps: number): SecantStep[] {
  const result: SecantStep[] = []
  let a = x0
  let b = x1
  for (let i = 0; i < steps; i++) {
    const ya = fn(a)
    const yb = fn(b)
    const denom = yb - ya
    if (denom === 0) break
    const xNext = b - yb * (b - a) / denom
    result.push({ x0: a, y0: ya, x1: b, y1: yb, xNext })
    if (!isFinite(xNext)) break
    a = b
    b = xNext
  }
  return result
}

/** 取迭代最终估计值（无步则返回 x1） */
export function finalEstimate(steps: SecantStep[], fallback: number): number {
  return steps.length > 0 ? steps[steps.length - 1].xNext : fallback
}

export const STEP_COUNTS = [2, 4, 6]
