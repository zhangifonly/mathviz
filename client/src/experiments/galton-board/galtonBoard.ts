/**
 * 高尔顿板核心算法（纯函数，便于测试）
 *
 * 小球从顶部落下，每碰到一层钉子就等概率地向左或向右偏一格。
 * 经过 rows 层后，落入的槽位 = 向右偏的总次数，服从二项分布 B(rows, 0.5)。
 * 大量小球堆积，柱状轮廓逼近正态分布（中心极限定理）。
 */

/** 线性同余伪随机，保证可复现 */
function makeRand(seed: number): () => number {
  let s = seed % 0x7fffffff
  if (s <= 0) s += 0x7fffffff
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

/** 单个小球下落：每层五五开左右，返回落入的槽位（= 向右次数） */
export function dropBall(rows: number, seed: number): number {
  const rand = makeRand(seed)
  let slot = 0
  for (let i = 0; i < rows; i++) {
    if (rand() >= 0.5) slot++
  }
  return slot
}

/** 模拟 balls 个小球，返回各槽计数（长度 rows+1） */
export function simulate(rows: number, balls: number, seed = 1): number[] {
  const counts = new Array(rows + 1).fill(0)
  for (let b = 0; b < balls; b++) {
    const slot = dropBall(rows, seed + b * 2654435761)
    counts[slot]++
  }
  return counts
}

/** 二项系数 C(n, k)，用乘法递推避免溢出 */
export function binomial(n: number, k: number): number {
  if (k < 0 || k > n) return 0
  let c = 1
  for (let i = 0; i < k; i++) c = (c * (n - i)) / (i + 1)
  return c
}

/** 理论二项分布 B(rows, 0.5)：各槽的概率，长度 rows+1，和为 1 */
export function binomialDist(rows: number): number[] {
  const p = 0.5
  const dist: number[] = []
  for (let k = 0; k <= rows; k++) {
    dist.push(binomial(rows, k) * p ** k * (1 - p) ** (rows - k))
  }
  return dist
}

export const ROWS = 12
export const BALL_COUNTS = [200, 1000, 5000]
