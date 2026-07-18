/**
 * 生日悖论核心算法（纯函数，便于测试）
 *
 * 在 n 个人的房间里，"至少两人生日相同"的概率增长得出奇地快。
 * 用补事件（所有人生日互不相同）来计算：
 *   P(碰撞) = 1 - ∏_{i=0..n-1} (365 - i) / 365
 * n=23 时已超过一半（约 0.507），n=70 时几乎必然（约 0.999）。
 */

const DAYS = 365

/** 至少两人同一天生日的概率（精确计算，忽略闰年与生日分布不均） */
export function collisionProb(n: number): number {
  if (n <= 1) return 0
  if (n > DAYS) return 1
  let allDistinct = 1
  for (let i = 0; i < n; i++) {
    allDistinct *= (DAYS - i) / DAYS
  }
  return 1 - allDistinct
}

/** 所有人生日互不相同的概率（补事件） */
export function distinctProb(n: number): number {
  return 1 - collisionProb(n)
}

/**
 * 蒙特卡洛模拟：随机给 n 个人分配生日，统计出现碰撞的频率。
 * 用线性同余伪随机保证同种子可复现。
 */
export function simulate(n: number, trials: number, seed = 1): number {
  if (n <= 1 || trials <= 0) return 0
  let s = seed >>> 0 || 1
  const rand = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
  let hits = 0
  for (let t = 0; t < trials; t++) {
    const seen = new Set<number>()
    let collided = false
    for (let i = 0; i < n; i++) {
      const day = Math.floor(rand() * DAYS)
      if (seen.has(day)) {
        collided = true
        break
      }
      seen.add(day)
    }
    if (collided) hits++
  }
  return hits / trials
}

/** 供曲线/选择器使用的一组代表性人数 */
export const GROUP_SIZES = [10, 23, 41, 57, 70]
