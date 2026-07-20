/**
 * 鸽巢原理核心算法（纯函数，便于测试）
 *
 * 鸽巢原理（抽屉原理）：把 n 个物品放进 m 个抽屉，若 n > m，
 * 则必有一个抽屉里至少有 2 个物品。更一般地，必有某个抽屉
 * 至少装了 ceil(n/m) 个物品。
 */

export interface Scenario {
  items: number
  holes: number
  label: string
}

/** 把 items 个物品伪随机分配到 holes 个抽屉，返回每个抽屉的物品数数组 */
export function distribute(items: number, holes: number, seed = 1): number[] {
  const counts = new Array(Math.max(0, holes)).fill(0)
  if (holes <= 0 || items <= 0) return counts
  let s = seed
  const rand = () => {
    // 线性同余伪随机，保证可复现
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
  for (let i = 0; i < items; i++) {
    const idx = Math.floor(rand() * holes) % holes
    counts[idx]++
  }
  return counts
}

/** 鸽巢原理保证的下界：必有某抽屉至少装了 ceil(items/holes) 个 */
export function guaranteedMax(items: number, holes: number): number {
  if (holes <= 0) return 0
  return Math.ceil(items / holes)
}

/** 物品多于抽屉时，必然发生碰撞（某抽屉≥2） */
export function hasCollision(items: number, holes: number): boolean {
  return items > holes
}

/** 实际分配中出现的最大抽屉物品数 */
export function actualMax(counts: number[]): number {
  return counts.reduce((m, c) => (c > m ? c : m), 0)
}

export const SCENARIOS: Scenario[] = [
  { items: 13, holes: 12, label: '13只鸽子12个巢' },
  { items: 5, holes: 4, label: '5只鸽子4个巢' },
  { items: 10, holes: 3, label: '10只鸽子3个巢' },
  { items: 8, holes: 8, label: '8只鸽子8个巢' },
  { items: 20, holes: 6, label: '20只鸽子6个巢' },
]
