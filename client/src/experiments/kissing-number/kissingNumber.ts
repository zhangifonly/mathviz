/**
 * 接吻数问题（纯函数，便于测试）
 *
 * 一个单位球周围最多能同时贴上几个同样大小的球？这个数叫**接吻数** τ(n)。
 *
 *   一维 τ=2   （线段两端）
 *   二维 τ=6   （六个圆围一圈，正好，没有余量）
 *   三维 τ=12  ← 牛顿与格雷戈里在 1694 年为此争论
 *   四维 τ=24  （2003 年才证明）
 *   八维 τ=240 （E8 格）· 二十四维 τ=196560（Leech 格）
 *
 * **三维的争论**：牛顿说 12，格雷戈里说也许能塞下 13。
 * 关键在于 12 个球摆好后**还剩不少空隙** —— 十二面体排列下，
 * 相邻球心的角距是 63.43°，而"贴住"只需要 60°，富余 3.43°。
 * 这些空隙加起来看着够第 13 个球，但挪不到一起。1953 年才严格证明是 12。
 *
 * 本实验用两个可算的量刻画这件事：
 *
 * 1. **角距判据**：两球都贴住中心球且互不重叠 ⟺ 球心角距 ≥ 60°。
 *    验证 12 球排列合法，且任意再加一个都会破坏它。
 *
 * 2. **球冠面积上界**：每个球在单位球面上占一个半角 30° 的球冠，
 *    面积 2π(1−cos30°)。用 4π 去除给出 τ ≤ 14.9 —— 这是最朴素的上界，
 *    它挡不住 13，正是争论持续 250 年的原因。
 */

import type { Vec3 } from '../../lib/proj3d'

export function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}

export function norm(a: Vec3): number {
  return Math.hypot(a[0], a[1], a[2])
}

export function unit(a: Vec3): Vec3 {
  const n = norm(a) || 1
  return [a[0] / n, a[1] / n, a[2] / n]
}

const PHI = (1 + Math.sqrt(5)) / 2

/**
 * 两球心方向的角距（弧度）。
 * 两个单位球都贴住中心球时球心距为 2，互不重叠要求球心距 ≥ 2，
 * 换算成角距就是 ≥ 60°。
 */
export function angularDistance(a: Vec3, b: Vec3): number {
  const c = dot(unit(a), unit(b))
  return Math.acos(Math.max(-1, Math.min(1, c)))
}

/** 贴住中心球所需的最小角距：60° */
export const MIN_ANGLE = Math.PI / 3

/** 每个邻球在单位球面上占的球冠半角：30° */
export const CAP_HALF_ANGLE = Math.PI / 6

/** 球冠立体角 2π(1−cos30°) */
export function capSolidAngle(): number {
  return 2 * Math.PI * (1 - Math.cos(CAP_HALF_ANGLE))
}

/**
 * 朴素上界：4π / 球冠立体角。
 * 给出 14.92 —— 挡不住 13，所以这个上界不够强。
 */
export function naiveUpperBound(): number {
  return (4 * Math.PI) / capSolidAngle()
}

/**
 * 一组球心方向是否构成合法排列：两两角距都 ≥ 60°。
 * 返回最小角距（应 ≥ 60° 才合法）。
 */
export function minPairAngle(dirs: Vec3[]): number {
  let m = Infinity
  for (let i = 0; i < dirs.length; i++) {
    for (let j = i + 1; j < dirs.length; j++) {
      m = Math.min(m, angularDistance(dirs[i], dirs[j]))
    }
  }
  return dirs.length < 2 ? Infinity : m
}

/** 排列是否合法（允许 1e-9 的数值容差） */
export function isValidArrangement(dirs: Vec3[], tol = 1e-9): boolean {
  return minPairAngle(dirs) >= MIN_ANGLE - tol
}

/**
 * 十二面体排列：12 个方向取正二十面体的顶点。
 * 这是牛顿主张的那 12 个球，相邻角距 63.43°，比 60° 富余 3.43°。
 */
export function icosahedralDirections(): Vec3[] {
  const raw: Vec3[] = [
    [0, 1, PHI], [0, -1, PHI], [0, 1, -PHI], [0, -1, -PHI],
    [1, PHI, 0], [-1, PHI, 0], [1, -PHI, 0], [-1, -PHI, 0],
    [PHI, 0, 1], [PHI, 0, -1], [-PHI, 0, 1], [-PHI, 0, -1],
  ]
  return raw.map(unit)
}

/**
 * 立方八面体（面心立方）排列：12 个方向取立方体各棱中点。
 * 这是最密堆积里每个球的邻居，相邻角距恰好 60° —— 一点余量都没有。
 */
