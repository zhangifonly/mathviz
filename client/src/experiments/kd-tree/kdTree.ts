/**
 * 2D KD 树核心算法（纯函数，便于测试）
 *
 * KD 树把平面上的点集按坐标轴交替切分：深度为偶数按 x 切，
 * 奇数按 y 切，每次取中位数点作为节点，从而构建一棵平衡的
 * 二叉搜索树。最近邻查询借助切分平面进行剪枝，避免遍历全部点。
 */

export interface Point {
  x: number
  y: number
}

export interface KdNode {
  point: Point
  axis: 0 | 1 // 0=按 x 切, 1=按 y 切
  left: KdNode | null
  right: KdNode | null
}

/** 生成 n 个随机点（线性同余伪随机，可复现） */
export function makePoints(n: number, width: number, height: number, seed = 1): Point[] {
  let s = seed
  const rand = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
  const pts: Point[] = []
  for (let i = 0; i < n; i++) {
    pts.push({ x: rand() * width, y: rand() * height })
  }
  return pts
}

/** 递归构建 KD 树：按当前轴取中位数切分 */
export function buildKdTree(points: Point[], depth = 0): KdNode | null {
  if (points.length === 0) return null
  const axis: 0 | 1 = (depth % 2) as 0 | 1
  const sorted = [...points].sort((a, b) => (axis === 0 ? a.x - b.x : a.y - b.y))
  const mid = Math.floor(sorted.length / 2)
  return {
    point: sorted[mid],
    axis,
    left: buildKdTree(sorted.slice(0, mid), depth + 1),
    right: buildKdTree(sorted.slice(mid + 1), depth + 1),
  }
}

/** 欧氏距离平方 */
export function dist2(a: Point, b: Point): number {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return dx * dx + dy * dy
}

export interface NnResult {
  best: Point | null
  bestDist2: number
  visited: number
}

/** 带剪枝的最近邻搜索：返回最近点、最近距离平方、访问节点数 */
export function nearestNeighbor(tree: KdNode | null, query: Point): NnResult {
  const res: NnResult = { best: null, bestDist2: Infinity, visited: 0 }
  const search = (node: KdNode | null) => {
    if (!node) return
    res.visited++
    const d = dist2(node.point, query)
    if (d < res.bestDist2) {
      res.bestDist2 = d
      res.best = node.point
    }
    const diff = node.axis === 0 ? query.x - node.point.x : query.y - node.point.y
    const near = diff < 0 ? node.left : node.right
    const far = diff < 0 ? node.right : node.left
    search(near)
    // 剪枝：只有当切分平面比当前最近距离更近时才搜另一侧
    if (diff * diff < res.bestDist2) search(far)
  }
  search(tree)
  return res
}

export const POINT_COUNTS = [8, 16, 32]
