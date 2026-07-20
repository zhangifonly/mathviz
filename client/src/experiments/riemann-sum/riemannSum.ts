/**
 * 黎曼和核心算法（纯函数，便于测试）
 *
 * 把区间 [a,b] 均分成 n 个小段，每段用一个矩形逼近曲线下面积。
 * 取样方式 mode 决定矩形高度取在左端点(left)、右端点(right)还是中点(mid)。
 * n 越大，矩形越窄，逼近值越接近真实定积分。
 */

export type RiemannMode = 'left' | 'right' | 'mid'

export interface Rect {
  x: number // 矩形左边缘 x
  w: number // 矩形宽度
  h: number // 矩形高度 = 取样点函数值
}

export interface RiemannResult {
  sum: number // 各矩形有向面积之和
  rects: Rect[] // 每个矩形的几何信息
}

export interface FnDef {
  key: string
  label: string
  fn: (x: number) => number
  integral: (a: number, b: number) => number // 解析定积分
  a: number
  b: number
}

export const MODES: RiemannMode[] = ['left', 'right', 'mid']

/** 计算黎曼和，返回和值与各矩形几何 */
export function riemannSum(
  fn: (x: number) => number,
  a: number,
  b: number,
  n: number,
  mode: RiemannMode,
): RiemannResult {
  const rects: Rect[] = []
  let sum = 0
  if (n <= 0) return { sum: 0, rects }
  const w = (b - a) / n
  for (let i = 0; i < n; i++) {
    const left = a + i * w
    let sample = left
    if (mode === 'right') sample = left + w
    else if (mode === 'mid') sample = left + w / 2
    const h = fn(sample)
    sum += h * w
    rects.push({ x: left, w, h })
  }
  return { sum, rects }
}

/** 真实定积分：优先解析式，否则高精度分段（辛普森法） */
export function trueIntegral(def: FnDef, a: number, b: number): number {
  if (def.integral) return def.integral(a, b)
  const n = 2000
  const w = (b - a) / n
  let s = def.fn(a) + def.fn(b)
  for (let i = 1; i < n; i++) {
    s += (i % 2 === 0 ? 2 : 4) * def.fn(a + i * w)
  }
  return (s * w) / 3
}

export const FUNCTIONS: FnDef[] = [
  {
    key: 'square',
    label: 'y = x²',
    fn: (x) => x * x,
    integral: (a, b) => (b * b * b - a * a * a) / 3,
    a: 0,
    b: 2,
  },
  {
    key: 'sin',
    label: 'y = sin x',
    fn: (x) => Math.sin(x),
    integral: (a, b) => Math.cos(a) - Math.cos(b),
    a: 0,
    b: Math.PI,
  },
  {
    key: 'sqrt',
    label: 'y = √x',
    fn: (x) => Math.sqrt(x),
    integral: (a, b) => (2 / 3) * (Math.pow(b, 1.5) - Math.pow(a, 1.5)),
    a: 0,
    b: 4,
  },
]

export const N_VALUES = [4, 8, 16, 32]
