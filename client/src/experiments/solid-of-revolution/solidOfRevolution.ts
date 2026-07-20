/**
 * 旋转体体积核心算法（纯函数，便于测试）
 *
 * 曲线 y=f(x) (f>=0) 在 [a,b] 上与 x 轴围成的区域，绕 x 轴旋转一周得到旋转体。
 *  - 圆盘法：沿 x 方向切成薄圆盘，V = ∫ π f(x)^2 dx
 *  - 壳层法：沿 y 方向套成薄圆筒，V = ∫ 2π y L(y) dy
 *    其中 L(y) 是满足 f(x)>=y 的 x 的总长度。
 * 两法计算的是同一个立体，数值结果必然一致。
 */

export type Fn = (x: number) => number

export interface CurveDef {
  id: string
  label: string
  fn: Fn
  a: number
  b: number
}

/** 复合辛普森积分 ∫[a,b] g(x) dx，n 为偶数子区间数 */
export function simpson(g: Fn, a: number, b: number, n: number): number {
  const m = n % 2 === 0 ? n : n + 1
  const h = (b - a) / m
  let sum = g(a) + g(b)
  for (let i = 1; i < m; i++) {
    sum += (i % 2 === 0 ? 2 : 4) * g(a + i * h)
  }
  return (sum * h) / 3
}

/** 圆盘法体积：V = ∫ π f(x)^2 dx */
export function diskVolume(fn: Fn, a: number, b: number, n = 400): number {
  return simpson((x) => Math.PI * fn(x) * fn(x), a, b, n)
}

/** 曲线在 [a,b] 上的最大值（用于确定壳层积分上限） */
export function maxValue(fn: Fn, a: number, b: number, n = 400): number {
  let mx = 0
  for (let i = 0; i <= n; i++) {
    const v = fn(a + ((b - a) * i) / n)
    if (v > mx) mx = v
  }
  return mx
}

/** 高度 y 处，满足 f(x)>=y 的 x 的总长度 L(y) */
export function lengthAtHeight(fn: Fn, a: number, b: number, y: number, n = 400): number {
  let count = 0
  for (let i = 0; i < n; i++) {
    const x = a + ((b - a) * (i + 0.5)) / n
    if (fn(x) >= y) count++
  }
  return (count / n) * (b - a)
}

/** 壳层法体积：V = ∫ 2π y L(y) dy，与圆盘法算同一立体 */
export function shellVolume(fn: Fn, a: number, b: number, n = 400): number {
  const top = maxValue(fn, a, b, n)
  if (top <= 0) return 0
  return simpson((y) => 2 * Math.PI * y * lengthAtHeight(fn, a, b, y, n), 0, top, n)
}

/** 可选曲线：均在 [0,4] 上非负 */
export const FUNCTIONS: CurveDef[] = [
  { id: 'line', label: 'f(x) = x', fn: (x) => x, a: 0, b: 2 },
  { id: 'sqrt', label: 'f(x) = √x', fn: (x) => Math.sqrt(Math.max(x, 0)), a: 0, b: 4 },
  { id: 'quad', label: 'f(x) = x²/4', fn: (x) => (x * x) / 4, a: 0, b: 2 },
  { id: 'hump', label: 'f(x) = 0.4x(4-x)', fn: (x) => 0.4 * x * (4 - x), a: 0, b: 4 },
]

/** 可选积分区间（右端点），均落在各曲线定义域内 */
export const INTERVALS = [2, 3, 4]

export function findCurve(id: string): CurveDef {
  return FUNCTIONS.find((f) => f.id === id) ?? FUNCTIONS[0]
}
