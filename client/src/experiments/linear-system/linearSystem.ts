/**
 * 二元一次方程组（纯函数，便于测试）
 *
 * 方程形如 a x + b y = c，两条直线的交点即方程组的解。
 * 用行列式（克莱姆法则）判断解的情况：
 *   D = a1*b2 - a2*b1
 *   D != 0  → 唯一解（两线相交）
 *   D == 0  → 平行（无解）或重合（无穷多解）
 */

/** 一条二元一次方程 a x + b y = c */
export interface LinearEquation {
  a: number
  b: number
  c: number
}

export type SolutionType = 'unique' | 'none' | 'infinite'

export interface Solution {
  type: SolutionType
  x?: number
  y?: number
}

/** 系数行列式 D = a1*b2 - a2*b1 */
export function determinant(eq1: LinearEquation, eq2: LinearEquation): number {
  return eq1.a * eq2.b - eq2.a * eq1.b
}

/** 用克莱姆法则求解方程组 */
export function solveLinearSystem(eq1: LinearEquation, eq2: LinearEquation): Solution {
  const d = determinant(eq1, eq2)
  const EPS = 1e-9
  if (Math.abs(d) > EPS) {
    const x = (eq1.c * eq2.b - eq2.c * eq1.b) / d
    const y = (eq1.a * eq2.c - eq2.a * eq1.c) / d
    return { type: 'unique', x, y }
  }
  // D == 0：判断平行还是重合
  const dx = eq1.c * eq2.b - eq2.c * eq1.b
  const dy = eq1.a * eq2.c - eq2.a * eq1.c
  if (Math.abs(dx) < EPS && Math.abs(dy) < EPS) return { type: 'infinite' }
  return { type: 'none' }
}

/** 给定 x，求直线上的 y（要求 b != 0）；b == 0 时直线竖直，返回 null */
export function yAt(eq: LinearEquation, x: number): number | null {
  if (Math.abs(eq.b) < 1e-9) return null
  return (eq.c - eq.a * x) / eq.b
}

/** 直线是否竖直（b == 0，形如 x = c/a） */
export function isVertical(eq: LinearEquation): boolean {
  return Math.abs(eq.b) < 1e-9
}

/** 把方程格式化成人类可读字符串，如 "2x + 3y = 6" */
export function formatEquation(eq: LinearEquation): string {
  const term = (coef: number, sym: string) => {
    if (coef === 0) return ''
    const sign = coef > 0 ? '+' : '-'
    const abs = Math.abs(coef)
    const num = abs === 1 ? '' : String(abs)
    return ` ${sign} ${num}${sym}`
  }
  let s = ''
  if (eq.a !== 0) s += `${eq.a === 1 ? '' : eq.a === -1 ? '-' : eq.a}x`
  s += term(eq.b, 'y')
  return `${s.trim()} = ${eq.c}`.replace(/^\+ /, '')
}

export interface SystemOption {
  id: string
  label: string
  note: string
  eq1: LinearEquation
  eq2: LinearEquation
}

/** 预置的方程组示例，覆盖三种解的情况 */
export const SYSTEM_OPTIONS: SystemOption[] = [
  {
    id: 'unique',
    label: '相交（唯一解）',
    note: '两线交于一点，解唯一',
    eq1: { a: 1, b: 1, c: 5 },
    eq2: { a: 2, b: -1, c: 1 },
  },
  {
    id: 'parallel',
    label: '平行（无解）',
    note: '斜率相同、永不相交',
    eq1: { a: 1, b: -1, c: 1 },
    eq2: { a: 1, b: -1, c: -2 },
  },
  {
    id: 'coincident',
    label: '重合（无穷解）',
    note: '同一条直线，解无穷多',
    eq1: { a: 1, b: 2, c: 4 },
    eq2: { a: 2, b: 4, c: 8 },
  },
]
