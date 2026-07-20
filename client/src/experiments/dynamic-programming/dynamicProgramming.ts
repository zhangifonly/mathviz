/**
 * 动态规划核心算法（纯函数，便于测试）
 * lcs 最长公共子序列 / knapsack01 0-1 背包，
 * 均返回 DP 表 + 最优解 + 回溯路径，供逐格可视化。
 */
export interface Cell { r: number; c: number }

export interface LcsResult {
  table: number[][]      // (m+1)x(n+1) DP 表
  length: number         // LCS 长度
  sequence: string       // 一条 LCS
  path: Cell[]           // 回溯经过的格子（从右下到左上）
  s1: string
  s2: string
}

/** 最长公共子序列：table[i][j] = s1 前 i 个与 s2 前 j 个的 LCS 长度 */
export function lcs(s1: string, s2: string): LcsResult {
  const m = s1.length
  const n = s2.length
  const table: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        table[i][j] = table[i - 1][j - 1] + 1
      } else {
        table[i][j] = Math.max(table[i - 1][j], table[i][j - 1])
      }
    }
  }
  const path: Cell[] = []
  let out = ''
  let i = m
  let j = n
  while (i > 0 && j > 0) {
    path.push({ r: i, c: j })
    if (s1[i - 1] === s2[j - 1]) {
      out = s1[i - 1] + out
      i--
      j--
    } else if (table[i - 1][j] >= table[i][j - 1]) {
      i--
    } else {
      j--
    }
  }
  return { table, length: table[m][n], sequence: out, path, s1, s2 }
}

export interface Item {
  name: string
  weight: number
  value: number
}

export interface KnapResult {
  table: number[][]      // (N+1)x(cap+1) DP 表
  best: number; chosen: number[]; path: Cell[]
  items: Item[]; cap: number
}

/** 0-1 背包：table[i][w] = 前 i 件物品、容量 w 时的最大价值 */
export function knapsack01(items: Item[], cap: number): KnapResult {
  const N = items.length
  const table: number[][] = Array.from({ length: N + 1 }, () => new Array(cap + 1).fill(0))
  for (let i = 1; i <= N; i++) {
    const { weight, value } = items[i - 1]
    for (let w = 0; w <= cap; w++) {
      table[i][w] = table[i - 1][w]
      if (weight <= w) {
        table[i][w] = Math.max(table[i][w], table[i - 1][w - weight] + value)
      }
    }
  }
  const chosen: number[] = []
  const path: Cell[] = []
  let w = cap
  for (let i = N; i > 0; i--) {
    path.push({ r: i, c: w })
    if (table[i][w] !== table[i - 1][w]) {
      chosen.push(i - 1)
      w -= items[i - 1].weight
    }
  }
  chosen.reverse()
  return { table, best: table[N][cap], chosen, path, items, cap }
}

export const LCS_SAMPLE = { s1: 'AGCAT', s2: 'GAC' }

export const KNAPSACK_SAMPLE = {
  items: [
    { name: '金条', weight: 4, value: 40 },
    { name: '相机', weight: 3, value: 30 },
    { name: '古董', weight: 5, value: 50 },
    { name: '珠宝', weight: 2, value: 25 },
  ] as Item[],
  cap: 8,
}
