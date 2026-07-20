/**
 * 燃烧船分形核心算法（纯函数，便于测试）
 *
 * 燃烧船是曼德博集合的绝对值变体，迭代公式为
 *   z_{n+1} = (|Re(z)| + i|Im(z)|)^2 + c
 * 与曼德博唯一的差别是：每次平方前先取实部、虚部的绝对值。
 * escapeTime 返回 |z| 超过逃逸半径时的迭代次数，用于染色。
 */

/** 逃逸半径的平方，|z|^2 > 4 即视为逃逸 */
export const ESCAPE_R2 = 4

/**
 * 计算 (cx, cy) 处燃烧船迭代的逃逸时间。
 * @returns 逃逸所用迭代次数；若始终未逃逸则返回 maxIter。
 */
export function escapeTime(cx: number, cy: number, maxIter: number): number {
  let x = 0
  let y = 0
  for (let i = 0; i < maxIter; i++) {
    // 先取绝对值，这是燃烧船区别于曼德博的关键一步
    const ax = Math.abs(x)
    const ay = Math.abs(y)
    // (ax + i*ay)^2 = ax^2 - ay^2 + i*2*ax*ay
    const nx = ax * ax - ay * ay + cx
    const ny = 2 * ax * ay + cy
    x = nx
    y = ny
    if (x * x + y * y > ESCAPE_R2) return i
  }
  return maxIter
}

/** 观察区域：中心坐标与横向宽度（虚轴按画布比例推导） */
export interface ViewRegion {
  name: string
  cx: number
  cy: number
  scale: number // 横向覆盖的复平面宽度
}

/**
 * 预设观察区域。
 * - 全景：容纳整个燃烧船，注意燃烧船通常上下颠倒观察，中心偏负虚轴。
 * - 船体特写：聚焦经典的“主船身”，位于实轴约 -1.75 附近。
 */
export const VIEW_REGIONS: ViewRegion[] = [
  { name: '全景', cx: -0.4, cy: -0.5, scale: 3.6 },
  { name: '船体特写', cx: -1.755, cy: -0.03, scale: 0.22 },
]

/** 逃逸时间映射为 [0,1] 的归一化值，供调色使用 */
export function normEscape(iter: number, maxIter: number): number {
  if (iter >= maxIter) return 1
  return iter / maxIter
}

/** 每个观察区域使用的最大迭代次数预设 */
export const MAX_ITERS = [60, 120, 200]
