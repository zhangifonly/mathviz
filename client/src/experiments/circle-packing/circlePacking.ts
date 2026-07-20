/**
 * 圆填充核心算法（纯函数，便于测试）
 *
 * 研究如何在一块矩形区域里塞进尽可能多的圆，并比较不同排布的
 * 密度（圆面积总和 / 区域面积）。方形排布密度约 0.7854，
 * 六边形最密排布密度约 0.9069（平面等圆填充的理论上界）。
 */

export interface Circle {
  x: number
  y: number
  r: number
}

export const MODES = ['hex', 'square', 'random'] as const
export type PackMode = (typeof MODES)[number]

/** 方形堆积：圆心排成正方形网格，行列间距均为 2r */
export function squarePacking(width: number, height: number, r: number): Circle[] {
  const circles: Circle[] = []
  for (let y = r; y + r <= height + 1e-6; y += 2 * r) {
    for (let x = r; x + r <= width + 1e-6; x += 2 * r) {
      circles.push({ x, y, r })
    }
  }
  return circles
}

/**
 * 六边形最密堆积：相邻行错开半个圆，行间距为 r*sqrt(3)，
 * 每个圆被六个圆紧紧包围，是平面等圆填充的最优排布。
 */
export function hexPacking(width: number, height: number, r: number): Circle[] {
  const circles: Circle[] = []
  const rowStep = r * Math.sqrt(3)
  let row = 0
  for (let y = r; y + r <= height + 1e-6; y += rowStep) {
    const offset = row % 2 === 1 ? r : 0
    for (let x = r + offset; x + r <= width + 1e-6; x += 2 * r) {
      circles.push({ x, y, r })
    }
    row++
  }
  return circles
}

/** 线性同余伪随机，保证同种子可复现 */
function makeRand(seed: number): () => number {
  let s = seed & 0x7fffffff
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

/**
 * 随机放置法：逐个尝试落下半径随机的圆，与已有圆重叠则丢弃。
 * count 为尝试次数，实际保留的圆数通常更少。
 */
export function randomPacking(
  width: number,
  height: number,
  count: number,
  seed = 1,
): Circle[] {
  const rand = makeRand(seed)
  const circles: Circle[] = []
  for (let i = 0; i < count; i++) {
    const r = 6 + rand() * 18
    const x = r + rand() * (width - 2 * r)
    const y = r + rand() * (height - 2 * r)
    let ok = width - 2 * r > 0 && height - 2 * r > 0
    for (const c of circles) {
      const dx = c.x - x
      const dy = c.y - y
      if (dx * dx + dy * dy < (c.r + r) * (c.r + r)) {
        ok = false
        break
      }
    }
    if (ok) circles.push({ x, y, r })
  }
  return circles
}

/** 填充密度：所有圆面积之和 / 区域面积 */
export function packingDensity(circles: Circle[], area: number): number {
  if (area <= 0) return 0
  let sum = 0
  for (const c of circles) sum += Math.PI * c.r * c.r
  return sum / area
}
