/**
 * 康威生命游戏 - 核心规则（纯函数，便于测试）
 *
 * 规则（B3/S23）：
 * - 活细胞周围有 2 或 3 个活邻居 -> 存活，否则死亡
 * - 死细胞周围恰好有 3 个活邻居 -> 复活
 */

export type Grid = Uint8Array

export interface GridDims {
  rows: number
  cols: number
}

/** 创建空网格 */
export function createGrid(rows: number, cols: number): Grid {
  return new Uint8Array(rows * cols)
}

/** 索引转换 */
export function idx(r: number, c: number, cols: number): number {
  return r * cols + c
}

/** 统计某格的活邻居数（环形边界，toroidal） */
export function countNeighbors(grid: Grid, r: number, c: number, dims: GridDims): number {
  const { rows, cols } = dims
  let count = 0
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue
      const nr = (r + dr + rows) % rows
      const nc = (c + dc + cols) % cols
      count += grid[idx(nr, nc, cols)]
    }
  }
  return count
}

/** 计算下一代 */
export function nextGeneration(grid: Grid, dims: GridDims): Grid {
  const { rows, cols } = dims
  const next = createGrid(rows, cols)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const alive = grid[idx(r, c, cols)]
      const n = countNeighbors(grid, r, c, dims)
      // B3/S23 规则
      next[idx(r, c, cols)] = alive ? (n === 2 || n === 3 ? 1 : 0) : (n === 3 ? 1 : 0)
    }
  }
  return next
}

/** 统计活细胞总数 */
export function countAlive(grid: Grid): number {
  let count = 0
  for (let i = 0; i < grid.length; i++) count += grid[i]
  return count
}

/** 随机填充网格 */
export function randomizeGrid(rows: number, cols: number, density = 0.3): Grid {
  const grid = createGrid(rows, cols)
  for (let i = 0; i < grid.length; i++) {
    grid[i] = Math.random() < density ? 1 : 0
  }
  return grid
}
