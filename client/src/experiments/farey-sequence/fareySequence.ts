/**
 * 法里数列核心算法（纯函数，便于测试）
 *
 * 法里数列 F_n 是所有分母不超过 n 的、位于闭区间 [0,1] 内的
 * 既约分数按升序排列的列表。用相邻项递推法生成，
 * 并验证相邻分数 a/b, c/d 满足 bc - ad = 1（法里邻居性质）。
 */

export interface Fraction {
  n: number
  d: number
}

/** 最大公约数（辗转相除，保证非负） */
export function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b !== 0) {
    ;[a, b] = [b, a % b]
  }
  return a
}

/** 两个分数的中位数 (mediant)：分子分母分别相加 */
export function mediant(f1: Fraction, f2: Fraction): Fraction {
  return { n: f1.n + f2.n, d: f1.d + f2.d }
}

/**
 * 生成 n 阶法里数列 F_n。
 * 用相邻项递推：由 a/b 与 c/d 求下一项 p/q，
 *   k = floor((n + b) / d),  p = k*c - a,  q = k*d - b
 * 从 0/1 与 1/n 出发，直到抵达 1/1。
 */
export function farey(n: number): Fraction[] {
  if (n < 1) return []
  const res: Fraction[] = [{ n: 0, d: 1 }]
  let a = 0
  let b = 1
  let c = 1
  let d = n
  res.push({ n: c, d })
  while (d > 1) {
    const k = Math.floor((n + b) / d)
    const p = k * c - a
    const q = k * d - b
    a = c
    b = d
    c = p
    d = q
    res.push({ n: c, d })
  }
  return res
}

/** 判断 f1, f2 是否为法里邻居：|n1*d2 - n2*d1| = 1 */
export function areNeighbors(f1: Fraction, f2: Fraction): boolean {
  return Math.abs(f1.n * f2.d - f2.n * f1.d) === 1
}

/** 每个分数 p/q 对应一个福特圆：圆心 (p/q, 1/(2q^2))，半径 1/(2q^2) */
export function fordRadius(f: Fraction): number {
  return 1 / (2 * f.d * f.d)
}

/** 可选的阶数（供 UI 切换） */
export const ORDERS = [5, 6, 7]
