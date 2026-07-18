/**
 * 牛顿分形核心算法（纯函数，便于测试）
 *
 * 对复系数多项式 f(z)，从复平面上每个点出发做牛顿迭代
 *   z <- z - f(z)/f'(z)
 * 迭代终会收敛到 f 的某个根，收敛到哪个根、收敛多快，
 * 由起点决定。把"收敛到同一根"的起点涂成一色，就画出分形。
 */

export interface Complex {
  re: number
  im: number
}

/** 复数减法 */
export function csub(a: Complex, b: Complex): Complex {
  return { re: a.re - b.re, im: a.im - b.im }
}

/** 复数乘法 (a+bi)(c+di) = (ac-bd) + (ad+bc)i */
export function cmul(a: Complex, b: Complex): Complex {
  return { re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re }
}

/** 复数除法 a/b */
export function cdiv(a: Complex, b: Complex): Complex {
  const d = b.re * b.re + b.im * b.im
  return { re: (a.re * b.re + a.im * b.im) / d, im: (a.im * b.re - a.re * b.im) / d }
}

/** 复数模长平方 */
export function cabs2(a: Complex): number {
  return a.re * a.re + a.im * a.im
}

/** 可选多项式（供 UI 切换） */
export const POLYNOMIALS = ['z^3-1', 'z^4-1']

/** 每个多项式的根（用于判定收敛归属与配色） */
export const ROOTS: Record<string, Complex[]> = {
  'z^3-1': [
    { re: 1, im: 0 },
    { re: -0.5, im: Math.sqrt(3) / 2 },
    { re: -0.5, im: -Math.sqrt(3) / 2 },
  ],
  'z^4-1': [
    { re: 1, im: 0 },
    { re: -1, im: 0 },
    { re: 0, im: 1 },
    { re: 0, im: -1 },
  ],
}

/** 计算 f(z) 与 f'(z)，poly 为 'z^3-1' 或 'z^4-1' */
export function evalPoly(poly: string, z: Complex): { f: Complex; df: Complex } {
  const z2 = cmul(z, z)
  if (poly === 'z^4-1') {
    const z3 = cmul(z2, z)
    const z4 = cmul(z2, z2)
    // f = z^4 - 1, f' = 4 z^3
    return { f: { re: z4.re - 1, im: z4.im }, df: { re: 4 * z3.re, im: 4 * z3.im } }
  }
  // 默认 z^3 - 1, f' = 3 z^2
  const z3 = cmul(z2, z)
  return { f: { re: z3.re - 1, im: z3.im }, df: { re: 3 * z2.re, im: 3 * z2.im } }
}

/**
 * 从 (cx,cy) 出发做牛顿迭代。
 * 返回收敛到的根索引 root（未收敛为 -1）与迭代次数 iter。
 */
export function newtonEscape(
  poly: string,
  cx: number,
  cy: number,
  maxIter: number,
): { root: number; iter: number } {
  const roots = ROOTS[poly] ?? ROOTS['z^3-1']
  let z: Complex = { re: cx, im: cy }
  const tol = 1e-6
  for (let iter = 0; iter < maxIter; iter++) {
    const { f, df } = evalPoly(poly, z)
    if (cabs2(df) < 1e-18) break
    z = csub(z, cdiv(f, df))
    for (let r = 0; r < roots.length; r++) {
      if (cabs2(csub(z, roots[r])) < tol) return { root: r, iter }
    }
  }
  return { root: -1, iter: maxIter }
}
