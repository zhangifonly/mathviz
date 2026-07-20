/**
 * 函数图象变换核心（纯函数，便于测试）
 *
 * 统一变换式： g(x) = a * f(b * (x - h)) + k
 *   h 水平平移（右正左负）
 *   k 竖直平移（上正下负）
 *   a 竖直伸缩（|a|>1 拉伸，0<|a|<1 压缩，a<0 关于 x 轴翻折）
 *   b 水平伸缩（|b|>1 压缩，0<|b|<1 拉伸，b<0 关于 y 轴翻折）
 */

export interface Transform {
  a: number
  b: number
  h: number
  k: number
}

export type BaseFn = (x: number) => number

export interface BaseDef {
  key: string
  label: string
  fn: BaseFn
}

export const IDENTITY: Transform = { a: 1, b: 1, h: 0, k: 0 }

/** 内置基函数集合 */
export const BASES: BaseDef[] = [
  { key: 'square', label: 'f(x)=x²', fn: (x) => x * x },
  { key: 'sin', label: 'f(x)=sin x', fn: (x) => Math.sin(x) },
  { key: 'abs', label: 'f(x)=|x|', fn: (x) => Math.abs(x) },
  { key: 'cubic', label: 'f(x)=x³', fn: (x) => x * x * x },
]

/** 应用变换，返回新函数 g(x)=a*f(b*(x-h))+k */
export function transform(base: BaseFn, t: Transform): BaseFn {
  const { a, b, h, k } = t
  return (x: number) => a * base(b * (x - h)) + k
}

/** 在 [x0,x1] 上等距采样，返回 [x,y] 点列 */
export function sample(fn: BaseFn, x0: number, x1: number, n: number): [number, number][] {
  const pts: [number, number][] = []
  if (n < 2) return pts
  const dx = (x1 - x0) / (n - 1)
  for (let i = 0; i < n; i++) {
    const x = x0 + i * dx
    pts.push([x, fn(x)])
  }
  return pts
}

/** 按 key 取基函数定义，找不到回退到第一个 */
export function getBase(key: string): BaseDef {
  return BASES.find((b) => b.key === key) ?? BASES[0]
}

/** 生成一句对当前参数效果的中文描述 */
export function describe(t: Transform): string {
  const parts: string[] = []
  if (t.b < 0) parts.push('关于y轴翻折')
  if (t.a < 0) parts.push('关于x轴翻折')
  if (Math.abs(t.b) !== 1) parts.push(Math.abs(t.b) > 1 ? '水平压缩' : '水平拉伸')
  if (Math.abs(t.a) !== 1) parts.push(Math.abs(t.a) > 1 ? '竖直拉伸' : '竖直压缩')
  if (t.h !== 0) parts.push(t.h > 0 ? '右移' : '左移')
  if (t.k !== 0) parts.push(t.k > 0 ? '上移' : '下移')
  return parts.length ? parts.join('·') : '与基函数重合'
}

export const A_VALUES = [-1, 0.5, 1, 2]
export const B_VALUES = [-1, 0.5, 1, 2]
export const H_VALUES = [-2, -1, 0, 1, 2]
export const K_VALUES = [-2, -1, 0, 1, 2]
