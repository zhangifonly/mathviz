/**
 * 级数收敛判别核心算法（纯函数，便于测试）
 *
 * 研究无穷和 a_1 + a_2 + a_3 + ... 何时收敛到有限值。
 * 通过部分和序列 S_N = sum_{n=1}^{N} a_n 的走势观察收敛/发散，
 * 并用比值判别法 lim |a_{n+1}/a_n| 判断收敛性。
 */

export type TermFn = (n: number) => number

/** 几何级数通项 (1/2)^(n-1)：公比 1/2，收敛到 2 */
export function geometricTerm(n: number): number {
  return Math.pow(0.5, n - 1)
}

/** 调和级数通项 1/n：发散，但极其缓慢 */
export function harmonicTerm(n: number): number {
  return 1 / n
}

/** p 级数 p=2 通项 1/n^2：收敛到 pi^2/6 */
export function pSeriesTerm(n: number): number {
  return 1 / (n * n)
}

/** 交错级数通项 (-1)^(n-1)/n：收敛到 ln 2 */
export function alternatingTerm(n: number): number {
  return Math.pow(-1, n - 1) / n
}

/** 部分和序列 [S_1, S_2, ..., S_N] */
export function partialSums(term: TermFn, N: number): number[] {
  const out: number[] = []
  let acc = 0
  for (let n = 1; n <= N; n++) {
    acc += term(n)
    out.push(acc)
  }
  return out
}

/**
 * 比值判别法：估计 lim_{n->inf} |a_{n+1}/a_n|。
 * L<1 收敛，L>1 发散，L=1 判别失效。用较大 n 逼近极限。
 */
export function ratioTest(term: TermFn, atN = 2000): number {
  // 从大 n 往回找一个非零且未下溢的采样点，避免几何级数下溢成 0
  let n = atN
  while (n > 1 && (term(n) === 0 || !Number.isFinite(term(n)))) n = Math.floor(n / 2)
  const a = term(n)
  const b = term(n + 1)
  if (a === 0) return NaN
  return Math.abs(b / a)
}

/**
 * 综合判断收敛性（true=收敛），基于柯西准则：
 * 收敛级数从 N+1 到 2N 的尾块和随 N 趋于零；
 * 发散级数（如调和）该尾块和保持有界正值（约 ln 2）。
 * 比值判别在 L 明显偏离 1 时直接给出结论。
 */
export function converges(term: TermFn): boolean {
  const L = ratioTest(term)
  if (L < 1 - 0.02) return true
  if (L > 1 + 0.02) return false
  // 比值趋于 1，判别失效：用柯西尾块和
  const N = 1000
  let chunk = 0
  for (let n = N + 1; n <= 2 * N; n++) chunk += term(n)
  return Math.abs(chunk) < 1e-2
}

export interface SeriesDef {
  key: string
  label: string
  term: TermFn
  converges: boolean
  limit: string
}

export const SERIES: SeriesDef[] = [
  { key: 'geometric', label: '几何级数 (1/2)^(n-1)', term: geometricTerm, converges: true, limit: '2' },
  { key: 'harmonic', label: '调和级数 1/n', term: harmonicTerm, converges: false, limit: '发散' },
  { key: 'p2', label: 'p 级数 1/n^2', term: pSeriesTerm, converges: true, limit: 'pi^2/6' },
  { key: 'alternating', label: '交错级数 (-1)^(n-1)/n', term: alternatingTerm, converges: true, limit: 'ln 2' },
]

export const N_COUNTS = [20, 50, 120]
