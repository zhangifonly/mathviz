/**
 * 列维C形曲线核心算法（纯函数，便于测试）
 *
 * 从一条水平线段出发，每一步把每条线段替换成两段：
 * 以原线段为斜边的等腰直角三角形的两条直角边。
 * 递归 order 次后得到形似字母 C 层层叠叠的自相似分形。
 */

export interface Point {
  x: number
  y: number
}

/**
 * 把线段 a->b 替换成两条直角边 a->m->b。
 * 直角顶点 m 位于以 ab 为斜边的等腰直角三角形上，
 * 即 ab 中点朝一侧偏移半个边长（旋转 45 度、缩放 1/√2）。
 */
export function splitSegment(a: Point, b: Point): Point {
  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2
  // 从中点指向 b 的向量，旋转 90 度得到偏移方向
  const dx = (b.x - a.x) / 2
  const dy = (b.y - a.y) / 2
  return { x: mx - dy, y: my + dx }
}

/**
 * 生成 order 阶列维C曲线的顶点序列。
 * order=0 时返回起止两点，每提升一阶线段数翻倍。
 */
export function levyPoints(order: number, a: Point, b: Point): Point[] {
  let pts: Point[] = [a, b]
  for (let step = 0; step < order; step++) {
    const next: Point[] = [pts[0]]
    for (let i = 0; i < pts.length - 1; i++) {
      const p = pts[i]
      const q = pts[i + 1]
      next.push(splitSegment(p, q))
      next.push(q)
    }
    pts = next
  }
  return pts
}

/** order 阶曲线的线段数量 = 2^order */
export function segmentCount(order: number): number {
  return Math.pow(2, order)
}

export const ORDERS = [8, 12, 16]
