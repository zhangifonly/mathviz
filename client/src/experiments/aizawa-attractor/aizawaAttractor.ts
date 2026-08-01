/**
 * 相泽吸引子（纯函数，便于测试）
 *
 *   dx/dt = (z − b)·x − d·y
 *   dy/dt = d·x + (z − b)·y
 *   dz/dt = c + a·z − z³/3 − (x² + y²)(1 + e·z) + f·z·x³
 *
 * 轨道在一个球面附近缠绕，同时沿轴向穿出又折回，形成球与柱交织的结构。
 *
 * 这个系统最漂亮的地方是**前两个方程可以合成一个复数方程**：
 * 记 w = x + i·y，则
 *   dw/dt = ((z − b) + i·d)·w
 * 实部 (z−b) 控制径向的胀缩，虚部 d 控制绕轴的旋转速率。
 * 这不是近似，是代数恒等式 —— 单测直接比对两种写法。
 *
 * 由此还能看出对称性的来源与破坏：
 *   f = 0 时 dz 只依赖 x²+y² 与 z，整个系统绕 z 轴旋转等变
 *   f ≠ 0 时 f·z·x³ 单独依赖 x，把旋转对称打破
 * 换句话说，f 是唯一破坏轴对称的项，这解释了吸引子为何不是回转体。
 */

import type { Vec3 } from '../../lib/proj3d'
import type { Field3D } from '../../lib/attractor3d'

export interface AizawaParams {
  a: number
  b: number
  c: number
  d: number
  e: number
  /** 唯一破坏轴对称的项的系数 */
  f: number
}

/** 标准参数，给出经典的球柱交织形状 */
export const CLASSIC: AizawaParams = {
  a: 0.95, b: 0.7, c: 0.6, d: 3.5, e: 0.25, f: 0.1,
}

/** 构造向量场 */
export function aizawaField(p: AizawaParams = CLASSIC): Field3D {
  return ([x, y, z]) => [
    (z - p.b) * x - p.d * y,
    p.d * x + (z - p.b) * y,
    p.c + p.a * z - (z * z * z) / 3
      - (x * x + y * y) * (1 + p.e * z)
      + p.f * z * x * x * x,
  ]
}

/**
 * 只调 f 的便捷接口 —— 它是唯一控制「轴对称是否被打破」的参数，
 * 也就是本实验最值得交互的那个量。
 */
export function aizawaFieldF(f: number): Field3D {
  return aizawaField({ ...CLASSIC, f })
}

/**
 * 前两个方程的复数形式 dw/dt = ((z−b) + i·d)·w。
 * 返回 [Re(dw/dt), Im(dw/dt)]，应与 field 的前两个分量完全一致。
 */
export function complexForm(
  x: number, y: number, z: number, p: AizawaParams = CLASSIC,
): [number, number] {
  const reCoef = z - p.b
  const imCoef = p.d
  // (reCoef + i·imCoef)(x + i·y)
  return [reCoef * x - imCoef * y, imCoef * x + reCoef * y]
}

/** 复数形式与直接形式的最大分量差，应为 0 */
export function complexFormError(q: Vec3, p: AizawaParams = CLASSIC): number {
  const d = aizawaField(p)(q)
  const [re, im] = complexForm(q[0], q[1], q[2], p)
  return Math.max(Math.abs(d[0] - re), Math.abs(d[1] - im))
}

/**
 * 绕 z 轴旋转 φ 的等变性误差：|f(R_φ p) − R_φ f(p)|。
 *
 * f=0 时应为 0（轴对称），f≠0 时应明显非零（对称被打破）。
 * 这是本实验的核心判据：把「f 是唯一破坏对称的项」变成可测的数字。
 */
export function rotationEquivarianceError(
  q: Vec3, phi: number, p: AizawaParams = CLASSIC,
): number {
  const rot = (v: Vec3): Vec3 => [
    v[0] * Math.cos(phi) - v[1] * Math.sin(phi),
    v[0] * Math.sin(phi) + v[1] * Math.cos(phi),
    v[2],
  ]
  const field = aizawaField(p)
  const lhs = field(rot(q))
  const rhs = rot(field(q))
  return Math.max(
    Math.abs(lhs[0] - rhs[0]),
    Math.abs(lhs[1] - rhs[1]),
    Math.abs(lhs[2] - rhs[2]),
  )
}

/**
 * 散度的解析式：
 *   ∂(dx)/∂x = z − b
 *   ∂(dy)/∂y = z − b
 *   ∂(dz)/∂z = a − z² − e(x² + y²) + f·x³
 * 三项相加。
 */
export function analyticDivergence(q: Vec3, p: AizawaParams = CLASSIC): number {
  const [x, y, z] = q
  return 2 * (z - p.b) + p.a - z * z - p.e * (x * x + y * y) + p.f * x * x * x
}

/** 到 z 轴的距离，用于观察「球面附近缠绕」 */
export function axisDistance(q: Vec3): number {
  return Math.hypot(q[0], q[1])
}

export const START: Vec3 = [0.1, 0, 0]

export const PRESETS = [
  { f: 0, label: '轴对称(f=0)', note: '完全回转对称' },
  { f: 0.1, label: '经典(f=0.1)', note: '对称被打破' },
  { f: 0.25, label: '强不对称', note: 'f 加大' },
] as const
