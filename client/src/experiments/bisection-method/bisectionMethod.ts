/**
 * 二分法求根核心算法（纯函数，便于测试）
 *
 * 若连续函数 f 在区间 [a,b] 两端异号（f(a)f(b)<0），由介值定理必有根。
 * 取中点 m=(a+b)/2，根据 f(m) 的符号把含根区间缩小一半，反复逼近。
 * 收敛是线性的：每一步区间长度减半，误差随之减半。
 */

export interface BisectionStep {
  a: number        // 当前含根区间左端
  b: number        // 当前含根区间右端
  mid: number      // 中点
  fMid: number     // 中点函数值
  width: number    // 区间宽度 b-a
}

export interface MathFunction {
  id: string
  label: string
  fn: (x: number) => number
  a: number        // 初始区间左端
  b: number        // 初始区间右端
  root: number     // 真实根（用于对照）
}

/** 可选函数：都在给定区间内两端异号，存在唯一根 */
export const FUNCTIONS: MathFunction[] = [
  { id: 'sqrt2', label: 'x^2 - 2  (求 √2)', fn: (x) => x * x - 2, a: 0, b: 2, root: Math.SQRT2 },
  { id: 'cbrt', label: 'x^3 - x - 2', fn: (x) => x * x * x - x - 2, a: 1, b: 2, root: 1.5213797 },
  { id: 'cosx', label: 'cos(x) - x', fn: (x) => Math.cos(x) - x, a: 0, b: 1, root: 0.7390851 },
]

/**
 * 执行二分法，返回每一步的含根区间与中点信息。
 * 结果首元素为初始区间，其后每个元素代表一次对半缩小。
 */
export function bisection(
  fn: (x: number) => number,
  a: number,
  b: number,
  tol = 1e-6,
  maxIter = 40,
): BisectionStep[] {
  let lo = a
  let hi = b
  const steps: BisectionStep[] = []
  let fLo = fn(lo)
  const record = () => {
    const mid = (lo + hi) / 2
    steps.push({ a: lo, b: hi, mid, fMid: fn(mid), width: hi - lo })
  }
  record()
  for (let i = 0; i < maxIter && hi - lo > tol; i++) {
    const mid = (lo + hi) / 2
    const fMid = fn(mid)
    if (fMid === 0) {
      lo = mid
      hi = mid
      record()
      break
    }
    // 保留异号的一半，令根始终落在 [lo,hi] 内
    if (fLo * fMid < 0) {
      hi = mid
    } else {
      lo = mid
      fLo = fMid
    }
    record()
  }
  return steps
}
