/**
 * 谢尔宾斯基三角核心算法（纯函数，便于测试）
 *
 * 两种生成法：
 * 1. 递归挖洞 subdivide：把一个三角形分成 4 个小三角，挖掉中间那个，
 *    对剩下 3 个继续递归，n 层后得到 3^n 个小三角形。
 * 2. 混沌游戏 chaosGame：从任意点出发，反复选一个随机顶点，
 *    把当前点向该顶点移动一半，得到的点集竟然也勾勒出同一个分形。
 */

export interface Point {
  x: number
  y: number
}

export type Triangle = [Point, Point, Point]

/** 两点中点 */
export function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}

/**
 * 递归挖洞：返回第 n 层剩余的所有小三角（挖掉中心后的 3 份继续细分）。
 * n=0 时返回原三角本身。
 */
export function subdivide(tri: Triangle, n: number): Triangle[] {
  if (n <= 0) return [tri]
  const [a, b, c] = tri
  const ab = midpoint(a, b)
  const bc = midpoint(b, c)
  const ca = midpoint(c, a)
  // 中间的 [ab, bc, ca] 被挖掉，只递归三个角
  const corners: Triangle[] = [
    [a, ab, ca],
    [ab, b, bc],
    [ca, bc, c],
  ]
  return corners.flatMap((t) => subdivide(t, n - 1))
}

/** 线性同余伪随机，保证可复现 */
function makeRand(seed: number): () => number {
  let s = seed & 0x7fffffff || 1
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

/**
 * 混沌游戏：给定三角三顶点，从一个随机内点出发，
 * 每步随机选一个顶点并移动到当前点与它的中点，累积 iterations 个点。
 * 前几个热身点会被丢弃以贴合吸引子。
 */
export function chaosGame(tri: Triangle, iterations: number, seed = 1): Point[] {
  const rand = makeRand(seed)
  let p: Point = { x: (tri[0].x + tri[1].x + tri[2].x) / 3, y: (tri[0].y + tri[1].y + tri[2].y) / 3 }
  const pts: Point[] = []
  const warmup = 10
  for (let i = 0; i < iterations + warmup; i++) {
    const v = tri[Math.floor(rand() * 3)]
    p = midpoint(p, v)
    if (i >= warmup) pts.push(p)
  }
  return pts
}

export const LEVELS = [1, 2, 3, 4, 5]
export const MODES = ['recursive', 'chaos'] as const
export type Mode = (typeof MODES)[number]
