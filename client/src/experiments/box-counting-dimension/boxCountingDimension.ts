/**
 * 盒维数（box-counting dimension）核心算法（纯函数，便于测试）
 * 用边长 ε 的网格覆盖分形点集，统计非空格子数 N(ε)。ε 越小 N 越大，
 * 维数 D = lim log N(ε) / log(1/ε)，用 log-log 直线斜率估计。
 */

export interface Pt {
  x: number
  y: number
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
 * 用「混沌游戏」生成谢尔宾斯基三角形点集，坐标落在 [0,size]。
 * 每步从三个顶点里随机取一个，移动到当前点与它的中点，
 * 迭代后所有落点逼近这个分形（理论盒维数 = log3/log2 ≈ 1.585）。
 */
export function makeSierpinski(nPoints: number, size = 512, seed = 1): Pt[] {
  const rand = makeRand(seed)
  const verts: Pt[] = [
    { x: size / 2, y: 0 },
    { x: 0, y: size },
    { x: size, y: size },
  ]
  let px = size / 2
  let py = size / 2
  const pts: Pt[] = []
  for (let i = 0; i < nPoints; i++) {
    const v = verts[Math.floor(rand() * 3) % 3]
    px = (px + v.x) / 2
    py = (py + v.y) / 2
    if (i > 10) pts.push({ x: px, y: py }) // 丢弃前几个未收敛的点
  }
  return pts
}

/** 用边长 epsilon 的网格覆盖点集，返回非空格子数 N(ε) */
export function countBoxes(points: Pt[], epsilon: number, size = 512): number {
  if (epsilon <= 0) return 0
  const cols = Math.ceil(size / epsilon) + 1
  const seen = new Set<number>()
  for (const p of points) {
    const cx = Math.floor(p.x / epsilon)
    const cy = Math.floor(p.y / epsilon)
    seen.add(cy * cols + cx)
  }
  return seen.size
}

/** 最小二乘线性拟合，返回斜率与截距 */
export function linearFit(xs: number[], ys: number[]): { slope: number; intercept: number } {
  const n = xs.length
  let sx = 0
  let sy = 0
  let sxx = 0
  let sxy = 0
  for (let i = 0; i < n; i++) {
    sx += xs[i]
    sy += ys[i]
    sxx += xs[i] * xs[i]
    sxy += xs[i] * ys[i]
  }
  const denom = n * sxx - sx * sx
  const slope = denom === 0 ? 0 : (n * sxy - sx * sy) / denom
  const intercept = n === 0 ? 0 : (sy - slope * sx) / n
  return { slope, intercept }
}

export interface BoxDatum {
  epsilon: number
  count: number
  logInvEps: number
  logN: number
}

/** 对每个尺度做盒计数，返回 log-log 数据点 */
export function boxCountData(points: Pt[], epsilons: number[], size = 512): BoxDatum[] {
  return epsilons.map((eps) => {
    const count = countBoxes(points, eps, size)
    return { epsilon: eps, count, logInvEps: Math.log(1 / eps), logN: Math.log(count || 1) }
  })
}

/** 估计盒维数 = log N 对 log(1/ε) 的拟合斜率 */
export function estimateDimension(points: Pt[], epsilons: number[], size = 512): number {
  const data = boxCountData(points, epsilons, size)
  return linearFit(data.map((d) => d.logInvEps), data.map((d) => d.logN)).slope
}

/** 可选的网格尺度（由大到小） */
export const EPSILONS = [64, 32, 16, 8, 4, 2]
