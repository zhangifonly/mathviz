import { describe, it, expect } from 'vitest'
import { aStar, dijkstra, search, manhattan, MAZE, START, GOAL, type Grid, type Cell } from './aStar'

const isValidPath = (grid: Grid, path: Cell[]) => {
  for (let i = 0; i < path.length; i++) {
    expect(grid[path[i].y][path[i].x]).toBe(0)
    if (i > 0) {
      const d = Math.abs(path[i].x - path[i - 1].x) + Math.abs(path[i].y - path[i - 1].y)
      expect(d).toBe(1)
    }
  }
}

describe('A星寻路', () => {
  it('manhattan 曼哈顿距离计算正确', () => {
    expect(manhattan({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(7)
    expect(manhattan({ x: 2, y: 2 }, { x: 2, y: 2 })).toBe(0)
  })

  it('aStar 在迷宫中找到从起点到终点的路径', () => {
    const { path } = aStar(MAZE, START, GOAL)
    expect(path.length).toBeGreaterThan(0)
    expect(path[0]).toEqual(START)
    expect(path[path.length - 1]).toEqual(GOAL)
  })

  it('返回的路径每一步都合法（相邻且非障碍）', () => {
    const { path } = aStar(MAZE, START, GOAL)
    isValidPath(MAZE, path)
  })

  it('A*与Dijkstra找到的最短路长度相同（同为最优）', () => {
    const a = aStar(MAZE, START, GOAL)
    const d = dijkstra(MAZE, START, GOAL)
    expect(a.path.length).toBe(d.path.length)
  })

  it('A*扩展的格子数不多于Dijkstra（启发更定向）', () => {
    const a = aStar(MAZE, START, GOAL)
    const d = dijkstra(MAZE, START, GOAL)
    expect(a.order.length).toBeLessThanOrEqual(d.order.length)
  })

  it('起点即终点时路径只含一个格子', () => {
    const { path, order } = aStar(MAZE, START, START)
    expect(path).toEqual([START])
    expect(order[0]).toEqual(START)
  })

  it('目标不可达时返回空路径', () => {
    const walled: Grid = [
      [0, 1, 0],
      [1, 1, 0],
      [0, 0, 0],
    ]
    const { path } = search(walled, { x: 0, y: 0 }, { x: 2, y: 0 }, true)
    expect(path.length).toBe(0)
  })

  it('扩展顺序首格为起点，且含终点', () => {
    const { order } = aStar(MAZE, START, GOAL)
    expect(order[0]).toEqual(START)
    expect(order.some((c) => c.x === GOAL.x && c.y === GOAL.y)).toBe(true)
  })
})
