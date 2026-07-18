/**
 * 希尔伯特曲线核心算法（纯函数，便于测试）
 *
 * 希尔伯特曲线是一条连续的分形曲线，能不重复地填满整个正方形网格，
 * 并且保持邻近性：一维距离相近的点，映射到二维后往往也相近。
 * 核心是标准的 d2xy 位操作算法。
 */

export interface Point {
  x: number
  y: number
}

/**
 * 把一维距离 d 映射到 order 阶希尔伯特曲线上的二维坐标 (x, y)。
 * 网格边长 n = 2^order，坐标范围 [0, n-1]。标准位操作实现。
 */
export function hilbertD2XY(order: number, d: number): Point {
  const n = 1 << order
  let rx = 0
  let ry = 0
  let t = d
  let x = 0
  let y = 0
  for (let s = 1; s < n; s <<= 1) {
    rx = 1 & (t >> 1)
    ry = 1 & (t ^ rx)
    // 旋转子象限，保证曲线连续拼接
    if (ry === 0) {
      if (rx === 1) {
        x = s - 1 - x
        y = s - 1 - y
      }
      const tmp = x
      x = y
      y = tmp
    }
    x += s * rx
    y += s * ry
    t >>= 2
  }
  return { x, y }
}

/** 生成 order 阶曲线的完整点序列，共 (2^order)^2 个点，按遍历顺序排列。 */
export function hilbertPoints(order: number): Point[] {
  const n = 1 << order
  const total = n * n
  const pts: Point[] = []
  for (let d = 0; d < total; d++) {
    pts.push(hilbertD2XY(order, d))
  }
  return pts
}

export const ORDERS = [3, 4, 5, 6]
