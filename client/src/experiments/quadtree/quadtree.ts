/**
 * 四叉树核心算法（纯函数，便于测试）
 *
 * 四叉树把平面递归地四等分：当某个矩形区域内的点数超过容量，
 * 就把它切成四个子象限，把点分配下去，如此递归。点密的地方
 * 划得细，点疏的地方划得粗。适合做空间索引与范围查询加速。
 */

export interface Point {
  x: number
  y: number
}

export interface QuadNode {
  x: number
  y: number
  w: number
  h: number
  points: Point[]        // 仅叶子节点携带点
  children: QuadNode[] | null // 顺序: 左上, 右上, 左下, 右下
}

/** 线性同余伪随机，保证可复现 */
function makeRand(seed: number) {
  let s = seed & 0x7fffffff || 1
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

/** 生成 n 个点，clustered 时围绕若干簇心聚集，更能体现疏密分布 */
export function makePoints(n: number, width: number, height: number, seed = 1, clustered = true): Point[] {
  const rand = makeRand(seed)
  const pts: Point[] = []
  const clusters = clustered ? 4 : 0
  const centers = Array.from({ length: clusters }, () => ({ cx: rand() * width, cy: rand() * height }))
  for (let i = 0; i < n; i++) {
    if (clustered && rand() < 0.75) {
      const c = centers[i % clusters]
      const r = rand() * Math.min(width, height) * 0.12
      const a = rand() * Math.PI * 2
      pts.push({
        x: Math.max(0, Math.min(width, c.cx + Math.cos(a) * r)),
        y: Math.max(0, Math.min(height, c.cy + Math.sin(a) * r)),
      })
    } else {
      pts.push({ x: rand() * width, y: rand() * height })
    }
  }
  return pts
}

/** 递归构建四叉树: 点数超容量则四分, 直到叶子达标或触底 */
export function buildQuadtree(
  points: Point[],
  x: number, y: number, w: number, h: number,
  capacity: number, depth = 0, maxDepth = 8,
): QuadNode {
  if (points.length <= capacity || depth >= maxDepth) {
    return { x, y, w, h, points: points.slice(), children: null }
  }
  const hw = w / 2, hh = h / 2
  const midX = x + hw, midY = y + hh
  const buckets: Point[][] = [[], [], [], []]
  for (const p of points) {
    const right = p.x >= midX ? 1 : 0
    const bottom = p.y >= midY ? 1 : 0
    buckets[bottom * 2 + right].push(p)
  }
  const rects = [
    [x, y], [midX, y], [x, midY], [midX, midY],
  ]
  const children = buckets.map((b, i) =>
    buildQuadtree(b, rects[i][0], rects[i][1], hw, hh, capacity, depth + 1, maxDepth),
  )
  return { x, y, w, h, points: [], children }
}

/** 统计树中节点总数（含内部与叶子） */
export function countNodes(node: QuadNode): number {
  if (!node.children) return 1
  return 1 + node.children.reduce((s, c) => s + countNodes(c), 0)
}

function intersects(n: QuadNode, rx: number, ry: number, rw: number, rh: number): boolean {
  return !(rx > n.x + n.w || rx + rw < n.x || ry > n.y + n.h || ry + rh < n.y)
}

/** 范围查询: 借助边界相交剪枝, 只下探与查询框重叠的子树 */
export function queryRange(node: QuadNode, rx: number, ry: number, rw: number, rh: number): Point[] {
  if (!intersects(node, rx, ry, rw, rh)) return []
  if (node.children) return node.children.flatMap((c) => queryRange(c, rx, ry, rw, rh))
  return node.points.filter((p) => p.x >= rx && p.x <= rx + rw && p.y >= ry && p.y <= ry + rh)
}

export const CAPACITY = 4
export const POINT_COUNTS = [30, 80, 160]
