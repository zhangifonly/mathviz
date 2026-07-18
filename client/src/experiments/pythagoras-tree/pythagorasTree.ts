/**
 * 毕达哥拉斯树核心算法（纯函数，便于测试）
 *
 * 从一个正方形出发，在它的顶边上架一个直角三角形（倾角 angle 可调，
 * 默认 45 度），三角形的两条直角边各作为新正方形的底边，递归生长。
 * 每层正方形数量翻倍，整体呈现自相似的分形树冠。
 * 坐标使用数学系（y 轴向上），由 draw 层做缩放与翻转。
 */

export interface Point {
  x: number
  y: number
}

/** 一个正方形：4 个顶点 + 所在递归层级（用于配色） */
export interface Square {
  points: [Point, Point, Point, Point]
  level: number
}

/** 由底边 A->B 构造正方形，向 A->B 逆时针 90 度一侧生长，返回 4 顶点 */
function squareFromBase(a: Point, b: Point): [Point, Point, Point, Point] {
  const dx = b.x - a.x
  const dy = b.y - a.y
  // 垂直向量（逆时针旋转 90 度），指向正方形生长方向
  const px = -dy
  const py = dx
  const topRight: Point = { x: b.x + px, y: b.y + py }
  const topLeft: Point = { x: a.x + px, y: a.y + py }
  return [a, b, topRight, topLeft]
}

/**
 * 递归构建毕达哥拉斯树。
 * @param depth 递归深度：0 只返回根正方形，共 2^(depth+1)-1 个正方形
 * @param angleDeg 顶边直角三角形在左端点处的倾角（度），默认 45
 */
export function buildTree(depth: number, angleDeg = 45): Square[] {
  const alpha = (angleDeg * Math.PI) / 180
  const squares: Square[] = []

  const recurse = (a: Point, b: Point, remaining: number, level: number) => {
    const pts = squareFromBase(a, b)
    squares.push({ points: pts, level })
    if (remaining <= 0) return
    const topLeft = pts[3]
    const topRight = pts[2]
    // 直角三角形顶点：以顶边为斜边，在左端点处夹角为 alpha
    const hx = topRight.x - topLeft.x
    const hy = topRight.y - topLeft.y
    const len = Math.hypot(hx, hy)
    const legLen = len * Math.cos(alpha)
    // 顶边方向逆时针旋转 alpha，得到左直角边方向
    const ca = Math.cos(alpha)
    const sa = Math.sin(alpha)
    const ux = (hx * ca - hy * sa) / len
    const uy = (hx * sa + hy * ca) / len
    const apex: Point = { x: topLeft.x + ux * legLen, y: topLeft.y + uy * legLen }
    // 两条直角边各生一个正方形
    recurse(topLeft, apex, remaining - 1, level + 1)
    recurse(apex, topRight, remaining - 1, level + 1)
  }

  recurse({ x: 0, y: 0 }, { x: 1, y: 0 }, depth, 0)
  return squares
}

/** 深度为 depth 的树共有多少个正方形：2^(depth+1)-1 */
export function squareCount(depth: number): number {
  return Math.pow(2, depth + 1) - 1
}

/** 一组正方形所有顶点的包围盒，供绘制时缩放平移 */
export function treeBounds(squares: Square[]): { minX: number; minY: number; maxX: number; maxY: number } {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const sq of squares) {
    for (const p of sq.points) {
      if (p.x < minX) minX = p.x
      if (p.x > maxX) maxX = p.x
      if (p.y < minY) minY = p.y
      if (p.y > maxY) maxY = p.y
    }
  }
  return { minX, minY, maxX, maxY }
}

export const DEPTHS = [6, 9, 12]
