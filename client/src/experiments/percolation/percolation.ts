/**
 * 渗流模型（Percolation，纯函数，便于测试）
 *
 * 在 N×N 的方格点阵上，每个格点以概率 p 独立地"开放"（连通），
 * 否则"关闭"。相邻（上下左右四连通）的开放格点组成一个连通簇（cluster）。
 * 研究的核心问题：是否存在一个横跨整个点阵（从顶行连到底行）的巨型簇，
 * 即发生"渗流"。二维方格点站点渗流的临界概率 p_c ≈ 0.5927。
 * 当 p 低于 p_c，几乎只有零散小簇；越过 p_c，会突然涌现出贯穿全局的巨簇，
 * 这是一种典型的相变现象。
 */

/** 二维方格点站点渗流的临界概率（数值近似值，无解析式） */
export const P_C_SITE_SQUARE = 0.5927

/** 创建一个带种子的确定性伪随机数发生器（mulberry32），返回 () => [0,1) */
export function createRng(seed: number): () => number {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** 生成 size×size 的开放/关闭点阵：true 表示开放，概率为 p */
export function generateLattice(size: number, p: number, rng: () => number): boolean[][] {
  const grid: boolean[][] = []
  for (let i = 0; i < size; i++) {
    const row: boolean[] = []
    for (let j = 0; j < size; j++) row.push(rng() < p)
    grid.push(row)
  }
  return grid
}

export interface ClusterResult {
  /** 每个格点的簇编号：0 表示关闭格点，正整数表示所属簇 */
  labels: number[][]
  /** 簇编号 → 该簇的格点数（下标即簇编号，第 0 项恒为 0，占位） */
  sizes: number[]
  /** 簇的数量 */
  count: number
}

/** 用广度优先搜索给所有开放格点按四连通标记连通簇 */
export function labelClusters(grid: boolean[][]): ClusterResult {
  const n = grid.length
  const labels: number[][] = grid.map((row) => row.map(() => 0))
  const sizes: number[] = [0]
  let current = 0
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (!grid[i][j] || labels[i][j] !== 0) continue
      current++
      let size = 0
      const stack: [number, number][] = [[i, j]]
      labels[i][j] = current
      while (stack.length > 0) {
        const [ci, cj] = stack.pop()!
        size++
        for (const [di, dj] of dirs) {
          const ni = ci + di
          const nj = cj + dj
          if (ni < 0 || ni >= n || nj < 0 || nj >= n) continue
          if (grid[ni][nj] && labels[ni][nj] === 0) {
            labels[ni][nj] = current
            stack.push([ni, nj])
          }
        }
      }
      sizes.push(size)
    }
  }
  return { labels, sizes, count: current }
}

/** 返回最大簇的格点数（无开放格点时为 0） */
export function largestClusterSize(res: ClusterResult): number {
  let max = 0
  for (let k = 1; k < res.sizes.length; k++) if (res.sizes[k] > max) max = res.sizes[k]
  return max
}

/**
 * 是否存在从顶行连到底行的贯穿簇（发生渗流）。
 * 返回该贯穿簇的编号，未渗流则返回 0。
 */
export function spanningClusterId(res: ClusterResult): number {
  const { labels } = res
  const n = labels.length
  if (n === 0) return 0
  const topLabels = new Set<number>()
  for (let j = 0; j < labels[0].length; j++) if (labels[0][j] !== 0) topLabels.add(labels[0][j])
  const bottom = labels[n - 1]
  for (let j = 0; j < bottom.length; j++) {
    if (bottom[j] !== 0 && topLabels.has(bottom[j])) return bottom[j]
  }
  return 0
}

/** 是否发生渗流 */
export function percolates(res: ClusterResult): boolean {
  return spanningClusterId(res) > 0
}

export interface PercolationStats {
  size: number
  p: number
  openCount: number
  openFraction: number
  clusterCount: number
  largest: number
  /** 最大簇占开放格点的比例，可视作序参量的代理 */
  largestFraction: number
  spanning: number
  percolates: boolean
}

/** 一次性统计一个点阵的渗流特征 */
export function analyze(grid: boolean[][], p: number): PercolationStats {
  const size = grid.length
  const res = labelClusters(grid)
  let openCount = 0
  for (const row of grid) for (const v of row) if (v) openCount++
  const largest = largestClusterSize(res)
  const spanning = spanningClusterId(res)
  const total = size * size
  return {
    size,
    p,
    openCount,
    openFraction: total > 0 ? openCount / total : 0,
    clusterCount: res.count,
    largest,
    largestFraction: openCount > 0 ? largest / openCount : 0,
    spanning,
    percolates: spanning > 0,
  }
}

export interface POption {
  p: number
  label: string
  note: string
}

/** 可选的开放概率 p：分别落在临界点之下、附近、之上 */
export const P_OPTIONS: POption[] = [
  { p: 0.45, label: 'p = 0.45', note: '低于临界，只有零散小簇' },
  { p: 0.55, label: 'p = 0.55', note: '逼近临界，大簇开始生长' },
  { p: 0.59, label: 'p ≈ 0.5927', note: '临界点，簇结构呈分形' },
  { p: 0.65, label: 'p = 0.65', note: '高于临界，巨簇贯穿全局' },
  { p: 0.75, label: 'p = 0.75', note: '深入渗流相，几乎全连通' },
]
