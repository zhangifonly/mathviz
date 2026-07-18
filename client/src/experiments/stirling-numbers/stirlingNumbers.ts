/**
 * 斯特林数核心算法（纯函数，便于测试）
 *
 * 第二类斯特林数 S(n,k)：把 n 个不同元素划分成 k 个非空子集的方案数。
 *   递推：S(n,k) = k*S(n-1,k) + S(n-1,k-1)，边界 S(0,0)=1、S(n,0)=0(n>0)。
 * 第一类斯特林数（无符号）c(n,k)：把 n 个元素排成 k 个非空循环的方案数。
 *   递推：c(n,k) = (n-1)*c(n-1,k) + c(n-1,k-1)。
 */

/** 集合最大规模，用于生成三角与限制交互范围 */
export const MAX_N = 9

/** 第二类斯特林数 S(n,k) */
export function stirling2(n: number, k: number): number {
  if (n < 0 || k < 0) return 0
  if (n === 0 && k === 0) return 1
  if (n === 0 || k === 0) return 0
  if (k > n) return 0
  return k * stirling2(n - 1, k) + stirling2(n - 1, k - 1)
}

/** 第一类斯特林数（无符号）c(n,k)，即循环数 */
export function stirling1(n: number, k: number): number {
  if (n < 0 || k < 0) return 0
  if (n === 0 && k === 0) return 1
  if (n === 0 || k === 0) return 0
  if (k > n) return 0
  return (n - 1) * stirling1(n - 1, k) + stirling1(n - 1, k - 1)
}

/**
 * 生成斯特林三角：第 n 行为 [S(n,0), S(n,1), ..., S(n,n)]（或第一类）。
 * @param kind 'second' 第二类（默认）| 'first' 第一类无符号
 */
export function stirlingTriangle(maxN: number, kind: 'first' | 'second' = 'second'): number[][] {
  const f = kind === 'first' ? stirling1 : stirling2
  const rows: number[][] = []
  for (let n = 0; n <= maxN; n++) {
    const row: number[] = []
    for (let k = 0; k <= n; k++) row.push(f(n, k))
    rows.push(row)
  }
  return rows
}

/** 贝尔数 B(n) = sum_k S(n,k)，即把 n 个元素划分成任意多非空子集的总数 */
export function bellNumber(n: number): number {
  let sum = 0
  for (let k = 0; k <= n; k++) sum += stirling2(n, k)
  return sum
}

/** 可选的集合规模档位（用于交互按钮） */
export const N_CHOICES = [3, 5, 7]
