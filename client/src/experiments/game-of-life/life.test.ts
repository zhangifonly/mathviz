import { describe, it, expect } from 'vitest'
import {
  createGrid, idx, countNeighbors, nextGeneration, countAlive, randomizeGrid,
} from './life'

const dims = (rows: number, cols: number) => ({ rows, cols })

/** 用活细胞坐标快速构造网格 */
function makeGrid(rows: number, cols: number, alive: [number, number][]) {
  const g = createGrid(rows, cols)
  for (const [r, c] of alive) g[idx(r, c, cols)] = 1
  return g
}

describe('生命游戏核心规则', () => {
  it('createGrid 创建全死网格', () => {
    expect(countAlive(createGrid(5, 5))).toBe(0)
    expect(createGrid(3, 4).length).toBe(12)
  })

  it('countNeighbors 正确统计八邻居（环形边界）', () => {
    // 中心十字
    const g = makeGrid(5, 5, [[1, 2], [2, 1], [2, 3], [3, 2]])
    expect(countNeighbors(g, 2, 2, dims(5, 5))).toBe(4)
    // 角落环绕：(0,0) 的邻居包含 (4,4) 等
    const g2 = makeGrid(5, 5, [[4, 4]])
    expect(countNeighbors(g2, 0, 0, dims(5, 5))).toBe(1)
  })

  it('闪烁灯（blinker）周期为 2', () => {
    // 横置三连
    const horizontal = makeGrid(5, 5, [[2, 1], [2, 2], [2, 3]])
    const vertical = nextGeneration(horizontal, dims(5, 5))
    // 一代后应变成竖置三连
    expect(vertical[idx(1, 2, 5)]).toBe(1)
    expect(vertical[idx(2, 2, 5)]).toBe(1)
    expect(vertical[idx(3, 2, 5)]).toBe(1)
    expect(vertical[idx(2, 1, 5)]).toBe(0)
    // 再一代变回横置
    const back = nextGeneration(vertical, dims(5, 5))
    expect(back[idx(2, 1, 5)]).toBe(1)
    expect(back[idx(2, 2, 5)]).toBe(1)
    expect(back[idx(2, 3, 5)]).toBe(1)
  })

  it('方块（block）是稳定静物', () => {
    const block = makeGrid(4, 4, [[1, 1], [1, 2], [2, 1], [2, 2]])
    const next = nextGeneration(block, dims(4, 4))
    expect([...next]).toEqual([...block])
  })

  it('孤立活细胞因孤独死亡', () => {
    const lone = makeGrid(3, 3, [[1, 1]])
    const next = nextGeneration(lone, dims(3, 3))
    expect(countAlive(next)).toBe(0)
  })

  it('randomizeGrid 密度 0 全死，密度 1 全活', () => {
    expect(countAlive(randomizeGrid(10, 10, 0))).toBe(0)
    expect(countAlive(randomizeGrid(10, 10, 1))).toBe(100)
  })
})
