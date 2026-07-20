/**
 * 埃农映射核心算法（纯函数，便于测试）
 *
 * 埃农映射是一个经典的二维离散动力系统：
 *   x' = 1 - a * x^2 + y
 *   y' = b * x
 * 当 a=1.4, b=0.3 时，轨道会收敛到一个具有自相似结构的
 * 分形吸引子（埃农吸引子）。
 */

export interface Point {
  x: number
  y: number
}

/** 单步埃农映射 */
export function henonStep(x: number, y: number, a: number, b: number): Point {
  return { x: 1 - a * x * x + y, y: b * x }
}

/**
 * 迭代埃农映射 n 次，丢弃前 skip 步暂态，返回落在吸引子上的点集。
 * @param a 参数 a（经典 1.4）
 * @param b 参数 b（经典 0.3）
 * @param n 采集的点数
 * @param x0 初始 x
 * @param y0 初始 y
 * @param skip 丢弃的暂态步数
 */
export function iterate(
  a: number,
  b: number,
  n: number,
  x0 = 0,
  y0 = 0,
  skip = 100,
): Point[] {
  let x = x0
  let y = y0
  for (let i = 0; i < skip; i++) {
    const p = henonStep(x, y, a, b)
    x = p.x
    y = p.y
  }
  const pts: Point[] = []
  for (let i = 0; i < n; i++) {
    const p = henonStep(x, y, a, b)
    x = p.x
    y = p.y
    pts.push({ x, y })
  }
  return pts
}

/** 计算点集在 x、y 方向的包围盒，用于绘制时归一化坐标 */
export function bounds(pts: Point[]): { minX: number; maxX: number; minY: number; maxY: number } {
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  for (const p of pts) {
    if (p.x < minX) minX = p.x
    if (p.x > maxX) maxX = p.x
    if (p.y < minY) minY = p.y
    if (p.y > maxY) maxY = p.y
  }
  return { minX, maxX, minY, maxY }
}

/** 预设参数组，经典埃农吸引子参数 */
export const PARAMS = [{ a: 1.4, b: 0.3 }]
