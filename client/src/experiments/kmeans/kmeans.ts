/**
 * K-means 聚类核心算法（纯函数，便于测试）
 *
 * 生成若干簇的合成二维数据，反复执行"分配-更新"两步，
 * 直到中心不再移动（收敛），记录每一步的帧用于可视化。
 */

export interface Point {
  x: number
  y: number
}

export const K_VALUES = [2, 3, 4]
export const N_CLUSTERS = 4

/** 一步迭代的快照：每个点归属、每个簇中心 */
export interface Frame {
  centers: Point[]
  assign: number[]
}

/** 线性同余伪随机，保证可复现 */
function makeRand(seed: number) {
  let s = seed & 0x7fffffff || 1
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

/** 生成 nClusters 个簇、共约 count 个点的合成数据 */
export function makePoints(count: number, width: number, height: number, seed = 1, nClusters = N_CLUSTERS): Point[] {
  const rand = makeRand(seed)
  const pts: Point[] = []
  const spread = Math.min(width, height) * 0.09
  const cx: Point[] = []
  for (let c = 0; c < nClusters; c++) {
    cx.push({ x: width * (0.2 + 0.6 * rand()), y: height * (0.2 + 0.6 * rand()) })
  }
  for (let i = 0; i < count; i++) {
    const c = cx[i % nClusters]
    // Box-Muller 近似：两个均匀量求和逼近高斯
    const gx = (rand() + rand() + rand() - 1.5) * spread
    const gy = (rand() + rand() + rand() - 1.5) * spread
    pts.push({ x: c.x + gx, y: c.y + gy })
  }
  return pts
}

export function dist2(a: Point, b: Point): number {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return dx * dx + dy * dy
}

/** 把每个点分配到最近的中心，返回中心索引数组 */
export function assignPoints(points: Point[], centers: Point[]): number[] {
  return points.map((p) => {
    let best = 0
    let bestD = Infinity
    for (let c = 0; c < centers.length; c++) {
      const d = dist2(p, centers[c])
      if (d < bestD) {
        bestD = d
        best = c
      }
    }
    return best
  })
}

/** 按当前分配，取每个簇的均值作为新中心（空簇保持原位） */
export function updateCenters(points: Point[], assign: number[], k: number): Point[] {
  const sum = Array.from({ length: k }, () => ({ x: 0, y: 0, n: 0 }))
  for (let i = 0; i < points.length; i++) {
    const c = assign[i]
    sum[c].x += points[i].x
    sum[c].y += points[i].y
    sum[c].n++
  }
  return sum.map((s) => (s.n > 0 ? { x: s.x / s.n, y: s.y / s.n } : { x: 0, y: 0 }))
}

/** 选取前 k 个点附近作为初始中心（确定性） */
export function initCenters(points: Point[], k: number, seed = 1): Point[] {
  const rand = makeRand(seed + 7)
  const centers: Point[] = []
  for (let c = 0; c < k; c++) {
    centers.push({ ...points[Math.floor(rand() * points.length)] })
  }
  return centers
}

/** 一次迭代：分配 + 更新，返回新中心与分配 */
export function kmeansStep(points: Point[], centers: Point[]): Frame {
  const assign = assignPoints(points, centers)
  const next = updateCenters(points, assign, centers.length)
  // 空簇沿用旧中心，避免退化到 (0,0)
  const centersOut = next.map((c, i) => (c.x === 0 && c.y === 0 ? centers[i] : c))
  return { centers: centersOut, assign }
}

/** 迭代到收敛，返回每一步的帧（含初始帧） */
export function runKmeans(points: Point[], k: number, seed = 1, maxIter = 20): Frame[] {
  let centers = initCenters(points, k, seed)
  const frames: Frame[] = [{ centers, assign: assignPoints(points, centers) }]
  for (let it = 0; it < maxIter; it++) {
    const f = kmeansStep(points, centers)
    frames.push(f)
    const moved = f.centers.some((c, i) => dist2(c, centers[i]) > 1e-6)
    centers = f.centers
    if (!moved) break
  }
  return frames
}
