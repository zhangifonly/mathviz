/**
 * 二重积分核心算法（纯函数，便于测试）
 *
 * 用网格中点法(midpoint rule)近似矩形域上的二重积分：
 * 把矩形域切成 n×n 个小格，取每格中心点 (x,y)，
 * 用 f(x,y)*dA 累加得到曲面下的近似体积。
 * n 越大，黎曼和越接近真实体积。
 */

export type Fn2 = (x: number, y: number) => number

export interface Cell {
  i: number
  j: number
  cx: number
  cy: number
  value: number
}

export interface IntegralResult {
  volume: number
  cells: Cell[]
  dx: number
  dy: number
  dA: number
}

/**
 * 网格中点法计算二重积分 ∫∫ f(x,y) dA。
 * @returns 近似体积与每个网格单元的中心取值
 */
export function doubleIntegral(
  f: Fn2,
  xa: number,
  xb: number,
  ya: number,
  yb: number,
  n: number,
): IntegralResult {
  const dx = (xb - xa) / n
  const dy = (yb - ya) / n
  const dA = dx * dy
  const cells: Cell[] = []
  let volume = 0
  for (let j = 0; j < n; j++) {
    const cy = ya + (j + 0.5) * dy
    for (let i = 0; i < n; i++) {
      const cx = xa + (i + 0.5) * dx
      const value = f(cx, cy)
      volume += value * dA
      cells.push({ i, j, cx, cy, value })
    }
  }
  return { volume, cells, dx, dy, dA }
}

/** 取网格所有单元中心取值的最小/最大值，供着色归一化用 */
export function valueRange(cells: Cell[]): [number, number] {
  let lo = Infinity
  let hi = -Infinity
  for (const c of cells) {
    if (c.value < lo) lo = c.value
    if (c.value > hi) hi = c.value
  }
  if (!isFinite(lo)) return [0, 1]
  return [lo, hi]
}

export interface FnSpec {
  id: string
  label: string
  f: Fn2
}

export const FUNCTIONS: FnSpec[] = [
  { id: 'dome', label: 'f = 4 - x² - y²（穹顶）', f: (x, y) => 4 - x * x - y * y },
  { id: 'plane', label: 'f = x + y + 2（斜面）', f: (x, y) => x + y + 2 },
  { id: 'wave', label: 'f = 1 + sin x · cos y（波面）', f: (x, y) => 1 + Math.sin(x) * Math.cos(y) },
  { id: 'bump', label: 'f = e^(-(x²+y²))（钟形）', f: (x, y) => Math.exp(-(x * x + y * y)) },
]

export interface DomainSpec {
  id: string
  label: string
  xa: number
  xb: number
  ya: number
  yb: number
}

export const DOMAINS: DomainSpec[] = [
  { id: 'unit', label: '[-1,1]×[-1,1]', xa: -1, xb: 1, ya: -1, yb: 1 },
  { id: 'square', label: '[0,2]×[0,2]', xa: 0, xb: 2, ya: 0, yb: 2 },
  { id: 'wide', label: '[-2,2]×[-2,2]', xa: -2, xb: 2, ya: -2, yb: 2 },
]

export const GRID_SIZES = [4, 8, 16, 32]
