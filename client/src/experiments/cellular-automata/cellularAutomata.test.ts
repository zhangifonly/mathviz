import { describe, it, expect } from 'vitest'
import {
  ruleTable,
  nextCell,
  stepRow,
  initRow,
  evolve,
  countAlive,
  RULE_OPTIONS,
} from './cellularAutomata'

describe('一维初等元胞自动机', () => {
  it('ruleTable 展开规则号为 8 个位（低位在前）', () => {
    // 规则 90 = 01011010b → 低位到高位: 0,1,0,1,1,0,1,0
    expect(ruleTable(90)).toEqual([0, 1, 0, 1, 1, 0, 1, 0])
    // 规则 0 全 0，规则 255 全 1
    expect(ruleTable(0)).toEqual([0, 0, 0, 0, 0, 0, 0, 0])
    expect(ruleTable(255)).toEqual([1, 1, 1, 1, 1, 1, 1, 1])
  })

  it('nextCell 与规则位表一致（索引=左4+中2+右）', () => {
    const table = ruleTable(110)
    for (let l = 0; l < 2; l++)
      for (let c = 0; c < 2; c++)
        for (let r = 0; r < 2; r++) {
          const idx = (l << 2) | (c << 1) | r
          expect(nextCell(l, c, r, 110)).toBe(table[idx])
        }
  })

  it('规则 90 是左右邻居异或（single 种子下一代）', () => {
    // 规则 90: 中心格 = 左 XOR 右
    const row = [0, 0, 1, 0, 0]
    // 环形边界下每格 = 左 xor 右
    expect(stepRow(row, 90)).toEqual([0, 1, 0, 1, 0])
  })

  it('规则 90 从单点演化出谢尔宾斯基三角前几行（无环形干扰的宽网格）', () => {
    const grid = evolve(90, 9, 3)
    // 第0代: 中心1；第1代: 左右各1；第2代: 更外两个1（帕斯卡 mod 2）
    expect(grid[0]).toEqual([0, 0, 0, 0, 1, 0, 0, 0, 0])
    expect(grid[1]).toEqual([0, 0, 0, 1, 0, 1, 0, 0, 0])
    expect(grid[2]).toEqual([0, 0, 1, 0, 0, 0, 1, 0, 0])
  })

  it('规则 0 使一切归零', () => {
    const grid = evolve(0, 11, 5)
    expect(countAlive(grid)).toBe(1) // 仅初始那一个种子
  })

  it('规则 255 让全部格子在下一代变 1（邻域 000→1）', () => {
    const row = [0, 0, 0, 0]
    expect(stepRow(row, 255)).toEqual([1, 1, 1, 1])
  })

  it('initRow single 只在中间放一个 1', () => {
    const row = initRow(7, true)
    expect(countAlive([row])).toBe(1)
    expect(row[3]).toBe(1)
  })

  it('initRow 随机种子受注入的随机函数控制', () => {
    const row = initRow(4, false, () => 0.1) // 恒 <0.5 → 全 1
    expect(row).toEqual([1, 1, 1, 1])
  })

  it('stepRow 采用环形边界（最左格左邻=最右格）', () => {
    // 规则 90 下: 长度3, [1,0,0] → 每格=左xor右
    // i0: 左=row[2]=0, 右=row[1]=0 → 0
    // i1: 左=row[0]=1, 右=row[2]=0 → 1
    // i2: 左=row[1]=0, 右=row[0]=1 → 1
    expect(stepRow([1, 0, 0], 90)).toEqual([0, 1, 1])
  })

  it('evolve 返回代数 × 宽度的网格', () => {
    const grid = evolve(30, 21, 12)
    expect(grid.length).toBe(12)
    for (const row of grid) expect(row.length).toBe(21)
  })

  it('RULE_OPTIONS 都是合法规则号且能正常演化', () => {
    expect(RULE_OPTIONS.length).toBeGreaterThan(0)
    for (const opt of RULE_OPTIONS) {
      expect(opt.rule).toBeGreaterThanOrEqual(0)
      expect(opt.rule).toBeLessThanOrEqual(255)
      const grid = evolve(opt.rule, 41, 20)
      expect(grid.length).toBe(20)
      for (const row of grid) for (const v of row) expect(v === 0 || v === 1).toBe(true)
    }
  })
})
