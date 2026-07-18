/**
 * 高斯整数核心算法（纯函数，便于测试）
 *
 * 高斯整数是形如 a+bi 的复数，其中 a、b 都是普通整数。
 * 它们在复平面上排成一张方格点阵。范数 norm(a+bi)=a^2+b^2。
 * 高斯素数是高斯整数里"不可再分解"的那些点，分布呈现优美的对称性。
 */

export interface GaussianInteger {
  a: number
  b: number
}

/** 高斯整数的范数：a^2 + b^2（等于到原点距离的平方） */
export function norm(a: number, b: number): number {
  return a * a + b * b
}

/** 判定普通正整数是否为素数 */
export function isRationalPrime(n: number): boolean {
  if (n < 2) return false
  if (n % 2 === 0) return n === 2
  for (let d = 3; d * d <= n; d += 2) {
    if (n % d === 0) return false
  }
  return true
}

/**
 * 判定高斯整数 a+bi 是否为高斯素数。
 * 规则：
 *  - 若 a 或 b 为 0（落在实轴/虚轴上），则另一个的绝对值须是形如 4k+3 的素数；
 *  - 否则（两者都非零），当且仅当范数 a^2+b^2 是普通素数时才是高斯素数。
 */
export function isGaussianPrime(a: number, b: number): boolean {
  if (a === 0 && b === 0) return false
  if (a === 0 || b === 0) {
    const p = Math.abs(a === 0 ? b : a)
    return isRationalPrime(p) && p % 4 === 3
  }
  return isRationalPrime(norm(a, b))
}

/**
 * 枚举 [-range, range]×[-range, range] 方格内的全部高斯素数。
 * 返回坐标列表，可直接用于绘制素数分布。
 */
export function gaussianPrimes(range: number): GaussianInteger[] {
  const list: GaussianInteger[] = []
  for (let a = -range; a <= range; a++) {
    for (let b = -range; b <= range; b++) {
      if (isGaussianPrime(a, b)) list.push({ a, b })
    }
  }
  return list
}

/**
 * 一个普通素数 p 在高斯整数中的行为：
 *  - p === 2：分歧（2 = -i·(1+i)^2）
 *  - p % 4 === 1：分裂成两个共轭高斯素数
 *  - p % 4 === 3：保持为高斯素数（惰性）
 */
export type SplitKind = 'ramified' | 'split' | 'inert'
export function splitKind(p: number): SplitKind {
  if (p === 2) return 'ramified'
  return p % 4 === 1 ? 'split' : 'inert'
}

/** 可选的枚举半径 */
export const RANGE = [6, 10, 15]
