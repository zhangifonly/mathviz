import { describe, it, expect } from 'vitest'
import { PATTERNS, placePattern } from './patterns'
import { countAlive, idx } from './life'

describe('生命游戏图案库', () => {
  it('每个图案都有名称、标签和至少一个活细胞', () => {
    for (const p of PATTERNS) {
      expect(p.name).toBeTruthy()
      expect(p.label).toBeTruthy()
      expect(p.cells.length).toBeGreaterThan(0)
    }
  })

  it('图案名称唯一', () => {
    const names = PATTERNS.map((p) => p.name)
    expect(new Set(names).size).toBe(names.length)
  })

  it('placePattern 放置的活细胞数等于图案细胞数', () => {
    const glider = PATTERNS.find((p) => p.name === 'glider')!
    const grid = placePattern(50, 80, glider)
    expect(countAlive(grid)).toBe(glider.cells.length)
  })

  it('placePattern 将图案居中（不贴边）', () => {
    const blinker = PATTERNS.find((p) => p.name === 'blinker')!
    const grid = placePattern(50, 80, blinker)
    // 闪烁灯在中部，第 0 行与最后一行应全空
    let topRow = 0
    let bottomRow = 0
    for (let c = 0; c < 80; c++) {
      topRow += grid[idx(0, c, 80)]
      bottomRow += grid[idx(49, c, 80)]
    }
    expect(topRow).toBe(0)
    expect(bottomRow).toBe(0)
  })

  it('placePattern 在小网格上不越界', () => {
    const pulsar = PATTERNS.find((p) => p.name === 'pulsar')!
    // 网格刚好容纳
    const grid = placePattern(13, 13, pulsar)
    expect(grid.length).toBe(169)
    // 不应抛错，且活细胞数不超过图案定义
    expect(countAlive(grid)).toBeLessThanOrEqual(pulsar.cells.length)
  })
})
