/**
 * 凸包算法核心（纯函数，便于测试）
 *
 * 给定平面上一组散点，凸包是能把它们全部套住的最小凸多边形，
 * 就像用一根橡皮筋从外面松开、紧紧箍住所有钉子后的形状。
 * 这里用 Andrew 单调链算法：先按坐标排序，再分别构造下凸壳与上凸壳。
 */

export interface Point {
  x: number
  y: number
}

/** 生成 n 个随机点（线性同余伪随机，同种子可复现） */
export function makePoints(n: number, seed = 1, width = 600, height = 480): Point[] {
  let s = seed
  const rand = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
  const pts: Point[] = []
  const mx = width * 0.08
  const my = height * 0.08
  for (let i = 0; i < n; i++) {
    pts.push({
      x: mx + rand() * (width - 2 * mx),
      y: my + rand() * (height - 2 * my),
    })
  }
  return pts
}

/**
 * 叉积：向量 OA 与 OB 的叉积。
 * >0 表示 O→A→B 为逆时针（左转），<0 为顺时针（右转），=0 共线。
 */
export function cross(o: Point, a: Point, b: Point): number {
  return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x)
}

/**
 * Andrew 单调链凸包。返回逆时针排列的凸包顶点（不含重复的首尾点）。
 * 点数 < 3 时原样返回去重后的点。
 */
export function convexHull(points: Point[]): Point[] {
  const pts = [...points].sort((p, q) => (p.x - q.x) || (p.y - q.y))
  const uniq: Point[] = []
  for (const p of pts) {
    const last = uniq[uniq.length - 1]
    if (!last || last.x !== p.x || last.y !== p.y) uniq.push(p)
  }
  if (uniq.length < 3) return uniq

  const lower: Point[] = []
  for (const p of uniq) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
      lower.pop()
    }
    lower.push(p)
  }
  const upper: Point[] = []
  for (let i = uniq.length - 1; i >= 0; i--) {
    const p = uniq[i]
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
      upper.pop()
    }
    upper.push(p)
  }
  lower.pop()
  upper.pop()
  return lower.concat(upper)
}

export const POINT_COUNTS = [10, 20, 40]
