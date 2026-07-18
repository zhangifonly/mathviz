/**
 * A* 寻路核心算法。f = g + h：g 是实际代价，h 是曼哈顿启发估计。
 * 优先扩展 f 最小的格子；令 h≡0 即退化为 Dijkstra。返回扩展顺序与最终路径。
 */
export interface Cell {
  x: number
  y: number
}

/** 网格：0 = 通路，1 = 障碍墙 */
export type Grid = number[][]

export const GRID = { cols: 15, rows: 11 }
export const START: Cell = { x: 1, y: 1 }
export const GOAL: Cell = { x: 13, y: 9 }
/** 带障碍的迷宫（四周为墙，内部散布障碍，起点终点连通） */
export const MAZE: Grid = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]

/** 曼哈顿距离启发函数 */
export function manhattan(a: Cell, goal: Cell): number {
  return Math.abs(a.x - goal.x) + Math.abs(a.y - goal.y)
}
const key = (c: Cell) => c.y * 1000 + c.x

const DIRS = [{ x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }]

function neighbors(grid: Grid, c: Cell): Cell[] {
  const out: Cell[] = []
  for (const d of DIRS) {
    const nx = c.x + d.x
    const ny = c.y + d.y
    if (ny < 0 || ny >= grid.length || nx < 0 || nx >= grid[0].length) continue
    if (grid[ny][nx] === 1) continue
    out.push({ x: nx, y: ny })
  }
  return out
}

export interface SearchResult {
  order: Cell[]
  path: Cell[]
}
/** 通用最优优先搜索：useHeuristic=true 为 A*，false 为 Dijkstra */
export function search(grid: Grid, start: Cell, goal: Cell, useHeuristic: boolean): SearchResult {
  const g = new Map<number, number>()
  const from = new Map<number, number>()
  const cellOf = new Map<number, Cell>()
  const closed = new Set<number>()
  const order: Cell[] = []
  const open: Cell[] = [start]
  g.set(key(start), 0)
  cellOf.set(key(start), start)
  const f = (c: Cell) => (g.get(key(c)) ?? Infinity) + (useHeuristic ? manhattan(c, goal) : 0)
  while (open.length > 0) {
    let bi = 0
    for (let i = 1; i < open.length; i++) if (f(open[i]) < f(open[bi])) bi = i
    const cur = open.splice(bi, 1)[0]
    const ck = key(cur)
    if (closed.has(ck)) continue
    closed.add(ck)
    order.push(cur)
    if (cur.x === goal.x && cur.y === goal.y) break
    for (const nb of neighbors(grid, cur)) {
      const nk = key(nb)
      if (closed.has(nk)) continue
      const ng = (g.get(ck) ?? Infinity) + 1
      if (ng < (g.get(nk) ?? Infinity)) {
        g.set(nk, ng)
        from.set(nk, ck)
        cellOf.set(nk, nb)
        open.push(nb)
      }
    }
  }

  const path: Cell[] = []
  let k: number | undefined = closed.has(key(goal)) ? key(goal) : undefined
  while (k !== undefined) {
    const c = cellOf.get(k)
    if (!c) break
    path.unshift(c)
    k = from.get(k)
  }
  return { order, path }
}

export const aStar = (grid: Grid, start: Cell, goal: Cell) => search(grid, start, goal, true)
export const dijkstra = (grid: Grid, start: Cell, goal: Cell) => search(grid, start, goal, false)