export function cuboctahedralDirections(): Vec3[] {
  const raw: Vec3[] = [
    [1, 1, 0], [1, -1, 0], [-1, 1, 0], [-1, -1, 0],
    [1, 0, 1], [1, 0, -1], [-1, 0, 1], [-1, 0, -1],
    [0, 1, 1], [0, 1, -1], [0, -1, 1], [0, -1, -1],
  ]
  return raw.map(unit)
}

/**
 * 六个坐标轴方向：只有 6 个球，角距 90°。
 *
 * ⚠️ 反直觉之处：这个排列**已经加不进第 7 个球**。
 * 最大的空位在体对角线方向 (1,1,1)/√3，角距只有 arccos(1/√3) = 54.74°，
 * 不到要求的 60°。所以它是个「局部最优」—— 摆得太松反而卡死，
 * 要达到 12 必须整体换一种摆法。这正是接吻数难在何处的直观体现。
 */
export function octahedralDirections(): Vec3[] {
  return [
    [1, 0, 0], [-1, 0, 0], [0, 1, 0],
    [0, -1, 0], [0, 0, 1], [0, 0, -1],
  ]
}

/** 体对角线方向与坐标轴的角距 arccos(1/√3)，六球排列的最大空位 */
export const OCTAHEDRAL_BEST_GAP = Math.acos(1 / Math.sqrt(3))

export type ArrangementId = 'icosahedral' | 'cuboctahedral' | 'octahedral'

export interface Arrangement {
  id: ArrangementId
  label: string
  note: string
  dirs: Vec3[]
}

export function arrangementOf(id: ArrangementId): Arrangement {
  if (id === 'cuboctahedral') {
    return {
      id,
      label: '立方八面体',
      note: '最密堆积 · 角距恰好 60°，零余量',
      dirs: cuboctahedralDirections(),
    }
  }
  if (id === 'octahedral') {
    return {
      id,
      label: '六球（坐标轴）',
      note: '角距 90° 却已卡死 · 局部最优',
      dirs: octahedralDirections(),
    }
  }
  return {
    id: 'icosahedral',
    label: '二十面体',
    note: '牛顿的 12 球 · 角距 63.43°，有余量',
    dirs: icosahedralDirections(),
  }
}

export const ARRANGEMENTS: ArrangementId[] = [
  'icosahedral', 'cuboctahedral', 'octahedral',
]

/**
 * 试图在已有排列上再加一个球：在球面上密集采样，
 * 找与所有已有方向角距都 ≥ 60° 的位置。
 *
 * 对 12 球排列应该找不到 —— 这正是接吻数是 12 而非 13 的数值体现。
 * 返回找到的位置（找不到返回 null）与搜索时遇到的最佳角距。
 */
export function findExtraSphere(
  dirs: Vec3[], samples = 20000,
): { found: Vec3 | null; bestAngle: number } {
  let best = -Infinity
  let bestDir: Vec3 | null = null
  // 球面均匀采样（黄金角螺旋）
  const ga = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < samples; i++) {
    const z = 1 - (2 * (i + 0.5)) / samples
    const r = Math.sqrt(Math.max(0, 1 - z * z))
    const th = ga * i
    const p: Vec3 = [r * Math.cos(th), r * Math.sin(th), z]
    // 这个位置与所有已有球的最小角距
    let m = Infinity
    for (const d of dirs) m = Math.min(m, angularDistance(p, d))
    if (m > best) {
      best = m
      bestDir = p
    }
  }
  return {
    found: best >= MIN_ANGLE - 1e-6 ? bestDir : null,
    bestAngle: best,
  }
}

/** 排列的"余量"：最小角距超出 60° 的部分 */
export function slack(dirs: Vec3[]): number {
  return minPairAngle(dirs) - MIN_ANGLE
}

/** 球冠覆盖球面的比例（12 个球时约 80%，剩 20% 空隙） */
export function capCoverage(dirs: Vec3[]): number {
  return (dirs.length * capSolidAngle()) / (4 * Math.PI)
}

/** 各维度的接吻数（已知值） */
export const KNOWN_KISSING = [
  { dim: 1, tau: 2, note: '线段两端' },
  { dim: 2, tau: 6, note: '六个圆围一圈，恰好' },
  { dim: 3, tau: 12, note: '牛顿对，1953 年才证明' },
  { dim: 4, tau: 24, note: '2003 年证明' },
  { dim: 8, tau: 240, note: 'E8 格' },
  { dim: 24, tau: 196560, note: 'Leech 格' },
] as const

/** 二维接吻数 6：六个单位圆恰好围住中心圆，角距恰为 60° */
export function kissing2DAngles(): number[] {
  return [0, 1, 2, 3, 4, 5].map((k) => (k * Math.PI) / 3)
}

/** 二维排列的相邻角距（应恰为 60°） */
export function kissing2DGap(): number {
  const a = kissing2DAngles()
  return a[1] - a[0]
}
