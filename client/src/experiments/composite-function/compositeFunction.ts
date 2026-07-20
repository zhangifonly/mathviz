/**
 * 复合函数核心算法（纯函数，便于测试）
 *
 * 复合函数把两个函数串起来：先用内层 g 作用于 x，
 * 再把结果送进外层 f，记作 (f∘g)(x) = f(g(x))。
 * 这里提供一个基本函数库与 compose、sampleCurve 两个工具。
 */

export interface MathFunc {
  key: string
  label: string
  fn: (x: number) => number
}

export interface Point {
  x: number
  y: number
}

/** 基本函数库：每个函数都带一个纯函数 fn(x) */
export const FUNCTIONS: MathFunc[] = [
  { key: 'square', label: '平方 x²', fn: (x) => x * x },
  { key: 'sine', label: '正弦 sin x', fn: (x) => Math.sin(x) },
  { key: 'exp', label: '指数 eˣ', fn: (x) => Math.exp(x) },
  { key: 'linear', label: '线性 2x+1', fn: (x) => 2 * x + 1 },
  { key: 'abs', label: '绝对值 |x|', fn: (x) => Math.abs(x) },
]

/** 按 key 取出函数定义，找不到时回退到第一个 */
export function getFunc(key: string): MathFunc {
  return FUNCTIONS.find((f) => f.key === key) ?? FUNCTIONS[0]
}

/**
 * 复合两个函数：返回新函数 x -> f(g(x))。
 * 注意次序：先作用内层 g，再作用外层 f。
 */
export function compose(
  f: (x: number) => number,
  g: (x: number) => number,
): (x: number) => number {
  return (x: number) => f(g(x))
}

/**
 * 在区间 [x0, x1] 上等间隔采样 n+1 个点，得到曲线折线。
 * 过滤掉非有限值（如 exp 溢出），保证可视化稳定。
 */
export function sampleCurve(
  fn: (x: number) => number,
  x0: number,
  x1: number,
  n: number,
): Point[] {
  const pts: Point[] = []
  for (let i = 0; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n
    const y = fn(x)
    if (Number.isFinite(y)) pts.push({ x, y })
  }
  return pts
}

/** 演示步进：默认沿 x 轴扫描映射点的位置序列 */
export const DEMO_XS = [-1.5, -0.75, 0, 0.75, 1.5]
