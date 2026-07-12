/**
 * 幂级数收敛（纯函数，便于测试）
 *
 * 幂级数形如 sum_{n>=0} a_n x^n。在收敛半径 R 内部（|x| < R）部分和
 * 逐项逼近真实函数值，在外部则发散。这里用逐项求和 + 精确函数对照，
 * 直观展示"部分和越加越准"以及收敛半径这条无形的边界。
 */

/** 单个幂级数示例的定义 */
export interface SeriesOption {
  id: string
  label: string
  note: string
  /** 收敛半径 R；指数级数为 Infinity（全平面收敛） */
  radius: number
  /** 精确函数值（仅在收敛域内有意义） */
  exact: (x: number) => number
  /** 第 n 项的数值，n 从 0 开始 */
  term: (n: number, x: number) => number
}

/** 阶乘（n 较小，直接连乘即可） */
export function factorial(n: number): number {
  let r = 1
  for (let i = 2; i <= n; i++) r *= i
  return r
}

/**
 * 计算幂级数前 terms 项的部分和。
 * terms=0 返回 0，terms=1 返回首项，以此类推。
 */
export function partialSum(series: SeriesOption, x: number, terms: number): number {
  let s = 0
  for (let n = 0; n < terms; n++) s += series.term(n, x)
  return s
}

/** 判断某点是否落在收敛域内部（严格 |x| < R） */
export function convergesAt(series: SeriesOption, x: number): boolean {
  return Math.abs(x) < series.radius
}

/** 部分和与精确值之间的绝对误差（收敛域内应随 terms 增大而减小） */
export function convergenceError(series: SeriesOption, x: number, terms: number): number {
  return Math.abs(partialSum(series, x, terms) - series.exact(x))
}

/** 按 id 取收敛半径，便于场景层直接读取 */
export function radiusOfConvergence(id: string): number {
  const opt = SERIES_OPTIONS.find((o) => o.id === id)
  return opt ? opt.radius : NaN
}

export const SERIES_OPTIONS: SeriesOption[] = [
  {
    id: 'geometric',
    label: '几何级数 1+x+x^2+...',
    note: '收敛半径 R=1，和为 1 除以 (1-x)',
    radius: 1,
    exact: (x) => 1 / (1 - x),
    term: (n, x) => Math.pow(x, n),
  },
  {
    id: 'exp',
    label: '指数级数 sum x^n / n!',
    note: '收敛半径 R 为无穷，处处收敛到 e 的 x 次方',
    radius: Infinity,
    exact: (x) => Math.exp(x),
    term: (n, x) => Math.pow(x, n) / factorial(n),
  },
  {
    id: 'ln1px',
    label: '对数级数 x - x^2/2 + ...',
    note: '收敛半径 R=1，和为 ln(1+x)',
    radius: 1,
    exact: (x) => Math.log(1 + x),
    // 第 n 项(n 从 0): (-1)^n * x^(n+1) / (n+1)
    term: (n, x) => (Math.pow(-1, n) * Math.pow(x, n + 1)) / (n + 1),
  },
  {
    id: 'arctan',
    label: '反正切级数 x - x^3/3 + ...',
    note: '收敛半径 R=1，和为 arctan(x)',
    radius: 1,
    exact: (x) => Math.atan(x),
    // 第 n 项(n 从 0): (-1)^n * x^(2n+1) / (2n+1)
    term: (n, x) => (Math.pow(-1, n) * Math.pow(x, 2 * n + 1)) / (2 * n + 1),
  },
]
