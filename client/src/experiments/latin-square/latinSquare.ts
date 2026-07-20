/**
 * 拉丁方核心算法（纯函数，便于测试）
 *
 * n 阶拉丁方是一个 n×n 的方阵，用 n 个符号(0..n-1)填充，
 * 使得每一行、每一列都恰好包含每个符号一次。
 * 这里用循环移位法构造：第 i 行第 j 列填 (i+j) mod n。
 */

const PALETTE = [
  '#6366f1', '#ec4899', '#22d3ee', '#a3e635', '#fbbf24',
  '#f87171', '#34d399', '#a78bfa', '#fb923c', '#38bdf8',
]

/** 取第 k 个符号对应的颜色 */
export function symbolColor(k: number): string {
  return PALETTE[((k % PALETTE.length) + PALETTE.length) % PALETTE.length]
}

/**
 * 用循环移位法生成 n 阶拉丁方。
 * grid[i][j] = (i * shift + j) mod n，shift 与 n 互质时仍是拉丁方。
 */
export function generateLatinSquare(n: number, shift = 1): number[][] {
  const grid: number[][] = []
  for (let i = 0; i < n; i++) {
    const row: number[] = []
    for (let j = 0; j < n; j++) {
      row.push((i * shift + j) % n)
    }
    grid.push(row)
  }
  return grid
}

/** 校验方阵是否为合法拉丁方：每行每列符号无重复且取值在 0..n-1 */
export function isValidLatinSquare(grid: number[][]): boolean {
  const n = grid.length
  if (n === 0) return false
  for (const row of grid) {
    if (row.length !== n) return false
    for (const v of row) {
      if (!Number.isInteger(v) || v < 0 || v >= n) return false
    }
  }
  for (let i = 0; i < n; i++) {
    const rowSeen = new Set<number>()
    const colSeen = new Set<number>()
    for (let j = 0; j < n; j++) {
      rowSeen.add(grid[i][j])
      colSeen.add(grid[j][i])
    }
    if (rowSeen.size !== n || colSeen.size !== n) return false
  }
  return true
}

/**
 * 判断两个同阶拉丁方是否正交：叠加后所有 (a,b) 有序对互不相同。
 * 正交拉丁方共有 n×n 个不同的有序对时成立。
 */
export function areOrthogonal(a: number[][], b: number[][]): boolean {
  const n = a.length
  if (b.length !== n || n === 0) return false
  const pairs = new Set<number>()
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      pairs.add(a[i][j] * n + b[i][j])
    }
  }
  return pairs.size === n * n
}

/** 生成一对正交拉丁方（shift 分别为 1 与 2，n 为奇数时正交） */
export function generateOrthogonalPair(n: number): [number[][], number[][]] {
  return [generateLatinSquare(n, 1), generateLatinSquare(n, 2)]
}

export const ORDERS = [4, 5, 6]
