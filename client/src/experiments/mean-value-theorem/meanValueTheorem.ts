/**
 * 中值定理核心算法（纯函数，便于测试）
 *
 * 拉格朗日中值定理：若 f 在 [a,b] 连续、(a,b) 可导，则存在 c 属于 (a,b)，
 * 使 f'(c) = (f(b)-f(a))/(b-a)，即某点切线平行于两端连成的割线。
 * 罗尔定理是其特例：当 f(a)=f(b) 时割线斜率为 0，存在 f'(c)=0。
 * 这里用数值微分在区间内密集采样导数，寻找 f'(c)=割线斜率 的点 c。
 */

export interface MvtFunction {
  id: string
  label: string
  f: (x: number) => number
}

/** 割线斜率 = 平均变化率 */
export function secantSlope(f: (x: number) => number, a: number, b: number): number {
  return (f(b) - f(a)) / (b - a)
}

/** 数值微分：中心差分，误差 O(h^2) */
export function numericalDeriv(f: (x: number) => number, x: number, h = 1e-5): number {
  return (f(x + h) - f(x - h)) / (2 * h)
}

/**
 * 数值寻找满足 f'(c)=slope 的所有 c（拉格朗日中值点）。
 * 做法：令 g(x)=f'(x)-slope，在 (a,b) 密集采样找符号变化区间，
 * 再用二分法逼近零点。samples 越大越不会漏根。
 */
export function findMeanValuePoints(
  f: (x: number) => number,
  a: number,
  b: number,
  samples = 2000,
): number[] {
  const slope = secantSlope(f, a, b)
  const g = (x: number) => numericalDeriv(f, x) - slope
  const roots: number[] = []
  const dx = (b - a) / samples
  let xPrev = a + dx * 0.5
  let gPrev = g(xPrev)
  for (let i = 1; i < samples; i++) {
    const xCur = a + dx * (i + 0.5)
    const gCur = g(xCur)
    if (gPrev === 0) {
      roots.push(xPrev)
    } else if (gPrev * gCur < 0) {
      roots.push(bisect(g, xPrev, xCur))
    }
    xPrev = xCur
    gPrev = gCur
  }
  return dedupe(roots, dx)
}

/** 二分法求 g 在 [lo,hi] 内的零点（假设两端异号） */
function bisect(g: (x: number) => number, lo: number, hi: number, iters = 60): number {
  let a = lo
  let b = hi
  let ga = g(a)
  for (let i = 0; i < iters; i++) {
    const m = (a + b) / 2
    const gm = g(m)
    if (ga * gm <= 0) {
      b = m
    } else {
      a = m
      ga = gm
    }
  }
  return (a + b) / 2
}

/** 合并距离过近的根，避免同一零点重复 */
function dedupe(roots: number[], tol: number): number[] {
  const out: number[] = []
  for (const r of roots) {
    if (out.every((o) => Math.abs(o - r) > tol)) out.push(r)
  }
  return out
}

/** 判断是否为罗尔定理情形（两端函数值相等，割线水平） */
export function isRolleCase(f: (x: number) => number, a: number, b: number, eps = 1e-9): boolean {
  return Math.abs(f(a) - f(b)) < eps
}

export const FUNCTIONS: MvtFunction[] = [
  { id: 'cubic', label: 'f(x)=x³-3x', f: (x) => x * x * x - 3 * x },
  { id: 'sine', label: 'f(x)=sin(x)', f: (x) => Math.sin(x) },
  { id: 'parabola', label: 'f(x)=x²', f: (x) => x * x },
  { id: 'quartic', label: 'f(x)=x⁴-2x²', f: (x) => x * x * x * x - 2 * x * x },
]

export const INTERVALS: Array<{ a: number; b: number }> = [
  { a: -2, b: 2 },
  { a: -1.5, b: 2.5 },
  { a: 0, b: 3 },
]
