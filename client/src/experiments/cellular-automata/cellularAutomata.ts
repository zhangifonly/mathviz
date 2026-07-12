/**
 * 一维初等元胞自动机（Wolfram Elementary Cellular Automata，纯函数，便于测试）
 *
 * 每个格子只有 0/1 两态，下一代的值由「自己 + 左右邻居」三个格子决定。
 * 三个格子共有 2^3 = 8 种邻域组合，一条规则用一个 0~255 的整数编码：
 * 该整数的二进制第 k 位（k = 左*4 + 中*2 + 右）就是这种邻域对应的输出。
 * 著名的规则 30、90、110 分别产生随机性、谢尔宾斯基分形与图灵完备的复杂结构。
 */

/** 把规则号（0~255）展开成 8 个输出位。索引 = 左*4+中*2+右，取值 0/1。 */
export function ruleTable(rule: number): number[] {
  const r = ((rule % 256) + 256) % 256
  const table: number[] = []
  for (let i = 0; i < 8; i++) table.push((r >> i) & 1)
  return table
}

/** 由邻域三元组 (left, center, right) 与规则号计算下一代中心格的值。 */
export function nextCell(left: number, center: number, right: number, rule: number): number {
  const idx = (left << 2) | (center << 1) | right
  return (((rule % 256) + 256) % 256 >> idx) & 1
}

/**
 * 演化一整行到下一代（边界按环形 wrap，即最左格的左邻是最右格）。
 * @param row 当前代，元素为 0/1
 * @param rule 规则号 0~255
 */
export function stepRow(row: number[], rule: number): number[] {
  const n = row.length
  if (n === 0) return []
  const next: number[] = new Array(n)
  for (let i = 0; i < n; i++) {
    const left = row[(i - 1 + n) % n]
    const center = row[i]
    const right = row[(i + 1) % n]
    next[i] = nextCell(left, center, right, rule)
  }
  return next
}

/** 生成宽度为 width 的初始行：single=中间一个 1，其余 0；否则随机（用传入的种子函数）。 */
export function initRow(width: number, single = true, rnd: () => number = Math.random): number[] {
  const row = new Array(width).fill(0)
  if (single) {
    row[Math.floor(width / 2)] = 1
  } else {
    for (let i = 0; i < width; i++) row[i] = rnd() < 0.5 ? 1 : 0
  }
  return row
}

/**
 * 从单个中心种子出发，演化 generations 代，返回二维网格（每行一代）。
 * @returns grid[g][i] 第 g 代第 i 个格子的值
 */
export function evolve(rule: number, width: number, generations: number, single = true): number[][] {
  const grid: number[][] = []
  let row = initRow(width, single)
  grid.push(row)
  for (let g = 1; g < generations; g++) {
    row = stepRow(row, rule)
    grid.push(row)
  }
  return grid
}

/** 统计整个网格中存活（值为 1）的格子总数。 */
export function countAlive(grid: number[][]): number {
  let c = 0
  for (const row of grid) for (const v of row) c += v
  return c
}

export interface RuleOption {
  rule: number
  label: string
  note: string
}

export const RULE_OPTIONS: RuleOption[] = [
  { rule: 30, label: '规则 30', note: '混沌：从有序中生出随机' },
  { rule: 90, label: '规则 90', note: '异或规则 → 谢尔宾斯基三角' },
  { rule: 110, label: '规则 110', note: '图灵完备，可做通用计算' },
  { rule: 54, label: '规则 54', note: '周期性纹理，边界会碰撞' },
  { rule: 150, label: '规则 150', note: '三格异或，更密的分形' },
  { rule: 184, label: '规则 184', note: '交通流模型，粒子向右迁移' },
]
