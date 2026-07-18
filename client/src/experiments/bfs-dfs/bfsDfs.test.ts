import { describe, it, expect } from 'vitest'
import { bfs, dfs, search, MAZE, START, GOAL, MODES, type Cell } from './bfsDfs'

// 小网格：无墙 3x3，便于精确验证
const OPEN3: number[][] = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
]

function pathLen(p: Cell[]): number {
  return p.length
}

describe('广度与深度优先搜索', () => {
  it('BFS 和 DFS 都能在迷宫中找到终点', () => {
    const b = bfs(MAZE, START, GOAL)
    const d = dfs(MAZE, START, GOAL)
    expect(b.found).toBe(true)
    expect(d.found).toBe(true)
  })

  it('访问顺序无重复格子', () => {
    for (const mode of MODES) {
      const res = search(mode, MAZE, START, GOAL)
      const seen = new Set(res.order.map(([r, c]) => `${r},${c}`))
      expect(seen.size).toBe(res.order.length)
    }
  })

  it('路径首尾正好是起点和终点', () => {
    const b = bfs(MAZE, START, GOAL)
    expect(b.path[0]).toEqual(START)
    expect(b.path[b.path.length - 1]).toEqual(GOAL)
  })

  it('路径相邻格子曼哈顿距离为 1（连续可走）', () => {
    const b = bfs(MAZE, START, GOAL)
    for (let i = 1; i < b.path.length; i++) {
      const [r0, c0] = b.path[i - 1]
      const [r1, c1] = b.path[i]
      expect(Math.abs(r0 - r1) + Math.abs(c0 - c1)).toBe(1)
      expect(MAZE[r1][c1]).toBe(0)
    }
  })

  it('BFS 路径长度不超过 DFS 路径（最短路保证）', () => {
    const b = bfs(MAZE, START, GOAL)
    const d = dfs(MAZE, START, GOAL)
    expect(pathLen(b.path)).toBeLessThanOrEqual(pathLen(d.path))
  })

  it('开放 3x3 网格 BFS 最短路长度为 5', () => {
    const b = bfs(OPEN3, [0, 0], [2, 2])
    expect(b.path.length).toBe(5)
  })

  it('终点被墙包围时 found 为 false 且路径为空', () => {
    const blocked: number[][] = [
      [0, 1, 0],
      [1, 1, 0],
      [0, 0, 0],
    ]
    const b = bfs(blocked, [0, 0], [0, 2])
    expect(b.found).toBe(false)
    expect(b.path.length).toBe(0)
  })

  it('DFS 起点即终点时立即命中', () => {
    const d = dfs(OPEN3, [1, 1], [1, 1])
    expect(d.found).toBe(true)
    expect(d.order[0]).toEqual([1, 1])
    expect(d.path).toEqual([[1, 1]])
  })
})
