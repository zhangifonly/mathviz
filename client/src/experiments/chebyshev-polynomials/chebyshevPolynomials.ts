/**
 * 切比雪夫多项式核心算法（纯函数，便于测试）
 *
 * 第一类切比雪夫多项式 T_n(x) 满足递推：
 *   T0(x) = 1
 *   T1(x) = x
 *   T(n+1)(x) = 2x * Tn(x) - T(n-1)(x)
 *
 * 它在区间 [-1,1] 上以 ±1 等幅振荡，是极小化最大误差
 * (minimax) 的最优多项式，其根即"切比雪夫节点"，
 * 用作插值节点可显著抑制龙格现象。
 */

/** 用递推计算 T_n(x)，n>=0 */
export function chebyshevT(n: number, x: number): number {
  if (n <= 0) return 1
  if (n === 1) return x
  let prev = 1 // T0
  let cur = x // T1
  for (let k = 2; k <= n; k++) {
    const next = 2 * x * cur - prev
    prev = cur
    cur = next
  }
  return cur
}

/**
 * 切比雪夫节点：T_n 的 n 个根
 *   x_k = cos((2k+1)π / (2n)),  k = 0..n-1
 * 均落在开区间 (-1,1) 内。
 */
export function chebyshevRoots(n: number): number[] {
  const roots: number[] = []
  for (let k = 0; k < n; k++) {
    roots.push(Math.cos(((2 * k + 1) * Math.PI) / (2 * n)))
  }
  return roots
}

/** 在 [-1,1] 上采样 T_n 曲线，返回 [x,y] 点列 */
export function sampleCurve(n: number, samples = 400): Array<[number, number]> {
  const pts: Array<[number, number]> = []
  for (let i = 0; i <= samples; i++) {
    const x = -1 + (2 * i) / samples
    pts.push([x, chebyshevT(n, x)])
  }
  return pts
}

export const DEGREES = [2, 3, 4, 5]
