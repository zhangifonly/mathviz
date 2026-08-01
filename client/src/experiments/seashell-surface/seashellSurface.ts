/**
 * 海螺曲面（纯函数，便于测试）
 *
 * 真实海螺的生长遵循一条简单规律：**自相似生长**。
 * 螺体沿对数螺线盘绕，同时截面按同一比例放大 —— 形状不变，只是变大。
 * 这解释了为什么海螺从幼体到成体始终"是同一个形状"。
 *
 * 参数方程（u 为盘绕角，v 为截面角）：
 *   g = exp(u·cot α)          自相似生长因子(对数螺线的核心)
 *   x = g·(a + b·cos v)·cos(n·u)
 *   y = g·(a + b·cos v)·sin(n·u)
 *   z = g·(b·sin v + c·u)
 *
 * α 是生长螺线与径向的夹角（对数螺线的定角性质），
 * n 控制盘绕圈数，c 控制沿轴拉伸。
 *
 * 可验证的核心性质：**每绕一圈，所有尺寸乘以同一个常数** exp(2π·cot α)。
 * 这就是自相似，也是对数螺线被称为"生长螺线"的原因。
 */

import type { Vec3 } from '../../lib/proj3d'

export const U_RANGE: [number, number] = [0, 6 * Math.PI]
export const V_RANGE: [number, number] = [0, 2 * Math.PI]

export interface ShellParams {
  /** 生长角 α(弧度)。越接近 π/2 生长越慢, 螺体越扁平 */
  alpha: number
  /** 截面中心到轴的基准距离 */
  a: number
  /** 截面半径 */
  b: number
  /** 沿轴拉伸 */
  c: number
}

/**
 * 默认参数。α=1.47 对应每圈放大约 1.89 倍, 绕三圈累计 6.7 倍。
 * α 再小会放大得过快: α=1.35 每圈 4.1 倍, 三圈累计 68 倍, 画面全被最外圈
 * 占满, 看不出螺旋结构。
 */
export const DEFAULT_PARAMS: ShellParams = { alpha: 1.47, a: 0.6, b: 0.28, c: 0.12 }

/** 自相似生长因子 exp(u·cot α) */
export function growthFactor(u: number, alpha: number): number {
  return Math.exp(u / Math.tan(alpha))
}

/**
 * 只调生长角的便捷接口。
 * 曲面族的其余参数(a/b/c)固定为默认值 —— 讲解与实验页只暴露 α,
 * 因为它才是决定「自相似速率」的那个量, 其余三个只改胖瘦。
 */
export function seashellAt(u: number, v: number, alpha: number): Vec3 {
  return seashell(u, v, { ...DEFAULT_PARAMS, alpha })
}

/** 海螺曲面参数方程 */
export function seashell(u: number, v: number, p: ShellParams = DEFAULT_PARAMS): Vec3 {
  const g = growthFactor(u, p.alpha)
  const radial = p.a + p.b * Math.cos(v)
  return [
    g * radial * Math.cos(u),
    g * radial * Math.sin(u),
    g * (p.b * Math.sin(v) + p.c * u),
  ]
}

/**
 * 每绕一圈的放大倍数 exp(2π·cot α)。
 * 这是自相似生长的定量表述：所有尺寸乘同一常数。
 */
export function growthPerTurn(alpha: number): number {
  return Math.exp((2 * Math.PI) / Math.tan(alpha))
}

/**
 * 自相似性判据：同一截面角 v 上，u 与 u+2π 两点的坐标之比
 * 应等于 growthPerTurn，且三个坐标的比值相同。
 *
 * 注意 z 分量含 c·u 项，它随 u 线性增长而非纯自相似，
 * 所以只对 x,y 做严格比值检验。
 */
export function selfSimilarityRatio(
  u: number, v: number, p: ShellParams = DEFAULT_PARAMS,
): { xRatio: number; yRatio: number; expected: number } {
  const p1 = seashell(u, v, p)
  const p2 = seashell(u + 2 * Math.PI, v, p)
  return {
    xRatio: p2[0] / p1[0],
    yRatio: p2[1] / p1[1],
    expected: growthPerTurn(p.alpha),
  }
}

/** 对数螺线的定角性质：径向与切向的夹角恒为 α */
export function radialTangentAngle(u: number, alpha: number, h = 1e-6): number {
  // 螺线 r(u) = exp(u·cot α), 位置 (r cos u, r sin u)
  const r = (t: number) => Math.exp(t / Math.tan(alpha))
  const pos = (t: number): [number, number] => [r(t) * Math.cos(t), r(t) * Math.sin(t)]
  const a = pos(u - h)
  const b = pos(u + h)
  const tangent: [number, number] = [(b[0] - a[0]) / (2 * h), (b[1] - a[1]) / (2 * h)]
  const radial = pos(u)
  const dot = radial[0] * tangent[0] + radial[1] * tangent[1]
  const cosTheta = dot / (Math.hypot(...radial) * Math.hypot(...tangent))
  return Math.acos(Math.max(-1, Math.min(1, cosTheta)))
}

/**
 * 截面半径。v=0 与 v=π 是截面直径的两端, 取二者距离的一半。
 * 它应随生长因子同步放大, 即恒等于 b·exp(u·cot α)。
 */
export function crossSectionRadius(u: number, p: ShellParams = DEFAULT_PARAMS): number {
  const p0 = seashell(u, 0, p)
  const p1 = seashell(u, Math.PI, p)
  return Math.hypot(p0[0] - p1[0], p0[1] - p1[1], p0[2] - p1[2]) / 2
}

export const PRESETS = [
  { alpha: 1.52, label: '扁平型', note: '每圈放大 1.38 倍' },
  { alpha: 1.47, label: '标准海螺', note: '每圈放大 1.89 倍' },
  { alpha: 1.4, label: '细长型', note: '每圈放大 2.96 倍' },
] as const
