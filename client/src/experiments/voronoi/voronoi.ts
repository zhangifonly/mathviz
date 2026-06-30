/**
 * 沃罗诺伊图核心算法（纯函数，便于测试）
 *
 * 给定一组站点(seed)，平面上每个点归属于最近的站点，
 * 由此把平面划分成一块块多边形区域，即沃罗诺伊图。
 * 这里用暴力最近站点法（像素级），简单可靠。
 */

export interface Site {
  x: number
  y: number
  color: string
}

const PALETTE = [
  '#6366f1', '#ec4899', '#22d3ee', '#a3e635', '#fbbf24',
  '#f87171', '#34d399', '#a78bfa', '#fb923c', '#38bdf8',
]

/** 生成 n 个随机站点（带可重复的伪随机种子） */
export function makeSites(n: number, width: number, height: number, seed = 1): Site[] {
  let s = seed
  const rand = () => {
    // 线性同余伪随机，保证可测试
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
  const sites: Site[] = []
  for (let i = 0; i < n; i++) {
    sites.push({
      x: rand() * width,
      y: rand() * height,
      color: PALETTE[i % PALETTE.length],
    })
  }
  return sites
}

/** 欧氏距离平方（省去开方，比较足够） */
export function dist2(ax: number, ay: number, bx: number, by: number): number {
  const dx = ax - bx
  const dy = ay - by
  return dx * dx + dy * dy
}

/** 找出 (x,y) 最近站点的索引 */
export function nearestSite(sites: Site[], x: number, y: number): number {
  let best = 0
  let bestD = Infinity
  for (let i = 0; i < sites.length; i++) {
    const d = dist2(x, y, sites[i].x, sites[i].y)
    if (d < bestD) {
      bestD = d
      best = i
    }
  }
  return best
}

export const SITE_COUNTS = [8, 16, 32]
