/**
 * 蒲丰投针核心算法（纯函数，便于测试）
 *
 * 在间距为 spacing 的等距平行线上随机投下长度为 length 的针。
 * 当针长等于线距时，相交概率恰为 2/pi，
 * 于是用相交频率反推 pi：piEstimate = 2 * length * n / (spacing * crossings)。
 */

export interface Needle {
  cx: number
  cy: number
  angle: number
  x1: number
  y1: number
  x2: number
  y2: number
  crosses: boolean
}

/** 线性同余伪随机，保证同种子可复现 */
export function makeRng(seed = 1): () => number {
  let s = seed >>> 0 || 1
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

/** 投一根针：随机中心与角度，判断是否跨越水平平行线 */
export function dropNeedle(
  rand: () => number,
  width: number,
  height: number,
  spacing: number,
  length: number,
): Needle {
  const cx = rand() * width
  const cy = rand() * height
  const angle = rand() * Math.PI
  const half = length / 2
  const x1 = cx - half * Math.cos(angle)
  const y1 = cy - half * Math.sin(angle)
  const x2 = cx + half * Math.cos(angle)
  const y2 = cy + half * Math.sin(angle)
  // 平行线在 y = 0, spacing, 2*spacing ...：两端点落在不同带内即相交
  const crosses = Math.floor(y1 / spacing) !== Math.floor(y2 / spacing)
  return { cx, cy, angle, x1, y1, x2, y2, crosses }
}

export interface SimResult {
  crossings: number
  total: number
  piEstimate: number
  needles: Needle[]
}

/** 投 n 根针，返回相交数、pi 估计与针列表（用于绘制） */
export function simulate(
  n: number,
  seed = 1,
  width = 600,
  height = 480,
  spacing = 60,
  length = 60,
): SimResult {
  const rand = makeRng(seed)
  const needles: Needle[] = []
  let crossings = 0
  for (let i = 0; i < n; i++) {
    const needle = dropNeedle(rand, width, height, spacing, length)
    if (needle.crosses) crossings++
    needles.push(needle)
  }
  return { crossings, total: n, piEstimate: piEstimate(n, crossings, spacing, length), needles }
}

/** 由相交数估计 pi；相交数为 0 时返回 NaN（无法估计） */
export function piEstimate(n: number, crossings: number, spacing = 60, length = 60): number {
  if (crossings <= 0) return NaN
  return (2 * length * n) / (spacing * crossings)
}

export const NEEDLE_COUNTS = [200, 1000, 5000]
