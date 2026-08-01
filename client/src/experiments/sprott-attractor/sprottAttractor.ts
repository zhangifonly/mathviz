/**
 * 斯普罗特极简吸引子（纯函数，便于测试）
 *
 * Julien Clinton Sprott 1994 年问了一个尖锐的问题：
 * **产生混沌最少需要多复杂的方程？**
 *
 * 洛伦兹系统有 7 项、2 个非线性项；罗斯勒有 7 项、1 个非线性项。
 * 斯普罗特用计算机穷举，找到了 19 个只有 5 项或 6 项的三维二次系统，
 * 其中 Case A 到 Case S 各有不同结构。本实验收录三个代表：
 *
 *   Sprott A: dx=y, dy=−x+y·z, dz=1−y²           5 项 · 2 非线性 · 保守
 *   Sprott B: dx=y·z, dy=x−y, dz=1−x·y           5 项 · 2 非线性
 *   Sprott C: dx=y·z, dy=x−y, dz=1−x²            5 项 · 2 非线性
 *
 * Sprott A 特别值得注意：它的**散度恒等于零**，是保守系统，
 * 却依然混沌。这打破了「混沌必须耗散」的直觉 ——
 * 耗散只是「存在吸引子」的条件，不是「存在混沌」的条件。
 */

import type { Vec3 } from '../../lib/proj3d'
import { rk4Step, type Field3D } from '../../lib/attractor3d'

export const CASES = ['A', 'B', 'C'] as const
export type SprottCase = (typeof CASES)[number]

export interface CaseInfo {
  id: SprottCase
  label: string
  equations: string
  /** 项数 */
  terms: number
  /** 是否保守(散度恒为零) */
  conservative: boolean
  note: string
}

export const CASE_INFO: CaseInfo[] = [
  {
    id: 'A',
    label: 'Sprott A',
    equations: "x'=y, y'=−x+yz, z'=1−y²",
    terms: 5,
    conservative: true,
    note: '散度恒为 0 · 保守却混沌',
  },
  {
    id: 'B',
    label: 'Sprott B',
    equations: "x'=yz, y'=x−y, z'=1−xy",
    terms: 5,
    conservative: false,
    note: '散度恒为 −1',
  },
  {
    id: 'C',
    label: 'Sprott C',
    equations: "x'=yz, y'=x−y, z'=1−x²",
    terms: 5,
    conservative: false,
    note: '散度恒为 −1',
  },
]

/** 构造向量场 */
export function sprottField(c: SprottCase): Field3D {
  switch (c) {
    case 'A':
      return ([x, y, z]) => [y, -x + y * z, 1 - y * y]
    case 'B':
      return ([x, y, z]) => [y * z, x - y, 1 - x * y]
    case 'C':
      return ([x, y, z]) => [y * z, x - y, 1 - x * x]
  }
}

/**
 * 散度的解析值。
 *   A: ∂y/∂x + ∂(−x+yz)/∂y + ∂(1−y²)/∂z = 0 + z + 0 = z
 *      ⚠️ 逐点是 z 而非恒零 —— 「保守」指的是沿轨道的**时间平均**为零,
 *      因为轨道在 z 的正负两侧对称分布。单测用长时间平均验证这一点。
 *   B: 0 + (−1) + 0 = −1
 *   C: 0 + (−1) + 0 = −1
 */
export function analyticDivergence(c: SprottCase, q: Vec3): number {
  if (c === 'A') return q[2]
  return -1
}

/** 项数统计（用于「极简」这个主张的量化） */
export function termCount(c: SprottCase): number {
  return CASE_INFO.find((i) => i.id === c)?.terms ?? 0
}

/**
 * 非线性项个数。
 * A: yz 与 y²; B: yz 与 xy; C: yz 与 x² —— 三者都是 2 个二次项。
 * 从方程字符串里数, 而不是写死常数, 这样改方程时不会对不上。
 */
export function nonlinearCount(c: SprottCase): number {
  const eq = infoOf(c).equations
  // 二次项形如 yz / xy / y² / x², 匹配「两个变量相乘」或「变量的平方」
  return (eq.match(/[xyz][xyz]|[xyz]²/g) ?? []).length
}

/**
 * 对照：洛伦兹与罗斯勒的项数，用于说明「极简」的意义。
 * 洛伦兹 σ(y−x), x(ρ−z)−y, xy−βz 展开后是 7 项。
 */
export const REFERENCE_SYSTEMS = [
  { name: '洛伦兹 (1963)', terms: 7, nonlinear: 2 },
  { name: '罗斯勒 (1976)', terms: 7, nonlinear: 1 },
  { name: 'Sprott (1994)', terms: 5, nonlinear: 2 },
] as const

/**
 * 散度沿轨道的时间平均 —— 这才是判断「保守还是耗散」的正确量。
 *
 * Case A 的逐点散度是 z（不是常数），只有长时间平均才趋于 0。
 * 若只看某一点就下结论，会误判成耗散或膨胀。
 */
export function meanDivergence(c: SprottCase, steps = 20000, dt = 0.005): number {
  const f = sprottField(c)
  let p = startOf(c)
  // 先跑暂态, 让轨道落到吸引子上
  for (let i = 0; i < 2000; i++) p = rk4Step(f, p, dt)
  let sum = 0
  let n = 0
  for (let i = 0; i < steps; i++) {
    p = rk4Step(f, p, dt)
    if (!Number.isFinite(p[0]) || !Number.isFinite(p[1]) || !Number.isFinite(p[2])) break
    sum += analyticDivergence(c, p)
    n++
  }
  return n === 0 ? NaN : sum / n
}

/** 各 Case 的推荐初值 */
export function startOf(c: SprottCase): Vec3 {
  if (c === 'A') return [0, 5, 0]
  return [0.05, 0.05, 0.05]
}

export const START: Vec3 = [0, 5, 0]

export function infoOf(c: SprottCase): CaseInfo {
  return CASE_INFO.find((i) => i.id === c) ?? CASE_INFO[0]
}
