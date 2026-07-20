/**
 * 多项式求根核心算法（纯函数，便于测试）
 *
 * 系数约定 coeffs = [a0, a1, ..., an] 为升幂，
 * 即多项式 p(x) = a0 + a1*x + a2*x^2 + ... + an*x^n。
 * 用霍纳法（秦九韶算法）求值，用密集采样加二分法找实根。
 */

/** 霍纳法求值：从高次往低次嵌套，只需 n 次乘法 */
export function evalPoly(coeffs: number[], x: number): number {
  let result = 0
  for (let i = coeffs.length - 1; i >= 0; i--) {
    result = result * x + coeffs[i]
  }
  return result
}

/** 求导：p'(x) 的系数，仍为升幂。常数项(仅 a0)导数为 [0] */
export function deriv(coeffs: number[]): number[] {
  if (coeffs.length <= 1) return [0]
  const d: number[] = []
  for (let i = 1; i < coeffs.length; i++) {
    d.push(coeffs[i] * i)
  }
  return d
}

/** 多项式实际次数（去掉最高次的零系数） */
export function degree(coeffs: number[]): number {
  let n = coeffs.length - 1
  while (n > 0 && Math.abs(coeffs[n]) < 1e-12) n--
  return n
}

/**
 * 在区间 [lo, hi] 上密集采样，遇到符号变化就用二分法夹逼出实根。
 * @param samples 采样段数，越大越不易漏根
 * @returns 升序排列且去重后的实根数组
 */
export function findRealRoots(
  coeffs: number[],
  lo = -6,
  hi = 6,
  samples = 400,
): number[] {
  const roots: number[] = []
  const dx = (hi - lo) / samples
  let prevX = lo
  let prevY = evalPoly(coeffs, prevX)
  if (Math.abs(prevY) < 1e-9) roots.push(prevX)

  for (let i = 1; i <= samples; i++) {
    const x = lo + i * dx
    const y = evalPoly(coeffs, x)
    if (prevY * y < 0) {
      roots.push(bisect(coeffs, prevX, x))
    } else if (Math.abs(y) < 1e-9 && i < samples) {
      roots.push(x)
    }
    prevX = x
    prevY = y
  }
  return dedupe(roots)
}

/** 二分法：在 [a,b] 内 p(a)*p(b)<0 时逼近根 */
function bisect(coeffs: number[], a: number, b: number, iters = 60): number {
  let lo = a, hi = b
  let fa = evalPoly(coeffs, lo)
  for (let i = 0; i < iters; i++) {
    const mid = (lo + hi) / 2
    const fm = evalPoly(coeffs, mid)
    if (Math.abs(fm) < 1e-12) return mid
    if (fa * fm < 0) {
      hi = mid
    } else {
      lo = mid
      fa = fm
    }
  }
  return (lo + hi) / 2
}

/** 去重：合并距离极近的根 */
function dedupe(xs: number[]): number[] {
  const sorted = [...xs].sort((a, b) => a - b)
  const out: number[] = []
  for (const x of sorted) {
    if (out.length === 0 || Math.abs(x - out[out.length - 1]) > 1e-4) out.push(x)
  }
  return out
}

/** 示例多项式（升幂系数）：二次、三次、四次 */
export const SAMPLE_POLYS: { name: string; coeffs: number[] }[] = [
  { name: '二次 x²-1', coeffs: [-1, 0, 1] },
  { name: '三次 x³-3x', coeffs: [0, -3, 0, 1] },
  { name: '四次 (x²-4)(x²+1)', coeffs: [-4, 0, -3, 0, 1] },
]
