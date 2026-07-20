/**
 * 整数分拆核心算法（纯函数，便于测试）
 *
 * 把正整数 n 写成若干正整数之和（不计顺序），每一种写法就是一个分拆。
 * 约定每个分拆用「非增」的正整数列表表示，如 4 = 3+1 记作 [3, 1]。
 */

/** 回溯生成 n 的所有分拆（每个是非增正整数列表），按字典序从大到小 */
export function partitions(n: number): number[][] {
  const result: number[][] = []
  const cur: number[] = []
  const backtrack = (remain: number, max: number) => {
    if (remain === 0) {
      result.push([...cur])
      return
    }
    // 最大部件从 min(max, remain) 递减枚举
    for (let k = Math.min(max, remain); k >= 1; k--) {
      cur.push(k)
      backtrack(remain - k, k)
      cur.pop()
    }
  }
  if (n > 0) backtrack(n, n)
  else if (n === 0) result.push([])
  return result
}

/** 分拆数 p(n)，用动态规划（完全背包思路），无需列举全部分拆 */
export function partitionCount(n: number): number {
  if (n < 0) return 0
  // dp[j] = 用部件 1..k 拼出 j 的方案数
  const dp = new Array<number>(n + 1).fill(0)
  dp[0] = 1
  for (let k = 1; k <= n; k++) {
    for (let j = k; j <= n; j++) {
      dp[j] += dp[j - k]
    }
  }
  return dp[n]
}

/** 共轭分拆：杨氏图（Ferrers 图）沿主对角线转置后得到的分拆 */
export function conjugate(partition: number[]): number[] {
  if (partition.length === 0) return []
  const maxPart = partition[0] // 已假设非增，首项即最大
  const conj: number[] = []
  for (let col = 1; col <= maxPart; col++) {
    // 第 col 列的格数 = 有多少行的部件 >= col
    let cnt = 0
    for (const part of partition) {
      if (part >= col) cnt++
    }
    conj.push(cnt)
  }
  return conj
}

/** 可选的 n 值（对应难度递增的分拆规模） */
export const NS = [4, 5, 6, 7]
