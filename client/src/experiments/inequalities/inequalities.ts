/**
 * 一元一次不等式与数轴（纯函数数学内核，无 DOM）
 *
 * 求解形如 a·x + b (op) c 的一元一次不等式，
 * 得到关于 x 的解集，并可在数轴上表示。
 * 核心难点：两边同乘/除以负数时，不等号方向要翻转。
 */

/** 不等号类型 */
export type Ineq = '<' | '<=' | '>' | '>='

/** 一个一元一次不等式：a·x + b (op) c */
export interface LinearInequality {
  a: number
  b: number
  c: number
  op: Ineq
}

/**
 * 解集：x (op) bound。
 * empty=true 表示无解（空集）；all=true 表示全体实数。
 */
export interface Solution {
  empty: boolean
  all: boolean
  bound: number
  op: Ineq
}

/** 翻转不等号方向（乘除负数时使用）。等号是否包含保持不变。 */
export function flipOp(op: Ineq): Ineq {
  switch (op) {
    case '<':
      return '>'
    case '<=':
      return '>='
    case '>':
      return '<'
    case '>=':
      return '<='
  }
}

/** 判断某个 x 是否满足解集 */
export function satisfies(x: number, sol: Solution): boolean {
  if (sol.all) return true
  if (sol.empty) return false
  switch (sol.op) {
    case '<':
      return x < sol.bound
    case '<=':
      return x <= sol.bound
    case '>':
      return x > sol.bound
    case '>=':
      return x >= sol.bound
  }
}

/**
 * 求解 a·x + b (op) c。
 * 步骤：a·x (op) c - b → x (op') (c-b)/a，其中 a<0 时 op' 需翻转。
 * a=0 时退化为常数比较 b (op) c，结果为全体或空集。
 */
export function solveLinear(ineq: LinearInequality): Solution {
  const { a, b, c, op } = ineq
  if (a === 0) {
    // b (op) c 恒成立与否
    const rhs = c
    const constTrue = compareConst(b, rhs, op)
    return { empty: !constTrue, all: constTrue, bound: 0, op }
  }
  const bound = (c - b) / a
  const finalOp = a < 0 ? flipOp(op) : op
  return { empty: false, all: false, bound, op: finalOp }
}

/** 常数比较：left (op) right 是否成立 */
function compareConst(left: number, right: number, op: Ineq): boolean {
  switch (op) {
    case '<':
      return left < right
    case '<=':
      return left <= right
    case '>':
      return left > right
    case '>=':
      return left >= right
  }
}

/** 把解集格式化为可读文本，如 "x > 3" 或 "x ≤ -1.5" */
export function formatSolution(sol: Solution): string {
  if (sol.all) return '全体实数'
  if (sol.empty) return '无解（空集）'
  const sym = { '<': '<', '<=': '≤', '>': '>', '>=': '≥' }[sol.op]
  return `x ${sym} ${round(sol.bound)}`
}

/** 保留最多两位小数，去掉多余的 0 */
export function round(n: number): number {
  return Math.round(n * 100) / 100
}

/** 该解集边界点是否为实心（含等号则实心，否则空心） */
export function boundInclusive(op: Ineq): boolean {
  return op === '<=' || op === '>='
}

/** 解集是否朝右延伸（x > 或 x ≥ 为向右） */
export function pointsRight(op: Ineq): boolean {
  return op === '>' || op === '>='
}

export interface InequalityOption {
  id: string
  label: string
  ineq: LinearInequality
  note: string
}

/** 预设示例，含正系数、负系数（翻转）、以及带常数项的情形 */
export const INEQUALITY_OPTIONS: InequalityOption[] = [
  {
    id: 'simple',
    label: 'x + 2 > 5',
    ineq: { a: 1, b: 2, c: 5, op: '>' },
    note: '最基础的移项：解得 x 大于 3',
  },
  {
    id: 'coeff',
    label: '2x - 1 ≤ 7',
    ineq: { a: 2, b: -1, c: 7, op: '<=' },
    note: '先移项再除以正数 2，方向不变',
  },
  {
    id: 'flip',
    label: '-3x + 1 < 10',
    ineq: { a: -3, b: 1, c: 10, op: '<' },
    note: '除以负数 -3，不等号要翻转！',
  },
  {
    id: 'flip2',
    label: '-x ≥ 4',
    ineq: { a: -1, b: 0, c: 4, op: '>=' },
    note: '两边乘 -1，≥ 变成 ≤',
  },
]
