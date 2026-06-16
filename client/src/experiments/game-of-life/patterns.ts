/**
 * 康威生命游戏 - 经典图案库
 * 每个图案用相对坐标 [row, col] 表示活细胞
 */

import { createGrid, idx, type Grid } from './life'

export interface Pattern {
  name: string
  label: string
  cells: [number, number][]
}

export const PATTERNS: Pattern[] = [
  {
    name: 'glider',
    label: '滑翔机',
    cells: [[0, 1], [1, 2], [2, 0], [2, 1], [2, 2]],
  },
  {
    name: 'blinker',
    label: '闪烁灯',
    cells: [[0, 0], [0, 1], [0, 2]],
  },
  {
    name: 'toad',
    label: '蟾蜍',
    cells: [[0, 1], [0, 2], [0, 3], [1, 0], [1, 1], [1, 2]],
  },
  {
    name: 'beacon',
    label: '信标',
    cells: [[0, 0], [0, 1], [1, 0], [2, 3], [3, 2], [3, 3]],
  },
  {
    name: 'pulsar',
    label: '脉冲星',
    cells: [
      // 经典脉冲星（周期3）的四分之一对称展开
      [0, 2], [0, 3], [0, 4], [0, 8], [0, 9], [0, 10],
      [2, 0], [2, 5], [2, 7], [2, 12],
      [3, 0], [3, 5], [3, 7], [3, 12],
      [4, 0], [4, 5], [4, 7], [4, 12],
      [5, 2], [5, 3], [5, 4], [5, 8], [5, 9], [5, 10],
      [7, 2], [7, 3], [7, 4], [7, 8], [7, 9], [7, 10],
      [8, 0], [8, 5], [8, 7], [8, 12],
      [9, 0], [9, 5], [9, 7], [9, 12],
      [10, 0], [10, 5], [10, 7], [10, 12],
      [12, 2], [12, 3], [12, 4], [12, 8], [12, 9], [12, 10],
    ],
  },
  {
    name: 'gosper',
    label: '高斯帕滑翔机枪',
    cells: [
      [0, 24],
      [1, 22], [1, 24],
      [2, 12], [2, 13], [2, 20], [2, 21], [2, 34], [2, 35],
      [3, 11], [3, 15], [3, 20], [3, 21], [3, 34], [3, 35],
      [4, 0], [4, 1], [4, 10], [4, 16], [4, 20], [4, 21],
      [5, 0], [5, 1], [5, 10], [5, 14], [5, 16], [5, 17], [5, 22], [5, 24],
      [6, 10], [6, 16], [6, 24],
      [7, 11], [7, 15],
      [8, 12], [8, 13],
    ],
  },
]

/** 将图案放置到网格指定位置（居中偏移），返回新网格 */
export function placePattern(rows: number, cols: number, pattern: Pattern): Grid {
  const grid = createGrid(rows, cols)
  // 计算图案包围盒
  let maxR = 0
  let maxC = 0
  for (const [r, c] of pattern.cells) {
    if (r > maxR) maxR = r
    if (c > maxC) maxC = c
  }
  const offsetR = Math.max(0, Math.floor((rows - maxR) / 2))
  const offsetC = Math.max(0, Math.floor((cols - maxC) / 2))
  for (const [r, c] of pattern.cells) {
    const rr = offsetR + r
    const cc = offsetC + c
    if (rr < rows && cc < cols) grid[idx(rr, cc, cols)] = 1
  }
  return grid
}
