// 广度与深度优先搜索核心算法（纯函数，便于测试）
// 网格迷宫上做 BFS(队列) 与 DFS(栈) 遍历，记录访问顺序并回溯路径。
// BFS 在无权图上保证最短路。网格值：0=可走，1=墙。坐标用 [行, 列]。
export type Cell = [number, number]

export interface SearchResult {
  order: Cell[]          // 访问顺序（染色帧）
  path: Cell[]           // 起点到终点的最终路径
  found: boolean         // 是否到达终点
}

// 4 邻域：上、右、下、左（决定 DFS 的分叉走向）
const DIRS: Cell[] = [[-1, 0], [0, 1], [1, 0], [0, -1]]

const key = (r: number, c: number): string => `${r},${c}`

function inBounds(grid: number[][], r: number, c: number): boolean {
  return r >= 0 && r < grid.length && c >= 0 && c < grid[0].length
}

// 从 parent 映射回溯出 start->goal 路径
function buildPath(parent: Map<string, Cell>, start: Cell, goal: Cell): Cell[] {
  const path: Cell[] = []
  let cur: Cell | undefined = goal
  while (cur) {
    path.push(cur)
    if (cur[0] === start[0] && cur[1] === start[1]) break
    cur = parent.get(key(cur[0], cur[1]))
  }
  return path.reverse()
}

// 广度优先搜索：用队列，逐层向外扩散，保证最短路
export function bfs(grid: number[][], start: Cell, goal: Cell): SearchResult {
  const order: Cell[] = []
  const parent = new Map<string, Cell>()
  const seen = new Set<string>([key(start[0], start[1])])
  const queue: Cell[] = [start]
  let found = false
  while (queue.length > 0) {
    const [r, c] = queue.shift() as Cell
    order.push([r, c])
    if (r === goal[0] && c === goal[1]) { found = true; break }
    for (const [dr, dc] of DIRS) {
      const nr = r + dr, nc = c + dc, k = key(nr, nc)
      if (!inBounds(grid, nr, nc) || grid[nr][nc] === 1 || seen.has(k)) continue
      seen.add(k)
      parent.set(k, [r, c])
      queue.push([nr, nc])
    }
  }
  return { order, path: found ? buildPath(parent, start, goal) : [], found }
}
// 深度优先搜索：用栈，一路走到底再回溯
export function dfs(grid: number[][], start: Cell, goal: Cell): SearchResult {
  const order: Cell[] = []
  const parent = new Map<string, Cell>()
  const seen = new Set<string>()
  const stack: Cell[] = [start]
  let found = false
  while (stack.length > 0) {
    const [r, c] = stack.pop() as Cell
    const k0 = key(r, c)
    if (seen.has(k0)) continue
    seen.add(k0)
    order.push([r, c])
    if (r === goal[0] && c === goal[1]) { found = true; break }
    for (let i = DIRS.length - 1; i >= 0; i--) {
      const nr = r + DIRS[i][0], nc = c + DIRS[i][1], k = key(nr, nc)
      if (!inBounds(grid, nr, nc) || grid[nr][nc] === 1 || seen.has(k)) continue
      if (!parent.has(k)) parent.set(k, [r, c])
      stack.push([nr, nc])
    }
  }
  return { order, path: found ? buildPath(parent, start, goal) : [], found }
}
// 迷宫：0 可走 / 1 墙。12 列 x 10 行
export const MAZE: number[][] = [
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
  [1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
  [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
  [1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
]

export const START: Cell = [0, 0]
export const GOAL: Cell = [9, 11]
export const MODES = ['bfs', 'dfs'] as const
export type Mode = (typeof MODES)[number]

// 按模式调度
export function search(mode: Mode, grid: number[][], start: Cell, goal: Cell): SearchResult {
  return mode === 'bfs' ? bfs(grid, start, goal) : dfs(grid, start, goal)
}
